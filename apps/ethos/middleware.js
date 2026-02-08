import { NextResponse } from "next/server";

// Subdomains that should NOT be rewritten at all
const RESERVED_SUBDOMAINS = ["www", "api", "admin"];

// Subdomains with custom routing (not using /a/[slug] pattern)
const CUSTOM_SUBDOMAINS = {
  guildry: "/guildry", // guildry.theaiethos.com → /guildry
  launchpad: "/launchpad", // launchpad.theaiethos.com → /launchpad
};

// The main domain (without subdomain)
const MAIN_DOMAIN = "theaiethos.com";

export function middleware(request) {
  const url = request.nextUrl.clone();
  const hostname = request.headers.get("host") || "";

  // Extract subdomain
  // hostname could be: "invoice-nudge.theaiethos.com", "theaiethos.com", "localhost:3000"
  let subdomain = null;

  if (hostname.includes(MAIN_DOMAIN)) {
    // Production: extract subdomain from theaiethos.com
    const parts = hostname.replace(`.${MAIN_DOMAIN}`, "").split(".");
    if (parts[0] && parts[0] !== MAIN_DOMAIN.split(".")[0]) {
      subdomain = parts[0];
    }
  } else if (hostname.includes("localhost") || hostname.includes("127.0.0.1")) {
    // Local development: use query param ?subdomain=invoice-nudge for testing
    subdomain = url.searchParams.get("subdomain");
  } else if (hostname.includes(".vercel.app")) {
    // Preview deployments: check for subdomain in the URL structure
    // e.g., invoice-nudge--ethos.vercel.app
    const match = hostname.match(/^([^-]+)--/);
    if (match) {
      subdomain = match[1];
    }
  }

  // Skip if no subdomain or it's reserved (www, api, admin)
  if (!subdomain || RESERVED_SUBDOMAINS.includes(subdomain)) {
    return NextResponse.next();
  }

  // Skip static files and _next routes
  if (
    url.pathname.startsWith("/_next") ||
    url.pathname.includes(".") // Static files like .ico, .png, etc.
  ) {
    return NextResponse.next();
  }

  // Handle custom subdomain routing (e.g., guildry)
  if (CUSTOM_SUBDOMAINS[subdomain]) {
    const basePath = CUSTOM_SUBDOMAINS[subdomain];

    // Handle API routes for custom subdomains
    if (url.pathname.startsWith("/api")) {
      // guildry.theaiethos.com/api/x → /guildry/api/x
      url.pathname = `${basePath}${url.pathname}`;
      return NextResponse.rewrite(url);
    }

    // guildry.theaiethos.com/dashboard → /guildry/dashboard
    // guildry.theaiethos.com/ → /guildry
    const newPath = url.pathname === "/" ? basePath : `${basePath}${url.pathname}`;
    url.pathname = newPath;
    return NextResponse.rewrite(url);
  }

  // Default: Launchpad apps use /a/[slug] pattern
  // Skip API routes for dynamic apps (they use the shared /api)
  if (url.pathname.startsWith("/api")) {
    return NextResponse.next();
  }

  // invoice-nudge.theaiethos.com/app → /a/invoice-nudge/app
  // invoice-nudge.theaiethos.com/ → /a/invoice-nudge (landing page)
  const newPath = `/a/${subdomain}${url.pathname}`;
  url.pathname = newPath;

  return NextResponse.rewrite(url);
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
