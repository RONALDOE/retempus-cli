import ProgressBar from "../ProgressBar";
import { useEffect, useState } from "react";
import axios from "axios";
import { formatBytes } from "@utils/helpers";

//shadow-[0px_0px_31px_-1px_rgba(255,255,255,_0.5)]
interface StorageQuota {
  limit: number; // Cuota máxima de almacenamiento en bytes
  usage: number; // Almacenamiento usado en bytes
  usageInDrive: number; // Uso en Google Drive en bytes
  usageInDriveTrash: number; // Uso en la papelera de Drive en bytes
}

interface DriveUser {
  kind: string; // Tipo de recurso (siempre "drive#user")
  displayName: string; // Nombre del usuario
  photoLink: string; // URL de la foto del usuario
  me: boolean; // Indica si es el usuario autenticado
  permissionId: string; // ID de permiso del usuario
  emailAddress: string; // Correo electrónico del usuario
}

interface DriveInfo {
  storageQuota: StorageQuota; // Información sobre la cuota de almacenamiento
  user: DriveUser; // Información del usuario
}

interface DataCardProps {
  accessToken: string;
}
export default function DataCard({ accessToken }: DataCardProps) {
  const [data, setData] = useState<DriveInfo | null>(null);

  useEffect(() => {
    const fetchData = async (accessToken: string) => {
      try {
        const response = await axios.get<DriveInfo>(
          `${import.meta.env.VITE_BACKEND_URL}/dashboard/driveInfo?accessToken=` + accessToken
        );
        setData(response.data);
      } catch (error) {
        console.error("Error al obtener la información:", error);
      }
    };
    fetchData(accessToken);
  }, [accessToken]);
  return (
    <div
      className='w-1/3 min-h-max p-4 flex flex-col bg-[white] rounded-lg hover:scale-105 transition-all'
      title={
        `Email ${data?.user.emailAddress} \nName ${data?.user.displayName} \nStorage ${formatBytes(data?.storageQuota.usage ?? 0).value}${formatBytes(data?.storageQuota.usage ?? 0).unit} of ${formatBytes(data?.storageQuota.limit ?? 0).value}${formatBytes(data?.storageQuota.limit    ?? 0).unit}`}
    >
      <div className='w-full h-24'>
        <img
          src={data?.user.photoLink}
          alt=''
          className='h-full w-24 bg-black rounded-full'
        />
      </div>
      <p className=' mt-4 text-2xl font-bold text-[#121212] '>
        {data?.user.emailAddress.split("@")[0]}
      </p>
      <ProgressBar
        total={data?.storageQuota.limit ?? 0}
        used={data?.storageQuota.usage ?? 0}
      />
    </div>
  );
}
