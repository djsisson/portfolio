"use client";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { signOut } from "@/lib/auth";
import { LogOut } from "lucide-react";
export default function Logout() {
  const submitForm = async (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    await signOut("/todos");
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
