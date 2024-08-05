import { redirect } from "next/navigation";
import { getUserFromJWT, signOut } from "@/utils/auth";

export default async function Page() {
  const user = await getUserFromJWT();
  if (!user) {
    redirect("/auth/");
  }
  return (
    <div>
      {user.email!}
      <form>
        <button formAction={signOut}>Logout</button>
      </form>
    </div>
  );
}
