import { useForm } from '@mantine/form';
import { TextInput, Button } from '@mantine/core';

function Formulario_subalmacenes() {
  const form = useForm({
    mode: 'uncontrolled',
    initialValues: { subalmacen: '', ubicacion: '', responsable: '' },

    validate: {
    
          subalmacen: (value) => (value.length < 30 ? 'Nombre del Subalmacen' : null),
          ubicacion: (value) => (value.length < 30 ? 'Ubicación del Sub Almacen' : null),
          responsable: (value) => (value.length < 30 ? 'Ubicación del Sub Almacen' : null),
    },
  });

  return (
    <form onSubmit={form.onSubmit(console.log)}>
      <TextInput
        label="Sub Almacen"
        placeholder="Nombre"
        key={form.key('subalmacen')}
        {...form.getInputProps('subalmacen')}
      />
      <TextInput
        mt="sm"
        label="Ubicacion"
        placeholder="Ubicación Fisica del Sub Almacén"
        key={form.key('ubicacion')}
        {...form.getInputProps('ubicacion')}
      />
       <TextInput
        mt="sm"
        label="Responsable"
        placeholder="Nombre del Responsable"
        key={form.key('responsable')}
        {...form.getInputProps('responsable')}
      />
      <Button type="submit" mt="sm">
        Guardar
      </Button>
    </form>
  );
}


export default Formulario_subalmacenes;