import React, { useRef, useEffect } from "react";
import { useContextMenu } from "@contexts/contextmenu.context"; // Importamos el hook del contexto

interface ContextMenuProps {
  options: {
    label: string;
    action: () => void;
  }[];
  children: React.ReactNode;
}

const ContextMenu: React.FC<ContextMenuProps> = ({ options, children }) => {
  const { isMenuVisible, setMenuVisibility, menuPosition, setMenuPosition } = useContextMenu();
  const menuRef = useRef<HTMLDivElement>(null);

  // Mostrar el menú solo si está visible
  const handleContextMenu = (event: React.MouseEvent) => {
    event.preventDefault();

    // Solo abrir el menú si no está ya visible
    if (!isMenuVisible) {
      setMenuVisibility(true);
    }

    // Determinar la posición inicial
    let x = event.clientX;
    let y = event.clientY;

    // Ajustar posición si el menú se sale de la pantalla
    const menuWidth = menuRef.current?.offsetWidth || 150;
    const menuHeight = menuRef.current?.offsetHeight || 150;
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;

    if (x + menuWidth > screenWidth) {
      x = screenWidth - menuWidth - 10; // Ajustar X
    }
    if (y + menuHeight > screenHeight) {
      y = screenHeight - menuHeight - 10; // Ajustar Y
    }

    setMenuPosition({ x, y });
  };

  // Cerrar el menú cuando se hace clic fuera
  const handleClickOutside = (event: MouseEvent) => {
    if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
      setMenuVisibility(false);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  return (
    <div onContextMenu={handleContextMenu} className="relative">
      {children}
      {isMenuVisible && (
        <div
          ref={menuRef}
          className="fixed z-[9999] bg-white shadow-lg rounded-md p-4 border"
          style={{
            top: menuPosition.y,
            left: menuPosition.x,
          }}
        >
          {options.map((option, index) => (
            <div
              key={index}
              className="px-4 py-2 hover:bg-gray-200 cursor-pointer"
              onClick={() => {
                option.action();
                setMenuVisibility(false); // Cerrar el menú después de la acción
              }}
            >
              {option.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ContextMenu;
