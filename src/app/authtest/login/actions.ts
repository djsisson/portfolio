"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createClient } from "@/utils/supabase/server";

export async function login(formData: FormData) {
  const supabase = createClient();

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const { error } = await supabase.auth.signInWithPassword(data);
  console.log(error);
  if (error) {
    redirect("/authtest/error");
  }

  revalidatePath("/authtest", "layout");
  redirect("/authtest/private");
}

export async function signup(formData: FormData) {
  const supabase = createClient();

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const { error } = await supabase.auth.signUp(data);
  console.log(error);
  if (error) {
    redirect("/authtest/error");
  }

  revalidatePath("/authtest", "layout");
  redirect("/authtest/private");
}

export async function logout() {
  const supabase = createClient();
  const { error } = await supabase.auth.signOut();
  revalidatePath("/authtest", "layout");
  redirect("/authtest/");
}

export async function signInWithGithub() {
  const supabase = createClient();
  const { error, data } = await supabase.auth.signInWithOAuth({
    provider: "github",
    options: {
      redirectTo: process.env.SITEURL! + "/authtest/callback",
    },
  });

  if (data.url) {
    if (process.env.NODE_ENV === "development") {
      redirect(data.url);
    }
    const newUrl = data.url.replace(
      process.env.NEXT_PUBLIC_SUPABASE_URL! + "/auth/v1",
      process.env.NEXT_PUBLIC_SUPABASE_URL_AUTH!,
    );
    redirect(newUrl); // use the redirect API for your server framework
  }
  if (error) {
    redirect("/authtest/error");
  }
  revalidatePath("/authtest", "layout");
  redirect("/authtest/private");
}
