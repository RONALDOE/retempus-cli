import React, { useState, useEffect } from "react";
import { useGoogleAuth } from "@contexts/gauth.context";
import axios from "axios";
import FolderTile from "@components/FolderTile";

export default function Upload() {
  const { gauthTokens } = useGoogleAuth();
  const [selectedEmail, setSelectedEmail] = useState<string | null>(null);
  const [folders, setFolders] = useState<Record<string, string>[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [foldersPerPage] = useState(18); // Número de carpetas por página
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [folderContents, setFolderContents] = useState<any[]>([]); // Almacena los contenidos de la carpeta seleccionada
  const [currentFolderId, setCurrentFolderId] = useState<string | null>(null); // Carpeta actual seleccionada
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  // Función para actualizar la URL con los parámetros email y folderId
  const updateUrlParams = (email: string | null, folderId: string | null) => {
    const url = new URL(window.location.href);
    if (email) url.searchParams.set("email", email);
    if (folderId) url.searchParams.set("folderId", folderId);
    window.history.replaceState({}, "", url.toString()); // Actualiza la URL sin recargar la página
  };

  // Obtener los parámetros de la URL al cargar la página
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const emailFromUrl = params.get("email");
    const folderIdFromUrl = params.get("folderId");

    if (emailFromUrl) setSelectedEmail(emailFromUrl);
    if (folderIdFromUrl) handleFolderClick(folderIdFromUrl);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Obtener las carpetas al seleccionar un correo
  useEffect(() => {
    async function fetchFolders() {
      if (!selectedEmail) return;
      try {
        const accessToken = gauthTokens.find(
          (token) => token.email === selectedEmail
        )?.access;

        const response = await axios.get(
          `${backendUrl}/files/folders?accessToken=${accessToken}`
        );

        setFolders(response.data);
      } catch (error) {
        console.error("Error al obtener las carpetas:", error);
      }
    }
    fetchFolders();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedEmail]);

  // Lógica de paginación
  const indexOfLastFolder = currentPage * foldersPerPage;
  const indexOfFirstFolder = indexOfLastFolder - foldersPerPage;
  const currentFolders = folders.slice(indexOfFirstFolder, indexOfLastFolder);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  // Función para manejar el clic en un folder y obtener sus contenidos
  const handleFolderClick = async (folderId: string) => {
    try {
      const accessToken = gauthTokens.find(
        (token) => token.email === selectedEmail
      )?.access;

      const response = await axios.get(
        `${backendUrl}/files/folders?folderId=${folderId}&accessToken=${accessToken}`
      );
      console.log("Contenidos de la carpeta:", response.data);
      setFolderContents(response.data); // Actualiza los contenidos de la carpeta
      setCurrentFolderId(folderId); // Actualiza el folder actual
      updateUrlParams(selectedEmail, folderId); // Actualiza los parámetros de la URL
    } catch (error) {
      console.error("Error al obtener los contenidos del folder:", error);
    }
  };

  // Función para manejar el cambio de correo electrónico
  const handleEmailChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newEmail = event.target.value;
    setSelectedEmail(newEmail);
    setCurrentPage(1); // Reiniciar a la primera página al cambiar el correo
    setFolderContents([]); // Limpiar los contenidos previos
    setCurrentFolderId(null); // Limpiar el folder actual
    updateUrlParams(newEmail, null); // Actualiza la URL solo con el nuevo email
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-4 p-6">
      {/* Selección de correo */}
      <div className="w-full max-w-md flex items-center justify-center flex-col">
        <label className="block text-gray-700 font-bold mb-2" htmlFor="email">
          Selecciona un correo electrónico:
        </label>
        <select
          id="email"
          className="w-full border border-gray-300 rounded-lg p-2"
          value={selectedEmail || ""}
          onChange={handleEmailChange}
        >
          <option value="" disabled>
            -- Selecciona un correo --
          </option>
          {gauthTokens.map((token, index: number) => (
            <option key={index} value={token.email}>
              {token.email}
            </option>
          ))}
        </select>
      </div>

      {/* Grid de carpetas */}
      {selectedEmail && !currentFolderId && (
        <div className="w-full">
          <div className="grid grid-cols-6 sm:grid-cols-4 lg:grid-cols-6 gap-4 p-4">
            {currentFolders.map((folder) => (
              <FolderTile
                key={folder.id}
                folderdata={folder}
                onClick={() => handleFolderClick(folder.id)} // Agregar manejador de clic
              />
            ))}
          </div>

          {/* Componente de paginación */}
          <Pagination
            itemsPerPage={foldersPerPage}
            totalItems={folders.length}
            currentPage={currentPage}
            paginate={paginate}
          />
        </div>
      )}

      {/* Mostrar los contenidos de la carpeta seleccionada */}
      {currentFolderId && (
                  <div className="grid grid-cols-6 sm:grid-cols-4 lg:grid-cols-6 gap-4 p-4">

          {folderContents.length > 0 ? (
            <>
             {folderContents.map((folder) => (
              <FolderTile
                key={folder.id}
                folderdata={folder}
                onClick={() => handleFolderClick(folder.id)} // Agregar manejador de clic
              />
            ))}
            </>
          ) : (
            <p>No se han cargado contenidos.</p>
          )}
        </div>
      )}
    </div>
  );
}

// Componente de paginación
interface PaginationProps {
  itemsPerPage: number;
  totalItems: number;
  currentPage: number;
  paginate: (pageNumber: number) => void;
}

function Pagination({
  itemsPerPage,
  totalItems,
  currentPage,
  paginate,
}: PaginationProps) {
  const pageNumbers = [];

  for (let i = 1; i <= Math.ceil(totalItems / itemsPerPage); i++) {
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
