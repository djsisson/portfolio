import { type JWTPayload, jwtVerify, SignJWT } from "jose";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const cache = new Map<string, { result: boolean; ttl: number }>();

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

async function verifyJWT(jwt: string): Promise<JWTPayload | null> {
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

export async function signInWithProvider(
	provider: "google" | "github",
	redirectTo: string,
) {
	const codeVerifier = await generateRandomBase64String();
	const codeChallenge = await computeCodeChallengeFromVerifier(codeVerifier);
	(await cookies()).set("code_verifier", codeVerifier, {
		httpOnly: true,
		sameSite: "lax",
		secure: process.env.NODE_ENV === "production",
		maxAge: 60 * 5,
	});
	redirect(
		`${process.env.EXTERNAL_AUTH_URL}/authorize?provider=${provider}&redirect_to=${process.env.SITE_URL}/redirect${redirectTo}&code_challenge=${codeChallenge}&code_challenge_method=S256`,
	);
}

export async function exchangeCodeForSession(code: string) {
	if (!code || !(await cookies()).get("code_verifier")?.value) {
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
				code_verifier: (await cookies()).get("code_verifier")?.value,
			}),
		},
	);
	if (result.status !== 200) {
		return false;
	}
	const data = await result.json();
	(await cookies()).delete("code_verifier");
	if (!data?.access_token && !data?.refresh_token && !data?.expires_in) {
		return false;
	}
	(await cookies()).set("access_token", data.access_token, {
		httpOnly: true,
		sameSite: "lax",
		secure: process.env.NODE_ENV === "production",
		maxAge: data.expires_in,
	});

	(await cookies()).set(
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

export async function signOutFromProvider(redirectTo: string) {
	const jwt = (await cookies()).get("access_token")?.value;
	if (jwt && (await isJWTValid(jwt))) {
		const result = await fetch(`${process.env.INTERNAL_AUTH_URL}/logout`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				apikey: process.env.SUPABASE_ANON_KEY!,
				Authorization: `Bearer ${jwt}`,
			},
		});
	}
	cache.delete((await cookies()).get("access_token")?.value!);
	(await cookies()).delete("access_token");
	(await cookies()).delete("refresh_token");
	redirect(redirectTo);
}

export async function getUser(token: string) {
	const inCache = cache.get(token);
	if (inCache && inCache.ttl > Date.now()) {
		return inCache.result;
	}
	const data = await fetch(`${process.env.INTERNAL_AUTH_URL}/user`, {
		method: "GET",
		headers: {
			"Content-Type": "application/json",
			apikey: process.env.SUPABASE_ANON_KEY!,
			Authorization: `Bearer ${token}`,
		},
	})
		.then((res) => {
			if (res.status === 200) {
				cache.set(token, {
					result: true,
					ttl: Date.now() + 60 * 1000,
				});
				return true;
			}
			cache.delete(token);
			return false;
		})
		.catch((e) => {
			cache.delete(token);
			return false;
		});
	return data;
}

export async function refreshToken(token: string) {
	const refresh = await verifyJWT(token);
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
	if (!(await cookies()).get("access_token")?.value) {
		return null;
	}
	const data = await verifyJWT((await cookies()).get("access_token")?.value!);
	return data;
}

const clearTokens = () => {
	cache.forEach((value, key) => {
		if (value.ttl < Date.now()) {
			cache.delete(key);
		}
	});
};
setInterval(clearTokens, 60 * 1000);
