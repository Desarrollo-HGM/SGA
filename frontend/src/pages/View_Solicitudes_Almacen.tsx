import { useState, useMemo, useEffect, useRef } from "react";
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
  IconCheck,
  IconBell
} from "@tabler/icons-react";

import InventarioTable from "../components/solicitud/InventarioTable";
import CarritoSolicitud from "../components/solicitud/CarritoSolicitud";
import CampanaSolicitudes from "../components/campana/CampanaSolicitudes";

import { useInventario } from "../hooks/useInventario";
import { generarPDF } from "../utils/generarPDF";

import { getSolicitudes } from "../services/solicitudes";
import type { Solicitud } from "../services/solicitudes";

import api from "../config/api";
import type { CartItem, Insumo } from "../types/global";

export default function SolicitudesDashboard() {

  const [search] = useState("");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [openedCart, setOpenedCart] = useState(false);
  const [openedCampana, setOpenedCampana] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const [highlightId, setHighlightId] = useState<number | undefined>();

  const { data, loading, error } = useInventario();

  const beep = new Audio("/beep.mp3");
  const errorSound = new Audio("/error.mp3");

  /* 🔔 SOLICITUDES */
  const [solicitudes, setSolicitudes] = useState<Solicitud[]>([]);
  const prevCountRef = useRef(0);

  /* ===============================
     🔔 FETCH SOLICITUDES
  =============================== */
  useEffect(() => {

    const fetch = async () => {
      const data = await getSolicitudes();

      const sorted = data.sort((a, b) =>
        new Date(b.fecha_solicitud).getTime() -
        new Date(a.fecha_solicitud).getTime()
      );

      setSolicitudes(sorted);
    };

    fetch();

    const interval = setInterval(fetch, 10000);

    return () => clearInterval(interval);

  }, []);

  /* 🔊 NUEVAS NOTIFICACIONES */
  useEffect(() => {
    if (solicitudes.length > prevCountRef.current) {
      beep.play().catch(() => {});
    }

    prevCountRef.current = solicitudes.length;
  }, [solicitudes]);

  /* ===============================
     FILTRO
  =============================== */
  const filtered = useMemo(() => {
    const q = search.toLowerCase();

    return data.filter(i =>
      i.insumo.toLowerCase().includes(q) ||
      i.servicio.toLowerCase().includes(q) ||
      i.subalmacen.toLowerCase().includes(q)
    );
  }, [search, data]);

  /* ===============================
     🟢 CARRITO
  =============================== */
  const addToCart = (item: Insumo) => {
    setCart(prev => {
      const exist = prev.find(i => i.id === item.id);

      if (exist) {
        if (exist.cantidad >= item.stock) {
          alert("Stock insuficiente");
          return prev;
        }

        return prev.map(i =>
          i.id === item.id
            ? { ...i, cantidad: i.cantidad + 1 }
            : i
        );
      }

      return [...prev, { ...item, cantidad: 1 }];
    });
  };

  const removeFromCart = (id: number) => {
    setCart(prev => prev.filter(i => i.id !== id));
  };

  const updateCantidad = (id: number, val: number) => {
    if (val <= 0) return;

    setCart(prev =>
      prev.map(i =>
        i.id === id ? { ...i, cantidad: val } : i
      )
    );
  };

  /* ===============================
     🔥 ESCANER
  =============================== */
  const onScan = async (codigo: string) => {
    if (!codigo) return;

    try {
      const res = await api.get(`/inventario/codigo/${codigo}`);
      const producto: Insumo = res.data;

      addToCart(producto);
      setHighlightId(producto.id);

      beep.play().catch(() => {});
      setTimeout(() => setHighlightId(undefined), 2000);

    } catch (error) {
      console.error("Producto no encontrado");
      errorSound.play().catch(() => {});
    }
  };

  /* ===============================
     PDF
  =============================== */
  const handleGenerarPDF = async () => {

    if (cart.length === 0) return;

    setIsSubmitting(true);

    const result = await generarPDF({ cart });

    setIsSubmitting(false);

    if (result) {
      setIsSubmitted(true);

      setTimeout(() => {
        setCart([]);
        setOpenedCart(false);
        setIsSubmitted(false);
      }, 1500);
    }
  };

  return (
    <AppShell padding="md">
      <AppShell.Main>

        {/* 🔝 HEADER */}
        <Group justify="apart" mb="lg">

          <Text fw={700} size="xl">
            Dashboard
          </Text>

          <Group>

            {/* 🔔 CAMPANA */}
            <Indicator
              inline
              label={solicitudes.length || undefined}
              size={16}
              color="orange"
            >
              <IconBell
                size={28}
                style={{ cursor: "pointer" }}
                onClick={() => setOpenedCampana(true)}
              />
            </Indicator>

            {/* 🛒 CARRITO */}
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
                onClick={() => setOpenedCart(true)}
              />
            </Indicator>

          </Group>
        </Group>

        {/* 📊 TABLA */}
        <Grid>
          <Grid.Col span={12}>
            <InventarioTable
              data={filtered}
              addToCart={addToCart}
              removeFromCart={removeFromCart}
              cart={cart}
              loading={loading}
              onScan={onScan}
              highlightId={highlightId}
            />

            {error && (
              <Text c="red" ta="center">
                {error}
              </Text>
            )}
          </Grid.Col>
        </Grid>

        {/* 🛒 DRAWER CARRITO */}
        <Drawer
          opened={openedCart}
          onClose={() => setOpenedCart(false)}
          position="bottom"
          size="65%"
          radius="lg"
          overlayProps={{ blur: 3 }}
          withCloseButton={false}
        >

          <Group justify="space-between" mb="md">
            <Group>
              <ThemeIcon size="lg" radius="xl" color="teal" variant="light">
                <IconPackages size={20} />
              </ThemeIcon>

              <Text fw={700} size="lg">
                Nueva solicitud
              </Text>
            </Group>

            <ActionIcon
              variant="light"
              color="red"
              size="lg"
              radius="xl"
              onClick={() => setOpenedCart(false)}
            >
              <IconX size={18} />
            </ActionIcon>
          </Group>

          {cart.length === 0 ? (
            <Stack align="center" justify="center" h={200}>
              <ThemeIcon size={60} radius="xl" variant="light" color="gray">
                <IconPackages size={30} />
              </ThemeIcon>

              <Text c="dimmed" fw={500}>
                ¡Agregar insumos para generar una solicitud!
              </Text>
            </Stack>
          ) : (
            <CarritoSolicitud
              cart={cart}
              setCart={setCart}
              removeFromCart={removeFromCart}
              updateCantidad={updateCantidad}
              generarPDF={handleGenerarPDF}
              isSubmitting={isSubmitting}
              isSubmitted={isSubmitted}
            />
          )}

          {isSubmitted && (
            <Group justify="center" mt="md">
              <ThemeIcon color="green" radius="xl" size="lg">
                <IconCheck size={18} />
              </ThemeIcon>

              <Text c="green" fw={600}>
                Solicitud generada correctamente
              </Text>
            </Group>
          )}

        </Drawer>

        {/* 🔔 DRAWER CAMPANA */}


 <Drawer
          opened={openedCampana}
          onClose={() => setOpenedCampana(false)}
          position="bottom"
          size="65%"
          radius="lg"
          overlayProps={{ blur: 3 }}
          withCloseButton={false}
        >

          <Group justify="space-between" mb="md">
            <Group>
              <ThemeIcon size="lg" radius="xl" color="teal" variant="light">
                <IconPackages size={20} />
              </ThemeIcon>

              <Text fw={700} size="lg">
                Nueva solicitud
              </Text>
            </Group>

            <ActionIcon
              variant="light"
              color="red"
              size="lg"
              radius="xl"
              onClick={() => setOpenedCampana(false)}
            >
              <IconX size={18} />
            </ActionIcon>
          </Group>

          {solicitudes.length === 0 ? (
  <Stack align="center" justify="center" h={200}>
    <ThemeIcon size={60} radius="xl" variant="light" color="gray">
      <IconBell size={30} />
    </ThemeIcon>

    <Text c="dimmed" fw={500}>
      No hay solicitudes registradas
    </Text>
  </Stack>
) : (
  <CampanaSolicitudes data={solicitudes} />
)}

          {isSubmitted && (
            <Group justify="center" mt="md">
              <ThemeIcon color="green" radius="xl" size="lg">
                <IconCheck size={18} />
              </ThemeIcon>

              <Text c="green" fw={600}>
                Solicitud generada correctamente
              </Text>
            </Group>
          )}

        </Drawer>











      </AppShell.Main>
    </AppShell>
  );
}