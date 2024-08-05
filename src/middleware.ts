import { NextResponse, type NextRequest } from "next/server";
import { getUser, verifyJWT, refreshToken, encodeToBase64 } from "./utils/auth";

export async function middleware(request: NextRequest) {
  let newResponse = NextResponse.next({
    request,
  });
  const cookies = request.cookies;
  const access_token = cookies.get("access_token")?.value;
  const refresh_token = cookies.get("refresh_token")?.value;
  if (access_token && (await verifyJWT(access_token))) {
    const user = await getUser(access_token);
    if (user) return newResponse;
  }
  if (refresh_token) {
    const token = await refreshToken(refresh_token);
    if (token) {
      cookies.set(
        "access_token",
        await encodeToBase64(JSON.stringify(token.access_token)),
      );
      cookies.set(
        "refresh_token",
        await encodeToBase64(JSON.stringify(token.refresh_token)),
      );
      newResponse = NextResponse.next({
        request,
      });
      newResponse.cookies.set(
        "access_token",
        await encodeToBase64(token.access_token),
        {
          httpOnly: true,
          sameSite: "lax",
          secure: process.env.NODE_ENV === "production",
          maxAge: token.expires_in,
        },
      );
      newResponse.cookies.set(
        "refresh_token",
        await encodeToBase64(token.refresh_token),
        {
          httpOnly: true,
          sameSite: "lax",
          secure: process.env.NODE_ENV === "production",
          maxAge: 60 * 60 * 24 * 7,
        },
      );
      return newResponse;
    }
    cookies.delete("access_token");
    cookies.delete("refresh_token");
    const url = request.nextUrl.clone();
    url.pathname = "/auth";
    return NextResponse.redirect(url);
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
