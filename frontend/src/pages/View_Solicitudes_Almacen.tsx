import { useState, useMemo } from "react";
import {
  AppShell,
  Group,
  Text,
  Indicator,
  Grid,
  Drawer,
  ThemeIcon,
  ActionIcon,
  Stack
} from "@mantine/core";

import {
  IconPackages,
  IconX,
  IconCheck
} from "@tabler/icons-react";

import InventarioTable from "../components/solicitud/InventarioTable";
import CarritoSolicitud from "../components/solicitud/CarritoSolicitud";

import { useInventario } from "../hooks/useInventario";
import { enviarSolicitudFinal } from "../services/solicitudesService";
import { generarPDF } from "../utils/generarPDF";

import type { CartItem, Insumo } from "../types/global";
import type { User } from "../types/User";

export default function SolicitudesDashboard() {

  const [search] = useState("");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [openedCart, setOpenedCart] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const { data, loading, error, changedIds } =
    useInventario();

  const user: User = JSON.parse(
    localStorage.getItem("user") || "{}"
  );

  /* ===============================
     FILTRO
  =============================== */
  const filtered = useMemo(() => {

    const q = search.toLowerCase();

    return data.filter((i) =>
      i.insumo.toLowerCase().includes(q) ||
      i.servicio.toLowerCase().includes(q) ||
      i.subalmacen.toLowerCase().includes(q)
    );

  }, [search, data]);

  /* ===============================
     CARRITO
  =============================== */
  const addToCart = (item: Insumo) => {

    setCart((prev) => {

      const exist =
        prev.find((i) => i.id === item.id);

      if (exist) {

        if (exist.cantidad >= item.stock) {

          alert("Stock insuficiente");

          return prev;
        }

        return prev.map((i) =>
          i.id === item.id
            ? {
                ...i,
                cantidad: i.cantidad + 1
              }
            : i
        );
      }

      return [
        ...prev,
        {
          ...item,
          cantidad: 1
        }
      ];

    });

  };

  const removeFromCart = (id: number) => {

    setCart((prev) =>
      prev.filter((i) => i.id !== id)
    );

  };

  const updateCantidad = (
    id: number,
    cantidad: number
  ) => {

    if (cantidad <= 0) return;

    setCart((prev) =>
      prev.map((i) =>
        i.id === id
          ? {
              ...i,
              cantidad
            }
          : i
      )
    );

  };

  /* ===============================
     ENVIAR SOLICITUD
  =============================== */
  const handleEnviarSolicitud = async () => {
  try {
    if (cart.length === 0) {
      alert("Debe agregar al menos un insumo");
      return;
    }

    setIsSubmitting(true);

    await enviarSolicitudFinal(cart, user);
console.log(cart);
    await generarPDF({ cart });

    setIsSubmitted(true);

    setTimeout(() => {
      setCart([]);
      setOpenedCart(false);
      setIsSubmitted(false);
    }, 2000);

  } catch (error: any) {
    console.error("ERROR COMPLETO:", error);
    alert(error.response?.data?.message || error.message || "Error al enviar solicitud");
  } finally {
    setIsSubmitting(false);
  }
};


  return (
    <AppShell padding="md">

      <AppShell.Main>

        {/* HEADER */}
        <Group justify="apart" mb="lg">

          <Text fw={700} size="xl">
            Dashboard
          </Text>

          <Indicator
            label={cart.length}
            size={16}
            color="teal"
            offset={4}
            withBorder
          >
            <IconPackages
              size={28}
              style={{ cursor: "pointer" }}
              onClick={() =>
                setOpenedCart(true)
              }
            />
          </Indicator>

        </Group>

        {/* TABLA */}
        <Grid>

          <Grid.Col span={12}>

            <InventarioTable
              data={filtered}
              addToCart={addToCart}
              removeFromCart={removeFromCart}
              cart={cart}
              loading={loading}
              changedIds={changedIds}
            />

            {error && (
              <Text
                c="red"
                ta="center"
              >
                {error}
              </Text>
            )}

          </Grid.Col>

        </Grid>

        {/* DRAWER */}
        <Drawer
          opened={openedCart}
          onClose={() =>
            setOpenedCart(false)
          }
          position="bottom"
          size="65%"
          radius="lg"
          overlayProps={{
            blur: 3
          }}
          withCloseButton={false}
        >

          <Group
            justify="space-between"
            mb="md"
          >

            <Group>

              <ThemeIcon
                size="lg"
                radius="xl"
                color="teal"
                variant="light"
              >
                <IconPackages size={20} />
              </ThemeIcon>

              <Text
                fw={700}
                size="lg"
              >
                Nueva solicitud
              </Text>

            </Group>

            <ActionIcon
              variant="light"
              color="red"
              size="lg"
              radius="xl"
              onClick={() =>
                setOpenedCart(false)
              }
            >
              <IconX size={18} />
            </ActionIcon>

          </Group>

          {cart.length === 0 ? (

            <Stack
              align="center"
              justify="center"
              h={200}
            >

              <ThemeIcon
                size={60}
                radius="xl"
                variant="light"
                color="gray"
              >
                <IconPackages size={30} />
              </ThemeIcon>

              <Text
                c="dimmed"
                fw={500}
              >
                ¡Agregar insumos para generar una solicitud!
              </Text>

            </Stack>

          ) : (

            <CarritoSolicitud
              cart={cart}
              setCart={setCart}
              removeFromCart={removeFromCart}
              updateCantidad={updateCantidad}
              onEnviarSolicitud={handleEnviarSolicitud}
              isSubmitting={isSubmitting}
              isSubmitted={isSubmitted}
            />

          )}

          {isSubmitted && (

            <Group
              justify="center"
              mt="md"
            >

              <ThemeIcon
                color="green"
                radius="xl"
                size="lg"
              >
                <IconCheck size={18} />
              </ThemeIcon>

              <Text
                c="green"
                fw={600}
              >
                Solicitud enviada correctamente
              </Text>

            </Group>

          )}

        </Drawer>

      </AppShell.Main>

    </AppShell>
  );
}