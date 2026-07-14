import {
  Card,
  Group,
  Text,
  Badge,
  ScrollArea,
  NumberInput,
  Loader,
  Center,
  Textarea,
} from "@mantine/core";

import { DataTable } from "mantine-datatable";
import { IconAlertTriangle } from "@tabler/icons-react";

interface Props {
  loading: boolean;
  detalle: any[];

  registrosSeleccionados: any[];
  setRegistrosSeleccionados: (records: any[]) => void;

  handleCantidadChange: (
    idDetalle: number,
    value: number
  ) => void;

  esSurtidoParcial: boolean;

  justificacionParcial: string;
  handleJustificacionChange: (text: string) => void;
}

export default function DetalleSolicitudTable({
  loading,
  detalle,

  registrosSeleccionados,
  setRegistrosSeleccionados,

  handleCantidadChange,

  esSurtidoParcial,

  justificacionParcial,
  handleJustificacionChange,
}: Props) {
  return (
    <Card
      withBorder
      radius="md"
      shadow="sm"
      style={{
        borderLeft: "6px solid #0b6fa4",
        background: "#f8fbfd",
      }}
    >
      <Group justify="space-between" mb="sm">
        <Text fw={700} size="lg" c="#0b6fa4">
          Insumos de la Solicitud
        </Text>

        <Badge color="blue" variant="light">
          {detalle.length} registros
        </Badge>
      </Group>

      <ScrollArea h={300}>
        {loading ? (
          <Center h={200}>
            <Loader />
          </Center>
        ) : (
          <DataTable
            striped
            highlightOnHover
            records={detalle}
            idAccessor="id_detalle"
            selectedRecords={registrosSeleccionados}
            onSelectedRecordsChange={setRegistrosSeleccionados}
            noRecordsText="No hay insumos en esta solicitud."
            columns={[
              {
                accessor: "id_detalle",
                title: "#",
                width: 90,
                textAlign: "center",
              },
              {
                accessor: "nombre_almacen",
                title: "Almacén",
                width: 120,
                textAlign: "center",
              },
              {
                accessor: "descripcion",
                title: "Descripción del Insumo",
              },
              {
                accessor: "cantidad",
                title: "Cant. Pedida",
                textAlign: "center",
                render: (r) => (
                  <Text fw={700}>{r.cantidad}</Text>
                ),
              },
              {
                accessor: "id_lote",
                title: "Lote",
                textAlign: "center",
              },
              {
                accessor: "estado",
                title: "Estado",
                textAlign: "center",
                render: (r) => (
                  <Badge
                    color={
                      r.estado === "Pendiente"
                        ? "orange"
                        : "green"
                    }
                    variant="light"
                  >
                    {r.estado}
                  </Badge>
                ),
              },
              {
                accessor: "solicitado",
                title: "Cantidad a Surtir",
                textAlign: "center",
                render: (r) => (
                  <NumberInput
                    value={r.solicitado}
                    min={1}
                    allowNegative={false}
                    allowDecimal={false}
                    onChange={(value) =>
                      handleCantidadChange(
                        r.id_detalle,
                        Number(value)
                      )
                    }
                    style={{
                      width: 90,
                      margin: "auto",
                    }}
                  />
                ),
              },
            ]}
          />
        )}
      </ScrollArea>

      {esSurtidoParcial && (
        <Card
          withBorder
          radius="md"
          mt="md"
          bg="#fff9db"
          style={{
            borderColor: "#fcc419",
          }}
        >
          <Group gap="xs" mb="xs">
            <IconAlertTriangle
              size={18}
              color="#f59f00"
            />

            <Text
              size="sm"
              fw={600}
              c="#f59f00"
            >
              Justificación de Surtido Parcial
            </Text>
          </Group>

          <Textarea
            placeholder="Explique el motivo del surtido parcial..."
            value={justificacionParcial}
            onChange={(e) =>
              handleJustificacionChange(
                e.currentTarget.value
              )
            }
            minRows={2}
            required
          />
        </Card>
      )}
    </Card>
  );
}