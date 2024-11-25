import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import {AuthProvider} from "@contexts/auth.context";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import Login from "@pages/Login";
import LandingPage from "@pages/LandingPage";
import Layout from "@components/Layout";
import Dashboard  from "@pages/Dashboard"; // Importa MainPage si lo tienes.
import Search from "@pages/Search";
import Register from "@pages/Register"
import Forgot from '@pages/Forgot'
import Reset from '@pages/Reset'
const router = createBrowserRouter([
  // Ruta principal que usará Layout
  {
    path: "/",
    element: (
      <LandingPage />
    ),
  },
  {
    path: "/search/:fileType",	
    element: (
    <Layout>

      <Search />
      </Layout>

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
  },{
    path: "/reset/:token",
    element: <Reset />,
  },
  {
    path: "/dashboard",
    element:
    <Layout>

    <Dashboard />
    </Layout>
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AuthProvider>
    <RouterProvider router={router} />
    </AuthProvider>
  </React.StrictMode>
);
