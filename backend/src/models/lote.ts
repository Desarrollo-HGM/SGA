// src/models/lote.ts
export interface Lote {
  id_lote?: number;
  totales: number;
  fecha_caducidad: Date;
  id_insumo: number;
  id_subalmacen: number; // nuevo campo para trazabilidad por almacén físico
}
