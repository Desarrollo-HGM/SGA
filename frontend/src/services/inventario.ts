import api from "../config/api";
import type { Insumo } from "../types/global";

export const getInventario = async (): Promise<Insumo[]> => {
  const res = await api.get("/api/stock/consolidado");

  const data = res.data.data || res.data;

  console.log("INVENTARIO API", data);

  return data.map((item: any): Insumo => ({
  id: Number(item.id),
  clave: item.clave ?? "",
  insumo: item.insumo ?? "",
  id_servicio: Number(item.id_servicio ?? 0),
  id_subalmacen: Number(item.id_subalmacen ?? 0),
  tipo_insumo: item.tipo_insumo ?? "",
  unidad_distribucion: item.unidad_distribucion ?? "",
  servicio: item.servicio ?? "",
  subalmacen: item.subalmacen ?? "",
  lote: item.lote ?? "",
  stock: Number(item.stock ?? 0),
  minimo: Number(item.minimo ?? 0),
  maximo: Number(item.maximo ?? 0),
}));
};

