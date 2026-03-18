import {
  Table,
  Button,
  TextInput,
  Card,
  Text,
  Badge,
  Stack
} from "@mantine/core";

import {
  IconTrash,
  IconFileInvoice,
  IconCheck
} from "@tabler/icons-react";

import type { CartItem } from "../../types/global";
import type { Dispatch, SetStateAction } from "react";

interface Props {
  cart: CartItem[];
  updateCantidad: (id: number, cantidad: number) => void;
  removeFromCart: (id: number) => void;
  setCart: Dispatch<SetStateAction<CartItem[]>>;
  generarPDF: () => void;
  isSubmitting: boolean;
  isSubmitted: boolean;
}

export default function CarritoSolicitud({
  cart,
  updateCantidad,
  removeFromCart,
  setCart,
  generarPDF,
  isSubmitting,
  isSubmitted
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

      {/* TITULO */}
      <Text fw={700} mb="sm">
        Carrito de solicitud
      </Text>

      {/* TABLA */}

      <Table
        striped
        highlightOnHover
        verticalSpacing="sm"
        horizontalSpacing="md"
        style={{ textAlign: "center" }}
      >
        <thead style={{ backgroundColor: "#0b6fa4", color: "white" }}>
          <tr>
            <th style={{ textAlign: "center", borderTopLeftRadius: "8px" }}>
              Insumo
            </th>

            <th style={{ textAlign: "center", width: 110 }}>
              Cantidad
            </th>

            <th style={{ textAlign: "center" }}>
              Justificación
            </th>

            <th style={{ textAlign: "center", width: 120 }}>
              Acción
            </th>
          </tr>
        </thead>

        <tbody>
          {cart.map((item) => {

            const requiereJustificacion =
              item.stock + item.cantidad > item.maximo ||
              item.cantidad > item.stock;

            return (
              <tr key={item.id}>

                {/* INSUMO */}
                <td>
                  <Text fw={500}>{item.insumo}</Text>
                </td>

                {/* CANTIDAD */}
                <td>
                  <TextInput
                    type="number"
                    value={item.cantidad}
                    size="xs"
                    style={{ width: 80, margin: "auto" }}
                    onChange={(e) =>
                      updateCantidad(
                        item.id,
                        Number(e.currentTarget.value)
                      )
                    }
                  />
                </td>

                {/* JUSTIFICACION */}
                <td>
                  {requiereJustificacion ? (
                    <Stack gap={4}>
                      <Badge
                        color="orange"
                        variant="light"
                        radius="sm"
                      >
                        Requiere justificación
                      </Badge>

                      <TextInput
                        size="xs"
                        placeholder={
                          item.cantidad > item.stock
                            ? `Stock disponible: ${item.stock}`
                            : `Máximo permitido: ${item.maximo}`
                        }
                        value={item.justificacion || ""}
                        onChange={(e) => {
                          const value = e.currentTarget.value;

                          setCart((prev) =>
                            prev.map((i) =>
                              i.id === item.id
                                ? { ...i, justificacion: value }
                                : i
                            )
                          );
                        }}
                      />
                    </Stack>
                  ) : (
                    <Badge color="green" variant="light">
                      OK
                    </Badge>
                  )}
                </td>

                {/* ACCION */}
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

      {/* BOTON GENERAR */}

      <Button
        mt="md"
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
        onClick={generarPDF}
      >
        {isSubmitted ? "Solicitud enviada" : "Generar solicitud"}
      </Button>

    </Card>
  );
}