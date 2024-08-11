"use client";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { signOut } from "@/lib/auth";
export default function Logout() {
  const submitForm = async (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    await signOut("/todos");
  };
  return (
    <DropdownMenuItem
      className="flex cursor-pointer justify-center"
      onClick={(e) => submitForm(e)}
    >
      Sign Out
    </DropdownMenuItem>
  );
}
