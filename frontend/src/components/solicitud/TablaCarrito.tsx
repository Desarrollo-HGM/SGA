import { Table, Text, TextInput, Badge, Button } from "@mantine/core";
import { IconTrash } from "@tabler/icons-react";
import type { CartItem } from "../../types/global";

interface Props {
  filteredCart: CartItem[];
  destino: "central" | "guarda" | null;
  updateCantidad: (id: number, cantidad: number) => void;
  removeFromCart: (id: number) => void;
}

export default function TablaCarrito({
  filteredCart,
  destino,
  updateCantidad,
  removeFromCart,
}: Props) {
  return (
    <div style={{ maxHeight: 300, overflowY: "auto" }}>
      <Table
        striped
        highlightOnHover
        verticalSpacing="sm"
        horizontalSpacing="md"
        style={{ textAlign: "center" }}
      >
        <thead
          style={{
            position: "sticky",
            top: 0,
            backgroundColor: "#0b6fa4",
            color: "white",
            zIndex: 1,
          }}
        >
          <tr>
            <th style={{ textAlign: "center" }}>Insumo</th>
            <th style={{ textAlign: "center", width: 110 }}>Cantidad</th>
            <th style={{ textAlign: "center" }}>Estado</th>
            <th style={{ textAlign: "center", width: 120 }}>Acción</th>
          </tr>
        </thead>
        <tbody>
          {filteredCart.map((item) => {
            const requiere =
              destino === "central" &&
              (item.stock + item.cantidad > item.maximo ||
                item.cantidad > item.stock);

            return (
              <tr key={item.id}>
                <td>
                  <Text fw={500}>{item.insumo}</Text>
                </td>
                <td>
                  <TextInput
                    type="number"
                    value={item.cantidad === 0 ? "" : item.cantidad}
                    size="xs"
                    style={{ width: 80, margin: "auto" }}
                    min={0}
                    required
                    onChange={(e) =>
                      updateCantidad(
                        item.id,
                        e.currentTarget.value === ""
                          ? 0
                          : Number(e.currentTarget.value)
                      )
                    }
                  />
                </td>
                <td>
                  {requiere ? (
                    <Badge color="orange" variant="light">
                      Requiere justificación
                    </Badge>
                  ) : (
                    <Badge color="green" variant="light">
                      OK
                    </Badge>
                  )}
                </td>
                <td>
                  <Button
                    size="xs"
                    color="red"
                    variant="light"
                    radius="xl"
                    leftSection={<IconTrash size={14} />}
                    onClick={() => removeFromCart(item.id)}
                  >
                    Eliminar
                  </Button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </Table>
    </div>
  );
}
