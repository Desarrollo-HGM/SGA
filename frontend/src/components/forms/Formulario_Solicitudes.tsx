import { useState } from "react";
import {
  TextInput,
  Select,
  NumberInput,
  Button,
  Stack,
  Group,
  LoadingOverlay,
  Grid
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
  IconHospital,
  IconBuilding
} from "@tabler/icons-react";

interface FormValues {
  fecha: Date | null;
  folio: string;
  insumo: string | null;
  cantidad: number;
  solicitante: string;
  tipoSolicitud: string | null;
  servicio: string | null;
  subalmacen: string | null;
  cc: string | null;
}

/* =====================
CATALOGOS
===================== */

const catalogoInsumos = [
  { value: "guantes", label: "Guantes" },
  { value: "cubrebocas", label: "Cubrebocas" },
  { value: "jeringa5", label: "Jeringa 5ml" },
  { value: "gasas", label: "Gasas" },
  { value: "alcohol", label: "Alcohol" }
];

const catalogoTipoSolicitud = [
  { value: "ordinaria", label: "Ordinaria" },
  { value: "urgente", label: "Urgente" },
  { value: "extraordinaria", label: "Extraordinaria" }
];

const catalogoServicios = [
  { value: "urgencias", label: "Urgencias" },
  { value: "hospitalizacion", label: "Hospitalización" },
  { value: "cirugia", label: "Cirugía" },
  { value: "pediatria", label: "Pediatría" }
];

const catalogoSubalmacen = [
  { value: "farmacia", label: "Farmacia" },
  { value: "urgencias", label: "Subalmacén Urgencias" },
  { value: "quirofano", label: "Quirófano" }
];

const catalogoCC = [
  { value: "1001", label: "1001 - Dirección" },
  { value: "1002", label: "1002 - Urgencias" },
  { value: "1003", label: "1003 - Hospitalización" }
];

export default function SolicitudForm() {

  const generarFolio = () =>
    "SOL-" + new Date().getFullYear() + "-" + Math.floor(Math.random() * 10000);

  const [loading, setLoading] = useState(false);

  const form = useForm<FormValues>({
   initialValues: {
  fecha: new Date(),
  folio: generarFolio(),
  insumo: null,
  cantidad: 1,
  solicitante: "",
  tipoSolicitud: null,
  servicio: null,
  subalmacen: null,
  cc: null
}
  });

  const handleSubmit = async (values: FormValues) => {

    setLoading(true);

    await new Promise((resolve) => setTimeout(resolve, 1500));

    console.log(values);

    setLoading(false);

    form.setFieldValue("folio", generarFolio());
  };

  return (




    
    <form onSubmit={form.onSubmit(handleSubmit)} style={{ position: "relative" }}>

      <LoadingOverlay visible={loading} overlayProps={{ blur: 2 }} />

      <Stack>

        <Grid>

          <Grid.Col span={{ base: 12, md: 6 }}>
            <DateInput
              label="Fecha"
              leftSection={<IconCalendar size={16} />}
              {...form.getInputProps("fecha")}
            />
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 6 }}>
            <TextInput
              label="Folio"
              leftSection={<IconHash size={16} />}
              readOnly
              {...form.getInputProps("folio")}
            />
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 6 }}>
  <Select
  label="Insumo"
  placeholder="Seleccione insumo"
  leftSection={<IconPackage size={16} />}
  data={catalogoInsumos}
  searchable
  clearable
  value={form.values.insumo}
  onChange={(value) => form.setFieldValue("insumo", value)}
/>
</Grid.Col>

          <Grid.Col span={{ base: 12, md: 6 }}>
            <NumberInput
              label="Cantidad"
              min={1}
              leftSection={<IconPackage size={16} />}
              {...form.getInputProps("cantidad")}
            />
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 6 }}>
            <TextInput
              label="Quien solicita"
              leftSection={<IconUser size={16} />}
              {...form.getInputProps("solicitante")}
            />
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 6 }}>
            <Select
              label="Tipo de solicitud"
              placeholder="Seleccione tipo"
              leftSection={<IconCategory size={16} />}
              data={catalogoTipoSolicitud}
              {...form.getInputProps("tipoSolicitud")}
            />
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 6 }}>
            <Select
              label="Servicio"
              placeholder="Seleccione servicio"
              leftSection={<IconHospital size={16} />}
              data={catalogoServicios}
              searchable
              {...form.getInputProps("servicio")}
            />
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 6 }}>
            <Select
              label="Subalmacén"
              placeholder="Seleccione subalmacén"
              leftSection={<IconBuildingWarehouse size={16} />}
              data={catalogoSubalmacen}
              {...form.getInputProps("subalmacen")}
            />
          </Grid.Col>

          <Grid.Col span={12}>
            <Select
              label="Central de costos"
              placeholder="Seleccione centro de costos"
              leftSection={<IconBuilding size={16} />}
              data={catalogoCC}
              searchable
              {...form.getInputProps("cc")}
            />
          </Grid.Col>

        </Grid>

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
  );
}