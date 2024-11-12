import React from "react";
import { Link } from "react-router-dom";
import Logo from "@assets/RetempusLogo.png";

interface NavbarProps {
  items: { name: string; link: string }[];
}

export default function Navbar({ items }: NavbarProps) {
  return (
    <nav className="w-screen h-20 bg-blue-600 flex items-center justify-between px-8 shadow-lg">
      {/* Logo */}
      <div className="flex items-center">
        <img src={Logo} alt="Retempus Logo" className="w-16 h-16 mr-4" />
        <h1 className="text-white text-2xl font-bold">Retempus</h1>
      </div>

      {/* Enlaces de navegación */}
      <div className="flex items-center space-x-8">
        {items.map((item, key) => {
          const isLastItem = key === items.length - 1;

          return isLastItem ? (
            <div 
              key={key} 
              className="flex items-center justify-center w-12 h-12 bg-white text-blue-600 rounded px-8 font-medium text-lg hover:bg-gray-100 transition duration-300"
            >
              {item.link.startsWith("#") ? (
                <a href={item.link} className="text-center">
                  {item.name}
                </a>
              ) : (
                <Link to={item.link} className="text-center">
                  {item.name}
                </Link>
              )}
            </div>
          ) : (
            item.link.startsWith("#") ? (
              <a 
                href={item.link} 
                key={key} 
                className="text-white text-lg font-medium hover:text-blue-300 transition duration-300"
              >
                {item.name}
              </a>
            ) : (
              <Link 
                to={item.link} 
                key={key} 
                className="text-white text-lg font-medium hover:text-blue-300 transition duration-300"
              >
                {item.name}
              </Link>
            )
          );
        })}
      </div>
    </nav>
  );
}
