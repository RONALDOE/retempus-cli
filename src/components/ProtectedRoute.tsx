import React from "react";
import { Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "@contexts/auth.context"; // Ajusta la ruta según tu estructura

interface ProtectedRouteProps {
  children: React.ReactElement; // Componente que se quiere proteger
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const authContext = useContext(AuthContext);

  if (!authContext) {
    throw new Error("AuthContext debe estar dentro de un AuthProvider");
  }

  const { auth, loading } = authContext;

  if (loading) {
    return <div>Cargando...</div>; // Mostrar un loader mientras se verifica el estado de autenticación
  }

  if (!auth.isAuthenticated) {
    return <Navigate to="/login" replace />; // Redirigir al login si no está autenticado
  }

  return children; // Renderizar el componente protegido si está autenticado
};

export default ProtectedRoute;
