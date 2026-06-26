export interface ItemPDF {
  insumo: string;
  cantidad: number;
  lote?: string;
  stock?: number;
  maximo?: number;
  justificacion?: string;
}

export interface DatosPDF {
  cart: ItemPDF[];
  quienSurte?: string;
  quienRecibe?: string;
  lote?: string;
}