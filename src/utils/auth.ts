"use server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { jwtVerify } from "jose";

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

const isCodeVerifierValid = async (
  codeVerifier: string,
  codeChallenge: string,
) => (await computeCodeChallengeFromVerifier(codeVerifier)) === codeChallenge;

export const encodeToBase64 = async (str: string) =>
  Buffer.from(str).toString("base64url");
const decodeFromBase64 = (str: string) =>
  Buffer.from(str || "", "base64url").toString();
const decodeJWT = (str: string) =>
  JSON.parse(
    Buffer.from(str.split(".")[1] || "", "base64url").toString() || "{}",
  );

export async function verifyJWT(jwt: string) {
  const { payload } = await jwtVerify(
    decodeFromBase64(jwt),
    new TextEncoder().encode(process.env.GO_TRUE_JWT_SECRET!),
  );
  console.log(payload);
  if (!payload.exp) {
    return false;
  }
  console.log(Date.now() - 60 * 1000 * 5, payload.exp * 1000);
  const isExpiring = Date.now() - 60 * 1000 * 5 > payload.exp * 1000;
  if (isExpiring) {
    return false;
  }
  return true;
}

export async function signInWithGithub() {
  const codeVerifier = await generateRandomBase64String();
  const codeChallenge = await computeCodeChallengeFromVerifier(codeVerifier);
  cookies().set("code_verifier", codeVerifier, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 5,
  });
  redirect(
    `${process.env.EXTERNAL_AUTH_URL}/authorize?provider=github&redirect_to=${process.env.SITE_URL}/auth/callback&code_challenge=${codeChallenge}&code_challenge_method=S256`,
  );
}

export async function exchangeCodeForSession(code: string) {
  if (!code || !cookies().get("code_verifier")?.value) {
    return false;
  }
  const data = await fetch(
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
  )
    .then((res) => res.json())
    .catch((e) => e);
  cookies().delete("code_verifier");
  if (!data?.access_token && !data?.refresh_token && !data?.expires_in) {
    return false;
  }
  cookies().set("access_token", await encodeToBase64(data.access_token), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: data.expires_in,
  });

  cookies().set("refresh_token", await encodeToBase64(data.refresh_token), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 7,
  });
  return true;
}

export async function signOut() {
  cookies().delete("access_token");
  cookies().delete("refresh_token");
  redirect("/auth/");
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
  const data = await fetch(`${process.env.INTERNAL_AUTH_URL}/refresh`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      apikey: process.env.SUPABASE_ANON_KEY!,
    },
    body: JSON.stringify({
      refresh_token: token,
    }),
  })
    .then((res) => res.json())
    .catch((e) => null);
  if (!data?.access_token && !data?.refresh_token && !data?.expires_in) {
    return null;
  }
  return data;
}

export async function getUserFromJWT() {
  const data = decodeJWT(
    decodeFromBase64(cookies().get("access_token")?.value!),
  );
  return data;
}
