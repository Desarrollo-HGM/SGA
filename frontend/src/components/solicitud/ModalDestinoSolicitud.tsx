import { Modal, Text, Button, SimpleGrid } from "@mantine/core";
import { IconBuildingWarehouse, IconShieldCheck } from "@tabler/icons-react";
import { useEffect } from "react";
import { useAuth } from "../../hooks/useAuth"; // 👈 tu hook de autenticación

interface Props {
  destino: "central" | "guarda" | null;
  setDestino: (destino: "central" | "guarda") => void;
   setTipoSolicitud: (tipo: string) => void; // 👈 requerido
}

export default function ModalDestinoSolicitud({
  destino,
  setDestino,
  setTipoSolicitud,
}: Props) {
  const { user } = useAuth();

  // 🚫 Si el rol es solicitante, no mostramos modal y asignamos Clinica
  useEffect(() => {
    if (user?.rol === "solicitante") {
      setDestino("guarda");        // 👈 destino por defecto
      setTipoSolicitud("Clinica"); // 👈 tipoSolicitud automático
    }
  }, [user, setDestino, setTipoSolicitud]);

  // Si es solicitante, no renderizamos nada
  if (user?.rol === "solicitante") return null;

  return (
    <Modal
      opened={destino === null}
      onClose={() => {}}
      withCloseButton={false}
      centered
      radius="lg"
      padding="xl"
      overlayProps={{ blur: 4, opacity: 0.55 }}
      title={
        <Text fw={700} size="lg" c="dimmed" style={{ letterSpacing: "0.5px" }}>
          DESTINO DE LA SOLICITUD
        </Text>
      }
    >
      <Text size="sm" c="dimmed" mb="xl" ta="center">
        Por favor, seleccione el almacén de destino para procesar los insumos de
        este pedido.
      </Text>
      <SimpleGrid cols={2} spacing="md">
        <Button
          variant="light"
          color="blue"
          size="xl"
          radius="md"
          h={100}
          styles={{ root: { flexDirection: "column", gap: "8px" } }}
          leftSection={<IconBuildingWarehouse size={32} stroke={1.5} />}
          onClick={() => setDestino("central")}
        >
          <Text fw={600} size="sm">Almacén Central</Text>
        </Button>
        <Button
          variant="light"
          color="orange"
          size="xl"
          radius="md"
          h={100}
          styles={{ root: { flexDirection: "column", gap: "8px" } }}
          leftSection={<IconShieldCheck size={32} stroke={1.5} />}
          onClick={() => setDestino("guarda")}
        >
          <Text fw={600} size="sm">Guarda</Text>
        </Button>
      </SimpleGrid>
    </Modal>
  );
}
