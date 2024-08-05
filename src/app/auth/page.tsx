import { signInWithGithub } from "@/utils/auth";

export default function LoginPage() {
  return (
    <div>
      <form>
        <button formAction={signInWithGithub}>Sign in with GitHub</button>
      </form>
    </div>
  );
}
