import React from "react";

interface FolderBreadcrumbsProps {
  folderHierarchy: { id: string; name: string; iconLink: string }[];
  onFolderClick: (folderId: string) => void;
}


const FolderBreadcrumbs = ({ folderHierarchy, onFolderClick }: FolderBreadcrumbsProps) => {
  console.log( "FOlder", folderHierarchy)
  return (
    <div className="flex items-center space-x-2 bg-gray-100 p-2 rounded-md shadow-md">
      {folderHierarchy.map((folder, index) => (
        <div
          key={folder.id}
          className="flex items-center space-x-2 cursor-pointer hover:bg-gray-200 p-1 rounded"
          onClick={() => onFolderClick(folder.id)}
        >
          {/* Icono del folder */}
          <img
            src={folder.iconLink.replace("16", "32")} // Usa un tamaño pequeño para el ícono
            alt={`${folder.name} icon`}
            className="w-5 h-5"
          />
          {/* Nombre del folder */}
          <span className="text-sm font-medium text-blue-500 hover:underline">
            {folder.name}
          </span>
          {/* Flecha de separación */}
          {index < folderHierarchy.length - 1 && <span className="text-gray-400">/</span>}
        </div>
      ))}
    </div>
  );
};

export default FolderBreadcrumbs;
