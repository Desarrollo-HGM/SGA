import { useState, useEffect } from "react";
import { Card, Badge } from "@mantine/core";
import type { CartItem } from "../../types/global";
import type { Dispatch, SetStateAction } from "react";

import ModalDestinoSolicitud from "./ModalDestinoSolicitud";
import TipoSolicitudField from  "./TipoSolicitudField"; 
import JustificacionGeneralCard   from "./JustificacionGeneralCard";
import BuscadorInsumos from   "./BuscadorInsumos";
import TablaCarrito from  "./TablaCarrito";
import BotonEnviarSolicitud from "../botones/BotonEnviarSolicitud";



interface Props {
  cart: CartItem[];
  updateCantidad: (id: number, cantidad: number) => void;
  removeFromCart: (id: number) => void;
  setCart: Dispatch<SetStateAction<CartItem[]>>;
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
  const [tipoSolicitud, setTipoSolicitud] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (cart.length === 0) {
      setDestino(null);
      setJustificacionGeneral("");
      setTipoSolicitud("");
    }
  }, [cart]);

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
        item.stock + item.cantidad > item.maximo || item.cantidad > item.stock
    );

  const filteredCart = cart.filter((item) =>
    item.insumo.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <ModalDestinoSolicitud destino={destino} setDestino={setDestino} setTipoSolicitud={setTipoSolicitud} />

      <Card
        withBorder
        radius="md"
        shadow="sm"
        mt="md"
        style={{ borderLeft: "6px solid #0b6fa4", background: "#f8fbfd" }}
      >
        <Badge color="blue" variant="light" mb="md">
          Fecha solicitud: {new Date().toLocaleString("es-MX")}
        </Badge>

        {destino && <TipoSolicitudField tipoSolicitud={tipoSolicitud} />}

        {requiereJustificacion && (
          <JustificacionGeneralCard
            justificacionGeneral={justificacionGeneral}
            setJustificacionGeneral={setJustificacionGeneral}
          />
        )}

        <BuscadorInsumos search={search} setSearch={setSearch} />

        <TablaCarrito
          filteredCart={filteredCart}
          destino={destino}
          updateCantidad={updateCantidad}
          removeFromCart={removeFromCart}
        />
      </Card>

      <BotonEnviarSolicitud
        isSubmitting={isSubmitting}
        isSubmitted={isSubmitted}
        cart={cart}
        tipoSolicitud={tipoSolicitud}
        justificacionGeneral={justificacionGeneral}
        onEnviarSolicitud={onEnviarSolicitud}
      />
    </>
  );
}
