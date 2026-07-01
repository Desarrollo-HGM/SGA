export interface InsumoPDF {
  id_detalle: number;
  id_insumos: number;
  descripcion: string;
  cantidad: number;
  solicitado: number;
  id_lote: number | string;
  estado: string;
  nombre_almacen: string;
}

export interface DatosPDF {
  cart: InsumoPDF[];
  quienSurte: string;
  quienRecibe: string;
  justificacion_parcial?: string | null;
}
