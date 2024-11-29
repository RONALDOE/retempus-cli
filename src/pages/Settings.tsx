import DataCard from "@components/DashboardUtilities/DataCard";
import { AuthContext } from "@contexts/auth.context";
import { useGoogleAuth } from "@contexts/gauth.context";
import { useContext, useEffect } from "react";

export default function Settings() {
  const authContext = useContext(AuthContext);
  const { fetchConnections, gauthTokens, getLink } = useGoogleAuth();

  // Estado para los gauthTokens

  // Cargar conexiones si el usuario está autenticado
  useEffect(() => {
    if (auth.user?.userId) {
      fetchConnections(auth.user.userId); // Opcional, si necesitas conexiones del backend
    } else {
      console.error("Usuario no autenticado.");
    }
  }, [authContext]);

  if (!authContext) {
    console.error("AuthContext no disponible.");
    return;
  }
  const { auth } = authContext;
  // Mostrar mensaje si no hay tokens
 
  return (
    <div className='bg-[#121212] w-full h-full flex flex-col justify-center items-center gap-4 p-6'>
      <div className='flex flex-row gap-4 '>
        { gauthTokens.length ===0 ? (<div>No hay tokens de acceso disponibles.</div>): gauthTokens.map((token, index) => (
          <DataCard
            key={index}
            tokens={token}
            canDelete={true}
            userId={auth.user?.userId}
          />
        ))}{" "}
        
        <div className='w-[20rem]    flex justify-center items-center'>
            <button 
              onClick={async () => {
                if (auth.user?.userId) {
                  const link = await getLink(auth.user.userId);
                  if (link) {
                    window.location.href = link;
                  }
                } else {
                  console.error("Usuario no autenticado.");
                }
              }}
              className='bg-[#121212] text-[#ffffff] p-2 rounded-lg'
            > Vincular Cuenta</button>
          </div>
        
      </div>
    </div>
  );
}
