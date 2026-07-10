import { TextInput } from "@mantine/core";

interface Props {
  search: string;
  setSearch: (value: string) => void;
}

export default function BuscadorInsumos({ search, setSearch }: Props) {
  return (
    <TextInput
      placeholder="Buscar insumo..."
      value={search}
      onChange={(e) => setSearch(e.currentTarget.value)}
      mb="sm"
    />
  );
}
