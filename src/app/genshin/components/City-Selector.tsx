export default function CitySelector({
  cities,
  currentCity,
  setCurrentCity,
}: {
  cities: { name: string }[];
  currentCity: number;
  setCurrentCity: React.Dispatch<React.SetStateAction<number>>;
}) {
  return (
    <div className="z-30 flex w-max flex-col justify-center md:gap-2">
      {cities.map((city, i) => (
        <div
          key={i}
          onClick={() => setCurrentCity(i)}
          className={`z-20 w-fit cursor-pointer bg-gradient-to-b from-white to-white bg-clip-text pl-2 font-bold text-transparent hover:to-red-500 md:text-xl lg:text-2xl ${currentCity === i && "to-yellow-400"}`}
        >
          {city.name}
        </div>
      ))}
    </div>
  );
}
