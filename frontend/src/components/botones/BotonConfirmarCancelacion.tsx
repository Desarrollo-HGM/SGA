import { Button } from "@mantine/core";

interface Props {
  onConfirm: () => void;
}

export default function BotonConfirmarCancelacion({ onConfirm }: Props) {
  return (
    <Button
      fullWidth
      mt="md"
      color="red"
      radius="xl"
      variant="light"
      onClick={onConfirm}
    >
      Confirmar cancelación
    </Button>
  );
}
