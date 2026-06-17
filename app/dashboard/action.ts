"use server";

import { createClient } from "@/utils/supabase/server";
import { decryptText } from "@/utils/encryption";

// Helper to clean and match domains
function cleanDomain(url: string): string {
  if (!url) return "";
  return url.replace(/^https?:\/\/(www\.)?/i, "").split("/")[0].toLowerCase();
}

// Helper for formatting time elapsed
function formatTimeAgo(dateInput: string | number | undefined): string {
  if (!dateInput) return "--";
  try {
    const date = new Date(dateInput);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    if (isNaN(diffMs)) return "--";
    
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  } catch (err) {
    return "--";
  }
}

interface CacheEntry {
  data: any;
  timestamp: number;
}

const apiCache: Record<string, CacheEntry> = {};
const CACHE_TTL_MS = 60000; // Cache for 60 seconds (1 minute)

async function fetchWithCache(url: string, token: string): Promise<any> {
  const cacheKey = `${url}:${token}`;
  const now = Date.now();

  // If cache is fresh, return it immediately
  if (apiCache[cacheKey] && now - apiCache[cacheKey].timestamp < CACHE_TTL_MS) {
    return apiCache[cacheKey].data;
  }

  try {
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) {
      const data = await res.json();
      apiCache[cacheKey] = {
        data,
        timestamp: now,
      };
      return data;
    }
  } catch (err) {
    console.error(`Fetch with cache failed for ${url}:`, err);
  }

  // Fallback to stale cache on network error if it exists
  return apiCache[cacheKey] ? apiCache[cacheKey].data : null;
}

export async function getDashboardData() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return { monitors: [], incidents: [], activity: [], configuredProviders: [], totalChecks: 0 };

    // Fetch Websites
    const { data: websites, error: webError } = await supabase
      .from("websites")
      .select("*")
      .eq("user_id", user.id)
      .order("create_at", { ascending: false });

    if (webError) {
      console.error("Error fetching websites:", webError);
      throw webError;
    }

    if (!websites || websites.length === 0) {
      return { monitors: [], incidents: [], activity: [], configuredProviders: [], totalChecks: 0 };
    }

  // Fetch configured API keys
  const { data: providerConfigs } = await supabase
    .from("provider_configs")
    .select("*")
    .eq("user_id", user.id);

  const configuredProviders = providerConfigs?.map((cfg) => cfg.provider_name.toLowerCase()) || [];

  let vercelToken = "";
  let netlifyToken = "";

  if (providerConfigs) {
    providerConfigs.forEach((cfg) => {
      try {
        const decrypted = decryptText({
          encryptedText: cfg.encrypted_api_key,
          iv: cfg.iv,
          authTag: cfg.auth_tag,
          salt: cfg.salt,
        });
        if (cfg.provider_name === "vercel") vercelToken = decrypted;
        if (cfg.provider_name === "netlify") netlifyToken = decrypted;
      } catch (err) {
        console.error("Failed to decrypt token for", cfg.provider_name, err);
      }
    });
  }

  // Fetch Vercel projects if token is available
  let vercelProjects: any[] = [];
  if (vercelToken) {
    const data = await fetchWithCache("https://api.vercel.com/v9/projects", vercelToken);
    if (data && data.projects) {
      vercelProjects = data.projects;
    }
  }

  // Fetch Netlify sites if token is available
  let netlifySites: any[] = [];
  if (netlifyToken) {
    const data = await fetchWithCache("https://api.netlify.com/api/v1/sites", netlifyToken);
    if (Array.isArray(data)) {
      netlifySites = data;
    }
  }

  // Fetch Checks
  const websiteIds = websites.map(w => w.id);
  const { data: checks } = await supabase
    .from("website_checks")
    .select("*")
    .in("website_id", websiteIds)
    .order("checked_at", { ascending: false });

  // Fetch Total Checks Count
  let totalChecks = 0;
  if (websiteIds.length > 0) {
    const { count } = await supabase
      .from("website_checks")
      .select("*", { count: "exact", head: true })
      .in("website_id", websiteIds);
    totalChecks = count || 0;
  }

  // Fetch Incidents
  const { data: dbIncidents } = await supabase
    .from("incidents")
    .select("*, websites(name, url)")
    .in("website_id", websiteIds)
    .order("started_at", { ascending: false });

  // Fetch SSL Certificates
  const { data: sslCerts } = await supabase
    .from("ssl_certificates")
    .select("*")
    .in("website_id", websiteIds);

  const sslByWebsite: Record<string, any> = {};
  if (sslCerts) {
    sslCerts.forEach(cert => {
      sslByWebsite[cert.website_id] = cert;
    });
  }

  // Group Checks by Website
  const checksByWebsite: Record<string, any[]> = {};
  if (checks) {
    checks.forEach(check => {
      if (!checksByWebsite[check.website_id]) {
        checksByWebsite[check.website_id] = [];
      }
      if (checksByWebsite[check.website_id].length < 10) {
        checksByWebsite[check.website_id].push(check);
      }
    });
  }

  // Construct Monitor Array with dynamic deployment info
  const monitors = websites.map(web => {
    const webChecks = checksByWebsite[web.id] || [];
    // Sort oldest to newest for history chart
    const sortedChecks = [...webChecks].sort((a, b) => new Date(a.checked_at).getTime() - new Date(b.checked_at).getTime());
    
    const history = sortedChecks.map(c => c.response_time);
    const avgResponse = history.length > 0 ? Math.round(history.reduce((a, b) => a + b, 0) / history.length) : 0;
    
    // Uptime calculation (simple)
    const upChecks = webChecks.filter(c => c.status === "UP").length;
    const uptime = webChecks.length > 0 ? ((upChecks / webChecks.length) * 100).toFixed(1) + "%" : "--%";

    // Default deployment placeholders
    let deploymentStatus = "UNKNOWN";
    let deploymentId = "--";
    let commitMsg = "--";
    let commitHash = "--";
    let deployedAt = "--";
    let branch = "--";

    const webDomain = cleanDomain(web.url);

    // Vercel Deployment Matching
    if (web.provider === "Vercel" && vercelProjects.length > 0) {
      const project = vercelProjects.find(p => {
        const hasAlias = p.targets?.production?.url === webDomain || 
                         (p.targets?.production?.alias && p.targets.production.alias.some((a: string) => cleanDomain(a) === webDomain));
        const matchesName = p.name.toLowerCase() === web.name.toLowerCase().replace(/\s+/g, "-");
        return hasAlias || matchesName;
      });

      if (project && project.targets?.production) {
        const prod = project.targets.production;
        deploymentStatus = prod.readyState === "READY" ? "READY" : "FAILED";
        deploymentId = prod.id || "--";
        commitMsg = prod.meta?.githubCommitMessage || "Triggered manually / webhook";
        commitHash = prod.meta?.githubCommitSha?.substring(0, 7) || "--";
        deployedAt = formatTimeAgo(prod.createdAt);
        branch = prod.meta?.githubCommitRef || "main";
      }
    }

    // Netlify Deployment Matching
    if (web.provider === "Netlify" && netlifySites.length > 0) {
      const site = netlifySites.find(s => {
        const defaultDomainMatch = s.url && cleanDomain(s.url) === webDomain;
        const customDomainMatch = s.custom_domain && cleanDomain(s.custom_domain) === webDomain;
        const nameMatch = s.name.toLowerCase() === web.name.toLowerCase().replace(/\s+/g, "-");
        return defaultDomainMatch || customDomainMatch || nameMatch;
      });

      if (site && site.published_deploy) {
        const dep = site.published_deploy;
        deploymentStatus = dep.state === "ready" ? "READY" : "FAILED";
        deploymentId = dep.id || "--";
        commitMsg = dep.title || "Triggered manually / web-hook";
        commitHash = dep.commit_ref?.substring(0, 7) || "--";
        deployedAt = formatTimeAgo(dep.published_at || dep.created_at);
        branch = dep.branch || "main";
      }
    }

    const ssl = sslByWebsite[web.id];
    const sslIssuer = ssl?.issuer || "--";
    const sslExpiresAt = ssl?.expires_at ? new Date(ssl.expires_at).toISOString().split("T")[0] : "--";
    const sslDaysRemaining = ssl?.days_remaining !== undefined ? ssl.days_remaining : undefined;

    return {
      id: web.id,
      name: web.name,
      url: web.url,
      provider: web.provider,
      isActive: web.is_active,
      uptime: uptime,
      avgResponse: `${avgResponse} ms`,
      history: history,
      
      sslIssuer,
      sslExpiresAt,
      sslDaysRemaining,
      deploymentStatus: deploymentStatus,
      deploymentId: deploymentId,
      commitMsg: commitMsg,
      commitHash: commitHash,
      deployedAt: deployedAt,
      branch: branch
    };
  });

  // Construct Incidents Array
  const incidents = (dbIncidents || []).map(inc => ({
    id: inc.id,
    name: inc.websites?.name || "Unknown",
    url: inc.websites?.url || "",
    status: inc.status,
    startedAt: new Date(inc.started_at).toLocaleString(),
    resolvedAt: inc.resolved_at ? new Date(inc.resolved_at).toLocaleString() : "--",
    duration: inc.duration ? `${Math.round(inc.duration / 60)} mins` : "Active",
    reason: inc.reason || "Unknown"
  }));

  // Construct Activity (Placeholder based on incidents)
  const activity = incidents.slice(0, 5).map(inc => {
    let message = `${inc.name} incident resolved`;
    let type = "success";

    if (inc.status === "DOWN") {
      message = `${inc.name} is DOWN (${inc.reason})`;
      type = "error";
    } else if (inc.status === "SOMETHING WRONG") {
      message = `${inc.name} is reporting issues (${inc.reason})`;
      type = "warning";
    }

    return {
      time: inc.startedAt,
      message,
      type
    };
  });

    return { monitors, incidents, activity, configuredProviders, totalChecks };
  } catch (error) {
    console.error("Critical error in getDashboardData:", error);
    throw error;
  }
}
