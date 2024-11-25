import React, { createContext, useContext, ReactNode, useState } from "react";
import axios from "axios";
import { IConnection } from "@utils/types";

// Tipos para el contexto
interface GoogleAuthContextType {
  connections: IConnection[] | null; // Conexiones almacenadas en el contexto
  getAuthUrl: (userId: string) => Promise<string | null>;
  validateToken: (
    userId: string,
    actualAccessToken: string,
    refreshToken: string
  ) => Promise<ValidationResult | null>;
  revokeToken: (userId: string, accessToken: string, ) => Promise<boolean>;
  fetchConnections: (userId: string) => Promise<void>; // Método para actualizar conexiones
}

interface ValidationResult {
  message: string;
  accessToken: string;
  expiresIn: number;
}

// Crear el contexto
const GoogleAuthContext = createContext<GoogleAuthContextType | undefined>(
  undefined
);

// Proveedor del contexto
interface GoogleAuthProviderProps {
  children: ReactNode;
}

export const GoogleAuthProvider: React.FC<GoogleAuthProviderProps> = ({
  children,
}) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL; // Backend API URL
  const [connections, setConnections] = useState<IConnection[] | null>(null);

  // Función para obtener tokens almacenados en localStorage
  const getStoredTokens = (): string[] => {
    const tokens = localStorage.getItem("accessTokens");
    return tokens ? JSON.parse(tokens) : [];
  };

  // Función para actualizar los tokens en localStorage
  const setStoredTokens = (tokens: string[]): void => {
    localStorage.setItem("accessTokens", JSON.stringify(tokens));
    console.log("Tokens almacenados:", tokens);
  };

  // Obtener la URL de autenticación
  const getAuthUrl = async (userId: string): Promise<string | null> => {
    try {
      const response = await axios.get(`${backendUrl}/gauth`, {
        params: { userId },
      });
      return response.data; // Retorna la URL de autenticación
    } catch (error) {
      console.error("Error al obtener la URL de autenticación:", error);
      return null;
    }
  };

  // Validar el token de acceso
  const validateToken = async (
    userId: string,
    actualAccessToken: string,
    refreshToken: string
  ): Promise<ValidationResult | null> => {
    try {
      const response = await axios.get(`${backendUrl}/gauth/validate-token`, {
        params: { userId, actualAccessToken, refreshToken },
      });

      const { accessToken } = response.data;
      const currentTokens = getStoredTokens();

      if (!currentTokens.includes(accessToken)) {
        currentTokens.push(accessToken);
        setStoredTokens(currentTokens); // Actualizar localStorage con el nuevo token
      }

      console.log("Validación exitosa:", response.data);
      return response.data; // Retorna el resultado de la validación
    } catch (error) {
      console.error("Error al validar el token de acceso:", error);
      return null;
    }
  };

  // Revocar el token
  const revokeToken = async (
    userId: string,
    accessToken: string
  ): Promise<boolean> => {
    try {
      await axios.post(`${backendUrl}/gauth/revoke-token`, {
        userId,
        accessToken,
      });

      const currentTokens = getStoredTokens();
      const updatedTokens = currentTokens.filter((token) => token !== accessToken);
      setStoredTokens(updatedTokens); // Actualizar localStorage eliminando el token

      console.log(`Token revocado: ${accessToken}`);
      return true; // Revocación exitosa
    } catch (error) {
      console.error("Error al revocar el token:", error);
      return false;
    }
  };

  // Obtener y almacenar las conexiones del usuario
  const fetchConnections = async (userId: string): Promise<void> => {
    try {
      const response = await axios.get(`${backendUrl}/gauth/handyInfo`, {
        params: { userId },
      });

      console.log("Conexiones obtenidas:", response.data.connections);
      if (response.status === 200) {
        setConnections(response.data.connections || []);
      } else {
        setConnections([]);
      }
    } catch (error) {
      console.error("Error al obtener las conexiones:", error);
      setConnections([]);
    }
  };

  return (
    <GoogleAuthContext.Provider
      value={{
        connections,
        getAuthUrl,
        validateToken,
        revokeToken,
        fetchConnections,
      }}
    >
      {children}
    </GoogleAuthContext.Provider>
  );
};

// Hook para usar el contexto
export const useGoogleAuth = (): GoogleAuthContextType => {
  const context = useContext(GoogleAuthContext);
  if (!context) {
    throw new Error(
      "useGoogleAuth debe ser usado dentro de un GoogleAuthProvider"
    );
  }
  return context;
};
