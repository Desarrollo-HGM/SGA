import { useForm } from '@mantine/form';
import { NumberInput, TextInput, Button } from '@mantine/core';

function Formulario() {
  const form = useForm({
    mode: 'uncontrolled',
    initialValues: { name: '', email: '', cantidad: 0 },

    validate: {
      name: (value) => (value.length < 2 ? 'Name must have at least 2 letters' : null),
      email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
      cantidad: (value) => (value < 18 ? 'Minimo 1' : null),
    },
  });

  return (
    <form onSubmit={form.onSubmit(console.log)}>
      <TextInput
        label="Name"
        placeholder="Name"
        key={form.key('name')}
        {...form.getInputProps('name')}
      />
      <TextInput
        mt="sm"
        label="Email"
        placeholder="Email"
        key={form.key('email')}
        {...form.getInputProps('email')}
      />
      <NumberInput
        mt="sm"
        label="Cantidad"
        placeholder="000"
        min={0}
        max={99}
        key={form.key('Cantidad')}
        {...form.getInputProps('Cantidad')}
      />
      <Button type="submit" mt="sm">
        Guardar
      </Button>
    </form>
  );
}


export default Formulario;