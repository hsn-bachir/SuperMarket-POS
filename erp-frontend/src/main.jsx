import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./styles/global.css";
import "./index.css";

import { AuthProvider } from "@/features/auth/authContext";
import { Toaster } from "sonner";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <App />
      <Toaster position="top-right" richColors closeButton duration={2500} />
    </AuthProvider>
  </React.StrictMode>,
);
