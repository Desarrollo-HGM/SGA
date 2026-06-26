import {
  Table,
  Button,
  TextInput,
  Card,
  Text,
  Badge,
  Textarea,
  Modal,
} from "@mantine/core";

import {
  IconTrash,
  IconFileInvoice,
  IconCheck,
} from "@tabler/icons-react";

import { useState } from "react";
import type { CartItem } from "../../types/global";
import type { User } from "../../types/User";
import type { Dispatch, SetStateAction } from "react";

interface Props {
  cart: CartItem[];
  updateCantidad: (id: number, cantidad: number) => void;
  removeFromCart: (id: number) => void;
  setCart: Dispatch<SetStateAction<CartItem[]>>;
  onEnviarSolicitud: () => void;
  isSubmitting: boolean;
  isSubmitted: boolean;
}

const user: User = JSON.parse(localStorage.getItem("user") || "{}");

export default function CarritoSolicitud({
  cart,
  updateCantidad,
  removeFromCart,
  onEnviarSolicitud,
  isSubmitting,
  isSubmitted,
}: Props) {
  const [justificacionGeneral, setJustificacionGeneral] = useState("");
  const [destino, setDestino] = useState<"central" | "guarda" | null>(null);
  const [search, setSearch] = useState("");

  const requiereJustificacion =
    destino === "central" &&
    cart.some(
      (item) =>
        item.stock + item.cantidad > item.maximo ||
        item.cantidad > item.stock
    );

  const filteredCart = cart.filter((item) =>
    item.insumo.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      {/* ================= MODAL ================= */}
      <Modal
        opened={destino === null}
        onClose={() => {}}
        withCloseButton={false}
        centered
        title="Seleccione destino de la solicitud"
      >
        <Button
          fullWidth
          mb="sm"
          color="blue"
          onClick={() => setDestino("central")}
        >
          Almacén Central
        </Button>
        <Button
          fullWidth
          color="orange"
          onClick={() => setDestino("guarda")}
        >
          Guarda
        </Button>
      </Modal>

      <Card
        withBorder
        radius="md"
        shadow="sm"
        mt="md"
        style={{
          borderLeft: "6px solid #0b6fa4",
          background: "#f8fbfd",
        }}
      >
        <Badge color="blue" variant="light" mb="md">
          Fecha solicitud: {new Date().toLocaleString("es-MX")}
        </Badge>

        {/* ================= JUSTIFICACIÓN GENERAL ================= */}
        {requiereJustificacion && (
          <Card
            withBorder
            radius="md"
            mb="md"
            p="md"
            style={{
              background: "#fff8e6",
              borderColor: "#f0c36d",
            }}
          >
            <Text fw={600} mb="sm">
              Justificación requerida
            </Text>

            <Textarea
              size="sm"
              minRows={3}
              autosize
              placeholder="Ingrese la justificación general"
              value={justificacionGeneral}
              onChange={(e) =>
                setJustificacionGeneral(e.currentTarget.value)
              }
            />
          </Card>
        )}

        {/* ================= BUSCADOR ================= */}
        <TextInput
          placeholder="Buscar insumo..."
          value={search}
          onChange={(e) => setSearch(e.currentTarget.value)}
          mb="sm"
        />

        {/* ================= TABLA ================= */}
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
                        <Badge color="green" variant="light">OK</Badge>
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
      </Card>

      {/* ================= BOTÓN FLOTANTE ================= */}

<div
  style={{
    position: "fixed",
    bottom: 20,
    right: 20,
  }}
>
  <Button
    radius="xl"
    size="md"
    loading={isSubmitting}
    disabled={isSubmitting || isSubmitted || cart.length === 0}
    color={isSubmitted ? "teal" : "green"}
    variant={isSubmitted ? "filled" : "light"}
    leftSection={
      isSubmitted ? <IconCheck size={18} /> : <IconFileInvoice size={18} />
    }
    onClick={onEnviarSolicitud}
  >
    {isSubmitted ? "Solicitud enviada" : "Generar solicitud"}
  </Button>
</div>

    </>
  );
}
 