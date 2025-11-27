// src/components/Layout.tsx
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import "../styles/layout.scss"; // opcional para estilos globales

export default function Layout() {
  return (
    <div className="app-layout">
      <Sidebar />
      <main className="app-content">
        <Outlet /> {/* Aquí se renderizan las páginas según la ruta */}
      </main>
    </div>
  );
}
