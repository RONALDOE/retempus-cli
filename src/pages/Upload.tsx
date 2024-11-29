import React, { useState, useEffect } from "react";
import { useGoogleAuth } from "@contexts/gauth.context";
import axios from "axios";
import FolderTile from "@components/FolderTile";
import { createFile } from "@utils/helpers";
export default function Upload() {
  const { gauthTokens } = useGoogleAuth();
  const [selectedEmail, setSelectedEmail] = useState<string | null>(null);
  const [folders, setFolders] = useState<Record<string, string>[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [foldersPerPage] = useState(18); // Number of folders per page
  const [folderContents, setFolderContents] = useState<any[]>([]); // Stores the contents of the selected folder
  const [currentFolderId, setCurrentFolderId] = useState<string | null>(null); // Current selected folder
  const [selectedFile, setSelectedFile] = useState<File | null>(null); // Selected file for upload
  const [folderPage, setFolderPage] = useState(1); // Pagination for folder contents
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [fileType, setFileType] = useState<string | null>(null);
  const fileOptions = ["document", "spreadsheet", "presentation"];

  // Function to update the URL with email and folderId
  const updateUrlParams = (email: string | null, folderId: string | null) => {
    const url = new URL(window.location.href);
    if (email) url.searchParams.set("email", email);
    if (folderId) url.searchParams.set("folderId", folderId);
    window.history.replaceState({}, "", url.toString()); // Updates the URL without reloading the page
  };

  // Get URL parameters when the page loads
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const emailFromUrl = params.get("email");
    const folderIdFromUrl = params.get("folderId");

    if (emailFromUrl) setSelectedEmail(emailFromUrl);
    if (folderIdFromUrl) handleFolderClick(folderIdFromUrl);
  }, []);

  // Get folders for selected email
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
        console.error("Error getting folders:", error);
      }
    }
    fetchFolders();
  }, [selectedEmail]);

  // Pagination logic for folders
  const indexOfLastFolder = currentPage * foldersPerPage;
  const indexOfFirstFolder = indexOfLastFolder - foldersPerPage;
  const currentFolders = folders.slice(indexOfFirstFolder, indexOfLastFolder);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  // Handle folder click to fetch its contents
  const handleFolderClick = async (folderId: string) => {
    try {
      const accessToken = gauthTokens.find(
        (token) => token.email === selectedEmail
      )?.access;

      const response = await axios.get(
        `${backendUrl}/files/folders?folderId=${folderId}&accessToken=${accessToken}`
      );
      console.log("Folder contents:", response.data);
      setFolderContents(response.data); // Update folder contents
      setCurrentFolderId(folderId); // Set the current folder
      updateUrlParams(selectedEmail, folderId); // Update the URL with folder info
    } catch (error) {
      console.error("Error getting folder contents:", error);
    }
  };


  const handleFileCreate = async () => {
    const accessToken = gauthTokens.find(
      (token) => token.email === selectedEmail
    )?.access;
    if (!fileType || !accessToken) {
      alert("Please select a file type and email.");
      return;
    }
    createFile(fileType,accessToken); 

  }

  // Handle email change
  const handleEmailChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newEmail = event.target.value;
    setSelectedEmail(newEmail);
    setCurrentPage(1); // Reset to the first page when email changes
    setFolderContents([]); // Clear previous folder contents
    setCurrentFolderId(null); // Clear the selected folder
    updateUrlParams(newEmail, null); // Update the URL with the new email only
  };

  // Handle file change
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files ? event.target.files[0] : null;
    setSelectedFile(file);
  };

  // Handle file upload
  const handleFileUpload = async () => {
    if (!selectedFile || !selectedEmail || !currentFolderId) {
      alert("Please select a file, email, and folder.");
      return;
    }

    const accessToken = gauthTokens.find(
      (token) => token.email === selectedEmail
    )?.access;

    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("folderId", currentFolderId);
    formData.append("accessToken", accessToken || "");

    try {
      const response = await axios.post(
        `${backendUrl}/files/upload`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      alert("File uploaded successfully!");
      setSelectedFile(null); // Clear the selected file after upload
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("Error uploading file. Please try again.");
    }
  };

  // Pagination for folder contents
  const itemsPerPageForContents = 12; // Number of items per page for folder contents
  const indexOfLastContent = folderPage * itemsPerPageForContents;
  const indexOfFirstContent = indexOfLastContent - itemsPerPageForContents;
  const currentContents = folderContents.slice(
    indexOfFirstContent,
    indexOfLastContent
  );

  const paginateFolderContents = (pageNumber: number) =>
    setFolderPage(pageNumber);

  // Handle folder creation
  const handleCreateFolder = async () => {
    const folderName = prompt("Enter folder name:");
    if (!folderName) return;

    const parentFolderId = currentFolderId; // Assuming folder is created within the current folder

    try {
      const accessToken = gauthTokens.find(
        (token) => token.email === selectedEmail
      )?.access;
      console.log(accessToken, folderName, parentFolderId);
      const data = {
        accessToken,
        folderName,
        folderParent: parentFolderId,
      };

      const response = await axios.post(`${backendUrl}/files/folders`, data);
      alert("Folder created successfully!");
      // Reload folders after adding new one
      setFolders([]); // Reset the folders state
      setCurrentPage(1); // Reset the pagination
    } catch (error) {
      console.error("Error creating folder:", error);
      alert("Error creating folder. Please try again.");
    }
  };

  return (
    <div className='flex flex-col items-center justify-center space-y-4 p-6'>
      {/* Email selection */}
      <div className='w-full max-w-md flex items-center justify-center flex-col'>
        <label className='block text-gray-700 font-bold mb-2' htmlFor='email'>
          Select an email:
        </label>
        <select
          id='email'
          className='w-full border border-gray-300 rounded-lg p-2'
          value={selectedEmail || ""}
          onChange={handleEmailChange}
        >
          <option value='' disabled>
            -- Select an email --
          </option>
          {gauthTokens.map((token, index: number) => (
            <option key={index} value={token.email}>
              {token.email}
            </option>
          ))}
        </select>
      </div>

      {/* Button to add folder */}
      {selectedEmail && (
        <button
          onClick={handleCreateFolder}
          className='px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600'
        >
          Add Folder
        </button>
      )}

      {/* Folder grid */}
      {!currentFolderId && selectedEmail && (
        <div className='w-full'>
          <div className='grid grid-cols-6 sm:grid-cols-4 lg:grid-cols-6 gap-4 p-4'>
            {currentFolders.map((folder) => (
              <FolderTile
                key={folder.id}
                folderdata={folder}
                onClick={() => handleFolderClick(folder.id)}
              />
            ))}
          </div>
          <Pagination
            itemsPerPage={foldersPerPage}
            totalItems={folders.length}
            currentPage={currentPage}
            paginate={paginate}
          />
        </div>
      )}

      {/* Folder contents grid */}
      {currentFolderId && (
        <div className='w-full'>
          <div className='grid grid-cols-6 sm:grid-cols-4 lg:grid-cols-6 gap-4 p-4'>
            {currentContents.length > 0 ? (
              currentContents.map((folder) => (
                <FolderTile
                  key={folder.id}
                  folderdata={folder}
                  onClick={() => handleFolderClick(folder.id)}
                />
              ))
            ) : (
              <p>No contents loaded.</p>
            )}
          </div>
          <Pagination
            itemsPerPage={itemsPerPageForContents}
            totalItems={folderContents.length}
            currentPage={folderPage}
            paginate={paginateFolderContents}
          />
        </div>
      )}

      {/* File upload */}
      <div className="flex flex-row gap-5">
        <div className='mt-6 flex flex-col items-center space-y-4'>
          <input
            type='file'
            onChange={handleFileChange}
            className='block w-full max-w-xs text-lg text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-lg file:cursor-pointer file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100'
          />
          <button
            onClick={handleFileUpload}
            disabled={selectedFile ? false : true}
            className='px-6 py-2 bg-blue-500 text-white rounded-lg shadow-md disabled:bg-gray-400 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2'
          >
            Upload File
          </button>
        </div>
        
        <p>Or</p>

        <div className='mt-6 flex flex-col items-center space-y-4'>
        <select
        onChange={(e) => setFileType(e.target.value as string)}
          className='block w-full max-w-xs text-lg text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-lg file:cursor-pointer file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100'
        >
          <option value='' disabled>
            -- Select a file type --
          </option>
          {fileOptions.map((option, index) => (
            <option key={index} value={option}>
              {option}
            </option>
          ))}
        </select>
        <button
          onClick={handleFileCreate}
          disabled={fileType ? false : true}
          className='px-6 py-2 bg-blue-500 text-white rounded-lg shadow-md disabled:bg-gray-400 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2'
        >
          CreateFile
        </button>
      </div>
      </div>
    </div>
  );
}

function Pagination({
  itemsPerPage,
  totalItems,
  currentPage,
  paginate,
}: {
  itemsPerPage: number;
  totalItems: number;
  currentPage: number;
  paginate: (pageNumber: number) => void;
}) {
  const pageNumbers = [];

  for (let i = 1; i <= Math.ceil(totalItems / itemsPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <div className='mt-4 flex justify-center space-x-2'>
      {pageNumbers.map((number) => (
        <button
          key={number}
          onClick={() => paginate(number)}
          className={`px-3 py-2 border rounded-lg ${
            currentPage === number ? "bg-blue-500 text-white" : "bg-white"
          }`}
        >
          {number}
        </button>
      ))}
    </div>
  );
}
