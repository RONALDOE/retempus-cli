import RecentFiles from "@components/DashboardUtilities/RecentFiles";
import Shortcut from "@components/DashboardUtilities/Shortcut";
import UserCard from "@components/DashboardUtilities/UserCard";
import TotalSpaceCard from "@components/DashboardUtilities/TotalSpaceCard";
import DataCardsWrapper from "@components/DashboardUtilities/DataCardsWrapper";
import { useGoogleAuth } from "@contexts/gauth.context";
import { AuthContext } from "@contexts/auth.context";
import { useContext, useEffect } from "react";
 
const shortcuts = [

  {
    name: "Images",
    icon: "https://img.icons8.com/fluency/256/stack-of-photos.png",
  },
  {
    name: "Videos",
    icon: "https://img.icons8.com/fluency/256/video--v1.png",
  },
  {
    name: "Music",
    icon: "https://img.icons8.com/fluency/256/musical-notes.png",
  },
  {
    name: "Documents",
    icon: "https://img.icons8.com/fluency/256/copy.png",
  },
  {
    name: "Upload",
    icon: "https://img.icons8.com/fluency/256/upload-to-cloud.png",
  },
];



export default function Dashboard() {

  const authContext = useContext(AuthContext);
  const { fetchConnections, gauthTokens } = useGoogleAuth();

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





  
    return (
      <div className="bg-[#121212] w-full h-full grid grid-cols-7 grid-rows-7 gap-4 p-6">
        {/* Contenedor de DataCards, ajustado al grid proporcionado */}
        <DataCardsWrapper/>

  
        {/* Data Analysis*/}
        <div className="col-span-2 row-span-7 col-start-6 row-start-1  col bg-white rounded-lg p-8">
          <UserCard/>
          <TotalSpaceCard gauthTokens={gauthTokens.map(token => token.access)} />
       
        </div>
  
        {/* Shortcuts*/}
        <div className="col-span-4 col-start-2 row-start-3 bg-white rounded-lg p-2 relative">

           <p className="text-2xl font-bold absolute top-1 left-2">Shorcuts</p>
           <div className="flex flex-row justify-center items-center gap-4">
            {shortcuts.map((shortcut, index) => (
              <Shortcut
                key={index}
                name={shortcut.name}
                icon={shortcut.icon}
              />
              ))}
           </div>
        </div>
  
        {/*RecentFiles */}
        <div className="col-span-4 row-span-4 col-start-2 row-start-4 bg-white rounded-lg relative">
        <p className="text-2xl font-bold absolute top-1 left-2">Recent Files</p>

          <RecentFiles gauthTokens={gauthTokens.map(token => token.access)} />
        </div>
  
        {/* Un contenedor más que puede ser útil para el diseño */}
        <div className="row-span-7 col-start-1 row-start-1 bg-white rounded-lg">
        </div>
      </div>
    );
  }
  