// src/services/stockService.ts
import api from "../config/api";

export interface StockItem {
  id: number;
  id_servicio: number;
  id_subalmacen: number;
  id_medico: number;
  nombre_insumo: string;
  nombre_subalmacen: string;
  stock_total_insumo: number;
  minimo: number;
  maximo: number;
  estado: string;
}

export const stockService = {
  async getConsolidado(): Promise<StockItem[]> {
    const res = await api.get("/api/stock/consolidado");
    return res.data.map((item: any, index: number) => ({
      id: index,
      id_servicio: item.id_servicio,
      id_subalmacen: item.id_subalmacen,
      id_medico: item.id_medico,
      nombre_insumo: item.nombre_insumo,
      nombre_subalmacen: item.nombre_subalmacen,
      stock_total_insumo: item.stock_total_insumo,
      minimo: item.minimo,
      maximo: item.maximo,
      estado:
        item.stock_total_insumo < item.minimo
          ? "Bajo mínimo"
          : item.stock_total_insumo > item.maximo
            ? "Sobre máximo"
            : "OK",
    }));
  },
};
 