
export interface Solicitud {
  id_solicitud: number;
  cantidad: number;
  tipo_solicitud: string;
  fecha_solicitud: string;
  requisitante: string;
  servicio: string;
  insumo: string;
  subalmacen: string;
  estado: "pendiente" | "surtida" | "cancelada";
  lote: string;
  justificacion?: string;
}

// 🔥 Simulación tipo backend
export const getSolicitudes = async (): Promise<Solicitud[]> => {
  await new Promise((res) => setTimeout(res, 500)); // delay fake

  const estados = ["pendiente", "surtida", "cancelada"] as const;
  const servicios = ["Urgencias", "UCI", "Pediatría", "Quirófano"];

  return Array.from({ length: 8 }).map((_, i) => ({
    id_solicitud: i + 1,
    cantidad: Math.floor(Math.random() * 10) + 1,
    tipo_solicitud: "Ordinaria",
    fecha_solicitud: new Date(
      Date.now() - Math.random() * 100000000
    ).toISOString(),
    requisitante: "Dr. García",
    servicio: servicios[Math.floor(Math.random() * servicios.length)],
    insumo: `Insumo ${i + 1}`,
    subalmacen: "Central",
    estado: estados[Math.floor(Math.random() * estados.length)],
    lote: "L-" + (1000 + i),
    justificacion: "Uso clínico"
  }));
};