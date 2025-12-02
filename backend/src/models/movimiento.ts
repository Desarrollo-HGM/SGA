export interface Movimiento {
  id_movimiento?: number | undefined; // ✅ ahora acepta undefined
  tipo_movimiento: "Entrada" | "Salida";
  cantidad: number;
  fecha_movimiento: Date;
  id_solicitudes: number;
  id_lote: number;
  id_subalmacen: number;
  estado_verificacion?: "Pendiente" | "Verificado" | "Parcial";
}
