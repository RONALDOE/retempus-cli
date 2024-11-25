import { useEffect, useContext, useState } from "react";
import DataCard from "./DataCard";
import { useGoogleAuth } from "@contexts/gauth.context";
import { AuthContext } from "@contexts/auth.context";

export default function DataCardsWrapper() {
  const authContext = useContext(AuthContext);
  const { fetchConnections } = useGoogleAuth();

  // Estado para los accessTokens
  const [accessTokens, setAccessTokens] = useState<Record<string, string>[]>([]);

  // Función para cargar los accessTokens desde localStorage
  const loadAccessTokens = (): void => {
    const storedTokens = localStorage.getItem("tokens");
    if (storedTokens) {
      setAccessTokens(JSON.parse(storedTokens));
    } else {
      setAccessTokens([]);
    }
  };

  // Cargar los accessTokens al montar el componente
  useEffect(() => {
    loadAccessTokens();
  }, []);

  // Cargar conexiones si el usuario está autenticado
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

  // Mostrar mensaje si no hay tokens
  if (accessTokens.length === 0) {
    return <div>No hay tokens de acceso disponibles.</div>;
  }

  // Renderizar un DataCard por cada token
  return (
    <div className="col-span-4 row-span-2 col-start-2 row-start-1 flex flex-row gap-6 items-center justify-center">
      {accessTokens.map((token, index) => (
        <DataCard key={index} accessToken={token.access} />
      ))}
    </div>
  );
}
