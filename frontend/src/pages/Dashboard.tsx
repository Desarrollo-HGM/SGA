import React, { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import api from "../config/api"; // tu servicio axios
import KpiCard from "../components/KpiCard";
import RecentMovements from "../components/RecentMovements";

const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [stock, setStock] = useState<any[]>([]);
  const [solicitudesPendientes, setSolicitudesPendientes] = useState<number>(0);
  const [movimientos, setMovimientos] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const stockRes = await api.get("/api/stock/consolidado");
        setStock(stockRes.data);

        const solicitudesRes = await api.get("/api/solicitudes?estado=Pendiente");
        setSolicitudesPendientes(solicitudesRes.data.length);

        const movimientosRes = await api.get("/api/movimientos?limit=5");
        setMovimientos(movimientosRes.data);
      } catch (err) {
        console.error("Error cargando dashboard", err);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="dashboard-page">
      <h1>Bienvenido, {user?.username}</h1>
      <div className="dashboard-kpis">
        <KpiCard
          title="Stock bajo mínimo"
          value={stock.filter(s => s.stock_total_insumo < s.minimo).length}
          link="/config-stock"
        />
        <KpiCard
          title="Solicitudes pendientes"
          value={solicitudesPendientes}
          link="/solicitudes"
        />
        <KpiCard
          title="Últimos movimientos"
          value={movimientos.length}
          link="/movimientos"
        />
      </div>
      <RecentMovements movimientos={movimientos} />
    </div>
  );
};

export default DashboardPage;
