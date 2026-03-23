import { useState, useMemo, useEffect } from "react";
import {
  AppShell,
  Group,
  Text,
  Indicator,
  Grid,
  Drawer,
ThemeIcon,

Box
} from "@mantine/core";

import { IconPackages } from "@tabler/icons-react";
import { IconPackage, IconShoppingCart } from "@tabler/icons-react";


import InventarioTable from "../components/solicitud/InventarioTable";
import CarritoSolicitud from "../components/solicitud/CarritoSolicitud";

import { useInventario } from "../hooks/useInventario";
import { generarPDF } from "../js/generarPDF";

import type { CartItem, Insumo } from "../types/global";

export default function SolicitudesDashboard() {

  const [search, setSearch] = useState("");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [openedCart, setOpenedCart] = useState(false);

  const [solicitados, setSolicitados] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
   const { data, loading, error } = useInventario();

  

  /* ===============================
     DEBUG (puedes quitar después)
  =============================== */

  useEffect(() => {
    console.log("CART:", cart);
  }, [cart]);

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
     ✅ FIX REAL AQUÍ
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

      } else {

        return [...prev, { ...item, cantidad: 1 }];

      }

    });

  };

  /* =============================== */

  const removeFromCart = (id: number) => {
    setCart(prev => prev.filter(i => i.id !== id));
  };

  /* =============================== */

  const updateCantidad = (id: number, val: number) => {

    if (val <= 0) return;

    setCart(prev =>
      prev.map(i =>
        i.id === id
          ? { ...i, cantidad: val }
          : i
      )
    );
  };

  /* ===============================
     GENERAR PDF
  =============================== */

const handleGenerarPDF = async () => {

  if (cart.length === 0) return;

  setIsSubmitting(true);

  const result = await generarPDF({
    cart
  });

  setIsSubmitting(false);

  if (result) {

    setSolicitados(prev => prev + 1);
    setIsSubmitted(true);

    setTimeout(() => {
      setCart([]);
      setOpenedCart(false);
      setIsSubmitted(false);
    }, 1500);
  }

};
  /* ===============================
     UI
  =============================== */

  return (

    <AppShell padding="md">

      <AppShell.Main>

        <Group justify="apart" mb="lg">

          <Text fw={700} size="xl">
            Dashboard
          </Text>

          {/* 🔥 PARA DEBUG USA cart.length */}
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


 

        <Grid>
          <Grid.Col span={12}>
            <InventarioTable
  data={filtered}
  addToCart={addToCart}
  cart={cart}
  loading={loading} // 🔥 IMPORTANTE
/>

{error && (
  <Text c="red" ta="center" mb="sm">
    {error}
  </Text>
)}          </Grid.Col>
        </Grid>

     

<Drawer
  opened={openedCart}
  onClose={() => setOpenedCart(false)}
  position="bottom"
  size="65%"
  padding="0"
  radius="xl"
  overlayProps={{ blur: 4, opacity: 0.55 }}
  styles={{
    content: {
      backgroundColor: "#f4f6f8",
    },
    body: {
      padding: 0,
    },
  }}
>
  {/* HEADER */}
  <Box
    px="md"
    py="sm"
    style={{
      borderBottom: "1px solid #e0e0e0",
      backgroundColor: "#ffffff",
    }}
  >
    <Group justify="space-between">
      <Group gap="xs">
        <ThemeIcon size="lg" radius="xl" variant="light" color="blue">
          <IconPackage size={20} />
        </ThemeIcon>

        <div>
          <Text fw={600}>Solicitud</Text>
          <Text size="xs" c="dimmed">
            Insumos seleccionados
          </Text>
        </div>
      </Group>

      <ThemeIcon variant="light" color="gray" radius="xl">
         <IconPackages size={18} />
      </ThemeIcon>
    </Group>
  </Box>

  {/* CONTENIDO */}
  <Box
    p="md"
    style={{
      maxHeight: "65vh",
      overflowY: "auto",
    }}
  >
    {cart.length === 0 ? (
      <Box
        style={{
          textAlign: "center",
          padding: "40px 20px",
          borderRadius: "12px",
          backgroundColor: "#ffffff",
          border: "1px dashed #d0d5dd",
        }}
      >
        <ThemeIcon
          size={60}
          radius="xl"
          variant="light"
          color="gray"
          mb="sm"
        >
            <IconPackages size={18} />
        </ThemeIcon>

        <Text fw={500} mb={4}>
          No hay insumos agregados!!
        </Text>

        <Text size="sm" c="dimmed">
          Agrega insumos desde el inventario para generar una solicitud
        </Text>
      </Box>
    ) : (
      <>
        <CarritoSolicitud
          cart={cart}
          setCart={setCart}
          removeFromCart={removeFromCart}
          updateCantidad={updateCantidad}
          generarPDF={handleGenerarPDF}
          isSubmitting={isSubmitting}
          isSubmitted={isSubmitted}
        />
      </>
    )}
  </Box>
</Drawer>

      </AppShell.Main>

    </AppShell>
  );
}