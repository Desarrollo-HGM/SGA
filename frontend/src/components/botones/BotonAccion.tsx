import { Button } from "@mantine/core";
import {
  IconCheck,
  IconPlus,
  IconX,
  IconBan
} from "@tabler/icons-react";

import type { Insumo, CartItem } from "../../types/global";
import { useState } from "react";

interface Props {
  record: Insumo;
  cart: CartItem[];
  addToCart: (item: Insumo) => void;
  removeFromCart: (id: number) => void;
}

export default function BotonAccion({
  record,
  cart,
  addToCart,
  removeFromCart
}: Props) {

  const [hover, setHover] = useState(false);

  const isInCart = cart.some((item) => item.id === record.id);
  const sinStock = record.stock <= 0;

  const handleClick = () => {
    if (sinStock) return;

    if (isInCart) {
      removeFromCart(record.id);
    } else {
      addToCart(record);
    }
  };

  /* 🎨 CONFIG VISUAL DINÁMICA */
  let color = "blue";
  let variant: "filled" | "light" | "outline" = "filled";
  let label = "Solicitar";
  let icon = <IconPlus size={14} />;

  if (sinStock) {
    color = "gray";
    variant = "outline";
    label = "Sin stock";
    icon = <IconBan size={14} />;
  } else if (isInCart) {
    color = hover ? "red" : "green";
    variant = "light";
    label = hover ? "Quitar" : "Agregado";
    icon = hover
      ? <IconX size={14} />
      : <IconCheck size={14} />;
  }

  return (
    <Button
      size="xs"
      radius="md"
      color={color}
      variant={variant}
      leftSection={icon}
      onClick={handleClick}
      disabled={sinStock}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        transition: "all 0.2s ease",
      }}
    >
      {label}
    </Button>
  );
}