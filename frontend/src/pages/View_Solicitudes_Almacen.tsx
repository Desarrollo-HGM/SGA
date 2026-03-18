import { useState, useMemo, useEffect } from "react";
import {
  AppShell,
  Group,
  Text,
  Indicator,
  Grid,
  Drawer
} from "@mantine/core";

import { IconPackages } from "@tabler/icons-react";


import BuscadorInsumos from "../components/solicitud/BuscadorInsumos";
import InventarioTable from "../components/solicitud/InventarioTable";
import CarritoSolicitud from "../components/solicitud/CarritoSolicitud";

import { inventarioMock } from "../components/solicitud/inventarioMock";
import { generarPDF } from "../js/generarPDF";

import type { CartItem, Insumo } from "../types/global";

export default function SolicitudesDashboard() {

  const [search, setSearch] = useState("");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [openedCart, setOpenedCart] = useState(false);

  const [solicitados, setSolicitados] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);


  

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

    return inventarioMock.filter(i =>
      i.insumo.toLowerCase().includes(q) ||
      i.servicio.toLowerCase().includes(q) ||
      i.subalmacen.toLowerCase().includes(q)
    );
  }, [search]);

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


 

        <BuscadorInsumos
          search={search}
          setSearch={setSearch}
        />

        <Grid>
          <Grid.Col span={12}>
            <InventarioTable
              data={filtered}
              addToCart={addToCart}
                cart={cart} // 🔥 NUEVO
            />
          </Grid.Col>
        </Grid>

        <Drawer
          opened={openedCart}
          onClose={() => setOpenedCart(false)}
          position="bottom"
          size="60%"
          padding="md"
          overlayProps={{ blur: 3 }}
        >

          {cart.length === 0 ? (

            <Text ta="center" mt="xl" c="dimmed">
              Agrega insumos al carrito
            </Text>

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

        </Drawer>

      </AppShell.Main>

    </AppShell>
  );
}