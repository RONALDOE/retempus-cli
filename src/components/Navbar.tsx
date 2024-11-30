import React from "react";
import { Link } from "react-router-dom";
import Logo from "@assets/RetempusLogo.png";

interface NavbarProps {
  items?: { name: string; link: string }[];
}

export default function Navbar({ items }: NavbarProps) {
  return (
    <nav className="w-full h-20 bg-[#121212] flex items-center justify-between px-8 shadow-lg">
      {/* Logo y título */}
      <div className="flex items-center">
        <img src={Logo} alt="Retempus Logo" className="w-12 h-12 mr-2" />
        <h1 className="text-white text-2xl font-semibold">Retempus</h1>
      </div>

      {/* Enlaces de navegación */}
      <div className="flex items-center space-x-6 px-8 py-2 rounded-full bg-[#333333]">
        {items && items.map((item, index) => (
          item.link.startsWith("#") ? (
            <a
              href={item.link}
              key={index}
              className="text-white text-lg font-medium  px-3 rounded-full hover:bg-[#555555] transition-all duration-200"
            >
              {item.name}
            </a>
          ) : (
            <Link
              to={item.link}
              key={index}
              className="text-white text-lg font-medium hover:text-[#dcdcdc] transition-colors duration-200"
            >
              {item.name}
            </Link>
          )
        ))}
      </div>

      {/* Botón de acceso */}
      <div>
        <Link
          to="login"
          className="bg-[#444444] text-white text-lg font-bold py-2 px-6 rounded-full hover:bg-[#555555] transform hover:scale-105 transition-transform duration-200"
        >
          Get Into The Power
        </Link>
      </div>
    </nav>
  );
}
