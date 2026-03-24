import {
  Modal,
  Card,
  Group,
  Text,
  Badge,
  ScrollArea,
  NumberInput,
  Button,
  Loader,
  Center,
  Grid,
  TextInput
} from "@mantine/core";

import { DataTable } from "mantine-datatable";
import { useEffect, useState, useMemo, useRef } from "react";
import { IconBuildingHospital } from "@tabler/icons-react";

import { getDetalleSolicitud } from "../../services/solicitudes_surtir";
import { generarPDF } from "../../utils/generarPDF_surtir";

interface Props {
  opened: boolean;
  onClose: () => void;
  idSolicitud: number | null;
}

const PAGE_SIZE = 10;

export default function ModalDetalleSolicitud({
  opened,
  onClose,
  idSolicitud
}: Props) {

  const [loading, setLoading] = useState(false);
  const [detalle, setDetalle] = useState<any[]>([]);

  const [filters, setFilters] = useState({
    clave: "",
    insumo: "",
    tipo: "",
    unidad: "",
    servicio: "",
    subalmacen: ""
  });

  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const viewportRef = useRef<HTMLDivElement>(null);

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

  /* ================= FILTROS ================= */
  const handleFilterChange = (field: string, value: string) => {
    setFilters(prev => ({ ...prev, [field]: value }));
    setVisibleCount(PAGE_SIZE);
  };

  const normalize = (value: any) =>
    (value ?? "").toString().toLowerCase().trim();

  const filteredData = useMemo(() => {
    return detalle.filter(item => (
      normalize(item.clave).includes(normalize(filters.clave)) &&
      normalize(item.insumo).includes(normalize(filters.insumo)) &&
      normalize(item.tipo).includes(normalize(filters.tipo)) &&
      normalize(item.unidad).includes(normalize(filters.unidad)) &&
      normalize(item.servicio).includes(normalize(filters.servicio)) &&
      normalize(item.subalmacen).includes(normalize(filters.subalmacen))
    ));
  }, [detalle, filters]);

  const visibleData = useMemo(() => {
    return filteredData.slice(0, visibleCount);
  }, [filteredData, visibleCount]);

  const handleScroll = () => {
    const viewport = viewportRef.current;
    if (!viewport) return;

    const { scrollTop, scrollHeight, clientHeight } = viewport;

    if (scrollTop + clientHeight >= scrollHeight - 50) {
      setVisibleCount(prev => prev + PAGE_SIZE);
    }
  };

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

    await generarPDF({
      cart: items,
      quienSurte: "Farmacia Central",
      quienRecibe: "Urgencias"
    });

    onClose();
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={`Detalle solicitud #${idSolicitud}`}
      size="xl"
      centered
    >
      <Card
        withBorder
        radius="md"
        shadow="sm"
        style={{
          borderLeft: "6px solid #0b6fa4",
          background: "#f8fbfd"
        }}
      >

        {/* HEADER */}
        <Group justify="space-between" mb="sm">
          <Group>
            <IconBuildingHospital size={22} color="#0b6fa4" />
            <Text fw={700} size="lg" c="#0b6fa4">
              Detalle de solicitud
            </Text>
          </Group>

          <Badge color="blue" variant="light">
            {filteredData.length} insumos
          </Badge>
        </Group>


        {/* TABLA */}
        <ScrollArea
          h={450}
          viewportRef={viewportRef}
          onScrollPositionChange={handleScroll}
        >
          {loading ? (
            <Center h={300}>
              <Loader />
            </Center>
          ) : (
            <DataTable
              withTableBorder
              highlightOnHover
              striped
              records={visibleData}
              idAccessor="id"
              noRecordsText="No hay insumos disponibles"

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
                  render: (r: any) => {
                    let color = "green";
                    let label = "OK";

                    if (r.stock <= 10) {
                      color = "red";
                      label = "Bajo";
                    } else if (r.stock <= 30) {
                      color = "yellow";
                      label = "Medio";
                    }

                    return (
                      <Badge color={color} variant="light">
                        {r.stock} • {label}
                      </Badge>
                    );
                  }
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

        {/* BOTÓN */}
        <Group justify="flex-end" mt="md">
          <Button color="green" onClick={handleSurtir}>
            Surtir solicitud
          </Button>
        </Group>

      </Card>
    </Modal>
  );
}