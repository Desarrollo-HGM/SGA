import { Button, Badge, Card, Group, Text } from "@mantine/core";
import {
  IconPlus,
  IconCheck,
  IconBuildingHospital
} from "@tabler/icons-react";
import { DataTable } from "mantine-datatable";

import type { Insumo, CartItem } from "../../types/global";

interface Props {
  data: Insumo[];
  addToCart: (item: Insumo) => void;
  cart: CartItem[];
}

export default function InventarioTable({
  data,
  addToCart,
  cart
}: Props) {

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

      {/* HEADER */}
      <Group justify="space-between" mb="sm">
        <Group>
          <IconBuildingHospital size={22} color="#0b6fa4" />

          <Text fw={700} size="lg" c="#0b6fa4">
            Inventario
          </Text>
        </Group>

        <Badge color="blue" variant="light">
          {data.length} insumos
        </Badge>
      </Group>

      {/* TABLA */}
      <DataTable
        withTableBorder
        highlightOnHover
        striped
        verticalSpacing="xs"
        horizontalSpacing="md"
        records={data}
        columns={[

          { accessor: "clave", title: "Clave" },

          { accessor: "insumo", title: "Insumo" },

          { accessor: "tipo_insumo", title: "Tipo" },

          { accessor: "unidad_distribucion", title: "Unidad" },

          { accessor: "servicio", title: "Servicio" },

          { accessor: "subalmacen", title: "Subalmacén" },

          {
            accessor: "lote",
            title: "Lote",
            textAlign: "center"
          },

          {
            accessor: "stock",
            title: "Stock",
            textAlign: "center",
            render: (r: Insumo) => (
              <Badge
                variant="light"
                color={
                  r.stock <= r.minimo
                    ? "red"
                    : r.stock <= r.minimo + 20
                    ? "yellow"
                    : "green"
                }
              >
                {r.stock}
              </Badge>
            )
          },

          {
            accessor: "minimo",
            title: "Min",
            textAlign: "center"
          },

          {
            accessor: "maximo",
            title: "Max",
            textAlign: "center"
          },

          /* 🔥 BOTÓN DINÁMICO FINAL */
          {
            accessor: "accion",
            title: "Acción",
            textAlign: "center",

            render: (record: Insumo) => {

              const sinStock = record.stock <= 0;

              const enCarrito = cart.some(
                (i) => i.id === record.id
              );

              return (
                <Button
                  size="xs"
                  radius="xl"

                  color={
                    sinStock
                      ? "gray"
                      : enCarrito
                      ? "blue"
                      : "teal"
                  }

                  variant={enCarrito ? "filled" : "light"}

                  leftSection={
                    enCarrito
                      ? <IconCheck size={14} />
                      : <IconPlus size={14} />
                  }

                  disabled={sinStock}

                  onClick={() => addToCart(record)}
                >
                  {sinStock
                    ? "Sin stock"
                    : enCarrito
                    ? "Agregado"
                    : "Solicitar"}
                </Button>
              );
            }
          }

        ]}
      />

    </Card>
  );
}