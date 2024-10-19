"use server";

import {
  getUserFromJWT,
  signInWithProvider,
  signOutFromProvider,
} from "./auth";

export async function getUser() {
  return await getUserFromJWT();
}

export async function signIn(
  provider: "google" | "github",
  redirectTo: string,
) {
  return await signInWithProvider(provider, redirectTo);
}

export async function signOut(redirectTo: string) {
  return await signOutFromProvider(redirectTo);
}
