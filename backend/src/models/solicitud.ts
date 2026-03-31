// src/models/solicitud.ts
export interface Solicitud {
  id_solicitudes?: number;
  tipo_solicitud: "Clinica" | "ReabastecimientoManual" | "ReabastecimientoAutomatico";
  fecha_solicitud: string | Date;   // se guarda como YYYY-MM-DD
  id_medico?: number | null;        // requisitante (por ahora cat_medicos)
  id_servicio: number;
  id_subalmacen: number;
  justificacion?: string | null;
  estado?: "Pendiente" | "Aprobada" | "Rechazada" | "Completada";
}

// Detalle de insumos dentro de la solicitud
export interface SolicitudDetalle {
  id_detalle?: number;
  id_solicitudes: number;
  id_insumos: number;
  cantidad: number;
  id_lote?: number;
  estado?: "Pendiente" | "Aprobada" | "Rechazada" | "Completada";
}

// Payload que recibe el servicio al crear una solicitud
export interface SolicitudPayload {
  tipo_solicitud: "Clinica" | "ReabastecimientoManual" | "ReabastecimientoAutomatico";
  id_medico?: number;
  id_servicio: number;
  id_subalmacen: number;
  justificacion?: string;
  insumos: {
    id_insumos: number;
    cantidad: number;
  }[];
}
