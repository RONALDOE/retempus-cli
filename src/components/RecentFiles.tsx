import React from "react";

interface FileData {
  name: string;
  modifiedDate: string;
  location: string;
  size: string;
}

interface RecentFilesProps {
  files: FileData[];
}

export default function RecentFiles({ files }: RecentFilesProps) {
  const handleRowClick = (file: FileData) => {
    console.log("File clicked:", file);
  };

  return (
    <div className="overflow-hidden bg-white rounded-lg shadow-lg p-4 w-full h-[90%] flex flex-col mt-8 ">
      {/* Encabezados */}
      <div className="flex justify-between items-center bg-gray-200 rounded-t-lg px-3 py-2">
        <div className="flex-1 text-gray-700 font-semibold text-sm">Name</div>
        <div className="flex-1 text-gray-700 font-semibold text-sm text-center">Modified Date</div>
        <div className="flex-1 text-gray-700 font-semibold text-sm text-left">Location</div>
        <div className="ml-4 text-gray-700 font-semibold text-sm">Size</div>
      </div>

      {/* Archivos */}
      <div className="flex flex-col space-y-3 mt-2">
        {files.slice(0, 5).map((file, index) => (
          <div
            key={index}
            className="flex justify-between items-center bg-gray-50 hover:bg-gray-100 rounded-lg p-3 cursor-pointer shadow-sm transition-transform duration-200 transform hover:scale-105"
            onClick={() => handleRowClick(file)}
          >
            <div className="flex-1 truncate font-medium text-gray-800">{file.name}</div>
            <div className="flex-1 truncate text-gray-600 text-sm text-center">{file.modifiedDate}</div>
            <div className="flex-1 truncate text-gray-500 text-sm text-left">{file.location}</div>
            <div className="ml-4 text-gray-700 text-sm">{file.size}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
