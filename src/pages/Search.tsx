import React, { useEffect, useState, useContext } from "react";
import { useSearchParams } from "react-router-dom";
import SearchBar from "@components/SearchBar";
import { useGoogleAuth } from "@contexts/gauth.context";
import { AuthContext } from "@contexts/auth.context";
import FileTile from "@components/Filetile";
import FolderTile from "@components/FolderTile";
import Loading from "@components/Loading";
import FolderBreadcrumbs from "@components/FolderBreadcrumbs";

export default function Search() {
  const [folderHierarchy, setFolderHierarchy] = useState<
    { id: string; name: string; iconLink: string }[]
  >([{ id: "root", name: "Root", iconLink: "https://img.icons8.com/glyph-neue/32/folder-invoices.png" }]);

  const [searchParams] = useSearchParams();
  const [files, setFiles] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [filesPerPage] = useState(18);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const authContext = useContext(AuthContext);
  const { fetchConnections, gauthTokens } = useGoogleAuth();

  const [currentFolderId, setCurrentFolderId] = useState<string | null>("root");

  // Extraer parámetros
  const name = searchParams.get("q");
  const categories = searchParams.get("categories");
  const date = searchParams.get("date");
  const startModificationRange = searchParams.get("startModificationDate");
  const endModificationRange = searchParams.get("endModificationDate");
  const modifiedDate = searchParams.get("modifiedDate");

  useEffect(() => {
    if (!authContext) {
      console.error("AuthContext no disponible.");
      return;
    }

    const { auth } = authContext;

    if (auth.user?.userId) {
      fetchConnections(auth.user.userId);
    } else {
      console.error("Usuario no autenticado.");
    }
  }, [authContext]);

  const fetchFiles = async (folderId: string | null = null) => {
    setLoading(true);
    setError(null);
    setFiles([]); // Limpiar los datos antes de cada consulta

    const allFiles: unknown[] = [];

    try {
      console.log("Fetching files...", folderId);
      // Si hay un folderId específico, buscar solo por ese folderId
    
        // Si no estamos en una carpeta específica, buscar por todos los tokens
        for (const token of gauthTokens) {
          const accessToken = token.access;
          const queryParams = new URLSearchParams();

          if (accessToken) queryParams.append("accessToken", accessToken);
          if (folderId) queryParams.append("folderId", folderId); // Filtra por folderId
          if (categories) queryParams.append("categories", categories);
          if (name) queryParams.append("containsWords", name);
          if (date) queryParams.append("date", date);
          if (startModificationRange)
            queryParams.append("startModified", startModificationRange);
          if (endModificationRange)
            queryParams.append("endModified", endModificationRange);
          if (modifiedDate) queryParams.append("modifiedDate", modifiedDate);

          const response = await fetch(
            `${import.meta.env.VITE_BACKEND_URL}/files/filtered?${queryParams.toString()}`
          );

          if (!response.ok) {
            throw new Error(`Error: ${response.statusText}`);
          }

          const data = await response.json();
          allFiles.push(...data.files);
          console.log(data.files);
        
      }

      setFiles(allFiles);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (gauthTokens.length > 0) {
      fetchFiles(currentFolderId); // Cargar archivos de la carpeta actual
    }
    setCurrentPage(1); // Resetear la página actual
  }, [
    name,
    categories,
    date,
    startModificationRange,
    endModificationRange,
    modifiedDate,
    gauthTokens,
    currentFolderId,
  ]);

  const handleFolderClick = (folderId: string, folderName?: string, iconLink?: string) => {
    if (folderId === "root") {
      setFolderHierarchy([
        { id: "root", name: "Root", iconLink: "https://img.icons8.com/glyph-neue/32/folder-invoices.png" },
      ]);
      setCurrentFolderId("root"); // Establecer como "root" cuando se navega a la carpeta raíz
      
    } else {
      setFolderHierarchy((prev) => [
        ...prev,
        { id: folderId, name: folderName || "Folder", iconLink: iconLink || "" },
      ]);
      setCurrentFolderId(folderId); // Establecer el folderId correspondiente para otras carpetas
    }
  };

  const indexOfLastFile = currentPage * filesPerPage;
  const indexOfFirstFile = indexOfLastFile - filesPerPage;
  const currentFiles = files.slice(indexOfFirstFile, indexOfLastFile);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <div>
      <SearchBar />
      {loading && <Loading loading={loading} message="Loading Files" />}
      {error && <p style={{ color: "red" }}>Error: {error}</p>}
      {!loading && !error && files.length === 0 && <p>No files found</p>}
      <FolderBreadcrumbs
        folderHierarchy={folderHierarchy}
        onFolderClick={(folderId) => {
          const folderIndex = folderHierarchy.findIndex((folder) => folder.id === folderId);
          if (folderIndex !== -1) {
            setFolderHierarchy(folderHierarchy.slice(0, folderIndex + 1));
          }
          setCurrentFolderId(folderId);
        }}
      />

      <div className="grid grid-cols-6 sm:grid-cols-4 lg:grid-cols-6 gap-4 p-4 mb-20">
        {currentFiles.map((file) =>
          file.mimeType === "application/vnd.google-apps.folder" ? (
            <FolderTile
              key={file.id}
              folderdata={file}
              onClick={() => handleFolderClick(file.id, file.name, file.iconLink)}
            />
          ):  (
            <FileTile key={file.id} fileData={file} />
          )
        )}
      </div>

      <Pagination
        filesPerPage={filesPerPage}
        totalFiles={files.length}
        currentPage={currentPage}
        paginate={paginate}
      />
    </div>
  );
}

interface PaginationProps {
  filesPerPage: number;
  totalFiles: number;
  currentPage: number;
  paginate: (pageNumber: number) => void;
}

function Pagination({ filesPerPage, totalFiles, currentPage, paginate }: PaginationProps) {
  const pageNumbers = [];

  for (let i = 1; i <= Math.ceil(totalFiles / filesPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <nav className="flex justify-center my-4">
      <ul className="flex space-x-2">
        {pageNumbers.map((number) => (
          <li key={number}>
            <button
              onClick={() => paginate(number)}
              className={`px-4 py-2 rounded ${
                currentPage === number
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 hover:bg-gray-300"
              }`}
            >
              {number}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}
