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
  userId: string;
  username: string;
  email: string;
  name: string;
}

interface RegisterCredentials {
  username: string;
  email: string;
  password: string;
  name: string;
}

interface AuthContextType {
  auth: AuthState;
  login: (credentials: LoginCredentials) => Promise<boolean>;
  logout: () => void;
  register: (credentials: RegisterCredentials) => Promise<boolean>;
  recover: (email: string) => Promise<{ status: number; message?: string }>;
  reset: (token: string, newPassword: string) => Promise<{ status: number; message?: string }>;
  loading: boolean;
  fetchgauthTokens: (userId: string, accessToken: string) => Promise<void>;
}

interface LoginCredentials {
  usernameOrEmail: string;
  password: string;
}

// Crear el contexto
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

const backend = import.meta.env.VITE_BACKEND_URL;

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
        userId: decoded.user.userId || decoded.sub,
        username: decoded.user.username || "",
        email: decoded.user.email || "",
        name: decoded.user.name || "",
      };
    } catch (error) {
      console.error("Error decoding token:", error);
      return { userId: "", username: "", email: "", name: "" };
    }
  };

// Función para obtener nuevos tokens de acceso y guardarlos
 const fetchgauthTokens = async (userId: string, accessToken: string | ""): Promise<void> => {
  try {
    console.log(userId, accessToken);
    const response = await axios.get(`${backend}/gauth/get-refresh-tokens`, {
      params: { userId, accessToken },
    });
    console.log(response.data.refreshTokens);

    const refreshTokens: string[] = response.data.refreshTokens;
    const emails: string[] = response.data.emails;

    if (!refreshTokens.length) {
      console.error("No se encontraron refreshTokens para este usuario.");
      return;
    }

    const tokensArray = [];

    // Aseguramos que se asocie cada refreshToken con el email correspondiente
    for (let i = 0; i < refreshTokens.length; i++) {
      const refreshToken = refreshTokens[i];
      const email = emails[i];  // Se obtiene el email correspondiente

      const tokenResponse = await axios.get(`${backend}/gauth/validate-token?userId=${userId}&actualAccessToken=${""}&refreshToken=${refreshToken}`);

      if (tokenResponse.status === 200) {
        const { accessToken } = tokenResponse.data;
        tokensArray.push({ refresh: refreshToken, access: accessToken, email }); // Asocia el email correcto
      }
    }

    localStorage.setItem("tokens", JSON.stringify(tokensArray)); // Guarda los tokens en localStorage
  } catch (error) {
    console.error("Error al obtener nuevos gauthTokens:", error);
  }
};

  // Función para iniciar sesión
  const login = async (credentials: LoginCredentials): Promise<boolean> => {
    try {
      
      const response = await axios.post(`${backend}/auth/login`, {
        usernameOrEmail: credentials.usernameOrEmail,
        password: credentials.password,
      });

      const { token } = response.data;
      const user = decodeToken(token);

      setAuth({
        isAuthenticated: true,
        token,
        user,
      });
      localStorage.setItem("token", token);

      // Obtén los nuevos tokens de acceso después de iniciar sesión
      console.log("Obteniendo nuevos tokens de acceso...");
      await fetchgauthTokens(user.userId, ""); // Obtiene los tokens de Google
      console.log("Tokens de acceso obtenidos.");
      window.location.replace(`${import.meta.env.VITE_HOST}/dashboard`);

      return true;
    } catch (error) {
      console.error("Error durante el login:", error);
      return false;
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
      const user = decodeToken(storedToken);

      setAuth({
        isAuthenticated: true,
        token: storedToken,
        user,
      });
    } catch (error) {
      console.error("Error verificando el token:", error);
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
    localStorage.removeItem("tokens"); // Limpia los tokens de Google
  };

  // Función de registro
  const register = async (credentials: RegisterCredentials): Promise<boolean> => {
    try {
      const response = await axios.post(`${backend}/auth/register`, credentials);
      if (response.status === 201) {
        window.location.replace(`${import.meta.env.VITE_HOST}/login`);
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error durante el registro:", error);
      return false;
    }
  };

  // Función para recuperación de contraseña
  const recover = async (email: string): Promise<{ status: number; message?: string }> => {
    try {
      const response = await axios.post(`${backend}/auth/forgot-password`, { email });
      if (response.status === 200) {
        return { status: 200, message: "Correo de recuperación enviado exitosamente." };
      }
      return { status: response.status, message: "No se encontró el correo electrónico." };
    } catch (error) {
      console.error("Error durante la recuperación de contraseña:", error);
      return { status: 0, message: "Error inesperado. Por favor, inténtalo de nuevo." };
    }
  };

  // Función para reiniciar la contraseña
  const reset = async (token: string, newPassword: string): Promise<{ status: number; message?: string }> => {
    try {
      const response = await axios.post(`${backend}/auth/reset-password`, { token, newPassword });
      if (response.status === 200) {
        window.location.replace(`${import.meta.env.VITE_HOST}/login`);
        return { status: 200, message: "Contraseña cambiada exitosamente." };
      }
      return { status: response.status, message: "Error inesperado. Por favor, inténtalo de nuevo." };
    } catch (error) {
      console.error("Error durante el reinicio de contraseña:", error);
      return { status: 0, message: "Error inesperado. Por favor, inténtalo de nuevo." };
    }
  };

  // Verificar el token al cargar la aplicación
  useEffect(() => {
    verifyToken();
  }, []);

  return (
    <AuthContext.Provider value={{ auth, login, logout, register, recover, reset, loading, fetchgauthTokens }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
