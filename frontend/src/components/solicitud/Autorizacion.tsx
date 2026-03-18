import { Card, Group, Switch, TextInput } from "@mantine/core";

export default function Autorizacion({
  autorizado,
  medico,
  setAutorizado,
  setMedico
}: any) {

  return (

    <Card withBorder mb="lg">

      <Group>

        <Switch
          label="Requiere autorización médica"
          checked={autorizado}
          onChange={(e) => setAutorizado(e.currentTarget.checked)}
        />

        {autorizado && (

          <TextInput
            label="Médico que autoriza"
            value={medico}
            onChange={(e) => setMedico(e.currentTarget.value)}
          />

        )}

      </Group>

    </Card>

  );

}