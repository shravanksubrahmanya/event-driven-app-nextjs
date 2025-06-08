import {
  clerkClient,
  clerkMiddleware,
  createRouteMatcher,
} from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

// Define public routes
const isPublicRoute = createRouteMatcher([
  "/",
  "/api/webhook/register",
  "/sign-up(.*)",
  "/sign-in(.*)",
]);

export default clerkMiddleware(async (auth, req: NextRequest) => {
  const { userId, redirectToSignIn } = await auth();

  if (isPublicRoute(req)) {
    return NextResponse.next();
  }

  if (!userId) {
    return redirectToSignIn({ returnBackUrl: req.url });
  }

  if (userId) {
    try {
      const clerk = await clerkClient();
      const user = await clerk.users.getUser(userId);
      const role = (user.publicMetadata?.role as string) || undefined;

      if (role === "admin" && req.nextUrl.pathname.startsWith("/dashboard")) {
        return NextResponse.redirect(new URL("/admin/dashboard", req.url));
      }

      // prevent non admin users from accessing admin routes
      if (role !== "admin" && req.nextUrl.pathname.startsWith("/admin")) {
        return NextResponse.redirect(new URL("/dashboard", req.url));
      }

      // redirect auth user trying to access public routes
      if (isPublicRoute(req)) {
        return NextResponse.redirect(
          new URL(role === "admin" ? "/admin/dashboard" : "/dashboard", req.url)
        );
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      return NextResponse.redirect(new URL("/error", req.url));
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
