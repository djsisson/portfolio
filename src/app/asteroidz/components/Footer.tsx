import Stats from "./Stats";

const Footer = () => {
  return (
    <footer className="col-start-1 -col-end-1 -row-start-2 -row-end-1 flex items-center justify-between border-t-5 [border-style:outset] border-[var(--bgcolour)] p-10">
      <Stats />
      <div
        className="bg-clip-text text-3xl font-bold text-transparent"
        style={{
          animation: "rainbow-scroll 10s ease-in-out infinite",
          background:
            "linear-gradient(45deg, #ff0000, #ff7300, #fffb00, #48ff00, #00ffd5, #002bff, #7a00ff, #ff00c8, #ff0000)",
          backgroundSize: "300%",
          WebkitBackgroundClip: "text",
          backgroundClip: "text",
        }}
      >
        Darren
      </div>
    </footer>
  );
};

export default Footer;
