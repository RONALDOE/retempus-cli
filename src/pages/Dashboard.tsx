import DataCard from "@components/DataCard";

export default function Dashboard() {
  return (
    <div className="bg-[#121212] w-full h-full grid grid-cols-7 grid-rows-7 gap-6 p-6">
      {/* Contenedor de DataCards, ajustado al grid proporcionado */}
      <div className="col-span-4 row-span-2 col-start-2 row-start-1 flex flex-row gap-6 items-center justify-center">
        <DataCard />
        <DataCard />
        <DataCard />
      </div>

      {/* Coloca el segundo DataCard en el lugar adecuado según el grid */}
      <div className="col-span-2 row-span-7 col-start-6 row-start-1 bg-white">
        {/* Aquí puedes colocar contenido si lo necesitas */}
      </div>

      {/* Coloca otro DataCard en una nueva posición */}
      <div className="col-span-4 col-start-2 row-start-3 bg-white">
        {/* Aquí puedes colocar contenido si lo necesitas */}
      </div>

      {/* Más tarjetas de datos según tu layout */}
      <div className="col-span-4 row-span-4 col-start-2 row-start-4 bg-white">
        {/* Aquí puedes colocar contenido si lo necesitas */}
      </div>

      {/* Un contenedor más que puede ser útil para el diseño */}
      <div className="row-span-7 col-start-1 row-start-1 bg-white">
        {/* Aquí puedes colocar contenido si lo necesitas */}
      </div>
    </div>
  );
}
