// utils/generarPDF.ts
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import QRCode from "qrcode";
import CryptoJS from "crypto-js";
import logo from "../../src/assets/hgm.png";
import type { DatosPDF } from "../types/global";

export const generarPDF = async ({  cart }: DatosPDF) => {
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
  const datos = { folio, fecha,  detalle: cart };
  const hash = CryptoJS.SHA256(JSON.stringify(datos)).toString();
  const qr = await QRCode.toDataURL(JSON.stringify({ folio, hash }));

  const doc = new jsPDF();

  // LOGO Y ENCABEZADO
  doc.addImage(logo, "PNG", 10, 10, 25, 20);
  doc.setFontSize(16);
  doc.text("Solicitud de Insumos", 65, 20);
  doc.setFontSize(11);
  doc.text(`Folio: ${folio}`, 20, 35);
  doc.text(`Fecha: ${fecha}`, 20, 42);
 


  // TABLA
  autoTable(doc, {
    startY: 75,
    head: [["Insumo", "Cantidad", "Lote"]],
    body: cart.map(i => [i.insumo, i.cantidad, i.lote]),
    theme: "grid",
    headStyles: { fillColor: [0, 70, 140], textColor: 255, halign: "center" },
    bodyStyles: { halign: "center" },
    alternateRowStyles: { fillColor: [230, 240, 255] },
    styles: { fontSize: 10 }
  });

  const finalY = (doc as any).lastAutoTable.finalY;

  // FIRMA Y QR
  doc.setFontSize(8);
  doc.text("Firma digital:", 20, finalY + 15);
  doc.text(doc.splitTextToSize(hash, 160), 20, finalY + 20);
  doc.addImage(qr, "PNG", 150, finalY + 5, 40, 40);

  doc.save(`Solicitud_${folio}.pdf`);

  return {
    folio,
    fecha,
    cart,
    hash
  };
};