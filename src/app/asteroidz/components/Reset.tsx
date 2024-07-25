"use client";

const Reset = () => {
  const onClick = () => {
    localStorage.removeItem("Asteroidz");
    window.location.reload();
  };

  return (
    <button className="cursor-pointer" onClick={onClick} type="button">
      Reset
    </button>
  );
};

export default Reset;
