export default function Home() {
  return (
    <main>
      <h1 className="text-2xl">Projects</h1>
      <ul className="flex flex-col gap-4">
        <li>
          <a className="hover:underline" href="/genshin">
            Genshin Impact
          </a>
        </li>
        <li>
          <a className="hover:underline" href="/asteroidz">
            Asteroidz
          </a>
        </li>
      </ul>
    </main>
  );
}
