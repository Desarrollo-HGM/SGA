import api from "../config/api";

/* ================= INTERFACES ================= */

// 1. Interfaz para la cabecera general de las solicitudes
export interface Solicitud {
  id_solicitudes: number;
  tipo_solicitud: string;
  fecha_solicitud: string;
  estado: "Pendiente" | "Surtida" | "Cancelada" | string;
  justificacion: string | null;
  id_servicio: number;
  nombre_servicio: string;
  id_subalmacen: number;
  nombre_subalmacen: string;
  id_medico: number;
  nombre_requisitor: string;
}

// 2. Interfaz para los insumos contenidos dentro del detalle de una solicitud
export interface InsumoSolicitado {
  id_insumos: number;
  clave: string;
  insumo: string;
  tipo_insumo: string;
  unidad_distribucion: string;
  stock: number;
  cantidad: number; // Cantidad solicitada originalmente por el médico
  id_lote: number;
  estado: "Pendiente" | "Surtida" | "Cancelada" | string;
  descripcion: string; // Descripción del insumo
}

// 3. Interfaz extendida para la respuesta del detalle completo
export interface DetalleSolicitudResponse extends Solicitud {
  insumos: InsumoSolicitado[];
}

/* ================= FUNCIONES API ================= */

/**
 * Obtiene el listado completo de solicitudes del backend
 */
export const getSolicitudes = async (): Promise<Solicitud[]> => {
  const response = await api.get("/api/solicitudes");
  return response.data;
};

/**
 * Obtiene la información específica y los insumos de una sola solicitud por su ID
 * Endpoint real consumido: /api/solicitudes/:id
 */
export const getDetalleSolicitud = async (id: number): Promise<DetalleSolicitudResponse> => {
  const response = await api.get(`/api/solicitudes/${id}`);
  return response.data;
};

/**
 * Registra el surtido de una solicitud en el backend
 * Endpoint: POST /api/solicitudes/:id
 */
export const surtirSolicitud = async (
  id: number,
  payload: {
    observaciones?: string | null;
    insumos: {
      id_detalle: number;
      id_insumos: number;
      id_lote: number;
      cantidad_solicitada: number;
      cantidad_suministrada: number;
    }[];
  }
): Promise<void> => {
  await api.post(`/api/solicitudes/${id}`, payload);
};

