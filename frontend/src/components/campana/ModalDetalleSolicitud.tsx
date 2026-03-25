import {
  Drawer,
  Card,
  Group,
  Text,
  Badge,
  ScrollArea,
  NumberInput,
  Button,
  Loader,
  Center,
  Textarea,
  ThemeIcon,
  ActionIcon
} from "@mantine/core";

import { DataTable } from "mantine-datatable";
import { useEffect, useState } from "react";

import {
  IconFileInvoice,
  IconCheck,
  IconX,
  IconAlertTriangle,
  IconPackages
} from "@tabler/icons-react";

import { getDetalleSolicitud } from "../../services/solicitudes_surtir";
import { generarPDF } from "../../utils/generarPDF_surtir";

interface Props {
  opened: boolean;
  onClose: () => void;
  idSolicitud: number | null;
}

export default function ModalDetalleSolicitud({
  opened,
  onClose,
  idSolicitud
}: Props) {

  const [loading, setLoading] = useState(false);
  const [detalle, setDetalle] = useState<any[]>([]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const [openCancel, setOpenCancel] = useState(false);
  const [motivo, setMotivo] = useState("");

  /* ================= FETCH ================= */
  useEffect(() => {
    if (!idSolicitud) return;

    const fetchDetalle = async () => {
      setLoading(true);
      try {
        const data = await getDetalleSolicitud(idSolicitud);

        setDetalle(
          data.map((d: any, i: number) => ({
            ...d,
            id: i + 1,
            solicitado: 0
          }))
        );

      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchDetalle();
  }, [idSolicitud]);

  /* ================= EDITAR ================= */
  const handleCantidadChange = (id: number, value: number) => {
    setDetalle(prev =>
      prev.map(item =>
        item.id === id ? { ...item, solicitado: value || 0 } : item
      )
    );
  };

  /* ================= SURTIR ================= */
  const handleSurtir = async () => {

    const items = detalle.filter(i => i.solicitado > 0);

    if (!items.length) {
      alert("No hay insumos seleccionados");
      return;
    }

    try {
      setIsSubmitting(true);

      await generarPDF({
        cart: items,
        quienSurte: "Farmacia Central",
        quienRecibe: "Urgencias"
      });

      setIsSubmitted(true);

    } catch (e) {
      console.error(e);
    } finally {
      setIsSubmitting(false);
    }
  };

  /* ================= CANCELAR ================= */
  const handleCancelar = () => {

    if (!motivo.trim()) {
      alert("Debes escribir un motivo");
      return;
    }

    console.log("Cancelar solicitud:", idSolicitud, motivo);

    setOpenCancel(false);
    setMotivo("");

    onClose();
  };

  return (
    <>
      <Drawer
        opened={opened}
        onClose={onClose}
        position="bottom"
        size="70%"
        radius="lg"
        overlayProps={{ blur: 3 }}
        withCloseButton={false}
      >

        {/* 🔥 HEADER PERSONALIZADO */}
        <Group justify="space-between" mb="md">
          <Group>
            <ThemeIcon size="lg" radius="xl" color="teal" variant="light">
              <IconPackages size={20} />
            </ThemeIcon>

            <Text fw={700} size="lg">
              Detalle solicitud #{idSolicitud}
            </Text>
          </Group>

          <ActionIcon
            variant="light"
            color="red"
            size="lg"
            radius="xl"
            onClick={onClose}
          >
            <IconX size={18} />
          </ActionIcon>
        </Group>

        {/* CONTENIDO */}
        <Card
          withBorder
          radius="md"
          shadow="sm"
          style={{
            borderLeft: "6px solid #0b6fa4",
            background: "#f8fbfd"
          }}
        >

          <Group justify="space-between" mb="sm">
            <Text fw={700} size="lg" c="#0b6fa4">
              Insumos
            </Text>

            <Badge color="blue" variant="light">
              {detalle.length} registros
            </Badge>
          </Group>

          <ScrollArea h={400}>
            {loading ? (
              <Center h={300}>
                <Loader />
              </Center>
            ) : (
              <DataTable
                striped
                highlightOnHover
                records={detalle}
                idAccessor="id"
                columns={[
                  { accessor: "clave", title: "Clave" },
                  { accessor: "insumo", title: "Insumo" },
                  { accessor: "tipo", title: "Tipo" },
                  { accessor: "unidad", title: "Unidad" },
                  { accessor: "servicio", title: "Servicio" },
                  { accessor: "subalmacen", title: "Subalmacén" },

                  {
                    accessor: "stock",
                    title: "Stock",
                    textAlign: "center",
                    render: (r: any) => (
                      <Badge color={r.stock <= 10 ? "red" : "green"}>
                        {r.stock}
                      </Badge>
                    )
                  },

                  {
                    accessor: "solicitado",
                    title: "Solicitado",
                    textAlign: "center",
                    render: (r: any) => (
                      <NumberInput
                        value={r.solicitado}
                        min={0}
                        max={r.stock}
                        onChange={(val) =>
                          handleCantidadChange(r.id, Number(val))
                        }
                        style={{ width: 90 }}
                      />
                    )
                  }
                ]}
              />
            )}
          </ScrollArea>

          {/* BOTONES */}
          <Group grow mt="md">

            <Button
              radius="xl"
              size="md"
              fullWidth
              loading={isSubmitting}
              disabled={isSubmitting || isSubmitted}
              color={isSubmitted ? "teal" : "green"}
              variant={isSubmitted ? "filled" : "light"}
              leftSection={
                isSubmitted
                  ? <IconCheck size={18} />
                  : <IconFileInvoice size={18} />
              }
              onClick={handleSurtir}
            >
              {isSubmitted ? "Surtido generado" : "Surtir solicitud"}
            </Button>

            <Button
              radius="xl"
              size="md"
              color="red"
              variant="light"
              leftSection={<IconX size={18} />}
              onClick={() => setOpenCancel(true)}
            >
              Cancelar solicitud
            </Button>

          </Group>

        </Card>
      </Drawer>

     {/* 🔥 CANCELACIÓN */}
<Drawer
  opened={openCancel}
  onClose={() => setOpenCancel(false)} 
  position="bottom"
  size="40%"
  radius="lg"
  withCloseButton={false} // opcional si usas tu propio botón
>

  {/* HEADER PERSONALIZADO */}
  <Group justify="space-between" mb="md">
    <Group>
      <IconAlertTriangle color="red" />
      <Text fw={700}>Cancelar solicitud</Text>
    </Group>

    <ActionIcon
      variant="light"
      color="red"
      size="lg"
      radius="xl"
      onClick={() => setOpenCancel(false)} // ✅ correcto
    >
      <IconX size={18} />
    </ActionIcon>
  </Group>

  {/* CONTENIDO */}
  <Text fw={600} mb="xs">
    Motivo de cancelación
  </Text>

  <Textarea
    placeholder="Escribe el motivo..."
    value={motivo}
    onChange={(e) => setMotivo(e.currentTarget.value)}
    minRows={3}
  />

  <Button
    fullWidth
    mt="md"
    color="red"
    radius="xl"
    variant="light"
    onClick={handleCancelar}
  >
    Confirmar cancelación
  </Button>

</Drawer>
    </>
  );
}