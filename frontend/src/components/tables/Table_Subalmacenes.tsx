
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
import { IconCheck, IconX, IconEdit } from "@tabler/icons-react";

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
  { id: 4, nombre: "Almacén A", ubicacion: "Planta Norte", estatus: "Habilitado", responsable: "Juan Pérez" },
  { id: 5, nombre: "Almacén B", ubicacion: "Planta Sur", estatus: "Deshabilitado", responsable: "María López" },
  { id: 6, nombre: "Almacén C", ubicacion: "Planta Centro", estatus: "Habilitado", responsable: "Carlos Ruiz" },
  { id: 7, nombre: "Almacén A", ubicacion: "Planta Norte", estatus: "Habilitado", responsable: "Juan Pérez" },
  { id: 8, nombre: "Almacén B", ubicacion: "Planta Sur", estatus: "Deshabilitado", responsable: "María López" },
  { id: 9, nombre: "Almacén C", ubicacion: "Planta Centro", estatus: "Habilitado", responsable: "Carlos Ruiz" },
  { id: 10, nombre: "Almacén A", ubicacion: "Planta Norte", estatus: "Habilitado", responsable: "Juan Pérez" },
  { id: 11, nombre: "Almacén B", ubicacion: "Planta Sur", estatus: "Deshabilitado", responsable: "María López" },
  { id: 12, nombre: "Almacén C", ubicacion: "Planta Centro", estatus: "Habilitado", responsable: "Carlos Ruiz" },
  { id: 13, nombre: "Almacén A", ubicacion: "Planta Norte", estatus: "Habilitado", responsable: "Juan Pérez" },
  { id: 14, nombre: "Almacén B", ubicacion: "Planta Sur", estatus: "Deshabilitado", responsable: "María López" },
  { id: 15, nombre: "Almacén C", ubicacion: "Planta Centro", estatus: "Habilitado", responsable: "Carlos Ruiz" },
  { id: 16, nombre: "Almacén A", ubicacion: "Planta Norte", estatus: "Habilitado", responsable: "Juan Pérez" },
  { id: 17, nombre: "Almacén B", ubicacion: "Planta Sur", estatus: "Deshabilitado", responsable: "María López" },
  { id: 18, nombre: "Almacén C", ubicacion: "Planta Centro", estatus: "Habilitado", responsable: "Carlos Ruiz" },
  { id: 19, nombre: "Almacén A", ubicacion: "Planta Norte", estatus: "Habilitado", responsable: "Juan Pérez" },
  { id: 20, nombre: "Almacén B", ubicacion: "Planta Sur", estatus: "Deshabilitado", responsable: "María López" },
  { id: 21, nombre: "Almacén C", ubicacion: "Planta Centro", estatus: "Habilitado", responsable: "Carlos Ruiz" },
];

export default function SubalmacenesDashboard() {
  const [search, setSearch] = useState<string>("");
  const [data, setData] = useState<Subalmacen[]>(subalmacenesMock);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selected, setSelected] = useState<Subalmacen | null>(null);

  const filtered = data.filter((s) =>
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
    setEditModalOpen(true);
  };

  const handleSave = () => {
    if (selected) {
      setData((prev) =>
        prev.map((s) => (s.id === selected.id ? selected : s))
      );
    }
    setEditModalOpen(false);
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
                      leftSection={
                        s.estatus === "Habilitado" ? (
                          <IconCheck size={16} />
                        ) : (
                          <IconX size={16} />
                        )
                      }
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
        >
          {selected && (
            <div>
              <TextInput
                label="Nombre del Subalmacén"
                value={selected.nombre}
                onChange={(e) =>
                  setSelected({ ...selected, nombre: e.currentTarget.value })
                }
                mb="sm"
              />
              <TextInput
                label="Ubicación"
                value={selected.ubicacion}
                onChange={(e) =>
                  setSelected({ ...selected, ubicacion: e.currentTarget.value })
                }
                mb="sm"
              />
              <TextInput
                label="Responsable"
                value={selected.responsable}
                onChange={(e) =>
                  setSelected({ ...selected, responsable: e.currentTarget.value })
                }
                mb="sm"
              />

              <Group justify="space-between" mt="md">
                <Button variant="default" onClick={() => setEditModalOpen(false)}>
                  Cancelar
                </Button>
                <Button color="blue" onClick={handleSave}>
                  Guardar
                </Button>
              </Group>
            </div>
          )}
        </Modal>
      </AppShell.Main>
    </AppShell>
  );
}