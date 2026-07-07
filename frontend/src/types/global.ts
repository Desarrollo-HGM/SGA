export interface Insumo {
  id: number;
  id_servicio: number;
  id_subalmacen: number;
  id_lote: number;
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
  codigo_barras?: string;
  loading?: boolean;
}

export interface CartItem extends Insumo {
  cantidad: number;
  justificacion?: string;
}


 