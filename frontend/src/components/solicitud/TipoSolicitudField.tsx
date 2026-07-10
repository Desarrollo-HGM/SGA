import { TextInput } from "@mantine/core";

interface Props {
  tipoSolicitud: string;
}

export default function TipoSolicitudField({ tipoSolicitud }: Props) {
  return (
    <TextInput
      label="Tipo de Solicitud"
      value={tipoSolicitud}
      readOnly
      variant="filled"
      mb="md"
      fw={600}
    />
  );
}
