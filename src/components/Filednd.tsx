import { useState } from "react";
import { FileUploader } from "react-drag-drop-files";

const fileTypes = ["JPEG", "PNG", "GIF"];

export default function FileDnd() {
  const [files, setFiles] = useState<FileList | null>(null);

  // Handle file change
  const handleChange = (file: FileList) => {
    setFiles(file);
  };

  return (
    <div className="flex flex-col items-center justify-center w-full h-full p-6 bg-gray-50 rounded-lg shadow-lg">
      <div className="flex flex-col items-center justify-center w-full h-40 p-4 border-4 border-dashed border-gray-300 rounded-lg bg-gray-100 hover:bg-gray-200 transition">
        <FileUploader
          multiple={true}
          handleChange={handleChange}
          name="file"
          types={fileTypes}
        />
        <p className="mt-4 text-sm text-gray-500">Drag and drop your files here</p>
      </div>

      <div className="mt-6 w-full">
        {files ? (
          <div>
            <h2 className="text-lg font-semibold text-gray-700">Uploaded Files:</h2>
            <ul className="mt-2 space-y-2">
              {Array.from(files).map((file, index) => (
                <li key={index} className="text-gray-600">{file.name}</li>
              ))}
            </ul>
          </div>
        ) : (
          <p className="text-gray-500">No files uploaded yet.</p>
        )}
      </div>
    </div>
  );
}
