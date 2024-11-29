import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "@contexts/auth.context";
import { useContext } from "react";

const Connected = () => {
  const [countdown, setCountdown] = useState(5); // Estado para el contador
  const navigate = useNavigate(); // Hook para redirigir al dashboard
  const authContext = useContext(AuthContext);

    if (!authContext) {
        console.error("AuthContext no disponible.");
        return null;
    }
    const { logout } = authContext;
  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    // Configurar el temporizador
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev === 1) {
          clearInterval(timer); // Limpiar el temporizador al llegar a 0
          logout(); // Redirigir al dashboard
        }
        return prev - 1;
      });
    }, 1000); // Decrementar cada segundo

    // Cleanup cuando el componente se desmonte
    return () => clearInterval(timer);
  }, [navigate]);

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="text-center">
        <h1>Estás conectado</h1>
        <p>Redirigiendo en {countdown} segundos...</p>
      </div>
    </div>
  );
};

export default Connected;
