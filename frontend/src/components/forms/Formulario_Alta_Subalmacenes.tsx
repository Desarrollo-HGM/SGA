import { useState } from "react";
import { useForm } from "@mantine/form";
import { TextInput, Button,Stack } from "@mantine/core";
import {
  IconBuildingWarehouse,
  IconMapPin,
  IconUser,
  IconCheck,
} from "@tabler/icons-react";

function Formulario_subalmacenes() {
  const [loading, setLoading] = useState(false);

  const form = useForm({
    mode: "uncontrolled",
    initialValues: { subalmacen: "", ubicacion: "", responsable: "" },

    validate: {
      subalmacen: (value) =>
        value.trim().length === 0
          ? "El nombre del subalmacén es requerido"
          : /^[a-zA-Z\s]+$/.test(value)
          ? null
          : "Solo texto permitido",
      ubicacion: (value) =>
        value.trim().length === 0
          ? "La ubicación es requerida"
          : /^[a-zA-Z0-9\s]+$/.test(value)
          ? null
          : "Solo letras y números permitidos",
      responsable: (value) =>
        value.trim().length === 0
          ? "El responsable es requerido"
          : /^[a-zA-Z\s]+$/.test(value)
          ? null
          : "Solo texto permitido",
    },
  });

  const handleSubmit = async (values: typeof form.values) => {
    setLoading(true);
    // Simula proceso de guardado (ej. llamada a API)
    await new Promise((resolve) => setTimeout(resolve, 2000));
    console.log("Datos guardados:", values);
    setLoading(false);
    form.reset();
  };

  return (
  
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Stack>
            <TextInput
              label="Sub Almacén"
              placeholder="Nombre"
              key={form.key("subalmacen")}
              leftSection={<IconBuildingWarehouse size={16} />}
              {...form.getInputProps("subalmacen")}
            />

            <TextInput
              label="Ubicación"
              placeholder="Ubicación física del subalmacén"
              key={form.key("ubicacion")}
              leftSection={<IconMapPin size={16} />}
              {...form.getInputProps("ubicacion")}
            />

            <TextInput
              label="Responsable"
              placeholder="Nombre del responsable"
              key={form.key("responsable")}
              leftSection={<IconUser size={16} />}
              {...form.getInputProps("responsable")}
            />

            <Button
              type="submit"
              mt="sm"
              color="green"
              loading={loading}
              leftSection={<IconCheck size={16} />}
            >
              Guardar
            </Button>
          </Stack>
        </form>
    
  );
}

export default Formulario_subalmacenes;