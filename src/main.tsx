import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import Login from "@pages/Login";
import LandingPage from "@pages/LandingPage";
import Layout from "@components/Layout";
import Dashboard  from "@pages/Dashboard"; // Importa MainPage si lo tienes.

const router = createBrowserRouter([
  // Ruta principal que usará Layout
  {
    path: "/",
    element: (
      <LandingPage />
    ),
  },
  
  // Rutas que no usan Layout
  {
    path: "/login",
    element: <Login />,
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
    <RouterProvider router={router} />
  </React.StrictMode>
);
