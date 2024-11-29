import { useEffect, useContext } from "react";
import DataCard from "@components/DashboardUtilities/DataCard";
import { useGoogleAuth } from "@contexts/gauth.context";
import { AuthContext } from "@contexts/auth.context";

export default function DataCardsWrapper() {
  const authContext = useContext(AuthContext);
  const { fetchConnections, gauthTokens } = useGoogleAuth();

  // Estado para los gauthTokens
 
  // Cargar conexiones si el usuario está autenticado
  

  // Mostrar mensaje si no hay tokens
  if (gauthTokens.length === 0) {
    return <div>No hay tokens de acceso disponibles.</div>;
  }

  // Renderizar un DataCard por cada token
  return (
    <div className="col-span-5 row-span-2 col-start-1 row-start-1 flex flex-row gap-6 items-center justify-center">
      {gauthTokens.map((token, index) => (
        <DataCard key={index} tokens={token} canDelete={false} />
      ))}
    </div>
  );
}
