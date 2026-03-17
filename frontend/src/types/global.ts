/* MODELOS */

export interface Insumo {
 id: number;
  clave: string;
  insumo: string;
  tipo_insumo: string;
  unidad_distribucion: string;
  servicio: string;
  subalmacen: string;
  lote: string;
  stock: number;
  minimo: number;
  maximo: number;
}

export interface CartItem extends Insumo {
  cantidad: number;
  justificacion?: string;
}
