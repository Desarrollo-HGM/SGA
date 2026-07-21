import { Drawer, Group, Text, ActionIcon, Textarea } from "@mantine/core";
import { IconAlertTriangle, IconX } from "@tabler/icons-react";
import BotonConfirmarCancelacion from "../botones/BotonConfirmarCancelacion";

interface Props {
  opened: boolean;
  onClose: () => void;
  idSolicitud: number | null;
  motivo: string;
  setMotivo: (value: string) => void;
  onConfirm: () => void;
}

export default function DrawerCancelarSolicitud({
  opened,
  onClose,
  idSolicitud,
  motivo,
  setMotivo,
  onConfirm,
}: Props) {
  return (
    <Drawer
      opened={opened}
      onClose={onClose}
      position="bottom"
      size="40%"
      radius="lg"
      withCloseButton={false}
    >
      <Group justify="space-between" mb="md">
        <Group>
          <IconAlertTriangle color="red" />
          <Text fw={700}>Cancelar solicitud #{idSolicitud}</Text>
        </Group>
        <ActionIcon
          variant="light"
          color="red"
          size="lg"
          radius="xl"
          onClick={onClose}
        >
          <IconX size={18} />
        </ActionIcon>
      </Group>

      <Text fw={600} mb="xs">
        Motivo de cancelación
      </Text>
      <Textarea
        placeholder="Escribe el motivo..."
        value={motivo}
        onChange={(e) => setMotivo(e.currentTarget.value)}
        minRows={3}
      />

      {/* Botón modular importado */}
      <BotonConfirmarCancelacion onConfirm={onConfirm} />
    </Drawer>
  );
}
