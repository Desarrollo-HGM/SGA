import { useState } from "react";
import {
  AppShell,
  Group,
  Card,
  Text,
  Table,
  Badge,
  Button,
  TextInput,
} from "@mantine/core";
import {
  IconClipboardList,
  IconClock,
  IconCheck,
  IconX,
} from "@tabler/icons-react";
import "../../styles/Table_Solicitudes.css";

interface Solicitud {
  id: number;
  folio: string;
  tipo: string;
  fecha: string;
  solicitante: string;
  servicio: string;
  insumo: string;
  subalmacen: string;
  lote: string;
  cantidad: number;
  estado: "Pendiente" | "Aprobada" | "Rechazada"  | "Completada";
}

const solicitudesMock: Solicitud[] = [
{ id: 1, folio:"2025-S-00001", tipo: "Reposición", fecha: "2026-02-03", solicitante: "Juan Pérez", servicio: "Mantenimiento", insumo: "Tornillos", subalmacen: "A", lote: "L-2026-01", estado: "Pendiente", cantidad: 100 },
{ id: 2, folio:"2025-S-00002", tipo: "Urgente", fecha: "2026-02-02", solicitante: "María López", servicio: "Producción", insumo: "Clavos", subalmacen: "B", lote: "L-2026-02", estado: "Pendiente", cantidad: 200 },
{ id: 3, folio:"2025-S-00003", tipo: "Normal", fecha: "2026-02-01", solicitante: "Carlos Ruiz", servicio: "Calidad", insumo: "Tuercas", subalmacen: "C", lote: "L-2026-03", estado: "Aprobada", cantidad: 150 },
{ id: 4, folio:"2025-S-00004", tipo: "Cancelada", fecha: "2026-02-01", solicitante: "Ana Torres", servicio: "Compras", insumo: "Arandelas", subalmacen: "C", lote: "L-2026-04", estado: "Rechazada", cantidad: 50 },
{ id: 24, folio:"2025-S-00024", tipo: "Cancelada", fecha: "2026-02-01", solicitante: "Ana Torres", servicio: "Compras", insumo: "Arandelas", subalmacen: "C", lote: "L-2026-04", estado: "Completada", cantidad: 50 },              
];

export default function SolicitudesDashboard(){
  const [search, setSearch] = useState<string>("");
  const [filter, setFilter] = useState<"Pendiente" | "Aprobada" | "Rechazada" | "Completada" | null>(null);

  const totalSolicitudes = solicitudesMock.length;
  const pendientes = solicitudesMock.filter((s) => s.estado === "Pendiente").length;
  const aprobada = solicitudesMock.filter((s) => s.estado === "Aprobada").length;
  const rechazada = solicitudesMock.filter((s) => s.estado === "Rechazada").length;
  const completada = solicitudesMock.filter((s) => s.estado === "Completada").length;

  const filteredSolicitudes = solicitudesMock.filter((s) => {
    const query = search.toLowerCase();
    const matchSearch =
       s.folio.toLowerCase().includes(query) ||
      s.tipo.toLowerCase().includes(query) ||
      s.solicitante.toLowerCase().includes(query) ||
      s.servicio.toLowerCase().includes(query) ||
      s.insumo.toLowerCase().includes(query) ||
      s.lote.toLowerCase().includes(query);

    const matchFilter = filter ? s.estado === filter : true;
    return matchSearch && matchFilter;
  });

  const getEstadoIcon = (estado: Solicitud["estado"]) => {
    switch (estado) {
      case "Pendiente":
        return <IconClock size={18} color="#facc15" />;
      case "Aprobada":
        return <IconCheck size={18} color="#48c522" />;
      case "Rechazada":
        return <IconX size={18} color="#ef4444" />;
         case "Completada":
        return <IconCheck size={18} color="#01611e" />;


      default:
        return null;
    }
  };

  return (
    <AppShell header={{ height: 60 }}>
      <AppShell.Main style={{ paddingLeft: 0, paddingRight: 0 }}>
        {/* KPI Cards centrados con eventos */}
        <Group mt="md">
          <Card className="kpi-card" onClick={() => setFilter(null)}>
            <IconClipboardList size={28} className="kpi-icon" />
            <Text className="kpi-number">{totalSolicitudes}</Text>
            <Text size="sm">Total</Text>
          </Card>
          <Card className="kpi-card" onClick={() => setFilter("Pendiente")}>
            <IconClock size={28} className="kpi-icon" />
            <Text className="kpi-number">{pendientes}</Text>
            <Text size="sm">Pendientes</Text>
          </Card>
          <Card className="kpi-card" onClick={() => setFilter("Aprobada")}>
            <IconCheck size={28} className="kpi-icon" />
            <Text className="kpi-number">{aprobada}</Text>
            <Text size="sm">Aprobadas</Text>
          </Card>
          <Card className="kpi-card" onClick={() => setFilter("Rechazada")}>
            <IconX size={28} className="kpi-icon" />
            <Text className="kpi-number">{rechazada}</Text>
            <Text size="sm">Rechazadas</Text>
          </Card>
             <Card className="kpi-card" onClick={() => setFilter("Completada")}>
            <IconX size={28} className="kpi-icon" />
            <Text className="kpi-number">{completada}</Text>
            <Text size="sm">Completada</Text>
          </Card>
        </Group>

        {/* Buscador */}
        <TextInput
          placeholder="Buscar solicitud..."
          value={search}
          onChange={(e) => setSearch(e.currentTarget.value)}
          className="search-bar"
          mt="lg"
        />

        {/* Tabla con scroll infinito */}
        <div className="table-container">
          <Table striped highlightOnHover>
            <thead className="table-head">
              <tr>
                <th>Folio</th>
                <th>Tipo</th>
                <th>Fecha</th>
                <th>Solicitante</th>
                <th>Servicio</th>
                <th>Insumo</th>
                <th>Subalmacén</th>
                <th>Lote</th>
                 <th>Cantidad</th>
                <th>Estado</th>
                <th>Acción</th>
              </tr>
            </thead>
            <tbody>
              {filteredSolicitudes.map((s) => (
                <tr key={s.id}>
                   <td>{s.folio}</td>
                  <td>{s.tipo}</td>
                  <td>{s.fecha}</td>
                  <td>{s.solicitante}</td>
                  <td>{s.servicio}</td>
                  <td>{s.insumo}</td>
                  <td>{s.subalmacen}</td>
                  <td>{s.lote}</td>
                   <td>{s.cantidad}</td>
                  <td>
                    <Badge
                      color={
  s.estado === "Pendiente"
    ? "yellow"
    : s.estado === "Aprobada"
    ? "#7CFC00"   // verde pistache (lime green)
    : s.estado === "Rechazada"
    ? "red"
    : s.estado === "Completada"
    ? "green"     // verde fuerte
    : "blue"
}
                      leftSection={getEstadoIcon(s.estado)}
                    >
                      {s.estado}
                    </Badge>
                  </td>
                  <td>
                   {(s.estado === "Pendiente" || s.estado === "Aprobada") && (
  <Button size="xs" variant="light" color="blue">
    Atender
  </Button>
)}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </AppShell.Main>
    </AppShell>
  );
}