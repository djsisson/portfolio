import {
  getUserFromJWT,
  signInWithGithub,
  signOut as _signOut,
} from "@/utils/auth";

export default async function Header() {
  const signIn = signInWithGithub.bind(null, "/todos/callback");
  const signOut = _signOut.bind(null, "/todos");
  const user = await getUserFromJWT();

  return (
    <div className="flex w-full justify-between p-4">
      <h1 className="text-2xl font-bold">Todos</h1>
      <div className="cursor-pointer">
        {user?.exp ? (
          <form>
            <button className="cursor-pointer" formAction={signOut}>
              Logout
            </button>
          </form>
        ) : (
          <form>
            <button className="cursor-pointer" formAction={signIn}>
              Sign in with GitHub
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
