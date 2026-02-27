import { useState } from "react";
import {
  AppShell,
  Group,
  Table,
  Badge,
  Button,
  TextInput,
  Modal,
} from "@mantine/core";
import {
  IconCheck,
  IconX,
  IconEdit,
  IconBuildingWarehouse,
  IconMapPin,
  IconUser,
} from "@tabler/icons-react";

interface Subalmacen {
  id: number;
  nombre: string;
  ubicacion: string;
  estatus: "Habilitado" | "Deshabilitado";
  responsable: string;
}

const subalmacenesMock: Subalmacen[] = [
  { id: 1, nombre: "Almacén A", ubicacion: "Planta Norte", estatus: "Habilitado", responsable: "Juan Pérez" },
  { id: 2, nombre: "Almacén B", ubicacion: "Planta Sur", estatus: "Deshabilitado", responsable: "María López" },
  { id: 3, nombre: "Almacén C", ubicacion: "Planta Centro", estatus: "Habilitado", responsable: "Carlos Ruiz" },
  // ...
];

export default function SubalmacenesDashboard() {
  const [search, setSearch] = useState<string>("");
  const [data, setData] = useState<Subalmacen[]>(subalmacenesMock);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selected, setSelected] = useState<Subalmacen | null>(null);
  const [errors, setErrors] = useState<{ nombre?: string; ubicacion?: string; responsable?: string }>({});
  const [loading, setLoading] = useState(false);

  const filtered = data.filter(
    (s) =>
      s.nombre.toLowerCase().includes(search.toLowerCase()) ||
      s.ubicacion.toLowerCase().includes(search.toLowerCase()) ||
      s.responsable.toLowerCase().includes(search.toLowerCase())
  );

  const toggleEstatus = (id: number) => {
    setData((prev) =>
      prev.map((s) =>
        s.id === id
          ? { ...s, estatus: s.estatus === "Habilitado" ? "Deshabilitado" : "Habilitado" }
          : s
      )
    );
  };

  const openEditModal = (sub: Subalmacen) => {
    setSelected(sub);
    setErrors({});
    setLoading(false);
    setEditModalOpen(true);
  };

  const validateForm = () => {
  const newErrors: typeof errors = {};

  // Regex que permite letras, espacios y acentos (áéíóúÁÉÍÓÚñÑ)
  const textoRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;
  const ubicacionRegex = /^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\s]+$/;

  if (!selected?.nombre.trim()) {
    newErrors.nombre = "El nombre es requerido";
  } else if (!textoRegex.test(selected.nombre)) {
    newErrors.nombre = "Solo texto permitido (con acentos)";
  }

  if (!selected?.ubicacion.trim()) {
    newErrors.ubicacion = "La ubicación es requerida";
  } else if (!ubicacionRegex.test(selected.ubicacion)) {
    newErrors.ubicacion = "Solo letras, números y acentos permitidos";
  }

  if (!selected?.responsable.trim()) {
    newErrors.responsable = "El responsable es requerido";
  } else if (!textoRegex.test(selected.responsable)) {
    newErrors.responsable = "Solo texto permitido (con acentos)";
  }

  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};

  const handleSave = async () => {
    if (validateForm() && selected) {
      setLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 2000)); // simula guardado
      setData((prev) => prev.map((s) => (s.id === selected.id ? selected : s)));
      setLoading(false);
      setEditModalOpen(false);
    }
  };

  return (
    <AppShell header={{ height: 60 }}>
      <AppShell.Main style={{ paddingLeft: 0, paddingRight: 0 }}>
        {/* Buscador */}
        <TextInput
          placeholder="Buscar subalmacén..."
          value={search}
          onChange={(e) => setSearch(e.currentTarget.value)}
          className="search-bar"
          mt="lg"
        />

        {/* Tabla */}
        <div className="table-container">
          <Table striped highlightOnHover>
            <thead className="table-head">
              <tr>
                <th>Nombre del Subalmacén</th>
                <th>Ubicación</th>
                <th>Estatus</th>
                <th>Responsable</th>
                <th>Acciones</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((s) => (
                <tr key={s.id}>
                  <td>{s.nombre}</td>
                  <td>{s.ubicacion}</td>
                  <td>
                    <Badge
                      color={s.estatus === "Habilitado" ? "green" : "red"}
                      leftSection={s.estatus === "Habilitado" ? <IconCheck size={16} /> : <IconX size={16} />}
                    >
                      {s.estatus}
                    </Badge>
                  </td>
                  <td>{s.responsable}</td>
                  <td>
                    <Group gap="md">
                      <Button
                        size="xs"
                        variant="light"
                        color={s.estatus === "Habilitado" ? "red" : "green"}
                        onClick={() => toggleEstatus(s.id)}
                      >
                        {s.estatus === "Habilitado" ? "Deshabilitar" : "Habilitar"}
                      </Button>
                    </Group>
                  </td>
                  <td>
                    <Group gap="md">
                      <Button
                        size="xs"
                        variant="light"
                        color="blue"
                        leftSection={<IconEdit size={14} />}
                        onClick={() => openEditModal(s)}
                      >
                        Editar
                      </Button>
                    </Group>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>

        {/* Modal con formulario */}
        <Modal
          opened={editModalOpen}
          onClose={() => setEditModalOpen(false)}
          title="Editar Subalmacén"
          centered
          size="lg"
          overlayProps={{ opacity: 0.55, blur: 3 }}
          closeOnClickOutside={false}
          zIndex={3000}
          styles={{
            header: {
              position: "sticky",
              top: 0,
              backgroundColor: "#003366", // azul fuerte institucional
              color: "white",
              fontWeight: "bold",
              zIndex: 1,
            },
            title: { color: "white" },
            body: { maxHeight: "70vh", overflowY: "auto" },
          }}
        >
          {selected && (
            <div>
              <TextInput
                label="Nombre del Subalmacén"
                value={selected.nombre}
                onChange={(e) => setSelected({ ...selected, nombre: e.currentTarget.value })}
                mb="sm"
                error={errors.nombre}
                leftSection={<IconBuildingWarehouse size={16} />}
              />
              <TextInput
                label="Ubicación"
                value={selected.ubicacion}
                onChange={(e) => setSelected({ ...selected, ubicacion: e.currentTarget.value })}
                mb="sm"
                error={errors.ubicacion}
                leftSection={<IconMapPin size={16} />}
              />
              <TextInput
                label="Responsable"
                value={selected.responsable}
                onChange={(e) => setSelected({ ...selected, responsable: e.currentTarget.value })}
                mb="sm"
                error={errors.responsable}
                leftSection={<IconUser size={16} />}
              />

              <Group justify="space-between" mt="md">
                <Button
                  variant="outline"
                  color="gray"
                  onClick={() => setEditModalOpen(false)}
                  leftSection={<IconX size={16} />}
                >
                  Cancelar
                </Button>
                <Button
                  color="green"
                  onClick={handleSave}
                  loading={loading}
                  leftSection={<IconCheck size={16} />}
                >
                  {loading ? "Guardando..." : "Guardar"}
                </Button>
              </Group>
            </div>
          )}
        </Modal>
      </AppShell.Main>
    </AppShell>
  );
}