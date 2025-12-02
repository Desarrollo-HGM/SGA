// src/models/insumo.ts
export interface Insumo {
  id_insumos?: number;
  descripcion_corta: string;
  descripcion_larga: string;
  clave: string;
  unidad_distribucion: string;
  codigo_barras: string;
  minimo: number;
  maximo: number;
  punto_reabastecimiento: number;
  id_almacen: number;
}
