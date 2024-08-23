import Link from "next/link";

export default function Footer() {
  return (
    <div className="bg-secondary w-full p-2 text-center">
      <Link
        href="tilez/about"
        replace={true}
        className="cursor-pointer hover:underline"
      >
        © DJadetech, 2024.
      </Link>
    </div>
  );
}
