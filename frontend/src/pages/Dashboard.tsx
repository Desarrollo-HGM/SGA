// src/pages/Dashboard.tsx
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import "../styles/dashboard.scss";

interface DashboardData {
  inventario: number;
  solicitudes: number;
  movimientos: number;
  reportes: number;
}

export default function Dashboard() {
  const { user } = useContext(AuthContext);
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      console.warn("⚠️ No hay token, usando mock temporal");
      // Mock temporal
      setTimeout(() => {
        setData({
          inventario: 1245,
          solicitudes: 87,
          movimientos: 320,
          reportes: 12,
        });
        setLoading(false);
      }, 1000);
      return;
    }

    // Aquí iría tu llamada real al backend
    fetch("/api/dashboard", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => {
        if (!res.ok) throw new Error("Error en la API");
        return res.json();
      })
      .then(json => {
        setData(json);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error cargando dashboard:", err);
        // fallback mock si falla la API
        setData({
          inventario: 1245,
          solicitudes: 87,
          movimientos: 320,
          reportes: 12,
        });
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Cargando métricas...</div>;

  return (
    <div className="dashboard">
      <h1 className="dashboard-title">Panel de Control</h1>

      <div className="dashboard-cards">
        <div className="card kpi">
          <div className="card-icon">
            <i className="fas fa-box"></i>
          </div>
          <div className="card-content">
            <span className="card-title">Inventario</span>
            <span className="card-value">{data?.inventario} items</span>
          </div>
        </div>

        <div className="card kpi">
          <div className="card-icon">
            <i className="fas fa-file-alt"></i>
          </div>
          <div className="card-content">
            <span className="card-title">Solicitudes</span>
            <span className="card-value">{data?.solicitudes} activas</span>
          </div>
        </div>

        <div className="card kpi">
          <div className="card-icon">
            <i className="fas fa-exchange-alt"></i>
          </div>
          <div className="card-content">
            <span className="card-title">Movimientos</span>
            <span className="card-value">{data?.movimientos} este mes</span>
          </div>
        </div>

        <div className="card kpi">
          <div className="card-icon">
            <i className="fas fa-chart-line"></i>
          </div>
          <div className="card-content">
            <span className="card-title">Reportes</span>
            <span className="card-value">{data?.reportes} generados</span>
          </div>
        </div>
      </div>

      <div className="dashboard-section">
        <h2>Resumen</h2>
        <p>
          Bienvenido {user?.nombreCompleto}, aquí tienes un resumen de tus métricas
          institucionales.
        </p>
      </div>
    </div>
  );
}
