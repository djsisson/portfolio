import { NextResponse } from "next/server";
import { exchangeCodeForSession } from "@/lib/auth";
// The client you created from the Server-Side Auth instructions

export async function GET(
  request: Request,
  props: { params: Promise<{ redirect?: string[] }> },
) {
  const params = await props.params;
  const { searchParams, hostname, protocol } = new URL(request.url);
  const code = searchParams.get("code");

  const redirectUrl = `/${params.redirect?.join("/") ?? ""}`;

  if (code) {
    const valid = await exchangeCodeForSession(code);
    if (valid) {
      const forwardedHost = request.headers.get("x-forwarded-host"); // original origin before load balancer
      const isLocalEnv = process.env.NODE_ENV === "development";
      if (isLocalEnv) {
        // we can be sure that there is no load balancer in between, so no need to watch for X-Forwarded-Host
        return NextResponse.redirect(`${protocol}//${hostname}${redirectUrl}`);
      } else if (forwardedHost) {
        return NextResponse.redirect(`https://${forwardedHost}${redirectUrl}`);
      } else {
        return NextResponse.redirect(`${protocol}//${hostname}${redirectUrl}`);
      }
    }
  }
  // return the user to an error page with instructions
  return NextResponse.redirect(
    `${protocol}//${hostname}${redirectUrl}?error=invalid_code`,
  );
}
