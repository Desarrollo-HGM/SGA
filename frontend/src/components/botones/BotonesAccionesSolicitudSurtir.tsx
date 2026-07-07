import { Group, Button } from "@mantine/core";
import {
  IconCheck,
  IconFileInvoice,
  IconX,
} from "@tabler/icons-react";

interface Props {
  isSubmitting: boolean;
  isSubmitted: boolean;
  botonSurtirDeshabilitado: boolean;
  handleSurtir: () => void;
  handleCancelar: () => void;
}

export default function AccionesSolicitud({
  isSubmitting,
  isSubmitted,
  botonSurtirDeshabilitado,
  handleSurtir,
  handleCancelar,
}: Props) {
  return (
    <Group grow mt="md">
      <Button
        radius="xl"
        size="md"
        fullWidth
        loading={isSubmitting}
        disabled={botonSurtirDeshabilitado}
        color={isSubmitted ? "teal" : "green"}
        variant={isSubmitted ? "filled" : "light"}
        leftSection={
          isSubmitted ? (
            <IconCheck size={18} />
          ) : (
            <IconFileInvoice size={18} />
          )
        }
        onClick={handleSurtir}
      >
        {isSubmitted ? "Surtido generado" : "Surtir solicitud"}
      </Button>

      <Button
        radius="xl"
        size="md"
        color="red"
        variant="light"
        leftSection={<IconX size={18} />}
        onClick={handleCancelar}
      >
        Cancelar solicitud
      </Button>
    </Group>
  ); 
}    