import { Card, Text, Textarea } from "@mantine/core";

interface Props {
  justificacionGeneral: string;
  setJustificacionGeneral: (value: string) => void;
}

export default function JustificacionGeneralCard({
  justificacionGeneral,
  setJustificacionGeneral,
}: Props) {
  return (
    <Card
      withBorder
      radius="md"
      mb="md"
      p="md"
      style={{ background: "#fff8e6", borderColor: "#f0c36d" }}
    >
      <Text fw={600} mb="sm">
        Justificación requerida
      </Text>
      <Textarea
        size="sm"
        minRows={3}
        autosize
        placeholder="Ingrese la justificación general"
        value={justificacionGeneral}
        onChange={(e) => setJustificacionGeneral(e.currentTarget.value)}
      />
    </Card>
  );
}
