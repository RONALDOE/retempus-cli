import React, { useState } from "react";
import { Link } from "react-router-dom";
import Logo from "@assets/RetempusLogo.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome, faInfoCircle, faCogs, faEnvelope, faChevronLeft, faChevronRight, faPowerOff } from "@fortawesome/free-solid-svg-icons";

interface SidebarItem {
  name: string;
  link: string;
  icon: JSX.Element;
}

const sidebarItems: SidebarItem[] = [
  { name: "Home", link: "/", icon: <FontAwesomeIcon icon={faHome} /> },
  { name: "About", link: "#about", icon: <FontAwesomeIcon icon={faInfoCircle} /> },
  { name: "Services", link: "#services", icon: <FontAwesomeIcon icon={faCogs} /> },
  { name: "Contact", link: "#contact", icon: <FontAwesomeIcon icon={faEnvelope} /> },
];

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div
        className={`${
          isSidebarOpen ? "w-64" : "w-20"
        } bg-[#1a1a1a] text-white transition-all duration-300 p-4 flex flex-col justify-between`}
      >
        {/* Logo y título */}
        <div className="flex items-center mb-8">
          <img src={Logo} alt="Retempus Logo" className="w-10 h-10" />
          <h1 className={`ml-3 text-xl font-semibold ${isSidebarOpen ? "" : "hidden"}`}>
            Retempus
          </h1>
        </div>

     {/* Menu */}
     <ul className="space-y-6">
          {sidebarItems.map((item, index) => (
            <li key={index}>
              <Link
                to={item.link}
                className="flex items-center text-white text-xl hover:bg-[#2e2e2e] hover:text-gray-300 transition-all duration-200 p-2 rounded-md"
              >
                <div className="mr-3">{item.icon}</div>
                {isSidebarOpen && <span>{item.name}</span>}
              </Link>
            </li>
          ))}
        </ul>
        {/* Toggle Button */}
        <div className="flex justify-center mb-6">
          <button
            onClick={toggleSidebar}
            className="text-white bg-[#444444] hover:bg-[#ec3f3f] transition-colors p-3 rounded-full"
          >
            {isSidebarOpen ? (
                <div className="flex flex-row  items-center justify-center gap-4  text-lg text-center">
              <FontAwesomeIcon icon={faPowerOff} /> <p>Sign Out</p></div>
            ) : (
              <FontAwesomeIcon icon={faPowerOff} />
            )}
          </button>
      </div>

        {/* Toggle Button */}
        <button
          onClick={toggleSidebar}
          className="absolute bottom-1  left-1/2 transform -translate-x-1/2 text-white bg-[#444444] hover:bg-[#555555] w-8 h-8  rounded-full"
        >
          {isSidebarOpen ? (
            <FontAwesomeIcon icon={faChevronLeft}></FontAwesomeIcon>
          ) : (
            <FontAwesomeIcon icon={faChevronRight}></FontAwesomeIcon>

          )}
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 p-8 pb-10">
        {children}
      </div>
    </div>
  );
};

export default Layout;
