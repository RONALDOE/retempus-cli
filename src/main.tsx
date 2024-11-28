import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { ContextMenuProvider } from "@contexts/contextmenu.context"; // Importamos el provider

import { AuthProvider } from "@contexts/auth.context";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from "@pages/Login";
import LandingPage from "@pages/LandingPage";
import Layout from "@components/Layout";
import Dashboard from "@pages/Dashboard"; // Importa MainPage si lo tienes.
import Search from "@pages/Search";
import Register from "@pages/Register";
import Forgot from "@pages/Forgot";
import Reset from "@pages/Reset";
import Trashcan from "@pages/Trashcan";
import ProtectedRoute from "@components/ProtectedRoute";
import { GoogleAuthProvider } from "@contexts/gauth.context";
import Upload from "@pages/Upload";
const router = createBrowserRouter([
  // Ruta principal que usará Layout
  {
    path: "/",
    element: <LandingPage />,
  },
  {
    path: "/search/:q?",
    element: (
      <ProtectedRoute>
        <Layout>
          <Search />
        </Layout>
      </ProtectedRoute>
    ),
  },

  // Rutas que no usan Layout
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/forgot",
    element: <Forgot />,
  },
  {
    path: "/reset/:token",
    element: <Reset />,
  },
  {
    path: "/dashboard",
    element: (
      <ProtectedRoute>
        <Layout>
          <Dashboard />
        </Layout>
      </ProtectedRoute>
    ),
  },
  {
    path: "/upload",
    element: (
      <ProtectedRoute>
        <Layout>
          <Upload />
        </Layout>
      </ProtectedRoute>
    ),
  },
  {
    path: "/trashcan",
    element: (
      <ProtectedRoute>
        <Layout>
          <Trashcan />
        </Layout>
      </ProtectedRoute>
    ),
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ContextMenuProvider>
      <GoogleAuthProvider>
        <AuthProvider>
          <RouterProvider router={router} />
        </AuthProvider>
      </GoogleAuthProvider>
    </ContextMenuProvider>
  </React.StrictMode>
);
