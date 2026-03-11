import { useState } from "react";
import {
  TextInput,
  Select,
  NumberInput,
  Button,
  Paper,
  Stack,
  Group,
  LoadingOverlay,
  Title
} from "@mantine/core";

import { DateInput } from "@mantine/dates";
import { useForm } from "@mantine/form";

import {
  IconCalendar,
  IconHash,
  IconPackage,
  IconUser,
  IconCategory,
  IconBuildingWarehouse,
  IconSend,
  IconHospital
} from "@tabler/icons-react";

interface FormValues {
  fecha: Date | null;
  folio: string;
  insumo: string;
  cantidad: number;
  solicitante: string;
  tipoSolicitud: string;
  servicio: string;
  subalmacen: string;
}

const catalogoInsumos = [
  { value: "guantes", label: "Guantes" },
  { value: "cubrebocas", label: "Cubrebocas" },
  { value: "jeringa5", label: "Jeringa 5ml" },
  { value: "gasas", label: "Gasas" },
  { value: "alcohol", label: "Alcohol" }
];

export default function SolicitudForm() {

  const generarFolio = () =>
    "SOL-" + new Date().getFullYear() + "-" + Math.floor(Math.random() * 10000);

  const [loading, setLoading] = useState(false);

  const form = useForm<FormValues>({
    initialValues: {
      fecha: new Date(),
      folio: generarFolio(),
      insumo: "",
      cantidad: 1,
      solicitante: "",
      tipoSolicitud: "",
      servicio: "",
      subalmacen: ""
    },

    validate: {
      fecha: (value) => (!value ? "Campo obligatorio" : null),
      insumo: (value) => (!value ? "Seleccione un insumo" : null),
      cantidad: (value) => (value <= 0 ? "Cantidad inválida" : null),
      solicitante: (value) =>
        value.length < 3 ? "Nombre inválido" : null,
      tipoSolicitud: (value) =>
        !value ? "Seleccione tipo de solicitud" : null,
      servicio: (value) =>
        value.length < 2 ? "Servicio requerido" : null,
      subalmacen: (value) =>
        value.length < 2 ? "Subalmacén requerido" : null
    }
  });

  const handleSubmit = async (values: FormValues) => {

    setLoading(true);

    await new Promise((resolve) => setTimeout(resolve, 2000));

    console.log(values);

    setLoading(false);

    form.setFieldValue("folio", generarFolio());
  };

  return (

    <Paper shadow="md" p="xl" radius="md" maw={600} mx="auto" pos="relative">

      <LoadingOverlay
        visible={loading}
        overlayProps={{ blur: 2 }}
      />

     

      <form onSubmit={form.onSubmit(handleSubmit)}>

        <Stack>

          <DateInput
            label="Fecha"
            placeholder="Seleccione fecha"
            leftSection={<IconCalendar size={16} />}
            {...form.getInputProps("fecha")}
            required
          />

          <TextInput
            label="Folio"
            leftSection={<IconHash size={16} />}
            readOnly
            {...form.getInputProps("folio")}
          />

          <Select
            label="Insumo"
            placeholder="Seleccione insumo"
            leftSection={<IconPackage size={16} />}
            data={catalogoInsumos}
            searchable
            {...form.getInputProps("insumo")}
            required
          />

          <NumberInput
            label="Cantidad"
            leftSection={<IconPackage size={16} />}
            min={1}
            {...form.getInputProps("cantidad")}
            required
          />

          <TextInput
            label="Quien solicita"
            leftSection={<IconUser size={16} />}
            placeholder="Nombre del solicitante"
            {...form.getInputProps("solicitante")}
            required
          />

          <Select
            label="Tipo de solicitud"
            leftSection={<IconCategory size={16} />}
            placeholder="Seleccione tipo"
            data={[
              { value: "ordinaria", label: "Ordinaria" },
              { value: "urgente", label: "Urgente" }
            ]}
            {...form.getInputProps("tipoSolicitud")}
            required
          />

          <TextInput
            label="Servicio"
            leftSection={<IconHospital size={16} />}
            placeholder="Ej. Urgencias"
            {...form.getInputProps("servicio")}
            required
          />

          <TextInput
            label="Subalmacén"
            leftSection={<IconBuildingWarehouse size={16} />}
            placeholder="Nombre del subalmacén"
            {...form.getInputProps("subalmacen")}
            required
          />

          
          <TextInput
            label="Central de Costos"
            leftSection={<IconBuildingWarehouse size={16} />}
            placeholder="Central de Costos"
            {...form.getInputProps("cc")}
            required
          />

          <Group justify="center" mt="md">

            <Button
              type="submit"
              loading={loading}
              leftSection={<IconSend size={18} />}
            >
              Enviar solicitud
            </Button>

          </Group>

        </Stack>

      </form>

    </Paper>
  );
}