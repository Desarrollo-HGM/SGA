import {
  Table,
  Card,
  Text,
  Badge,
  Group,
  ScrollArea
} from "@mantine/core";

import { useState } from "react";

import ModalDetalleSolicitud from "./ModalDetalleSolicitud";
// Importamos la interfaz Solicitud directamente para garantizar compatibilidad de tipos
import type { Solicitud } from "../../services/solicitudes"; 
import BotonDetalleSolicitud from "../botones/BotonDetalleSolicitud";

/* ================= TIPOS ================= */

interface Props {
  data: Solicitud[]; // <-- Actualizado con tu nueva interfaz global
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

  // Ajustado para evaluar strings con mayúsculas/minúsculas sin romperse
  const getColor = (estado: string) => {
    switch (estado?.toLowerCase()) {
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
      {/*  SCROLL para muchas solicitudes */}
      <ScrollArea h={400}>

        <Table striped highlightOnHover withTableBorder>
          <thead style={{ backgroundColor: "#0b6fa4", color: "white" }}>
           <tr>
              <th style={{ textAlign: "center" }}>ID</th>
              <th style={{ textAlign: "center" }}>Fecha</th>
              <th style={{ textAlign: "center" }}>Requisitor</th>
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
                  <Text c="dimmed" ta="center" py="md">
                    Sin solicitudes encontradas
                  </Text>
                </td>
              </tr>
            ) : (
              data.map((sol) => (
               <tr key={sol.id_solicitudes}>
                  <td style={{ textAlign: "center", fontWeight: 600 }}>
                    {sol.id_solicitudes}
                  </td>

                  <td style={{ textAlign: "center" }}>
                    {new Date(sol.fecha_solicitud).toLocaleDateString("es-MX")}
                  </td>

                  <td style={{ textAlign: "center" }}>
                    {sol.nombre_requisitor}
                  </td>

                  <td style={{ textAlign: "center" }}>
                    {sol.nombre_servicio}
                  </td>

                  <td style={{ textAlign: "center" }}>
                    {sol.nombre_subalmacen}
                  </td>
                         
               

                  <td style={{ textAlign: "center" }}>
                    <Badge color={getColor(sol.estado)} variant="light">
                      {sol.estado ? sol.estado.toUpperCase() : "DESCONOCIDO"}
                    </Badge>
                  </td>

                  <td style={{ textAlign: "center" }}>
                    <Group justify="center">
                       <BotonDetalleSolicitud onClick={() => openDetalle(sol.id_solicitudes)} />
                    </Group>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </Table>

      </ScrollArea>

      {/*  MODAL */}
      <ModalDetalleSolicitud
        opened={modalDetalle}
        onClose={() => setModalDetalle(false)}
        idSolicitud={idSeleccionado}
      />

    </Card>
  );
}
 