import {
  Table,
  Button,
  Card,
  Text,
  Badge,
  Group,
  ScrollArea
} from "@mantine/core";

import { IconEye } from "@tabler/icons-react";
import { useState } from "react";

import ModalDetalleSolicitud from "./ModalDetalleSolicitud";
import type { Solicitud as SolicitudBase } from "../../services/solicitudes";

/* ================= TIPOS ================= */

interface Props {
  data: SolicitudBase[];
}

/* ================= COMPONENTE ================= */

export default function CampanaSolicitudes({ data }: Props) {

  const [modalDetalle, setModalDetalle] = useState(false);
  const [idSeleccionado, setIdSeleccionado] = useState<number | null>(null);

  /* ================= DETALLE ================= */

  const openDetalle = (id: number) => {
    setIdSeleccionado(id);
    setModalDetalle(true);
  };

  /* ================= UTILS ================= */

  const getColor = (estado: string) => {
    switch (estado) {
      case "pendiente": return "yellow";
      case "cancelada": return "red";
      case "surtida": return "green";
      default: return "gray";
    }
  };

  /* ================= UI ================= */

  return (
    <Card
      withBorder
      radius="md"
      shadow="sm"
      mt="md"
      style={{
        borderLeft: "6px solid #0b6fa4",
        background: "#f8fbfd"
      }}
    >

      {/* 🔥 SCROLL para muchas solicitudes */}
      <ScrollArea h={400}>

        <Table striped highlightOnHover withTableBorder>
          <thead style={{ backgroundColor: "#0b6fa4", color: "white" }}>
            <tr>
              <th style={{ textAlign: "center" }}>ID</th>
              <th style={{ textAlign: "center" }}>Servicio</th>
              <th style={{ textAlign: "center" }}>Subalmacén</th>
              <th style={{ textAlign: "center" }}>Estado</th>
              <th style={{ textAlign: "center" }}>Acciones</th>
            </tr>
          </thead>

          <tbody>
            {data.length === 0 ? (
              <tr>
                <td colSpan={5}>
                  <Text c="dimmed" ta="center">
                    Sin solicitudes
                  </Text>
                </td>
              </tr>
            ) : (
              data.map((sol) => (
                <tr key={sol.id_solicitud}>
                  <td style={{ textAlign: "center" }}>
                    {sol.id_solicitud}
                  </td>

                  <td style={{ textAlign: "center" }}>
                    {sol.servicio}
                  </td>

                  <td style={{ textAlign: "center" }}>
                    {sol.subalmacen}
                  </td>

                  <td style={{ textAlign: "center" }}>
                    <Badge color={getColor(sol.estado)} variant="light">
                      {sol.estado.toUpperCase()}
                    </Badge>
                  </td>

                  <td style={{ textAlign: "center" }}>
                    <Group justify="center">
                      <Button
                        size="xs"
                        radius="xl"
                        variant="light"
                        color="blue"
                        leftSection={<IconEye size={14} />}
                        onClick={() => openDetalle(sol.id_solicitud)}
                      >
                        Detalle
                      </Button>
                    </Group>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </Table>

      </ScrollArea>

      {/* 🔥 MODAL */}
      <ModalDetalleSolicitud
        opened={modalDetalle}
        onClose={() => setModalDetalle(false)}
        idSolicitud={idSeleccionado}
      />

    </Card>
  );
}