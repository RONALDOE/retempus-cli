import React, { useEffect, useState } from "react";
import axios from "axios";
import { downloadFile } from "@utils/helpers";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"; // Importa FontAwesomeIcon
import { faCloudArrowDown } from "@fortawesome/free-solid-svg-icons"; // Importa el icono específico

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

interface RecentFilesProps {
  gauthTokens: string[];
}


export default function RecentFiles({ gauthTokens }: RecentFilesProps) {
  const backendUrl = import.meta.env.VITE_BACKEND_URL; // Backend API URL
  const [files, setFiles] = useState<FileData[]>([]);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const requests = gauthTokens.map((token) =>
          axios.get(`${backendUrl}/dashboard/recentFiles?accessToken=${token}`)
        );

        const responses = await Promise.all(requests);
        let allFiles: FileData[] = [];

        for (const response of responses) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const filesFromResponse = response.data.files.map((file: any) => ({
            iconLink: file.iconLink,
            webViewLink: file.webViewLink,
            name: file.name,
            modifiedTime: file.modifiedTime,
            mimeType: file.mimeType,
            id: file.id,
            accessToken: file.accessToken,
          }));

          allFiles = allFiles.concat(filesFromResponse);
        }

        const sortedFiles = allFiles.sort((a, b) =>
          new Date(b.modifiedTime).getTime() - new Date(a.modifiedTime).getTime()
        );

        setFiles(sortedFiles.slice(0, 5));
      } catch (error) {
        console.error("Error al obtener archivos recientes:", error);
      } finally {
        setLoading(false);
      }
    };

    if (gauthTokens.length > 0) {
      fetchFiles();
    }
  }, [gauthTokens]);
  console.log(files)

  if (loading) {
    return <div className="text-center">Loading recent files...</div>;
  }

  return (
    <div className="overflow-hidden bg-white rounded-lg shadow-lg p-4 w-full h-[90%] flex flex-col mt-8">
      <div className="flex justify-between items-center bg-gray-200 rounded-t-lg px-3 py-2">
        <div className="flex-1 text-gray-700 font-semibold text-sm">Name</div>
        <div className="flex-1 text-gray-700 font-semibold text-sm text-center">Modified Date</div>
        <div className="flex-1 text-gray-700 font-semibold text-sm text-left">MIME Type</div>
        <div className="flex-1 text-gray-700 font-semibold text-sm text-left">Actions</div> {/* Nueva columna para acciones */}
      </div>

      <div className="flex flex-col space-y-3 mt-2">
        {files.map((file) => (
          <div key={file.id} className="flex justify-between items-center bg-gray-50 hover:bg-gray-100 rounded-lg p-3 cursor-pointer shadow-sm">
            <img
              src={file.iconLink.replace("16", "256")}
              className="w-8 h-8 rounded-sm mr-5"
              alt="file"
            />
            <div className="flex-1 truncate font-medium text-gray-800">{file.name}</div>
            <div className="flex-1 truncate text-gray-600 text-sm text-center">
              {new Date(file.modifiedTime).toLocaleString()}
            </div>
            <div className="flex-1 truncate text-gray-500 text-sm text-left">{file.mimeType}</div>
            <div className="flex-1 flex justify-center">
              {/* Botón de descarga al lado de cada archivo */}
              <button
                onClick={() => downloadFile(file.id, file.accessToken, file.name)}
                className="text-blue-500 hover:text-blue-700"
              >
                <FontAwesomeIcon icon={faCloudArrowDown} />
              </button>
              <a
                href={file.webViewLink}
                target="_blank"
                className="ml-4 text-xl font-bold text-blue-500 hover:text-blue-700"
              >
                Open
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
