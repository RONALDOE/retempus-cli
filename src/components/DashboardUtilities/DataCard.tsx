import ProgressBar from "../ProgressBar";
import { useEffect, useState } from "react";
import axios from "axios";
import { deleteAccount, formatBytes } from "@utils/helpers";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {  faTrash } from "@fortawesome/free-solid-svg-icons";
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
  tokens: Record<string, string>; // Token de acceso
  canDelete: boolean; // Indica si el usuario puede eliminar archivos
  userId?: string;
}
export default function DataCard({ tokens, canDelete, userId }: DataCardProps) {
  const [data, setData] = useState<DriveInfo | null>(null);



  
  useEffect(() => {
    const fetchData = async (tokens: Record<string, string>) => {
      try {
        const response = await axios.get<DriveInfo>(
          `${import.meta.env.VITE_BACKEND_URL}/dashboard/driveInfo?accessToken=` + tokens.access
        );
        setData(response.data);
      } catch (error) {
        console.error("Error al obtener la información:", error);
      }
    };
    fetchData(tokens);
  }, [tokens]);
  return (
    <div
      className='relative w-[25rem] min-h-max p-4 flex flex-col bg-[white] rounded-lg '
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
      {canDelete && (
        <button className=' absolute mt-4  top-0 right-4 text-xl text-red-600 hover:text-red-700' onClick={()=>deleteAccount(userId!, tokens.access)}>
          <FontAwesomeIcon icon={faTrash} />
        </button>
      )}
    </div>
  );
}
