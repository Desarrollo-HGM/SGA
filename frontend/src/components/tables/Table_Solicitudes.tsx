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
  Modal,
  Grid
} from "@mantine/core";

import {
  IconClipboardList,
  IconClock,
  IconCheck,
  IconX,
  IconEdit
} from "@tabler/icons-react";

import SolicitudForm from "../../components/forms/Formulario_Solicitudes";

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
  estado: "Pendiente" | "Aprobada" | "Rechazada" | "Completada";
}

const solicitudesMock: Solicitud[] = [
  { id: 1, folio:"2025-S-00001", tipo: "Reposición", fecha: "2026-02-03", solicitante: "Juan Pérez", servicio: "Mantenimiento", insumo: "Tornillos", subalmacen: "A", lote: "L-2026-01", estado: "Pendiente", cantidad: 100 },
  { id: 2, folio:"2025-S-00002", tipo: "Urgente", fecha: "2026-02-02", solicitante: "María López", servicio: "Producción", insumo: "Clavos", subalmacen: "B", lote: "L-2026-02", estado: "Pendiente", cantidad: 200 },
  { id: 3, folio:"2025-S-00003", tipo: "Normal", fecha: "2026-02-01", solicitante: "Carlos Ruiz", servicio: "Calidad", insumo: "Tuercas", subalmacen: "C", lote: "L-2026-03", estado: "Aprobada", cantidad: 150 },
  { id: 4, folio:"2025-S-00004", tipo: "Cancelada", fecha: "2026-02-01", solicitante: "Ana Torres", servicio: "Compras", insumo: "Arandelas", subalmacen: "C", lote: "L-2026-04", estado: "Rechazada", cantidad: 50 },
  { id: 24, folio:"2025-S-00024", tipo: "Normal", fecha: "2026-02-01", solicitante: "Ana Torres", servicio: "Compras", insumo: "Arandelas", subalmacen: "C", lote: "L-2026-04", estado: "Completada", cantidad: 50 },
];

export default function SolicitudesDashboard() {

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"Pendiente" | "Aprobada" | "Rechazada" | "Completada" | null>(null);

  const [openedSurtir, setOpenedSurtir] = useState(false);
  const [openedSolicitud, setOpenedSolicitud] = useState(false);

  const [selectedSolicitud, setSelectedSolicitud] = useState<Solicitud | null>(null);

  const [loading, setLoading] = useState(false);

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

  const handleSubmit = (e: React.FormEvent) => {

    e.preventDefault();

    if (!selectedSolicitud) return;

    setLoading(true);

    setTimeout(() => {

      alert(`Solicitud ${selectedSolicitud.folio} atendida`);

      setLoading(false);
      setOpenedSurtir(false);

    }, 1500);
  };

  return (

    <AppShell header={{ height: 60 }}>

      <AppShell.Main style={{ paddingLeft: 0, paddingRight: 0 }}>

        {/* KPI Cards */}

        <Group mt="md">

          <Card className="kpi-card" onClick={() => setFilter(null)}>
            <IconClipboardList size={28} />
            <Text fw={700}>{totalSolicitudes}</Text>
            <Text size="sm">Total</Text>
          </Card>

          <Card className="kpi-card" onClick={() => setFilter("Pendiente")}>
            <IconClock size={28} />
            <Text fw={700}>{pendientes}</Text>
            <Text size="sm">Pendientes</Text>
          </Card>

          <Card className="kpi-card" onClick={() => setFilter("Aprobada")}>
            <IconCheck size={28} />
            <Text fw={700}>{aprobada}</Text>
            <Text size="sm">Aprobadas</Text>
          </Card>

          <Card className="kpi-card" onClick={() => setFilter("Rechazada")}>
            <IconX size={28} />
            <Text fw={700}>{rechazada}</Text>
            <Text size="sm">Rechazadas</Text>
          </Card>

          <Card className="kpi-card" onClick={() => setFilter("Completada")}>
            <IconCheck size={28} />
            <Text fw={700}>{completada}</Text>
            <Text size="sm">Completadas</Text>
          </Card>

        </Group>

        {/* Buscador + botón */}

        <Group justify="space-between" mt="lg" mb="md">

          <TextInput
            placeholder="Buscar solicitud..."
            value={search}
            onChange={(e) => setSearch(e.currentTarget.value)}
            style={{ width: 300 }}
          />


        </Group>

        {/* Tabla */}

       <Table striped highlightOnHover>
            <thead className="table-head">

         

            <tr>
              <th>Folio</th>
              <th>Tipo</th>
              <th>Fecha</th>
              <th>Solicitante</th>
              <th>Servicio</th>
              <th>Insumo</th>
              <th>Sub Almacén</th>
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
                        ? "lime"
                        : s.estado === "Rechazada"
                        ? "red"
                        : "green"
                    }
                    leftSection={getEstadoIcon(s.estado)}
                  >
                    {s.estado}
                  </Badge>

                </td>

                <td>

                  {(s.estado === "Pendiente" || s.estado === "Aprobada") && (

                    <Button
                      size="xs"
                      variant="light"
                      color="blue"
                      leftSection={<IconEdit size={16} />}
                      onClick={() => {

                        setSelectedSolicitud(s);
                        setOpenedSurtir(true);

                      }}
                    >
                      Surtir
                    </Button>

                  )}

                </td>

              </tr>

            ))}

          </tbody>

        </Table>

        {/* Modal surtir */}

        <Modal
          opened={openedSurtir}
          onClose={() => setOpenedSurtir(false)}
          title="Surtir almacén"
          centered
          size="lg"
        >

          {selectedSolicitud && (

            <form onSubmit={handleSubmit}>

              <Grid>

                <Grid.Col span={6}>
                  <TextInput label="Folio" value={selectedSolicitud.folio} readOnly />
                </Grid.Col>

                <Grid.Col span={6}>
                  <TextInput label="Tipo" value={selectedSolicitud.tipo} readOnly />
                </Grid.Col>

                <Grid.Col span={6}>
                  <TextInput label="Servicio" value={selectedSolicitud.servicio} readOnly />
                </Grid.Col>

                <Grid.Col span={6}>
                  <TextInput label="Insumo" value={selectedSolicitud.insumo} readOnly />
                </Grid.Col>

                <Grid.Col span={6}>
                  <TextInput label="Cantidad" value={selectedSolicitud.cantidad.toString()} readOnly />
                </Grid.Col>

              </Grid>

              <Group justify="right" mt="md">

                <Button
                  type="submit"
                  color="green"
                  loading={loading}
                  leftSection={<IconCheck size={16} />}
                >
                  Confirmar Surtido
                </Button>

                <Button
                  variant="outline"
                  color="gray"
                  onClick={() => setOpenedSurtir(false)}
                  leftSection={<IconX size={16} />}
                >
                  Cancelar
                </Button>

              </Group>

            </form>

          )}

        </Modal>

        {/* Modal nueva solicitud */}

        <Modal
          opened={openedSolicitud}
          onClose={() => setOpenedSolicitud(false)}
   
          title="Nueva Solicitud"
        
  
        
        
          centered
          size="lg"
          overlayProps={{ opacity: 0.55, blur: 3 }}
          closeOnClickOutside={false}
          zIndex={3000}
          styles={{
            header: {
              position: "sticky",
              top: 0,
              backgroundColor: "#003366", // azul fuerte institucional
              color: "white",
              fontWeight: "bold",
              zIndex: 1,
            },
            title: { color: "white" },
            body: { maxHeight: "70vh", overflowY: "auto" },
          }}









        >

          <SolicitudForm />

        </Modal>

      </AppShell.Main>

    </AppShell>
  );
}