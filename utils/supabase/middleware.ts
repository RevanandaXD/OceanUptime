import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

const AUTH_COOKIE_PREFIX = `sb-${process.env.NEXT_PUBLIC_SUPABASE_PROJECT_REF || "ncdycmmejguoqqzbfxsz"}-auth-token`;

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const isDashboardRoute = request.nextUrl.pathname.startsWith("/dashboard");
  const isAuthRoute = request.nextUrl.pathname.startsWith("/auth");

  const authCookies = request.cookies
    .getAll()
    .filter((c) => c.name.startsWith(AUTH_COOKIE_PREFIX));

  // Fast path: no session cookie present -> guaranteed unauthenticated.
  // Skip the expensive Supabase auth network round-trip entirely.
  if (authCookies.length === 0) {
    if (isDashboardRoute) {
      const url = request.nextUrl.clone();
      url.pathname = "/auth";
      return NextResponse.redirect(url);
    }
    return supabaseResponse;
  }

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY! || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Redirect unauthenticated user trying to access dashboard to auth page
  if (!user && isDashboardRoute) {
    const url = request.nextUrl.clone();
    url.pathname = "/auth";
    return NextResponse.redirect(url);
  }

  // Redirect authenticated user trying to access auth page to dashboard
  if (user && isAuthRoute) {
    const url = request.nextUrl.clone();
    url.pathname = "/dashboard/overview";
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}
