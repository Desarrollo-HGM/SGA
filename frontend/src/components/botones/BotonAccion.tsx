import { Button } from "@mantine/core";
import { IconPlus, IconCheck } from "@tabler/icons-react";
import type { Insumo, CartItem } from "../../types/global";

interface Props {
  record: Insumo;
  cart: CartItem[];
  addToCart: (item: Insumo) => void;
}

export default function BotonAccion({
  record,
  cart,
  addToCart
}: Props) {

  const sinStock = record.stock <= 0;

  const enCarrito = cart.some((i) => i.id === record.id);

  return (
    <Button
      size="xs"
      radius="xl"
      color={
        sinStock
          ? "gray"
          : enCarrito
          ? "blue"
          : "teal"
      }
      variant={enCarrito ? "filled" : "light"}
      leftSection={
        enCarrito
          ? <IconCheck size={14} />
          : <IconPlus size={14} />
      }
      disabled={sinStock}
      onClick={() => addToCart(record)}
    >
      {sinStock
        ? "Sin stock"
        : enCarrito
        ? "Agregado"
        : "Solicitar"}
    </Button>
  );
}