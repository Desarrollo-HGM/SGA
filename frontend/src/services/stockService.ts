// src/services/stockService.ts
import api from "../config/api";

export interface StockItem {
  id: number;
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
