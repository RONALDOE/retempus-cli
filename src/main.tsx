import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import Login from "@pages/Login";
import LandingPage from "@pages/LandingPage";
const router = createBrowserRouter([
  {
    path: "/*",
    element: <div>Hello world!</div>,
    
  },
  {
    path: "/login",
    element: <Login/>,
    
  },
  {
    path: "/",
    element: <LandingPage/>,
    
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
        <RouterProvider router={router} />
  </React.StrictMode>,
);
