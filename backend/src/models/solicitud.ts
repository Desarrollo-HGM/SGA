// src/models/solicitud.ts
export interface Solicitud {
  id_solicitudes?: number;
  cantidad: number;
  tipo_solicitud: "Clinica" | "ReabastecimientoManual" | "ReabastecimientoAutomatico";
  fecha_solicitud: Date;
  id_medico: number;
  id_servicio: number;
  id_insumos: number;
  id_subalmacen: number;
  id_lote: number; // ✅ nuevo campo
  estado?: "Pendiente" | "Aprobada" | "Rechazada" | "Ejecutada";
}