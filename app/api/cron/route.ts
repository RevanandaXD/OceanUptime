import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { performCheck } from "@/utils/monitoring";

export const dynamic = 'force-dynamic'; 

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

  const { data: websites, error: fetchError } = await supabase
    .from("websites")
    .select("id, url, name, expected_keyword")
    .eq("is_active", true);

  if (fetchError || !websites) {
    return NextResponse.json({ error: "Failed to Get Data from Database" }, { status: 500 });
  }

  const checkPromises = websites.map(async (web) => {
    const outcome = await performCheck(web.url, {
      expectedKeyword: web.expected_keyword,
    });

    const status = outcome.status;
    const statusCode = outcome.statusCode;
    const failureReason = outcome.failureReason || "";
    const responseTime = outcome.responseTime;

    const { error: insertError } = await supabase.from("website_checks").insert({
      website_id: web.id,
      status,
      response_time: responseTime,
      status_code: statusCode,
    });
    
    if (insertError) {
      console.error(`Failed to save check result for ${web.name}:`, insertError);
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
          reason: failureReason || `Check failed (HTTP Code: ${statusCode})`
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
    message: "Monitoring engine executed successfully!",
    total_checked: results.length,
    results,
  });
}
