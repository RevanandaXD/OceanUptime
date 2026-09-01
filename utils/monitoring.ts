
export type CheckOutcome = {
    status: 'UP' | 'DOWN' | 'SOMETHING WRONG',
    statusCode: number,
    responseTime: number,
    failureReason?: string,
}

const ERROR_KEYWORDS = [
  "database connection error",
  "failed to connect to database",
  "error connecting to database",
  "could not connect to the database",
  "connection to database server failed",
  "prisma client error",
  "prismaerror",
  "react-error-boundary",
  "errorboundary",
  "something went wrong",
  "an unexpected error has occurred",
  "application error: a client-side exception has occurred",
  "application error: a server-side exception has occurred",
  "project is paused",
  "this project has been paused",
  "your project has been paused",
  "500 internal server error",
  "502 bad gateway",
  "503 service unavailable",
  "504 gateway timeout",
  "connection refused",
  "fetch failed",
  "supabase",
  "databaseerror",
  "econnrefused",
  "econnreset",
  "etimedout",
  "unable to connect",
  "service unavailable",
  "bad gateway",
  "upstream error",
  "worker exited",
  "cold start",
  "function invocation timeout",
  "runtime exited",
  "module not found",
  "cannot find module",
  "referenceerror",
  "typeerror: cannot read",
  "err_name_not_resolved",
  "net::err_",
  "uncaught typeerror",
  "uncaught referenceerror",
  "unhandledrejection",
  "loading chunk",
  "loading css chunk",
];

const TIMEOUT_MS = 10000;

export async function performCheck(
  url: string,
  opts?: { expectedKeyword?: string | null },
): Promise<CheckOutcome> {
  const startTime = performance.now();
  let status: CheckOutcome["status"] = "DOWN";
  let statusCode = 0;
  let failureReason = "";

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 OceanUptime/1.0",
      },
      signal: controller.signal,
      cache: "no-store",
    });
    clearTimeout(timeoutId);

    statusCode = response.status;

    if (statusCode >= 200 && statusCode < 400) {
      status = "UP";
      const contentType = response.headers.get("content-type") || "";

      if (contentType.includes("application/json")) {
        try {
          const jsonBody = await response.json();
          if (
            jsonBody.status === "SOMETHING WRONG" ||
            jsonBody.database === "DISCONNECTED"
          ) {
            status = "SOMETHING WRONG";
            failureReason =
              jsonBody.error || "Database error reported by health endpoint";
          }
        } catch {
          // ignore
        }
      } else if (contentType.includes("text/html")) {
        try {
          const htmlText = await response.text();
          const bodySize = htmlText.length;
          const stripped = htmlText.replace(/<[^>]*>/g, "").trim();

          if (bodySize < 1000 && stripped.length === 0) {
            status = "SOMETHING WRONG";
            failureReason = "Blank page detected (Empty HTML body)";
          } else {
            const bodyLower = htmlText.toLowerCase();
            const foundError = ERROR_KEYWORDS.find((k) =>
              bodyLower.includes(k),
            );
            if (foundError) {
              status = "SOMETHING WRONG";
              failureReason = `System error signature found: "${foundError}"`;
            } else if (opts?.expectedKeyword) {
              const keywords = opts.expectedKeyword
                .split(",")
                .map((k) => k.trim().toLowerCase())
                .filter(Boolean);
              if (
                keywords.length > 0 &&
                keywords.filter((k) => bodyLower.includes(k)).length === 0
              ) {
                status = "SOMETHING WRONG";
                failureReason = `None of the expected keywords were found on the page`;
              }
            }
          }
        } catch {
          // ignore
        }
      }
    } else if (statusCode >= 500) {
      status = "SOMETHING WRONG";
      failureReason = `Server Error (HTTP ${statusCode})`;
    } else {
      status = "DOWN";
      failureReason = `HTTP Error Code: ${statusCode}`;
    }
  } catch {
    status = "DOWN";
    failureReason = "Timeout / Network Error";
  }

  const responseTime = Math.round(performance.now() - startTime);
  return {
    status,
    statusCode,
    responseTime,
    failureReason: failureReason || undefined,
  };
}