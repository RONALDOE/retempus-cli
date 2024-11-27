import React, { useState } from 'react';
import FileModal from '@components/FileModal'; // Importa el modal

interface FileData {
  name: string;
  modifiedTime: string;
  mimeType: string;
  id: string;
  iconLink: string;
  webViewLink: string;
  accessToken: string;
  starred: boolean;
   size:string;
    fileExtension: string;
}


const FileTile = ({ fileData }: { fileData: FileData }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  console.log(fileData);

  // Función para abrir el modal
  const openModal = () => setIsModalOpen(true);

  // Función para cerrar el modal
  const closeModal = () => setIsModalOpen(false);

  return (
    <div className="border border-gray-200 rounded-lg shadow-md flex flex-col items-center p-4 w-40 h-40 bg-white">
      {/* Icon */}
      <img
        src={fileData.iconLink.replace("16", "256")}
        alt={`${fileData.name} icon`}
        className="w-16 h-16 object-contain mb-4 cursor-pointer"
        onClick={openModal}
      />

      {/* File name */}
      <div className="text-center flex flex-col flex-grow justify-between">
        <a
          href={fileData.webViewLink}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500 font-semibold hover:underline"
        >
          {fileData.name.length > 20 ? `${fileData.name.slice(0, 20)}...` : fileData.name}
        </a>
      </div>

      {/* FileModal */}
      <FileModal
        isOpen={isModalOpen}
        fileData={fileData}
        onClose={closeModal}
      />
    </div>
  );
};

export default FileTile;
