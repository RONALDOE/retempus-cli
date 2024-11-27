import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faXmark,
  faLink,
  faTrash,
  faCloudArrowDown,
} from "@fortawesome/free-solid-svg-icons";
import { downloadFile, formatBytes, trashFile } from "@utils/helpers";
interface FileData {
  name: string;
  modifiedTime: string;
  mimeType: string;
  id: string;
  iconLink: string;
  webViewLink: string;
  accessToken: string;
  starred: boolean;
  size: string;
  fileExtension: string;
}

interface FileModalProps {
  isOpen: boolean;
  fileData: FileData;
  onClose: () => void;
}

const FileModal: React.FC<FileModalProps> = ({ isOpen, fileData, onClose }) => {
  if (!isOpen) return null;

  const handleDelete = () => {
   
    const answer = window.confirm("¿Estás seguro de que deseas eliminar este archivo?");
    if (!answer
    ) {
      return;
    }
    trashFile(fileData.id, fileData.accessToken);
  }


  const {
    name,
    modifiedTime,
    mimeType,
    iconLink,
    webViewLink,
    size,
    fileExtension,
    accessToken,
  } = fileData;
  const parsedModifiedTime = new Date(modifiedTime).toLocaleString();

  return (
    <div className='fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center'>
      <div className='bg-white p-6 rounded-lg shadow-lg max-w-md w-full'>
        {/* Modal Header */}
        <div className='flex justify-between items-center mb-4'>
          <h2 className='text-2xl font-semibold'>File Details</h2>
          <button
            className='text-gray-500 hover:text-red-500 text-3xl'
            onClick={onClose}
          >
            <FontAwesomeIcon icon={faXmark} />{" "}
          </button>
        </div>

        {/* File Icon */}
        <div className='flex justify-center mb-4'>
          <img
            src={iconLink.replace("16", "256")}
            alt={`${name} icon`}
            className='w-24 h-24 object-contain'
          />
        </div>

        {/* File Information */}
        <div className='space-y-4'>
          <div>
            <strong>Name:</strong>
            <p>{name}</p>
          </div>
          <div>
            <strong>Modified Date:</strong>
            <p>{parsedModifiedTime}</p>
          </div>
          <div>
            <strong>Mime Type:</strong>
            <p>{mimeType}</p>
          </div>
          {!isNaN(Number(size)) && (
            <div>
              <strong>File Size:</strong>
              <p>
                {formatBytes(Number(size)).value}
                {formatBytes(Number(size)).unit}
              </p>
            </div>
          )}
          {fileExtension && (
            <div>
              <strong>File Extension:</strong>
              <p>{fileExtension}</p>
            </div>
          )}
          {/* <div>
            <strong>File Link: </strong>
            <a
              href={webViewLink}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline"
            >
              Open File
            </a>
          </div> */}
        </div>

        {/* Close Button */}
        <div className='flex flex-row gap-4 justify-center mt-6 text-xl'>
          <a
            href={webViewLink}
            target='_blank'
            onClick={onClose}
            className='bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600'
          >
            <FontAwesomeIcon icon={faLink} />
          </a>
          <button
            onClick={() => downloadFile(fileData.id, accessToken, name)}
            className='bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600'
          >
            <FontAwesomeIcon icon={faCloudArrowDown} />
          </button>
          <button
            onClick={handleDelete}
            className='bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600'
          >
            <FontAwesomeIcon icon={faTrash} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default FileModal;
