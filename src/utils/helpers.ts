import axios from "axios";

export const formatBytes = (bytes: number): { value: number; unit: string } => {
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  if (bytes === 0) return { value: 0, unit: "Bytes" };
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  const value = bytes / Math.pow(1024, i);
  return { value: parseFloat(value.toFixed(2)), unit: sizes[i] };
};

export async function downloadFile(
  fileId: string,
  accessToken: string,
  fileName: string
) {
  try {
    console.log("Id:", fileId, "Access Token:", accessToken);

    // Realizar la solicitud de descarga
    const response = await axios.get(
      `${import.meta.env.VITE_BACKEND_URL}/files/download`,
      {
        params: {
          fileId,
          accessToken,
        },
        responseType: "blob", // Recibir los datos como un Blob
      }
    );

    // Verificar si el tipo MIME es PDF y configurar el nombre del archivo con la extensión correcta
    const mimeType = response.headers["content-type"];

    // Asignar la extensión correcta al nombre del archivo
    const extension = mimeType === "application/pdf" ? ".pdf" : ""; // Puedes agregar más tipos si es necesario
    const finalFileName = fileName.endsWith(extension)
      ? fileName
      : `${fileName}${extension}`;

    // Crear un objeto URL para el Blob recibido
    const url = window.URL.createObjectURL(new Blob([response.data]));

    // Crear un enlace de descarga
    const a = document.createElement("a");
    a.href = url;
    a.download = finalFileName; // Nombre del archivo con la extensión correcta

    // Iniciar la descarga
    document.body.appendChild(a);
    a.click();

    // Liberar el objeto URL para evitar fugas de memoria
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  } catch (error) {
    console.error("Error al descargar el archivo:", error);
  }
}


export async function deleteFile(fileId: string, accessToken: string) {
  try {
    console.log("Id:", fileId, "Access Token:", accessToken);


    // Realizar la solicitud para eliminar el archivo
    const response = await axios.delete(
      `${import.meta.env.VITE_BACKEND_URL}/files/delete`, 
      {
        params: {
          fileId,
          accessToken,
        },
      }
    );

    // Verificar si la respuesta fue exitosa
    if (response.status === 200) {
      console.log("Archivo eliminado correctamente");

      // Refrescar la página después de eliminar el archivo
      window.location.reload();
    } else {
      console.error("Error al eliminar el archivo:", response.data.error);
    }
  } catch (error) {
    console.error("Error al eliminar el archivo:", error);
  }
}


export async function trashFile(fileId: string, accessToken: string) {
  try {
    console.log("Id:", fileId, "Access Token:", accessToken);


    // Realizar la solicitud para eliminar el archivo
    const response = await axios.put(
      `${import.meta.env.VITE_BACKEND_URL}/files/trash`, null,
      {
        params: {
          fileId,
          accessToken,
        },
      }
    );

    // Verificar si la respuesta fue exitosa
    if (response.status === 200) {
      console.log("Archivo trasheado correctamente");

      // Refrescar la página después de eliminar el archivo
      window.location.reload();
    } else {
      console.error("Error al trashear el archivo:", response.data.error);
    }
  } catch (error) {
    console.error("Error al trashear el archivo:", error);
  }
}


export async function untrashFile(fileId: string, accessToken: string) {
  try {
    console.log("Id:", fileId, "Access Token:", accessToken);


    // Realizar la solicitud para eliminar el archivo
    const response = await axios.put(
      `${import.meta.env.VITE_BACKEND_URL}/files/untrash`,null, 
      {
        params: {
          fileId,
          accessToken,
        },
      }
    );

    // Verificar si la respuesta fue exitosa
    if (response.status === 200) {
      console.log("Archivo trasheado correctamente");

      // Refrescar la página después de eliminar el archivo
      window.location.reload();
    } else {
      console.error("Error al trashear el archivo:", response.data.error);
    }
  } catch (error) {
    console.error("Error al trashear el archivo:", error);
  }
}

