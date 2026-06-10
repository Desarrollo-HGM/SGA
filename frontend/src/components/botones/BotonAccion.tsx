import { Button, Group } from "@mantine/core";
import {
  IconCheck,
  IconPlus,
  IconX,
  IconBan,
  IconPackage
} from "@tabler/icons-react";

import type { Insumo, CartItem } from "../../types/global";
import { useState } from "react";

interface Props {
  record: Insumo;
  cart: CartItem[];
  addToCart: (item: Insumo) => void;
  removeFromCart: (id: number) => void;

  onSurtir?: (item: Insumo) => void;
}

export default function BotonAccion({
  record,
  cart,
  addToCart,
  removeFromCart,
  onSurtir
}: Props) {
  const [hover, setHover] = useState(false);

  const isInCart = cart.some(
    (item) => item.id === record.id
  );

  const sinStock = record.stock <= 0;

  const handleSolicitud = () => {
    if (sinStock) return;

    if (isInCart) {
      removeFromCart(record.id);
    } else {
      addToCart(record);
    }
  };

  let color = "blue";
  let label = "Solicitar";
  let icon = <IconPlus size={14} />;

  if (sinStock) {
    color = "gray";
    label = "Sin stock";
    icon = <IconBan size={14} />;
  } else if (isInCart) {
    color = hover ? "red" : "green";
    label = hover ? "Quitar" : "Agregado";
    icon = hover
      ? <IconX size={14} />
      : <IconCheck size={14} />;
  }

  return (
    <Group gap={5} justify="center">
      <Button
        size="xs"
        radius="md"
        color={color}
        leftSection={icon}
        onClick={handleSolicitud}
        disabled={sinStock}
        variant="light"
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      >
        {label}
      </Button>

      {!sinStock && onSurtir && (
        <Button
          size="xs"
          radius="md"
          color="green"
          variant="light"
          leftSection={<IconPackage size={14} />}
          onClick={() => onSurtir(record)}
        >
          Surtir
        </Button>
      )}
    </Group>
  );
}