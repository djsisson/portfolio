import { getUserFromJWT, signInWithGithub } from "@/utils/auth";
import { redirect } from "next/navigation";

export default async function LoginPage() {
  const user = await getUserFromJWT();
  if (user?.email) {
    redirect("/auth/private");
  }
  return (
    <div>
      <form>
        <button formAction={signInWithGithub}>Sign in with GitHub</button>
      </form>
    </div>
  );
}
