import { redirect } from "next/navigation";

import { createClient } from "@/utils/supabase/server";
import { logout } from "../login/actions";

export default async function PrivatePage() {
  const supabase = createClient();

  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) {
    redirect("/authtest/login");
  }

  return (
    <form>
      <p>Hello {data.user.email}</p>
      <button formAction={logout}>Logout</button>
    </form>
  );
}
