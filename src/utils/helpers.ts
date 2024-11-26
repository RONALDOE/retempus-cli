import axios from "axios";

export const formatBytes = (bytes: number): { value: number; unit: string } => {
    const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
    if (bytes === 0) return { value: 0, unit: "Bytes" };
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    const value = bytes / Math.pow(1024, i);
    return { value: parseFloat(value.toFixed(2)), unit: sizes[i] };
  };

 export async function downloadFile(fileId: string, accessToken: string, fileName: string) {
    try {

      console.log("Id:",fileId,"Access Token", accessToken)
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/files/download`, {
        params: {
          fileId,
          accessToken,
        },
        responseType: "blob", // Recibir los datos como un Blob
      });
  
      // Crear un objeto URL para el Blob recibido
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const a = document.createElement("a");
      a.href = url;
      a.download = fileName; // Nombre del archivo
      document.body.appendChild(a);
      a.click();
  
      // Liberar el objeto URL para evitar fugas de memoria
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error("Error al descargar el archivo:", error);
    }
  }