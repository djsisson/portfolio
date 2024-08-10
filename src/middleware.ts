import { NextResponse, type NextRequest } from "next/server";
import { getUser, isJWTValid, refreshToken } from "./lib/auth";

export async function middleware(request: NextRequest) {
  let newResponse = NextResponse.next({
    request,
  });
  const cookies = request.cookies;
  const access_token = cookies.get("access_token")?.value;
  const refresh_token = cookies.get("refresh_token")?.value;
  if (access_token) {
    const valid = await isJWTValid(access_token);
    if (valid) {
      const user = await getUser(access_token);
      if (user) return newResponse;
    }
  }

  if (refresh_token) {
    const token = await refreshToken(refresh_token);
    if (token) {
      cookies.set("access_token", JSON.stringify(token.access_token));
      cookies.set("refresh_token", JSON.stringify(token.refresh_token));
      newResponse = NextResponse.next({
        request,
      });
      newResponse.cookies.set("access_token", token.access_token, {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        maxAge: token.expires_in,
      });
      newResponse.cookies.set("refresh_token", token.refresh_token, {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60 * 24 * 7,
      });
      return newResponse;
    }
    cookies.delete("access_token");
    cookies.delete("refresh_token");
    const url = request.nextUrl.clone();
    url.pathname = "/";
    newResponse = NextResponse.redirect(url);
    newResponse.cookies.delete("access_token");
    newResponse.cookies.delete("refresh_token");
    return newResponse;
  }
  return newResponse;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
