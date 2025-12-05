// src/layouts/DashboardLayout.tsx
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="app-layout">
      {/* Sidebar fijo a la izquierda */}
      <aside className="app-sidebar">
        <Sidebar />
      </aside>

      {/* Columna derecha con header + contenido */}
      <div className="app-main">
        <Header />
        <div className="app-content">{children}</div>
      </div>
    </div>
  );
}
