import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import tls from "tls";

export const dynamic = 'force-dynamic'; // Selalu eksekusi, jangan di-cache

function checkSSL(urlStr: string): Promise<{ issuer: string | string[]; expiresAt: string; daysRemaining: number }> {
  return new Promise((resolve) => {
    try {
      const parsedUrl = new URL(urlStr);
      if (parsedUrl.protocol !== "https:") {
        resolve({ issuer: "N/A (HTTP)", expiresAt: "--", daysRemaining: 365 });
        return;
      }

      const socket = tls.connect(
        {
          host: parsedUrl.hostname,
          port: 443,
          servername: parsedUrl.hostname,
          rejectUnauthorized: false,
        },
        () => {
          const cert = socket.getPeerCertificate();
          if (cert && cert.valid_to) {
            const expiresAt = new Date(cert.valid_to);
            const daysRemaining = Math.max(0, Math.round((expiresAt.getTime() - Date.now()) / (24 * 60 * 60 * 1000)));
            resolve({
              issuer: cert.issuer.O || cert.issuer.CN || "Unknown",
              expiresAt: expiresAt.toISOString(),
              daysRemaining,
            });
          } else {
            resolve({ issuer: "Unknown", expiresAt: "--", daysRemaining: 0 });
          }
          socket.destroy();
        }
      );

      socket.on("error", () => {
        resolve({ issuer: "Connection Failed", expiresAt: "--", daysRemaining: 0 });
      });
      
      socket.setTimeout(5000, () => {
        socket.destroy();
        resolve({ issuer: "Timeout", expiresAt: "--", daysRemaining: 0 });
      });
    } catch (_) {
      resolve({ issuer: "Invalid URL", expiresAt: "--", daysRemaining: 0 });
    }
  });
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const secret = searchParams.get("secret");
  
  // Ambil token Bearer dari Header Otorisasi Vercel
  const authHeader = request.headers.get("authorization");
  const bearerToken = authHeader?.startsWith("Bearer ") ? authHeader.substring(7) : null;
  
  const CRON_SECRET = process.env.CRON_SECRET;

  if (CRON_SECRET) {
    const isSecretParamValid = secret === CRON_SECRET;
    const isBearerTokenValid = bearerToken === CRON_SECRET;
    
    if (!isSecretParamValid && !isBearerTokenValid) {
      return NextResponse.json({ error: "Unauthorized access. Invalid secret." }, { status: 401 });
    }
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  const supabase = createClient(supabaseUrl, supabaseKey);

  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    console.warn("WARNING: SUPABASE_SERVICE_ROLE_KEY tidak ditemukan di .env. Insert data mungkin akan gagal karena RLS.");
  }

  const { data: websites, error: fetchError } = await supabase
    .from("websites")
    .select("id, url, name, expected_keyword")
    .eq("is_active", true);

  if (fetchError || !websites) {
    return NextResponse.json({ error: "Gagal mengambil daftar website dari database" }, { status: 500 });
  }

  const checkPromises = websites.map(async (web) => {
    const startTime = performance.now();
    let status = "DOWN";
    let statusCode = 0;
    let failureReason = "";
    
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);
      
      const response = await fetch(web.url, { 
        method: 'GET',
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 OceanUptime/1.0',
        },
        signal: controller.signal,
        cache: 'no-store' 
      });
      clearTimeout(timeoutId);
      
      statusCode = response.status;
      if (statusCode >= 200 && statusCode < 400) {
        status = "UP";
        
        const contentType = response.headers.get("content-type") || "";
        if (contentType.includes("application/json")) {
          try {
            const jsonBody = await response.json();
            if (jsonBody.status === "SOMETHING WRONG" || jsonBody.database === "DISCONNECTED") {
              status = "SOMETHING WRONG";
              failureReason = jsonBody.error || "Database error reported by health endpoint";
            }
          } catch (_) {
          }
        } else if (contentType.includes("text/html")) {
          try {
            const htmlText = await response.text();
            const bodySize = htmlText.length;
            
            if (bodySize < 1000 && htmlText.trim() === "") {
              status = "SOMETHING WRONG";
              failureReason = "Blank page detected (Empty HTML body)";
            } else {
              const errorKeywords = [
                "database connection error",
                "failed to connect to database",
                "error connecting to database",
                "prisma client error",
                "react-error-boundary",
                "something went wrong",
                "application error: a client-side exception has occurred"
              ];
              
              const foundError = errorKeywords.find(keyword => 
                htmlText.toLowerCase().includes(keyword)
              );
              
              if (foundError) {
                status = "SOMETHING WRONG";
                failureReason = `System error signature found: "${foundError}"`;
              } else if (web.expected_keyword) {
                const keywords = web.expected_keyword
                  .split(",")
                  .map((k: string) => k.trim().toLowerCase())
                  .filter(Boolean);
                
                const foundKeywords = keywords.filter((k: string) => 
                  htmlText.toLowerCase().includes(k)
                );
                
                if (foundKeywords.length === 0) {
                  status = "SOMETHING WRONG";
                  failureReason = `None of the expected keywords (${web.expected_keyword}) were found on the page`;
                }
              }
            }
          } catch (_) {
          }
        }
      } else if (statusCode >= 500) {
        status = "SOMETHING WRONG";
        failureReason = `Server Error (HTTP ${statusCode})`;
      } else {
        status = "DOWN";
        failureReason = `HTTP Error Code: ${statusCode}`;
      }
    } catch (error) {
      status = "DOWN";
      failureReason = "Timeout / Network Error";
    }

    const responseTime = Math.round(performance.now() - startTime);

    const { error: insertError } = await supabase.from("website_checks").insert({
      website_id: web.id,
      status,
      response_time: responseTime,
      status_code: statusCode,
    });
    
    if (insertError) {
      console.error(`Gagal menyimpan ping untuk ${web.name}:`, insertError);
    }

    try {
      const sslInfo = await checkSSL(web.url);
      
      const { data: existingCert } = await supabase
        .from("ssl_certificates")
        .select("id")
        .eq("website_id", web.id)
        .maybeSingle();

      if (existingCert) {
        await supabase
          .from("ssl_certificates")
          .update({
            issuer: sslInfo.issuer,
            days_remaining: sslInfo.daysRemaining,
            expires_at: sslInfo.expiresAt,
          })
          .eq("id", existingCert.id);
      } else {
        await supabase.from("ssl_certificates").insert({
          website_id: web.id,
          issuer: sslInfo.issuer,
          days_remaining: sslInfo.daysRemaining,
          expires_at: sslInfo.expiresAt,
        });
      }
    } catch (sslErr) {
      console.error(`Gagal menyimpan SSL untuk ${web.name}:`, sslErr);
    }

    if (status === "DOWN" || status === "SOMETHING WRONG") {
      const { data: activeIncidents } = await supabase
        .from("incidents")
        .select("id")
        .eq("website_id", web.id)
        .in("status", ["DOWN", "SOMETHING WRONG"])
        .single();
        
      if (!activeIncidents) {
        await supabase.from("incidents").insert({
          website_id: web.id,
          status,
          reason: failureReason || `Pengecekan gagal (HTTP Code: ${statusCode})`
        });
      }
    } else if (status === "UP") {
      const { data: activeIncidents } = await supabase
        .from("incidents")
        .select("id, started_at")
        .eq("website_id", web.id)
        .in("status", ["DOWN", "SOMETHING WRONG"]);

      if (activeIncidents && activeIncidents.length > 0) {
        for (const inc of activeIncidents) {
          const durationSecs = Math.round((new Date().getTime() - new Date(inc.started_at).getTime()) / 1000);
          await supabase
            .from("incidents")
            .update({
              status: "RESOLVED",
              resolved_at: new Date().toISOString(),
              duration: durationSecs
            })
            .eq("id", inc.id);
        }
      }
    }

    return { name: web.name, url: web.url, status, responseTime: `${responseTime}ms` };
  });

  const results = await Promise.all(checkPromises);

  return NextResponse.json({
    success: true,
    message: "Mesin monitoring berhasil dijalankan!",
    total_checked: results.length,
    results,
  });
}
