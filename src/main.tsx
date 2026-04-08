// import { createRoot } from 'react-dom/client'
// import App from './App.tsx'
// import './index.css'

// createRoot(document.getElementById("root")!).render(<App />);

import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { AuthProvider } from "@/context/AuthContext";
import { SidebarProvider } from "@/context/SidebarContext";

createRoot(document.getElementById("root")!).render(
  <AuthProvider>
    <SidebarProvider>
      <App />
    </SidebarProvider>
  </AuthProvider>
);

