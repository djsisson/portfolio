"use client";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { signOut } from "@/lib/auth-client";
import { LogOut } from "lucide-react";
export default function Logout({ redirect }: { redirect: string }) {
  const submitForm = async (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    await signOut(redirect);
  };
  return (
    <DropdownMenuItem
      className="flex cursor-pointer justify-center gap-2"
      onClick={(e) => submitForm(e)}
    >
      <LogOut /> Logout
    </DropdownMenuItem>
  );
}
