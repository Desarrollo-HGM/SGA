import { useState } from "react";
import {
  AppShell,
  Card,
  Text,
  Table,
  Badge,
  Button,
  Modal,
  SimpleGrid,
} from "@mantine/core";
import "./dashboard.css";

const stockMock = [
  { subalmacen: "A", servicio: "Mantenimiento", cantidad: 1200, estado: "Abasto" },
  { subalmacen: "B", servicio: "Producción", cantidad: 80, estado: "Desabasto" },
  { subalmacen: "C", servicio: "Calidad", cantidad: 300, estado: "Abasto" },
  { subalmacen: "D", servicio: "Compras", cantidad: 50, estado: "Desabasto" },
];

export default function StockDashboard() {
  const [opened, setOpened] = useState(false);
  const [filter, setFilter] = useState<string | null>(null);

  const totalAbasto = stockMock.filter(s => s.estado === "Abasto").length;
  const totalDesabasto = stockMock.filter(s => s.estado === "Desabasto").length;

  const filteredStock = filter
    ? stockMock.filter(s => s.estado === filter)
    : stockMock;

  return (
    <AppShell header={{ height: 60 }}>
     

      <AppShell.Main style={{ paddingLeft: 0, paddingRight: 0 }}>
        {/* KPI Cards en grid */}
        <SimpleGrid cols={2} spacing="md" mt="md">
          <Card className="kpi-card kpi-abasto">
            <Text>Subalmacenes con Abasto: {totalAbasto}</Text>
            <Button size="xs" className="btn-action" onClick={() => { setFilter("Abasto"); setOpened(true); }}>
              Ver detalle
            </Button>
          </Card>
          <Card className="kpi-card kpi-desabasto">
            <Text>Subalmacenes con Desabasto: {totalDesabasto}</Text>
            <Button size="xs" className="btn-action" onClick={() => { setFilter("Desabasto"); setOpened(true); }}>
              Ver detalle
            </Button>
          </Card>
        </SimpleGrid>

        {/* Tabla de Stock */}
        <Text mt="xl" fw={600}>Listado de Stock</Text>
        <Table striped highlightOnHover>
          <thead>
            <tr>
              <th>Subalmacén</th>
              <th>Servicio</th>
              <th>Cantidad</th>
              <th>Estado</th>
              <th>Acción</th>
            </tr>
          </thead>
          <tbody>
            {stockMock.map((s, i) => (
              <tr key={i}>
                <td>{s.subalmacen}</td>
                <td>{s.servicio}</td>
                <td>{s.cantidad}</td>
                <td>
                  <Badge color={s.estado === "Abasto" ? "green" : "red"}>
                    {s.estado}
                  </Badge>
                </td>
                <td>
                  {s.estado === "Desabasto" && (
                    <Button size="xs" color="red" className="btn-action">
                      Acción requerida
                    </Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>

        {/* Modal de detalle filtrado */}
        <Modal opened={opened} onClose={() => setOpened(false)} title="Detalle de Stock">
          <Table striped highlightOnHover>
            <thead>
              <tr>
                <th>Subalmacén</th>
                <th>Servicio</th>
                <th>Cantidad</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              {filteredStock.map((s, i) => (
                <tr key={i}>
                  <td>{s.subalmacen}</td>
                  <td>{s.servicio}</td>
                  <td>{s.cantidad}</td>
                  <td>{s.estado}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Modal>
      </AppShell.Main>
    </AppShell>
  );
}