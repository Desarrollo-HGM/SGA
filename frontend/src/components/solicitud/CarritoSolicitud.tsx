import {
  Table,
  Button,
  TextInput,
  Card,
  Text,
  Badge,
  Textarea,
  Modal,
  SimpleGrid
} from "@mantine/core";

import {
  IconTrash,
  IconFileInvoice,
  IconCheck,
   IconBuildingWarehouse, IconShieldCheck
} from "@tabler/icons-react";

import { useState, useEffect } from "react"; // 1. Importamos useEffect
import type { CartItem } from "../../types/global";
import type { Dispatch, SetStateAction } from "react";

interface Props {
  cart: CartItem[];
  updateCantidad: (id: number, cantidad: number) => void;
  removeFromCart: (id: number) => void;
  setCart: Dispatch<SetStateAction<CartItem[]>>;
  // 2. Modificamos el callback para que envíe los nuevos datos al componente padre
  onEnviarSolicitud: (tipoSolicitud: string, justificacion: string) => void;
  isSubmitting: boolean;
  isSubmitted: boolean;
}

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
  const [tipoSolicitud, setTipoSolicitud] = useState(""); // 3. Estado para el tipo de solicitud
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (cart.length === 0) {
      setDestino(null);
      setJustificacionGeneral("");
      setTipoSolicitud("");
    }
  }, [cart]);

  // 4. Efecto para cambiar automáticamente el tipo de solicitud según el destino
  useEffect(() => {
    if (destino === "central") {
      setTipoSolicitud("ReabastecimientoManual");
    } else if (destino === "guarda") {
      setTipoSolicitud("Clinica");
    }
  }, [destino]);

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
  radius="lg"
  padding="xl"
  overlayProps={{
    blur: 4,
    opacity: 0.55,
  }}
  title={
    <Text fw={700} size="lg" c="dimmed" style={{ letterSpacing: "0.5px" }}>
      DESTINO DE LA SOLICITUD
    </Text>
  }
>
  <Text size="sm" c="dimmed" mb="xl" ta="center">
    Por favor, seleccione el almacén de destino para procesar los insumos de este pedido.
  </Text>

  <SimpleGrid cols={2} spacing="md">
    <Button
      variant="light"
      color="blue"
      size="xl"
      radius="md"
      h={100}
      styles={{
        root: { flexDirection: "column", gap: "8px" },
        inner: { flexDirection: "column" }
      }}
      leftSection={<IconBuildingWarehouse size={32} stroke={1.5} />}
      onClick={() => setDestino("central")}
    >
      <Text fw={600} size="sm">Almacén Central</Text>
    </Button>

    <Button
      variant="light"
      color="orange"
      size="xl"
      radius="md"
      h={100}
      styles={{
        root: { flexDirection: "column", gap: "8px" },
        inner: { flexDirection: "column" }
      }}
      leftSection={<IconShieldCheck size={32} stroke={1.5} />}
      onClick={() => setDestino("guarda")}
    >
      <Text fw={600} size="sm">Guarda</Text>
    </Button>
  </SimpleGrid>
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

        {/* ================= TIPO DE SOLICITUD (NUEVO INPUT) ================= */}
        {destino && (
          <TextInput
            label="Tipo de Solicitud"
            value={tipoSolicitud}
            readOnly // Evita que el usuario lo modifique escribiendo
            variant="filled" // Le da un aspecto visual de campo deshabilitado/automático
            mb="md"
            fw={600}
          />
        )}

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
          // 5. Enviamos las variables locales en la función submit
          onClick={() => onEnviarSolicitud(tipoSolicitud, justificacionGeneral)}
        >
          {isSubmitted ? "Solicitud enviada" : "Generar solicitud"}
        </Button>
      </div>
    </>
  );
}
