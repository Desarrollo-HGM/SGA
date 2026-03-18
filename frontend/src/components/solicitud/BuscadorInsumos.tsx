import { TextInput } from "@mantine/core";
import { IconSearch } from "@tabler/icons-react";

export default function BuscadorInsumos({ search, setSearch }: any) {

  return (

    <TextInput
      placeholder="Buscar insumo..."
      leftSection={<IconSearch size={16} />}
      value={search}
      onChange={(e) => setSearch(e.currentTarget.value)}
      mb="lg"
      style={{ width: 300 }}
    />

  );

}