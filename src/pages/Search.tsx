import React, { useEffect, useState, useContext } from 'react';
import { useSearchParams } from 'react-router-dom';
import SearchBar from '@components/SearchBar';
import { useGoogleAuth } from "@contexts/gauth.context";
import { AuthContext } from "@contexts/auth.context";
import FileTile from '@components/Filetile';

export default function Search() {
  const [searchParams] = useSearchParams();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [files, setFiles] = useState<any[]>([]); // Estado para guardar los archivos obtenidos
  const [currentPage, setCurrentPage] = useState(1); // Estado para la página actual
  const [filesPerPage] = useState(24); // Archivos por página
  const [loading, setLoading] = useState(false); // Estado para controlar la carga
  const [error, setError] = useState<string | null>(null); // Estado para manejar errores
  const authContext = useContext(AuthContext);
  const { fetchConnections, gauthTokens } = useGoogleAuth();

  // Extraer parámetros
  const name = searchParams.get('q');
  const categories = searchParams.get('categories');
  const date = searchParams.get('date');
  const startModificationRange = searchParams.get('startModificationDate');
  const endModificationRange = searchParams.get('endModificationDate');
  const modifiedDate = searchParams.get('modifiedDate');

  useEffect(() => {
    if (!authContext) {
      console.error("AuthContext no disponible.");
      return;
    }

    const { auth } = authContext;

    if (auth.user?.userId) {
      fetchConnections(auth.user.userId); // Opcional, si necesitas conexiones del backend
    } else {
      console.error("Usuario no autenticado.");
    }
  }, [authContext]);

  // Función para hacer la solicitud al backend
  const fetchFiles = async () => {
    setLoading(true);
    setError(null);

    const allFiles: unknown[] = []; // Array temporal para acumular resultados

    try {
      for (const token of gauthTokens) {
        const accessToken = token.access;
        const queryParams = new URLSearchParams();

        // Agregar parámetros dinámicamente
        if (accessToken) queryParams.append('accessToken', accessToken);
        if (categories) queryParams.append('categories', categories);
        if (name) queryParams.append('containsWords', name);
        if (date) queryParams.append('date', date);
        if (startModificationRange) queryParams.append('startModified', startModificationRange);
        if (endModificationRange) queryParams.append('endModified', endModificationRange);
        if (modifiedDate) queryParams.append('modifiedDate', modifiedDate);

        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/files/filtered?${queryParams.toString()}`
        );

        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }

        const data = await response.json();
        allFiles.push(...data.files); // Acumular resultados en el array temporal
      }

      setFiles(allFiles); // Actualizar el estado con todos los archivos acumulados
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  // Ejecutar la solicitud cuando cambien los parámetros
  useEffect(() => {
    if (gauthTokens.length > 0) {
      fetchFiles();
    }
  }, [name, categories, date, startModificationRange, endModificationRange, modifiedDate, gauthTokens]);

  // Obtener archivos de la página actual
  const indexOfLastFile = currentPage * filesPerPage;
  const indexOfFirstFile = indexOfLastFile - filesPerPage;
  const currentFiles = files.slice(indexOfFirstFile, indexOfLastFile);

  // Cambiar página
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <div>
      <SearchBar />
      {loading && <p>Loading files...</p>}
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}
      {!loading && !error && files.length === 0 && <p>No files found</p>}
      
      {/* Grid de archivos */}
      <div className="grid grid-cols-6 sm:grid-cols-4 lg:grid-cols-6 gap-4 p-4">
        {currentFiles.map((file) => (
          <FileTile key={file.id} fileData={file} />
        ))}
      </div>
      
      {/* Paginación */}
      <Pagination
        filesPerPage={filesPerPage}
        totalFiles={files.length}
        currentPage={currentPage}
        paginate={paginate}
      />
    </div>
  );
}

// Componente de paginación
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
              className={`px-4 py-2 rounded ${currentPage === number ? 'bg-blue-500 text-white' : 'bg-gray-200 hover:bg-gray-300'}`}
            >
              {number}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}
