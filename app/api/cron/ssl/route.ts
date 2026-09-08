import tls from "tls";
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

function checkSSL(urlStr: string): Promise<{
  issuer: string | string[];
  expiresAt: string;
  daysRemaining: number;
}> {
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
            const daysRemaining = Math.max(
              0,
              Math.round(
                (expiresAt.getTime() - Date.now()) / (24 * 60 * 60 * 1000),
              ),
            );
            resolve({
              issuer: cert.issuer.O || cert.issuer.CN || "Unknown",
              expiresAt: expiresAt.toISOString(),
              daysRemaining,
            });
          } else {
            resolve({ issuer: "Unknown", expiresAt: "--", daysRemaining: 0 });
          }
          socket.destroy();
        },
      );

      socket.on("error", () => {
        resolve({
          issuer: "Connection Failed",
          expiresAt: "--",
          daysRemaining: 0,
        });
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

  const authHeader = request.headers.get("authorization");
  const bearerToken = authHeader?.startsWith("Bearer ")
    ? authHeader.substring(7)
    : null;

  const CRON_SECRET = process.env.CRON_SECRET;

  if (CRON_SECRET) {
    const isSecretParamValid = secret === CRON_SECRET;
    const isBearerTokenValid = bearerToken === CRON_SECRET;

    if (!isSecretParamValid && !isBearerTokenValid) {
      return NextResponse.json(
        { error: "Unauthorized access. Invalid secret." },
        { status: 401 },
      );
    }
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  const supabase = createClient(supabaseUrl, supabaseKey);

  const { data: websites, error: fetchError } = await supabase
    .from("websites")
    .select("id, url, name, expected_keyword")
    .eq("is_active", true);

  if (fetchError || !websites) {
    return NextResponse.json(
      { error: "Failed to Get Data from Database" },
      { status: 500 },
    );
  }

  const checkPromises = websites.map(async (web) => {
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

      return {
        name: web.name,
        url: web.url,
        daysRemaining: sslInfo.daysRemaining,
        issuer: sslInfo.issuer
      }
    } catch (err) {
      console.error(`Failed to save SSL info for ${web.name}:`, err);
    }
  });

  const result = await Promise.all(checkPromises);

  return NextResponse.json({
    success: true,
    message: 'Checking SSL executed successfully!',
    total_checked: result.length,
    result,
  })
}

