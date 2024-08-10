"use server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { JWTPayload, jwtVerify, SignJWT } from "jose";

const generateRandomBase64String = async (length = 24) =>
  Buffer.from(crypto.getRandomValues(new Uint8Array(length))).toString(
    "base64url",
  );

const computeCodeChallengeFromVerifier = async (verifier: string) => {
  const hashedValue = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(verifier),
  );
  return Buffer.from(hashedValue).toString("base64url");
};

export async function isJWTValid(jwt: string) {
  const payload = await verifyJWT(jwt);
  if (!payload?.exp) {
    return false;
  }
  const isExpiring = Date.now() - 60 * 1000 * 5 > payload.exp * 1000;
  if (isExpiring) {
    return false;
  }
  return true;
}

export async function verifyJWT(jwt: string): Promise<JWTPayload | null> {
  try {
    const { payload } = await jwtVerify(
      jwt,
      new TextEncoder().encode(process.env.GO_TRUE_JWT_SECRET!),
    );
    return payload as JWTPayload;
  } catch (e) {
    return null;
  }
}

async function signJWT(payload: JWTPayload) {
  const jwt = await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("1w")
    .sign(new TextEncoder().encode(process.env.GO_TRUE_JWT_SECRET!));
  return jwt;
}

export async function signInWithGithub(redirectTo: string) {
  const codeVerifier = await generateRandomBase64String();
  const codeChallenge = await computeCodeChallengeFromVerifier(codeVerifier);
  cookies().set("code_verifier", codeVerifier, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 5,
  });
  redirect(
    `${process.env.EXTERNAL_AUTH_URL}/authorize?provider=github&redirect_to=${process.env.SITE_URL}${redirectTo}&code_challenge=${codeChallenge}&code_challenge_method=S256`,
  );
}

export async function exchangeCodeForSession(code: string) {
  if (!code || !cookies().get("code_verifier")?.value) {
    return false;
  }
  const result = await fetch(
    `${process.env.INTERNAL_AUTH_URL}/token?grant_type=pkce`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: process.env.SUPABASE_ANON_KEY!,
      },
      body: JSON.stringify({
        auth_code: code,
        code_verifier: cookies().get("code_verifier")?.value,
      }),
    },
  );
  if (result.status !== 200) {
    return false;
  }
  const data = await result.json();
  cookies().delete("code_verifier");
  if (!data?.access_token && !data?.refresh_token && !data?.expires_in) {
    return false;
  }
  cookies().set("access_token", data.access_token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: data.expires_in,
  });

  cookies().set(
    "refresh_token",
    await signJWT({ refresh_token: data.refresh_token }),
    {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7,
    },
  );
  return true;
}

export async function signOut(redirectTo: string) {
  const result = await fetch(`${process.env.INTERNAL_AUTH_URL}/logout`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      apikey: process.env.SUPABASE_ANON_KEY!,
      Authorization: `Bearer ${cookies().get("access_token")?.value}`,
    },
  });
  cookies().delete("access_token");
  cookies().delete("refresh_token");
  redirect(redirectTo);
}

export async function getUser(token: string) {
  const data = await fetch(`${process.env.INTERNAL_AUTH_URL}/user`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      apikey: process.env.SUPABASE_ANON_KEY!,
      Authorization: `Bearer ${token}`,
    },
  })
    .then((res) => res.json())
    .catch((e) => null);
  return data;
}

export async function refreshToken(token: string) {
  const refresh = await verifyJWT(token)
  if (refresh === null) {
    return null;
  }
  const data = await fetch(
    `${process.env.INTERNAL_AUTH_URL}/token?grant_type=refresh_token`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: process.env.SUPABASE_ANON_KEY!,
      },
      body: JSON.stringify({
        refresh_token: refresh.refresh_token,
      }),
    },
  );
  if (data.status !== 200) {
    return null;
  }

  const result = await data.json();
  if (!result?.access_token && !result?.refresh_token && !result?.expires_in) {
    return null;
  }

  return {
    ...result,
    refresh_token: await signJWT({ refresh_token: result.refresh_token }),
  };
}

export async function getUserFromJWT() {
  if (!cookies().get("access_token")?.value) {
    return null;
  }
  const data = verifyJWT(cookies().get("access_token")?.value!);
  return data;
}
