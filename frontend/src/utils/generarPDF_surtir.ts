import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import QRCode from "qrcode";
import CryptoJS from "crypto-js";
import logo from "../../src/assets/hgm.png";

/* ================= TIPOS ================= */

export interface ItemPDF {
  insumo: string;
  cantidad: number;
  lote?: string;
  stock?: number;
  maximo?: number;
  justificacion?: string;
}

export interface DatosPDF {
  cart: ItemPDF[];
  quienSurte?: string;
  quienRecibe?: string;
}

/* ================= FUNCIÓN ================= */

export const generarPDF = async ({
  cart,
  quienSurte,
  quienRecibe
}: DatosPDF) => {

  /* ================= VALIDACIONES ================= */

  if (!cart || cart.length === 0) {
    alert("El carrito está vacío");
    return;
  }

  for (const i of cart) {
    if ((i.cantidad > (i.maximo ?? Infinity) || i.cantidad > (i.stock ?? Infinity)) && !i.justificacion) {
      alert(`Debe justificar el insumo: ${i.insumo}`);
      return;
    }
  }

  if (!quienSurte || !quienRecibe) {
    alert("Debe indicar quién surte y quién recibe");
    return;
  }

  /* ================= DATOS ================= */

  const folio = `SOL-${Date.now()}`;
  const fecha = new Date().toLocaleString();

  const datos = {
    folio,
    fecha,
    detalle: cart
  };

  const hash = CryptoJS.SHA256(JSON.stringify(datos)).toString();

  const qr = await QRCode.toDataURL(
    JSON.stringify({ folio, hash })
  );

  const doc = new jsPDF();

  /* ================= ENCABEZADO ================= */

  doc.addImage(logo, "PNG", 10, 10, 25, 20);

  doc.setFontSize(16);
  doc.text("Solicitud de Insumos", 65, 20);

  doc.setFontSize(11);
  doc.text(`Folio: ${folio}`, 20, 35);
  doc.text(`Fecha: ${fecha}`, 20, 42);

  /* ================= TABLA ================= */

  autoTable(doc, {
    startY: 55,
    head: [["Insumo", "Cantidad", "Lote"]],
    body: cart.map(i => [
      i.insumo,
      i.cantidad,
      i.lote || "—"
    ]),
    theme: "grid",
    headStyles: {
      fillColor: [0, 70, 140],
      textColor: 255,
      halign: "center"
    },
    bodyStyles: {
      halign: "center"
    },
    alternateRowStyles: {
      fillColor: [230, 240, 255]
    },
    styles: {
      fontSize: 10
    }
  });

  const finalY = (doc as any).lastAutoTable.finalY;

  /* ================= FIRMAS ================= */

  doc.setFontSize(10);

  // QUIEN SURTE
  doc.text("Entrega:", 20, finalY + 20);
  doc.line(20, finalY + 25, 90, finalY + 25);
  doc.text(quienSurte, 20, finalY + 32);

  // QUIEN RECIBE
  doc.text("Recibe:", 120, finalY + 20);
  doc.line(120, finalY + 25, 190, finalY + 25);
  doc.text(quienRecibe, 120, finalY + 32);

  /* ================= HASH + QR ================= */

  doc.setFontSize(8);

  doc.text("Firma digital (hash):", 20, finalY + 45);
  doc.text(
    doc.splitTextToSize(hash, 160),
    20,
    finalY + 50
  );

  doc.addImage(qr, "PNG", 150, finalY + 40, 40, 40);

  /* ================= EXPORTAR ================= */

  doc.save(`Solicitud_${folio}.pdf`);

  return {
    folio,
    fecha,
    cart,
    hash
  };
};