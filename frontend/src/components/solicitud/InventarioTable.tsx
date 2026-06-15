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
  Code,
  Drawer,
  NumberInput,
  Button, 
  Table,
  ThemeIcon

} from "@mantine/core";

import BotonAccion from "../botones/BotonAccion";
import { IconBuildingHospital,IconTrash, IconCheck,IconClipboardList } from "@tabler/icons-react";
import { DataTable } from "mantine-datatable";

import type { Insumo, CartItem } from "../../types/global";

interface Props {
  data: Insumo[];
  addToCart: (item: Insumo) => void;
  removeFromCart: (id: number) => void;

  cart: CartItem[];
  loading?: boolean;
  highlightId?: number;
  changedIds?: number[]; 
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

const [drawerSurtido, setDrawerSurtido] = useState(false);

const [surtidoItems, setSurtidoItems] = useState<
  (Insumo & { cantidad: number })[]
>([]);



  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const viewportRef = useRef<HTMLDivElement>(null);

  const abrirDrawerSurtido = (item: Insumo) => {
  setSurtidoItems(prev => {
    const existe = prev.find(i => i.id === item.id);

    if (existe) {
      return prev;
    }

    return [
      ...prev,
      {
        ...item,
        cantidad: 1
      }
    ];
  });

  setDrawerSurtido(true);
};

const actualizarCantidad = (
  id: number,
  cantidad: number
) => {
  if (!cantidad || cantidad < 1) {
    cantidad = 1;
  }

  if (cantidad > 40) {
    cantidad = 40;
  }

  setSurtidoItems(prev =>
    prev.map(item =>
      item.id === id
        ? {
            ...item,
            cantidad
          }
        : item
    )
  );
};

const eliminarSurtido = (id: number) => {
  setSurtidoItems(prev =>
    prev.filter(item => item.id !== id)
  );
};

const generarSurtimiento = async () => {
  if (!surtidoItems.length) return;

  console.log("SURTIMIENTO:", surtidoItems);

  /*
  await api.post(
    "/surtimientos",
    surtidoItems
  );
  */

  setDrawerSurtido(false);
};

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
     <>
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
              if (changedIds.includes(record.id)) return "row-changed"; 
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
                   else if (r.stock > r.maximo + 20) { color = "orange"; label = "Sobre abasto!!!"; }
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
    onSurtir={abrirDrawerSurtido}
  />
)
              }
            ]}
          />
        )}
      </ScrollArea>
       </Card>
       
       <Drawer
  opened={drawerSurtido}

  onClose={() => setDrawerSurtido(false)}
  position="bottom"
  size="70%"
  radius="24px 24px 0 0"
  shadow="xl"
  padding="md"
  title={null}
  closeButtonProps={{
  size: "lg",
  style: {
    backgroundColor: "#fff5f5",
    color: "#fa5252",
    borderRadius: "999px",
  },
}}
         
>
  {/* HEADER */}

  <Group mb="md" gap="sm">
    <ThemeIcon
      size="lg"
      radius="xl"
      color="blue"
      variant="light"
    >
      <IconClipboardList size={20} />
    </ThemeIcon>

    <div>
      <Text fw={700} size="lg">
        Surtir Insumos
      </Text>

      <Text size="xs" c="dimmed">
        Administra los insumos seleccionados
      </Text>
    </div>
  </Group>

  {/* CARD */}

  <Card
    withBorder
    radius="md"
    shadow="sm"
    style={{
      borderLeft: "6px solid #0b6fa4",
      background: "#f8fbfd",
    }}
  >
    <Table
      striped
      highlightOnHover
      verticalSpacing="sm"
      horizontalSpacing="md"
      style={{ textAlign: "center" }}
    >
      <thead
        style={{
          backgroundColor: "#0b6fa4",
          color: "white",
        }}
      >
        <tr>
          <th style={{ textAlign: "center" }}>
            Insumo
          </th>

          <th
            style={{
              textAlign: "center",
              width: 120,
            }}
          >
            Cantidad
          </th>

          <th
            style={{
              textAlign: "center",
              width: 120,
            }}
          >
            Acción
          </th>
        </tr>
      </thead>

      <tbody>
        {surtidoItems.map((item) => (
          <tr key={item.id}>
            <td>
              <Text fw={500}>
                {item.insumo}
              </Text>
            </td>

            <td>
              <NumberInput
                min={1}
                max={40}
                value={item.cantidad}
                size="xs"
                style={{
                  width: 90,
                  margin: "auto",
                }}
                onChange={(value) =>
                  actualizarCantidad(
                    item.id,
                    Number(value)
                  )
                }
              />
            </td>

            <td>
              <Button
                size="xs"
                color="red"
                variant="light"
                radius="xl"
                leftSection={<IconTrash size={14} />}
                onClick={() =>
                  eliminarSurtido(item.id)
                }
              >
                Eliminar
              </Button>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>

    <Button
      mt="md"
      fullWidth
      radius="xl"
      size="md"
      color="green"
      variant="light"
      leftSection={<IconCheck size={18} />}
      onClick={generarSurtimiento}
    >
      Generar surtimiento
    </Button>
  </Card>
</Drawer>

  </>
);
}