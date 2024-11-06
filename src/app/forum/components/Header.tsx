import Auth from "@/components/auth";

export default async function Header() {
  return (
    <div className="flex w-full justify-between p-4">
      <h1 className="text-2xl font-bold">Forum</h1>
      <Auth app={"/forum"} />
    </div>
  );
}
