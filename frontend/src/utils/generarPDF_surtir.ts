import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import QRCode from "qrcode";
import CryptoJS from "crypto-js";
import logo from "../../src/assets/hgm.png";
import type {InsumoPDF} from "../types/pdf";
import type {DatosPDF} from "../types/pdf";

export const generarPDF = async ({
  cart,
  quienSurte,
  quienRecibe,
  justificacion_parcial
}: DatosPDF) => {

  if (!cart || cart.length === 0) {
    alert("No hay insumos seleccionados para generar el acuse");
    return;
  }

  if (!quienSurte || !quienRecibe) {
    alert("Debe indicar quién surte y quién recibe");
    return;
  }

  const folio = `ACU-${Date.now()}`;
  const fecha = new Date().toLocaleString("es-MX");

  // ================= AGRUPACIÓN LOGÍSTICA POR ALMACÉN =================
  const almacenesAgrupados: { [key: string]: InsumoPDF[] } = {};
  
  cart.forEach(item => {
    const nombreAlmacen = item.nombre_almacen || "ALMACÉN NO ESPECIFICADO";
    if (!almacenesAgrupados[nombreAlmacen]) {
      almacenesAgrupados[nombreAlmacen] = [];
    }
    almacenesAgrupados[nombreAlmacen].push(item);
  });

  const datosHash = {
    folio,
    fecha,
    detalle: cart,
    justificacion_parcial
  };

  const hash = CryptoJS.SHA256(JSON.stringify(datosHash)).toString();
  const qr = await QRCode.toDataURL(JSON.stringify({ folio, hash }));

  const doc = new jsPDF();

  // ================= ENCABEZADO INSTITUCIONAL =================
  doc.addImage(logo, "PNG", 10, 10, 25, 20);
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("HOSPITAL GENERAL DE MÉXICO", 40, 16);
  doc.setFontSize(12);
  doc.setFont("helvetica", "normal");
  doc.text("Acuse de Surtido de Insumos", 40, 22);

  doc.setFontSize(10);
  doc.text(`Folio Interno: ${folio}`, 145, 16);
  doc.text(`Fecha Emisión: ${fecha}`, 145, 22);
  doc.line(10, 33, 200, 33);

  // DATOS OPERATIVOS
  doc.setFont("helvetica", "bold");
  doc.text("Área Origen / Entrega:", 10, 40);
  doc.setFont("helvetica", "normal");
  doc.text(quienSurte, 53, 40);

  doc.setFont("helvetica", "bold");
  doc.text("Servicio Destino / Recibe:", 10, 46);
  doc.setFont("helvetica", "normal");
  doc.text(quienRecibe, 57, 46);
  doc.line(10, 50, 200, 50);

  let currentY = 55;

  // ================= GENERACIÓN DE TABLAS SEPARADAS POR ALMACÉN =================
  Object.keys(almacenesAgrupados).forEach((nombreAlmacen) => {
    // Si la tabla va a desbordar la página actual, agregamos una nueva hoja
    if (currentY > 230) {
      doc.addPage();
      currentY = 20;
    }

    // Subtítulo del Almacén
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setFillColor(240, 240, 240);
    doc.rect(10, currentY, 190, 7, "F");
    doc.text(`ALMACEN: ${nombreAlmacen.toUpperCase()}`, 13, currentY + 5);
    
    currentY += 10;

        autoTable(doc, {
      startY: currentY,
      head: [["Descripción / Insumo", "Cant. Pedida", "Cant. Surtida", "Asignado"]],
      body: almacenesAgrupados[nombreAlmacen].map(i => [
        i.descripcion,
        i.cantidad,
        i.solicitado,
        i.id_lote || "—"
      ]),
      theme: "grid",
      headStyles: {
        fillColor:[11, 111, 164],
        textColor: 255,
        halign: "center",
        fontSize: 9
      },
      bodyStyles: {
        halign: "center",
        fontSize: 9
      },
      // 🔥 1. AJUSTE DE COLUMNAS SIMÉTRICO: Descripción ancha, cantidades del mismo tamaño
      columnStyles: {
        0: { halign: "left", cellWidth: 90 },  // Descripción (La más grande)
        1: { halign: "center", cellWidth: 25 }, // Cantidad Pedida
        2: { halign: "center", cellWidth: 25 }, // Cantidad Surtida (Mismo tamaño que la pedida)
        3: { halign: "center", cellWidth: 30 }  // Lote Asignado
      },
      alternateRowStyles: {
        fillColor: [245, 249, 252]
      },
      // 🔥 2. REGLA EN TIEMPO DE RENDERIZADO PARA PINTAR EN ROJO
      didParseCell: (data) => {
        // Validamos que estemos procesando las filas del cuerpo (body) y específicamente la celda de Cant. Surtida (columna índice 2)
        if (data.section === "body" && data.column.index === 2) {
          const fila = data.row.raw as (string | number)[];
          
          const cantPedida = Number(fila[1]);  // Índice 1 de la fila mapeada
          const cantSurtida = Number(fila[2]); // Índice 2 de la fila mapeada

          // Si el surtido es desalineado (mayor o menor), cambiamos el estilo de la celda a color rojo
          if (cantSurtida !== cantPedida) {
            data.cell.styles.textColor = [224, 49, 49]; // Rojo brillante institucional (#e03131)
            data.cell.styles.fontStyle = "bold";        // Resaltado extra para el acuse
          }
        }
      }
    });


    currentY = (doc as any).lastAutoTable.finalY + 12;
  });

 // ================= TEXTO DE JUSTIFICACIÓN SI EXISTE =================

if (justificacion_parcial && justificacion_parcial.trim()) {
  if (currentY > 230) { 
    doc.addPage(); 
    currentY = 20; 
  }
  
  doc.setFont("helvetica", "bold");
  doc.text("Justificación de Surtido Incompleto:", 10, currentY);
  
  doc.setFont("helvetica", "italic");
  // CORREGIDO: Cambiado a justificacion_parcial aquí también
  const lineasJustificacion = doc.splitTextToSize(justificacion_parcial, 180);
  doc.text(lineasJustificacion, 10, currentY + 5);
  
  currentY += (lineasJustificacion.length * 5) + 10;
}


  // ================= SECCIÓN DE FIRMAS DE CONFORMIDAD =================
  if (currentY > 240) { doc.addPage(); currentY = 20; }
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");

  doc.text("Personal que Entrega", 20, currentY + 10);
  doc.line(20, currentY + 23, 90, currentY + 23);
  doc.setFont("helvetica", "normal");
  doc.text(quienSurte, 20, currentY + 28);

  doc.setFont("helvetica", "bold");
  doc.text("Responsable que Recibe", 120, currentY + 10);
  doc.line(120, currentY + 23, 190, currentY + 23);
  doc.setFont("helvetica", "normal");
  doc.text(quienRecibe, 120, currentY + 28);

  // ================= BLOC DE FIRMA DIGITAL Y SELLO QR =================
  doc.setFontSize(8);
  doc.setFont("helvetica", "bold");
  doc.text("Sello Digital de Validación de Surtido:", 10, currentY + 43);
  doc.setFont("helvetica", "normal");
  doc.text(doc.splitTextToSize(hash, 135), 10, currentY + 48);

  doc.addImage(qr, "PNG", 155, currentY + 35, 35, 35);

  doc.save(`Acuse_Surtido_${folio}.pdf`);

  return { folio, fecha, hash };
};
