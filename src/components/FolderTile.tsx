
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const FolderTile = ({ folderdata, onClick }: { folderdata: any, onClick: (folderId: string) => void }) => {

  // Función para abrir el modal (si lo necesitas)

  // Función para cerrar el modal (si lo necesitas)

  return (
    <div className="border border-gray-200 rounded-lg shadow-md flex flex-col items-center p-4 w-40 h-40 bg-white">
      {/* Icono de la carpeta */}
      <img
        src={folderdata.iconLink.replace("16", "256")}  // Asegúrate de que el link del icono sea correcto
        alt={`${folderdata.name} icon`}
        className="w-16 h-16 object-contain mb-4 cursor-pointer"
        onClick={() => onClick(folderdata.id)}  // Llama la función onClick pasando el folderId
      />

      {/* Nombre de la carpeta */}
      <div className="text-center flex flex-col flex-grow justify-between">
        <a
          href={folderdata.webViewLink}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500 font-semibold hover:underline"
        >
          {folderdata.name.length > 20 ? `${folderdata.name.slice(0, 20)}...` : folderdata.name}
        </a>
      </div>

     
    </div>
  );
};

export default FolderTile;
