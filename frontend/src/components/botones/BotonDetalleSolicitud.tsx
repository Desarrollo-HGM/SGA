import { Button } from "@mantine/core";
import { IconEye } from "@tabler/icons-react";

interface Props {
  onClick: () => void;
}

export default function BotonDetalleSolicitud({ onClick }: Props) {
  return (
    <Button
      size="xs"
      radius="xl"
      variant="light"
      color="blue"
      leftSection={<IconEye size={14} />}
      onClick={onClick}
    >
      Detalle
    </Button>
  );
}
