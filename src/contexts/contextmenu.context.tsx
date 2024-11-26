import React, { createContext, useState, useContext } from "react";

// Tipo para el contexto
interface ContextMenuContextType {
  isMenuVisible: boolean;
  setMenuVisibility: (visible: boolean) => void;
  menuPosition: { x: number; y: number };
  setMenuPosition: (position: { x: number; y: number }) => void;
}

// Crear el contexto
const ContextMenuContext = createContext<ContextMenuContextType | undefined>(undefined);

// Crear el proveedor del contexto
export const ContextMenuProvider: React.FC<React.PropsWithChildren<object>> = ({ children }) => {
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });

  return (
    <ContextMenuContext.Provider value={{ isMenuVisible, setMenuVisibility: setIsMenuVisible, menuPosition, setMenuPosition }}>
      {children}
    </ContextMenuContext.Provider>
  );
};

// Hook para consumir el contexto
export const useContextMenu = (): ContextMenuContextType => {
  const context = useContext(ContextMenuContext);
  if (!context) {
    throw new Error("useContextMenu must be used within a ContextMenuProvider");
  }
  return context;
};
