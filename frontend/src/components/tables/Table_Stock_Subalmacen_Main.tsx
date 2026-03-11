import { useState } from "react";
import {
  AppShell,
  Group,
  Card,
  Text,
  Table,
  Button,
  TextInput,
  Modal
} from "@mantine/core";
import { IconClipboardList,IconEdit, IconX } from "@tabler/icons-react";
import "../../styles/Table_Solicitudes.css";
import Stock_Subalmacen from "./Table_Stock_Subalmacen";
interface Solicitud {
  id: number;
  dia: string;
  servicio: string;
  subalmacen: string;
}

const solicitudesMock: Solicitud[] = [
  { id: 1, dia: "Lunes", servicio: "Mantenimiento", subalmacen: "A1" },
  { id: 2, dia: "Martes", servicio: "Producción", subalmacen: "B1" },
  { id: 3, dia: "Miércoles", servicio: "Calidad", subalmacen: "C1" },
  { id: 4, dia: "Jueves", servicio: "Compras", subalmacen: "D1" },
  { id: 5, dia: "Viernes", servicio: "Logística", subalmacen: "E1" },
  { id: 6, dia: "Sábado", servicio: "Almacén", subalmacen: "F1" },
  { id: 7, dia: "Domingo", servicio: "Seguridad", subalmacen: "G1" },
];

export default function SolicitudesDashboard() {
  const [search, setSearch] = useState<string>("");
  const [filterDia, setFilterDia] = useState<string | null>(null);
  const [opened, setOpened] = useState(false);
  const [selectedSolicitud, setSelectedSolicitud] = useState<Solicitud | null>(null);

  const diasSemana = ["Lunes","Martes","Miércoles","Jueves","Viernes","Sábado","Domingo"];

  const filteredSolicitudes = solicitudesMock.filter((s) => {
    const query = search.toLowerCase();
    const matchSearch =
      s.dia.toLowerCase().includes(query) ||
      s.servicio.toLowerCase().includes(query) ||
      s.subalmacen.toLowerCase().includes(query);

    const matchFilter = filterDia ? s.dia === filterDia : true;
    return matchSearch && matchFilter;
  });

  return (
    <AppShell header={{ height: 60 }}>
      <AppShell.Main style={{ paddingLeft: 0, paddingRight: 0 }}>
        {/* KPI Cards */}
        <Group mt="md">
          <Card className="kpi-card" onClick={() => setFilterDia(null)}>
            <IconClipboardList size={28} className="kpi-icon" />
            <Text className="kpi-number">{solicitudesMock.length}</Text>
            <Text size="sm">Total</Text>
          </Card>
          {diasSemana.map((dia) => (
            <Card key={dia} className="kpi-card" onClick={() => setFilterDia(dia)}>
              <IconClipboardList size={28} className="kpi-icon" />
              <Text className="kpi-number">
                {solicitudesMock.filter((s) => s.dia === dia).length}
              </Text>
              <Text size="sm">{dia}</Text>
            </Card>
          ))}
        </Group>

        {/* Buscador */}
        <TextInput
          placeholder="Buscar..."
          value={search}
          onChange={(e) => setSearch(e.currentTarget.value)}
          className="search-bar"
          mt="lg"
        />

        {/* Tabla */}
        <div className="table-container">
          <Table striped highlightOnHover>
            <thead className="table-head">
              <tr>
                <th>Día</th>
                <th>Servicio</th>
                <th style={{ textAlign: "center" }}>Sub Almacén</th>
                <th style={{ textAlign: "center" }}>Acción</th>
              </tr>
            </thead>
            <tbody>
              {filteredSolicitudes.map((s) => (
                <tr key={s.id}>
                  <td>{s.dia}</td>
                  <td>{s.servicio}</td>
                  <td style={{ textAlign: "center" }}>{s.subalmacen}</td>
                  <td style={{ textAlign: "center" }}>
                    <Button
                      size="xs"
                      variant="light"
                      color="blue"
                        leftSection={<IconEdit size={14} />}
                      onClick={() => {
                        setSelectedSolicitud(s);
                        setOpened(true);
                      }}
                    >
                      Mostrar Stock
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>

        {/* Modal grande */}
        <Modal
          opened={opened}
          onClose={() => setOpened(false)}
          centered
          fullScreen
          title={
            <div style={{ backgroundColor: "#1E3A8A", padding: "10px", color: "white" }}>
              <Text fw={600}>Acción de Surtir</Text>
            </div>
          }
        >
          {selectedSolicitud && (
            <div style={{ padding: "20px" }}>
              <Text fw={500}>Día: {selectedSolicitud.dia}</Text>
              <Text fw={500}>Servicio: {selectedSolicitud.servicio}</Text>
              <Text fw={500}>Sub Almacén: {selectedSolicitud.subalmacen}</Text>

              <Button size="xs"
                      variant="light"
                      color="orange"
                      leftSection={<IconX size={14} />} onClick={() => setOpened(false)}>
                Cerrar
              </Button>
            </div>
          )}


          <Stock_Subalmacen />



        </Modal>
      </AppShell.Main>
    </AppShell>
  );
}