import { useState, useMemo } from "react";
import {
  AppShell,
  Group,
  Card,
  Text,
  TextInput,
  Table,
  Button,
  Badge,
  Switch
} from "@mantine/core";
import { IconBuildingHospital } from "@tabler/icons-react";
import { DataTable } from "mantine-datatable";
import logo from "../../assets/hgm.png";

import {
  IconShoppingCart,
  IconPlus,
  IconTrash,
  IconSearch,
  IconFileInvoice
} from "@tabler/icons-react";

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import QRCode from "qrcode";
import CryptoJS from "crypto-js";
import type { CartItem, Insumo } from "../../types/global";

/* INVENTARIO DEMO */

const inventarioMock: Insumo[] = [
  { id: 1, insumo: "Guantes", servicio: "Urgencias", subalmacen: "NEFROLOGÍA", lote: "L01", stock: 100, minimo: 50, maximo: 100 },
  { id: 2, insumo: "Cubrebocas", servicio: "Laboratorio", subalmacen: "NEFROLOGÍA", lote: "L02", stock: 80, minimo: 60, maximo: 120 },
  { id: 3, insumo: "Jeringas", servicio: "Enfermería", subalmacen: "NEFROLOGÍA", lote: "L03", stock: 50, minimo: 30, maximo: 60 },
  { id: 4, insumo: "Gasas", servicio: "Hospitalización", subalmacen: "NEFROLOGÍA", lote: "L04", stock: 120, minimo: 95, maximo: 190 },
  { id: 5, insumo: "Alcohol", servicio: "Quirófano", subalmacen: "NEFROLOGÍA", lote: "L05", stock: 60, minimo: 70, maximo: 140 }
];

/* COMPONENTE */

export default function SolicitudesDashboard() {


  const [search, setSearch] = useState("");
  const [cart, setCart] = useState<CartItem[]>([]);

  const [usuario, setUsuario] = useState("");
  const [servicioSolicitante, setServicioSolicitante] = useState("");

  const [autorizado, setAutorizado] = useState(false);
  const [medico, setMedico] = useState("");

  /* FILTRO */

  const filtered = useMemo(() => {
    const q = search.toLowerCase();

    return inventarioMock.filter(i =>
      i.insumo.toLowerCase().includes(q) ||
      i.servicio.toLowerCase().includes(q) ||
      i.subalmacen.toLowerCase().includes(q)
    );
  }, [search]);

  /* AGRUPAR */

  const agrupados = useMemo(() => {
    return filtered.reduce((acc: any, item) => {
      if (!acc[item.subalmacen]) acc[item.subalmacen] = [];
      acc[item.subalmacen].push(item);
      return acc;
    }, {});
  }, [filtered]);

  /* AGREGAR AL CARRITO */

  const addToCart = (item: Insumo) => {
    const exist = cart.find(i => i.id === item.id);

    if (exist) {
      if (exist.cantidad >= item.stock) {
        alert("Stock insuficiente");
        return;
      }

      setCart(cart.map(i =>
        i.id === item.id
          ? { ...i, cantidad: i.cantidad + 1 }
          : i
      ));

    } else {
      setCart([...cart, { ...item, cantidad: 1 }]);
    }
  };

  /* ELIMINAR */

  const removeFromCart = (id: number) => {
    setCart(cart.filter(i => i.id !== id));
  };

  /* ACTUALIZAR CANTIDAD */

  const updateCantidad = (id: number, val: number) => {
    if (val <= 0) return;

    setCart(cart.map(i =>
      i.id === id
        ? { ...i, cantidad: val }
        : i
    ));
  };

  /* GENERAR PDF */

  const generarPDF = async () => {

    if (cart.length === 0) {
      alert("El carrito está vacío");
      return;
    }

    for (const i of cart) {

      if ((i.cantidad > i.maximo || i.cantidad > i.stock) && !i.justificacion) {
        alert(`Debe justificar ${i.insumo}`);
        return;
      }

 

    }

    const folio = `SOL-${Date.now()}`;
    const fecha = new Date().toLocaleString();

    const datos = {
      folio,
      fecha,
      usuario,
      servicio: servicioSolicitante,
      autorizado,
      medico,
      detalle: cart
    };

    const hash = CryptoJS.SHA256(JSON.stringify(datos)).toString();
    const qr = await QRCode.toDataURL(JSON.stringify({ ...datos, hash }));

    const doc = new jsPDF();


     /* LOGO */

    doc.addImage(logo, "PNG", 10, 5, 25, 20);
    doc.setFontSize(16);
    doc.text("Solicitud de Insumos", 65, 20);

    doc.setFontSize(11);
    doc.text(`Folio: ${folio}`, 20, 35);
    doc.text(`Fecha: ${fecha}`, 20, 42);
    doc.text(`Almacén: ${usuario}`, 20, 49);
    doc.text(`Servicio: ${servicioSolicitante}`, 20, 56);
    

    if (autorizado) {
      doc.text(`Autorizado por: ${medico}`, 20, 63);
    }

    autoTable(doc, {
  startY: 75,

  head: [["Insumo", "Cantidad", "Lote"]],

  body: cart.map(i => [
    i.insumo,
    i.cantidad,
    i.lote
  ]),

  theme: "grid",

  headStyles: {
    fillColor: [0, 70, 140], // azul institucional
    textColor: 255,
    halign: "center"
  },

  bodyStyles: {
    textColor: 0
  },

  alternateRowStyles: {
    fillColor: [230, 240, 255] // azul claro
  },

  styles: {
    fontSize: 10
  }

});

    const finalY = (doc as any).lastAutoTable.finalY;

    doc.setFontSize(8);

    doc.text("Firma digital:", 20, finalY + 15);

    doc.text(
      doc.splitTextToSize(hash, 160),
      20,
      finalY + 20
    );

    doc.addImage(qr, "PNG", 150, finalY + 5, 40, 40);

    doc.save(`Solicitud_${folio}.pdf`);
    setCart([]);


    /* OBJETO PARA BASE DE DATOS */

    const solicitudDB = {

      folio,
      fecha,

      usuario,
      servicio: servicioSolicitante,

      autorizacion: {
        requiere: autorizado,
        medico: autorizado ? medico : null
      },

      items: cart.map(i => ({
        insumo_id: i.id,
        insumo: i.insumo,
        cantidad: i.cantidad,
        lote: i.lote,
        subalmacen: i.subalmacen,
        justificacion: i.justificacion || null
      }))

    };

    console.log("Enviar a API:", solicitudDB);

  };

  return (
    <AppShell padding="md">
      <AppShell.Main>

        <Group justify="apart" mb="lg">
          <Text fw={700} size="xl">
            Solicitud de insumos
          </Text>

          <Badge color="blue" leftSection={<IconShoppingCart size={14} />}>
            {cart.length} en carrito
          </Badge>
        </Group>

        {/* DATOS SOLICITUD */}

        <Card withBorder mb="lg">

          <Text fw={700} mb="md">
            Datos de solicitud
          </Text>

          <Group>

            <TextInput
              label="Usuario solicitante"
              value={usuario}
              onChange={(e) => setUsuario(e.currentTarget.value)}
            />

            <TextInput
              label="Servicio solicitante"
              value={servicioSolicitante}
              onChange={(e) => setServicioSolicitante(e.currentTarget.value)}
            />

          </Group>

        </Card>

        {/* AUTORIZACION */}

        <Card withBorder mb="lg">

          <Group>

            <Switch
              label="Requiere autorización médica"
              checked={autorizado}
              onChange={(e) => setAutorizado(e.currentTarget.checked)}
            />

            {autorizado && (

              <TextInput
                label="Médico que autoriza"
                value={medico}
                onChange={(e) => setMedico(e.currentTarget.value)}
              />

            )}

          </Group>

        </Card>

        {/* BUSCAR */}

        <TextInput
          placeholder="Buscar insumo..."
          leftSection={<IconSearch size={16} />}
          value={search}
          onChange={(e) => setSearch(e.currentTarget.value)}
          mb="lg"
          style={{ width: 300 }}
        />

        {/* INVENTARIO */}

        {Object.entries(agrupados).map(([sub, items]: any) => (

          <Card
  key={sub}
  withBorder
  radius="md"
  shadow="sm"
  mt="md"
  style={{
    borderLeft: "6px solid #0b6fa4",
    background: "#f8fbfd"
  }}
>

  <Group justify="space-between" mb="sm">

    <Group>
      <IconBuildingHospital size={22} color="#0b6fa4" />

      <Text fw={700} size="lg" c="#0b6fa4">
        Subalmacén {sub}
      </Text>
    </Group>

    <Badge color="blue" variant="light">
      {items.length} insumos
    </Badge>

  </Group>

  <DataTable
    withTableBorder
    highlightOnHover
    striped
    verticalSpacing="xs"
    horizontalSpacing="md"

    records={items}

    columns={[

      {
        accessor: "insumo",
        title: "Insumo"
      },

      {
        accessor: "servicio",
        title: "Servicio"
      },

      {
        accessor: "stock",
        title: "Stock",
        render: (r:any)=>(
          <Badge
            color={
              r.stock <= r.minimo
                ? "red"
                : r.stock <= r.minimo + 20
                ? "yellow"
                : "green"
            }
            variant="light"
          >
            {r.stock}
          </Badge>
        )
      },

      {
        accessor: "minimo",
        title: "Min"
      },

      {
        accessor: "maximo",
        title: "Max"
      },

      {
        accessor: "accion",
        title: "Solicitud",
        textAlign:"center",

        render: (record:any)=>(
          <Button
            size="xs"
            radius="xl"
            color="teal"
            leftSection={<IconPlus size={14}/>}
            onClick={()=>addToCart(record)}
          >
            Solicitar
          </Button>
        )
      }

    ]}
  />

</Card>

        ))}

        {/* CARRITO */}

        <Card withBorder mt="xl">

          <Text fw={700}>
            Carrito de solicitud
          </Text>

          <Table striped highlightOnHover>
            <thead className="table-head">

              <tr>

                <th style={{ textAlign: "center" }}>Insumo</th>
                <th style={{ textAlign: "center" }}>Cantidad</th>
                <th style={{ textAlign: "center" }}>Justificación</th>
                <th style={{ textAlign: "center" }}>Acción</th>

              </tr>

            </thead>

            <tbody>

              {cart.map(item => (

          




                <tr key={item.id}>

                  <td style={{ textAlign: "center" }}>
                    {item.insumo}
                  </td>

                  <td style={{ textAlign: "center" }}>
                    <TextInput
                      type="number"
                      value={item.cantidad}
                      style={{ width: 80, margin: "auto" }}
                      onChange={(e) =>
                        updateCantidad(item.id, Number(e.currentTarget.value))
                      }
                    />
                  </td>

                  <td style={{ textAlign: "center" }}>

               {(item.stock + item.cantidad > item.maximo) && (
  <>
    <TextInput
      placeholder={
        item.cantidad > item.stock
          ? `Stock disponible: ${item.stock}`
          : `Máximo permitido: ${item.maximo}`
      }
      value={item.justificacion || ""}
      onChange={(e) => {
        setCart(cart.map(i =>
          i.id === item.id
            ? { ...i, justificacion: e.currentTarget.value }
            : i
        ));
      }}
    />
  </>
)}

                  </td>

                  <td style={{ textAlign: "center" }}>

                    <Button
                      size="xs"
                      color="red"
                      leftSection={<IconTrash size={14} />}
                      onClick={() => removeFromCart(item.id)}
                    >
                      Eliminar
                    </Button>

                  </td>

                </tr>

              ))}

            </tbody>

          </Table>

          <Button
            mt="md"
            color="green"
            leftSection={<IconFileInvoice size={18} />}
            onClick={generarPDF}
          >
            Generar solicitud
          </Button>

        </Card>

      </AppShell.Main>
    </AppShell>
  );
}