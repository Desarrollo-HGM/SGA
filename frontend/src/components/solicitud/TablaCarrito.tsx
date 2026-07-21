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
            <th style={{ textAlign: "center" }}>Stock</th>
            <th style={{ textAlign: "center", width: 310 }}>Cantidad</th>
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
                  <Text fw={500}>{item.stock}</Text>
                 

                </td>
          <td>
  <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
   
  <TextInput
  type="text"
  placeholder="Ingrese cantidad"
  value={item.cantidad === 0 ? "" : String(item.cantidad)}
  size="xs"
  style={{ width: 80 }}
  required
  onChange={(e) => {
    const val = e.currentTarget.value;

    // Solo permitir números o vacío
    if (/^\d*$/.test(val)) {
      // Si está vacío, lo tratamos como 0 pero el campo se queda vacío
      const num = val === "" ? 0 : Number(val);

      if (destino === "guarda") {
        // En guarda no permitir exceder stock
        if (num <= item.stock) {
          updateCantidad(item.id, num);
        }
      } else {
        // En central sí permitir exceder stock
        updateCantidad(item.id, num);
      }
    }
  }}
/>






    {item.cantidad === 0 ? (
      <Badge color="gray" variant="light" mt={4}>
        Pendiente
      </Badge>
    ) : destino === "guarda" ? (
      item.cantidad > item.stock ? (
        <Badge color="red" variant="light" mt={4}>
          ¡Excede stock disponible!
        </Badge>
      ) : (
        <Badge color="green" variant="light" mt={4}>
          ¡Permitido!
        </Badge>
      )
    ) : (
      item.cantidad > item.stock ? (
        <Badge color="orange" variant="light" mt={4}>
          Requiere justificación
        </Badge>
      ) : (
        <Badge color="green" variant="light" mt={4}>
          OK
        </Badge>
      )
    )}
  </div>
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
