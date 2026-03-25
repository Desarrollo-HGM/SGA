import { useState, useMemo, useRef } from "react";
import {
  Badge,
  Card,
  Group,
  Text,
  TextInput,
  Grid,
  ScrollArea,
  Center,
  Loader,
  Code
} from "@mantine/core";

import BotonAccion from "../botones/BotonAccion";
import { IconBuildingHospital } from "@tabler/icons-react";
import { DataTable } from "mantine-datatable";

import type { Insumo, CartItem } from "../../types/global";

interface Props {
  data: Insumo[];
  addToCart: (item: Insumo) => void;
  removeFromCart: (id: number) => void;
  cart: CartItem[];
  loading?: boolean;
  highlightId?: number;
  changedIds?: number[]; // 🔥 filas cambiadas
}

const PAGE_SIZE = 10;

export default function InventarioTable({
  data,
  addToCart,
  removeFromCart,
  cart,
  loading = false,
  highlightId,
  changedIds = []
}: Props) {

  const [filters, setFilters] = useState({
    clave: "",
    insumo: "",
    tipo: "",
    unidad: "",
    servicio: "",
    subalmacen: "",
  });

  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const viewportRef = useRef<HTMLDivElement>(null);

  const handleFilterChange = (field: string, value: string) => {
    setFilters(prev => ({ ...prev, [field]: value }));
    setVisibleCount(PAGE_SIZE);
  };

  const normalize = (value: any) => (value ?? "").toString().toLowerCase().trim();

  const filteredData = useMemo(() => {
    return data.filter(item => 
      normalize(item.clave).includes(normalize(filters.clave)) &&
      normalize(item.insumo).includes(normalize(filters.insumo)) &&
      normalize(item.tipo_insumo).includes(normalize(filters.tipo)) &&
      normalize(item.unidad_distribucion).includes(normalize(filters.unidad)) &&
      normalize(item.servicio).includes(normalize(filters.servicio)) &&
      normalize(item.subalmacen).includes(normalize(filters.subalmacen))
    );
  }, [data, filters]);

  const visibleData = useMemo(() => filteredData.slice(0, visibleCount), [filteredData, visibleCount]);

  const handleScroll = () => {
    const viewport = viewportRef.current;
    if (!viewport) return;

    const { scrollTop, scrollHeight, clientHeight } = viewport;
    if (scrollTop + clientHeight >= scrollHeight - 50) {
      setVisibleCount(prev => prev + PAGE_SIZE);
    }
  };

  return (
    <Card withBorder radius="md" shadow="sm" mt="md" style={{ borderLeft: "6px solid #0b6fa4", background: "#f8fbfd" }}>

      {/* HEADER */}
      <Group justify="space-between" mb="sm">
        <Group>
          <IconBuildingHospital size={22} color="#0b6fa4" />
          <Text fw={700} size="lg" c="#0b6fa4">Inventario</Text>
        </Group>
        <Badge color="blue" variant="light">{filteredData.length} insumos</Badge>
      </Group>

      {/* FILTROS */}
      <Grid mb="md">
        <Grid.Col span={2}><TextInput placeholder="Clave" value={filters.clave} onChange={e => handleFilterChange("clave", e.currentTarget.value)} /></Grid.Col>
        <Grid.Col span={3}><TextInput placeholder="Insumo" value={filters.insumo} onChange={e => handleFilterChange("insumo", e.currentTarget.value)} /></Grid.Col>
        <Grid.Col span={2}><TextInput placeholder="Tipo" value={filters.tipo} onChange={e => handleFilterChange("tipo", e.currentTarget.value)} /></Grid.Col>
        <Grid.Col span={2}><TextInput placeholder="Unidad" value={filters.unidad} onChange={e => handleFilterChange("unidad", e.currentTarget.value)} /></Grid.Col>
        <Grid.Col span={2}><TextInput placeholder="Servicio" value={filters.servicio} onChange={e => handleFilterChange("servicio", e.currentTarget.value)} /></Grid.Col>
        <Grid.Col span={1}><TextInput placeholder="Sub" value={filters.subalmacen} onChange={e => handleFilterChange("subalmacen", e.currentTarget.value)} /></Grid.Col>
      </Grid>

      {/* TABLA */}
      <ScrollArea h={500} viewportRef={viewportRef} onScrollPositionChange={handleScroll}>
        {loading ? (
          <Center h={300}><Loader /></Center>
        ) : (
          <DataTable
            withTableBorder
            highlightOnHover
            striped
            records={visibleData}
            idAccessor="id"
            className="tabla-inventario"
            noRecordsText="No hay insumos disponibles"

            rowClassName={(record: Insumo) => {
              if (record.id === highlightId) return "row-highlight";
              if (changedIds.includes(record.id)) return "row-changed"; // 🔥 filas cambiadas
              return "";
            }}

            columns={[
              { accessor: "clave", title: "Clave" },
              { accessor: "insumo", title: "Insumo" },
              { accessor: "tipo_insumo", title: "Tipo" },
              { accessor: "unidad_distribucion", title: "Unidad" },
              { accessor: "servicio", title: "Servicio" },
              { accessor: "subalmacen", title: "Subalmacén" },

              {
                accessor: "stock",
                title: "Stock",
                textAlign: "center",
                render: (r: Insumo) => {
                  let color = "green";
                  let label = "OK";
                  if (r.stock <= r.minimo) { color = "red"; label = "Bajo"; }
                  else if (r.stock <= r.minimo + 20) { color = "yellow"; label = "Medio"; }
                  return <Badge color={color} variant="light">{r.stock} • {label}</Badge>;
                }
              },

              { accessor: "minimo", title: "Min", textAlign: "center" },
              { accessor: "maximo", title: "Max", textAlign: "center" },

              { accessor: "codigo_barras", title: "Código", render: (r: Insumo) => <Code fw={700}>{r.codigo_barras || "—"}</Code> },

              {
                accessor: "accion",
                title: "Acción",
                textAlign: "center",
                render: (record: Insumo) => (
                  <BotonAccion
                    record={record}
                    cart={cart}
                    addToCart={addToCart}
                    removeFromCart={removeFromCart}
                  />
                )
              }
            ]}
          />
        )}
      </ScrollArea>
    </Card>
  );
}