import { login, signup, logout, signInWithGithub } from "./actions";

export default function LoginPage() {
  return (
    <div>
      <form>
        <label htmlFor="email">Email:</label>
        <input id="email" name="email" type="email" required />
        <label htmlFor="password">Password:</label>
        <input id="password" name="password" type="password" required />
        <button formAction={login}>Log in</button>
        <button formAction={signup}>Sign up</button>
        <button formAction={logout}>Log out</button>
      </form>
      <form>
        <button formAction={signInWithGithub}>Sign in with GitHub</button>
      </form>
    </div>
  );
}
