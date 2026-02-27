import { useState } from "react";
import {
  Table,
  Checkbox,
  Button,
  Modal,
  TextInput,
  Group,
  NumberInput,
  Text
} from "@mantine/core";
import { IconPrinter, IconCheck } from "@tabler/icons-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import QRCode from "qrcode";
import logo from "../../assets/hgm.png";
import {  TimeInput } from "@mantine/dates";
interface Insumo {
  id: number;
  insumo: string;
  descripcion: string;
  clave: string;
  unidad: string;
  maximo: number;
  minimo: number;
  existencias: number;

}

interface FormData {
  quienSurte: string;
  fecha: string;
  hora: string;
}

const insumosMock: Insumo[] = [
  {
    id: 1,
    insumo: "Guantes",
    descripcion: "Guantes de látex",
    clave: "GLX-001",
    unidad: "Caja",
    maximo: 100,
    minimo: 20,
    existencias: 50,
  },
  {
    id: 2,
    insumo: "Cubrebocas",
    descripcion: "Cubrebocas triple capa",
    clave: "CBK-002",
    unidad: "Paquete",
    maximo: 200,
    minimo: 50,
    existencias: 120,
  },
];

export default function TablaSurtido() {
  const [seleccionados, setSeleccionados] = useState<number[]>([]);
  const [cantidades, setCantidades] = useState<Record<number, number>>({});
  const [modalOpen, setModalOpen] = useState(false);

  const [formData, setFormData] = useState<FormData>({
    quienSurte: "",
   
    fecha: "",
    hora: "",
  });

  /* ================= FORMULA AUTOMATICA ================= */

  const diferenciaASurtir = (item: Insumo) => {
    const diff = item.maximo - item.existencias;
    return diff > 0 ? diff : 0;
  };

  /* ================= SELECCION ================= */

  const toggleSeleccion = (id: number) => {
    const item = insumosMock.find((i) => i.id === id);
    if (!item) return;

    if (seleccionados.includes(id)) {
      setSeleccionados(seleccionados.filter((x) => x !== id));
      const nuevas = { ...cantidades };
      delete nuevas[id];
      setCantidades(nuevas);
    } else {
      setSeleccionados([...seleccionados, id]);
      setCantidades({
        ...cantidades,
        [id]: diferenciaASurtir(item),
      });
    }
  };

  const seleccionarTodos = () => {
    if (seleccionados.length === insumosMock.length) {
      setSeleccionados([]);
      setCantidades({});
    } else {
      const todos = insumosMock.map((i) => i.id);
      const nuevas: Record<number, number> = {};
      insumosMock.forEach((item) => {
        nuevas[item.id] = diferenciaASurtir(item);
      });
      setSeleccionados(todos);
      setCantidades(nuevas);
    }
  };

  const totalASurtir = () =>
    Object.values(cantidades).reduce((acc, val) => acc + (val || 0), 0);

  /* ================= HASH ================= */

  const generarHash = async (data: string) => {
    const encoder = new TextEncoder();
    const encoded = encoder.encode(data);
    const hashBuffer = await crypto.subtle.digest("SHA-256", encoded);
    return Array.from(new Uint8Array(hashBuffer))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
  };

  /* ================= PDF ================= */

  const handleGuardar = async () => {
    const detalle = seleccionados
      .map((id) => {
        const item = insumosMock.find((i) => i.id === id)!;
        return `${item.insumo}|${item.clave}|${item.maximo}|${item.minimo}|${item.existencias}|${cantidades[id]}`;
      })
      .join(";");

    const cadena = `
Quien surte: ${formData.quienSurte}

Fecha: ${formData.fecha}
Hora: ${formData.hora}
Detalle: ${detalle}
`;

    const hash = await generarHash(cadena);
    const qrDataUrl = await QRCode.toDataURL(`${cadena}\nHASH:${hash}`);

    const doc = new jsPDF();

    doc.setFillColor(0, 51, 102);
    doc.rect(0, 0, 210, 30, "F");
    doc.addImage(logo, "PNG", 10, 5, 25, 20);

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(18);
    doc.text("Institución - Acuse de Surtido", 45, 20);

    doc.setTextColor(0, 0, 0);
    doc.setFontSize(12);
    doc.text(`Quién surte: ${formData.quienSurte}`, 20, 45);
   
    doc.text(`Fecha: ${formData.fecha}`, 20, 65);
    doc.text(`Hora: ${formData.hora}`, 20, 75);

    autoTable(doc, {
      startY: 85,
      head: [[
        "#",
        "Insumo",
        "Clave",
        "Máximo",
        "Mínimo",
        "Existencias",
        "Cantidad a surtir",
        "Cantidad surtida",
      ]],
      body: seleccionados.map((id, index) => {
        const item = insumosMock.find((i) => i.id === id)!;
        return [
          index + 1,
          item.insumo,
          item.clave,
          item.maximo,
          item.minimo,
          item.existencias,
          diferenciaASurtir(item),
          cantidades[id],
        ];
      }),
      styles: { fontSize: 9 },
      headStyles: { fillColor: [0, 51, 102], textColor: 255 },
    });

    const finalY = (doc as any).lastAutoTable.finalY;

    doc.text(`Total a surtir: ${totalASurtir()}`, 40, finalY + 10);

    doc.addImage(qrDataUrl, "PNG", 150, finalY + 20, 40, 40);

    doc.setFontSize(8);
    doc.text("Cadena de autenticidad del documento:", 20, finalY + 150);
    doc.text(hash, 20, finalY + 155, { maxWidth: 120 });

    
   // Firmas centradas
doc.setFontSize(12);

// Firma de quien entrega (automática con nombre)
doc.text("Firma de quien surte:", 55, finalY + 100, { align: "center" });
doc.text("__________________", 55, finalY + 110, { align: "center" });


// Firma de quien recibe (manual)
doc.text("Firma de quien recibe:", 155, finalY + 100, { align: "center" });
doc.text("__________________", 155, finalY + 110, { align: "center" });







    doc.save("acuse_surtido.pdf");
    setModalOpen(false);
  };

  return (
    <>
      <Group justify="flex-end" mb="md">
        <Button leftSection={<IconCheck size={18} />} onClick={() => setModalOpen(true)}>
          Surtir seleccionados
        </Button>
      </Group>

      <Table striped withTableBorder 
 > 
        <thead className="table-head"  >
          <tr>
            <th>
              <Checkbox
                checked={seleccionados.length === insumosMock.length}
                onChange={seleccionarTodos}
              />
            </th>
            <th >Insumo</th>
            <th>Clave</th>
            <th>Máximo</th>
            <th>Mínimo</th>
            <th>Existencias</th>
            <th>Diferencia</th>
            <th>Cantidad a surtir</th>
          </tr>
        </thead>
        <tbody >
          {insumosMock.map((item) => (
            <tr key={item.id}>
              <td>
                <Checkbox
                  checked={seleccionados.includes(item.id)}
                  onChange={() => toggleSeleccion(item.id)}
                />
              </td>
              <td>{item.insumo}</td>
              <td>{item.clave}</td>
              <td>{item.maximo}</td>
              <td>{item.minimo}</td>
              <td>{item.existencias}</td>
              <td>{diferenciaASurtir(item)}</td>
              <td>
                {seleccionados.includes(item.id) && (
                  <NumberInput
                    value={cantidades[item.id]}
                    min={0}
                    max={item.maximo}
                    onChange={(value) =>
                      setCantidades({
                        ...cantidades,
                        [item.id]: Number(value) || 0,
                      })
                    }
                  />
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
<Modal
  opened={modalOpen}
  onClose={() => setModalOpen(false)}
  centered
  size="lg"
  title="Confirmación de Surtido"
>
  {/* Quién surte */}
  <TextInput
    label="Quién surte"
    value={formData.quienSurte}
    onChange={(e) =>
      setFormData({ ...formData, quienSurte: e.currentTarget.value })
    }
    required
  />

 {/* Fecha */}
<TextInput
  label="Fecha"
  type="date"
  value={formData.fecha ?? ""}
  onChange={(e) =>
    setFormData({ ...formData, fecha: e.currentTarget.value })
  }
  required
/>

{/* Hora */}
<TimeInput
  label="Hora"
  value={formData.hora}
  onChange={(event) =>
    setFormData({ ...formData, hora: event.currentTarget.value })
  }
  mt="sm"
  required
/>

  {/* Resumen */}
  <div style={{ marginTop: 20 }}>
    <Text fw={600}>Resumen de surtido:</Text>

    <ul>
      {seleccionados.map((id) => {
        const item = insumosMock.find((i) => i.id === id)!;
        return (
          <li key={id}>
            {item.insumo} — Diferencia: {diferenciaASurtir(item)} — A surtir: {cantidades[id]}
          </li>
        );
      })}
    </ul>

    <Text fw={600}>Total: {totalASurtir()}</Text>
  </div>

  <Group justify="flex-end" mt="md">
    <Button
      leftSection={<IconPrinter size={18} />}
      onClick={handleGuardar}
      disabled={
        seleccionados.length === 0 ||
        !formData.quienSurte.trim()
      }
    >
      Firmar y Generar PDF
    </Button>
  </Group>
</Modal>
    </>
  );
}