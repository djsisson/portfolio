import { NextResponse, type NextRequest } from "next/server";
import { getUser, isJWTValid, refreshToken } from "./lib/auth";

export async function middleware(request: NextRequest) {
  const isDev = process.env.NODE_ENV === "development";
  const nonce = Buffer.from(crypto.randomUUID()).toString("base64");
  const cspHeader = `
    default-src 'self';
    script-src 'self' 'nonce-${nonce}' 'strict-dynamic';
    style-src 'self' 'unsafe-inline';
    img-src 'self' blob: data: https://avatars.githubusercontent.com https://\*.googleusercontent.com;
    font-src 'self';
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'none';
    upgrade-insecure-requests;
`;
  // Replace newline characters and spaces
  const contentSecurityPolicyHeaderValue = cspHeader
    .replace(/\s{2,}/g, " ")
    .trim();

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-nonce", nonce);

  requestHeaders.set(
    "Content-Security-Policy",
    contentSecurityPolicyHeaderValue,
  );
  const newResponse = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
  newResponse.headers.set(
    "Content-Security-Policy",
    contentSecurityPolicyHeaderValue,
  );

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
    const newRedirect = NextResponse.redirect(url);
    newRedirect.cookies.delete("access_token");
    newRedirect.cookies.delete("refresh_token");
    newRedirect.headers.set(
      "Content-Security-Policy",
      contentSecurityPolicyHeaderValue,
    );
    return newRedirect;
  }
  return newResponse;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    {
      source: "/((?!api|_next/static|_next/image|favicon.ico).*)",
      missing: [
        { type: "header", key: "next-router-prefetch" },
        { type: "header", key: "purpose", value: "prefetch" },
      ],
    },
  ],
};
