import { useState } from "react";
import {
  TextInput,
  NumberInput,
  Button,
  Stack,
  Group,
  LoadingOverlay,
  Grid,
  Paper,
  Text,
  Autocomplete
} from "@mantine/core";

import { DateInput } from "@mantine/dates";
import { useForm } from "@mantine/form";

import {
  IconCalendar,
  IconHash,
  IconPackage,
  IconUser,
  IconSend,
  IconBuilding,
  IconPlus,
  IconTrash
} from "@tabler/icons-react";

/* =====================
TIPOS
===================== */

export interface Item {
  insumo: string;
  cantidad: number;
}

export interface FormValues {
  fecha: Date | null;
  folio: string;
  solicitante: string;
  tipoSolicitud: string;
  servicio: string;
  subalmacen: string;
  cc: string;
 
  items: Item[];
}

/* =====================
CATÁLOGOS
===================== */

export const catalogoInsumos: string[] = [
  "Guantes",
  "Cubrebocas",
  "Jeringa 5ml",
  "Gasas",
  "Alcohol"
];

export const catalogoCC: string[] = [
  "1001 - Dirección",
  "1002 - Urgencias",
  "1003 - Hospitalización"
];

export default function SolicitudForm() {


  function generarFolio(): string {
  const year = new Date().getFullYear();
  const random = Math.floor(1000 + Math.random() * 9000);
  return `SOL-${year}-${random}`;
}

const [loading, setLoading] = useState(false);

const MAX_ITEMS = 20;

const itemVacio: Item = {
  insumo: "",
  cantidad: 1
};


const form = useForm<FormValues>({
  initialValues: {
    fecha: new Date(),
    folio: generarFolio(),
    solicitante: "",
    tipoSolicitud: "",
    servicio: "",
    subalmacen: "",
    cc: "",
    items: [{ insumo: "", cantidad: 1 }]
  },

  validate: {
    solicitante: (value) =>
      value.trim().length < 3 ? "El solicitante es obligatorio" : null,

    tipoSolicitud: (value) =>
      value.trim().length === 0 ? "Ingrese el tipo de solicitud" : null,

    servicio: (value) =>
      value.trim().length === 0 ? "Ingrese el servicio" : null,

    subalmacen: (value) =>
      value.trim().length === 0 ? "Ingrese el subalmacén" : null,

    cc: (value) =>
      value.trim().length === 0 ? "Seleccione un centro de costos" : null,

    items: {
      insumo: (value) =>
        value.trim().length === 0 ? "Seleccione un insumo" : null,

      cantidad: (value) =>
        value < 1 ? "La cantidad debe ser mayor a 0" : null
    }
  },
  validateInputOnBlur: true,
  validateInputOnChange: true
});



const handleSubmit = async (values: FormValues) => {

  if (values.items.length === 0) {
    form.setFieldError("items", "Debe agregar al menos un insumo");
    return;
  }

  setLoading(true);

  await new Promise((resolve) => setTimeout(resolve, 1500));

  console.log(values);

  setLoading(false);

  form.reset();
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
          readOnly
          leftSection={<IconHash size={16} />}
          {...form.getInputProps("folio")}
        />
      </Grid.Col>

      <Grid.Col span={{ base: 12, md: 6 }}>
        <TextInput
          label="Solicitante"
          leftSection={<IconUser size={16} />}
          {...form.getInputProps("solicitante")}
        />
      </Grid.Col>

      <Grid.Col span={{ base: 12, md: 6 }}>
        <TextInput
          label="Tipo de solicitud"
          {...form.getInputProps("tipoSolicitud")}
        />
      </Grid.Col>

      <Grid.Col span={{ base: 12, md: 6 }}>
        <TextInput
          label="Servicio"
          {...form.getInputProps("servicio")}
        />
      </Grid.Col>

      <Grid.Col span={{ base: 12, md: 6 }}>
        <TextInput
          label="Subalmacén"
          {...form.getInputProps("subalmacen")}
        />
      </Grid.Col>

      <Grid.Col span={{ base: 12, md: 12 }}>
        <Autocomplete
          label="Centro de costos"
          placeholder="Buscar..."
          leftSection={<IconBuilding size={16} />}
          data={catalogoCC}
          value={form.values.cc ?? ""}
          onChange={(value: string) => form.setFieldValue("cc", value)}
          comboboxProps={{ withinPortal: false }}
        />
      </Grid.Col>

    </Grid>

    {/* INSUMOS */}

   {form.values.items.map((item, index) => (
  <Paper key={index} shadow="xs" p="md" withBorder>
    <Grid>

      <Grid.Col span={{ base: 12, md: 6 }}>
        <Autocomplete
          label="Insumo"
          placeholder="Buscar insumo..."
          leftSection={<IconPackage size={16} />}
          data={catalogoInsumos}
          value={form.values.items[index]?.insumo ?? ""}
          onChange={(value: string) => form.setFieldValue(`items.${index}.insumo`, value)}
          comboboxProps={{ withinPortal: false }}
        />
      </Grid.Col>

      <Grid.Col span={{ base: 12, md: 4 }}>
        <NumberInput
          label="Cantidad"
          min={1}
          value={item.cantidad}
          onChange={(value: number | string) =>
            form.setFieldValue(
              `items.${index}.cantidad`,
              typeof value === "number" ? value : 1
            )
          }
        />
      </Grid.Col>

      <Grid.Col span={{ base: 12, md: 2 }}>
        <Button
          mt="lg"
          color="red"
          variant="light"
          onClick={() => form.removeListItem("items", index)}
        >
          <IconTrash size={16} />
        </Button>
      </Grid.Col>

    </Grid>
  </Paper>
))}

 <Button
  variant="outline"
  leftSection={<IconPlus size={16} />}
  disabled={form.values.items.length >= MAX_ITEMS}
  onClick={() => form.insertListItem("items", itemVacio)}
>
  Agregar insumo
</Button>
{form.errors.items && (
  <Text c="red" size="sm">
    {form.errors.items}
  </Text>
)}
    <Group justify="center">
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