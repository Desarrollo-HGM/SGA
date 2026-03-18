import { Card, Group, TextInput } from "@mantine/core";

export default function DatosSolicitud({
  usuario,
  servicioSolicitante,
  setUsuario,
  setServicioSolicitante
}: any) {

  return (

    <Card withBorder mb="lg">


      <Group>

        <TextInput
          label="Subalmacén"
          value={usuario}
          onChange={(e) => setUsuario(e.currentTarget.value)}
        />

        <TextInput
          label="Servicio"
          value={servicioSolicitante}
          onChange={(e) => setServicioSolicitante(e.currentTarget.value)}
        />

      </Group>

    </Card>

  );

}