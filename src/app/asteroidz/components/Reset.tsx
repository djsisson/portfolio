"use client";

const Reset = () => {
  const onClick = () => {
    localStorage.removeItem("Asteroidz");
    window.location.reload();
  };

  return (
    <button
      className="cursor-pointer text-sm md:text-lg"
      onClick={onClick}
      type="button"
    >
      Reset
    </button>
  );
};

export default Reset;
