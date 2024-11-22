import React, { createContext, useState, useEffect, ReactNode } from "react";
import axios from "axios";
import {jwtDecode} from "jwt-decode"; // Instala esta librería: npm install jwt-decode

// Tipos para el estado de autenticación y las funciones
interface AuthState {
  isAuthenticated: boolean;
  token: string | null;
  user: User | null;
}

interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthContextType {
  auth: AuthState;
  login: (credentials: LoginCredentials) => Promise<boolean>;
  logout: () => void;
  loading: boolean;
}

interface LoginCredentials {
  usernameOrEmail: string;
  password: string;
}

// Crear el contexto
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

const backend = import.meta.env.VITE_BACKEND_URL;
console.log(backend)

// Proveedor del contexto
interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [auth, setAuth] = useState<AuthState>({
    isAuthenticated: false,
    token: null,
    user: null,
  });
  const [loading, setLoading] = useState<boolean>(true);

  // Función para decodificar el token JWT
  const decodeToken = (token: string): User => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const decoded: any = jwtDecode(token); // Decodifica el token JWT
      return {
        id: decoded.id || decoded.sub, // `sub` es común en tokens JWT estándar
        name: decoded.name || "",
        email: decoded.email || "",
      };
    } catch (error) {
      console.error("Error decoding token:", error);
      return { id: "", name: "", email: "" };
    }
  };

  // Función para iniciar sesión
  const login = async (credentials: LoginCredentials): Promise<boolean> => {
    try {
        console.log(credentials)
      const response = await axios.post(`${backend}/auth/login`, {
        usernameOrEmail: credentials.usernameOrEmail,
        password: credentials.password,
      });
      const { token } = response.data;

      // Decodificar el token para obtener los datos del usuario
      const user = decodeToken(token);

      // Guardar el token y los datos del usuario en el estado y localStorage
      setAuth({
        isAuthenticated: true,
        token,
        user,
      });
      localStorage.setItem("token", token);

      console.log("Login exitoso:", user);

      return true; // Login exitoso
    } catch (error) {
      console.error("Error durante el login:", error);
      return false; // Login fallido
    }
  };

  // Función para verificar el token
  const verifyToken = async (): Promise<void> => {
    const storedToken = localStorage.getItem("token");

    if (!storedToken) {
      setAuth({ isAuthenticated: false, token: null, user: null });
      setLoading(false);
      return;
    }

    try {
      // Decodificar el token para obtener los datos del usuario
      const user = decodeToken(storedToken);

      setAuth({
        isAuthenticated: true,
        token: storedToken,
        user,
      });
    } catch (error) {
      console.error("Error verificando el token:", error);

      // Si el token no es válido, eliminarlo
      setAuth({ isAuthenticated: false, token: null, user: null });
      localStorage.removeItem("token");
    } finally {
      setLoading(false);
    }
  };

  // Función para cerrar sesión
  const logout = (): void => {
    setAuth({ isAuthenticated: false, token: null, user: null });
    localStorage.removeItem("token");
  };

  // Verificar el token al cargar la aplicación
  useEffect(() => {
    verifyToken();
  }, []);

  return (
    <AuthContext.Provider value={{ auth, login, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
