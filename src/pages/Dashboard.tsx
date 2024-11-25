import DataCard from "@components/DashboardUtilities/DataCard";
import RecentFiles from "@components/DashboardUtilities/RecentFiles";
import Shortcut from "@components/DashboardUtilities/Shortcut";
import UserCard from "@components/DashboardUtilities/UserCard";
import TotalSpaceCard from "@components/DashboardUtilities/TotalSpaceCard";
import DataCardsWrapper from "@components/DashboardUtilities/DataCardsWrapper";

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

const files = [
  { 
    name: "Report_Q1.pdf", 
    modifiedDate: "2024-11-01 10:24 AM", 
    location: "/documents/reports", 
    size: "1.2 MB" 
  },
  { 
    name: "Vacation_Photos.zip", 
    modifiedDate: "2024-10-25 03:15 PM", 
    location: "/downloads", 
    size: "150 MB" 
  },
  { 
    name: "Presentation.pptx", 
    modifiedDate: "2024-10-20 09:00 AM", 
    location: "/work/presentations", 
    size: "4.5 MB" 
  },
  { 
    name: "Code_Project.zip", 
    modifiedDate: "2024-10-18 08:45 PM", 
    location: "/development/projects", 
    size: "32.8 MB" 
  },
  { 
    name: "Design_Mockup.png", 
    modifiedDate: "2024-11-11 02:37 PM", 
    location: "/work/designs", 
    size: "2.1 MB" 
  },
];
const spaceData = [
  { name: 'Drive 1', totalSpace: 500, usedSpace: 200 },
  { name: 'Drive 2', totalSpace: 1000, usedSpace: 600 },
  // Agrega más objetos si es necesario
];



export default function Dashboard() {
    return (
      <div className="bg-[#121212] w-full h-full grid grid-cols-7 grid-rows-7 gap-4 p-6">
        {/* Contenedor de DataCards, ajustado al grid proporcionado */}
        <DataCardsWrapper/>

  
        {/* Data Analysis*/}
        <div className="col-span-2 row-span-7 col-start-6 row-start-1 bg-white rounded-lg p-8">
          <UserCard/>
          <TotalSpaceCard data={spaceData}/>
       
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

          <RecentFiles files={files} />
        </div>
  
        {/* Un contenedor más que puede ser útil para el diseño */}
        <div className="row-span-7 col-start-1 row-start-1 bg-white rounded-lg">
          {/* Aquí puedes colocar contenido si lo necesitas */}
        </div>
      </div>
    );
  }
  