export default function CitySelector({
  cities,
  currentCity,
  setCurrentCity,
}: {
  cities: { id: number; name: string }[];
  currentCity: number;
  setCurrentCity: React.Dispatch<React.SetStateAction<number>>;
}) {
  return (
    <div className="flex flex-1 flex-col justify-center gap-2">
      {cities.map((city, i) => (
        <div
          key={city.id}
          onClick={() => setCurrentCity(i)}
          className={`z-20 w-fit cursor-pointer ${i === currentCity ? "text-blue-500" : "text-white"} hover:text-red-500 md:text-xl lg:text-2xl`}
        >
          {city.name}
        </div>
      ))}
    </div>
  );
}
