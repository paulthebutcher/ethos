import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export { clerkMiddleware, createRouteMatcher };

/**
 * Creates a standard auth middleware for AI Ethos apps
 *
 * @param publicRoutes - Array of public route patterns (default: ["/", "/sign-in", "/sign-up"])
 * @returns Clerk middleware configured for the app
 *
 * @example
 * ```typescript
 * // middleware.ts
 * import { createAuthMiddleware } from "@guildry/auth/middleware";
 *
 * export default createAuthMiddleware(["/", "/pricing", "/about"]);
 *
 * export const config = {
 *   matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
 * };
 * ```
 */
export function createAuthMiddleware(publicRoutes: string[] = []) {
  const defaultPublicRoutes = [
    "/",
    "/sign-in(.*)",
    "/sign-up(.*)",
    "/api/webhooks(.*)",
  ];

  const allPublicRoutes = [...defaultPublicRoutes, ...publicRoutes];
  const isPublicRoute = createRouteMatcher(allPublicRoutes);

  return clerkMiddleware(async (auth, req: NextRequest) => {
    if (!isPublicRoute(req)) {
      await auth.protect();
    }
    return NextResponse.next();
  });
}

/**
 * Standard middleware matcher config for Next.js
 */
export const standardMatcherConfig = {
  matcher: [
    // Skip Next.js internals and static files
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
