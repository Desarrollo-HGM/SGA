// src/services/stockService.ts
import { stockRepository } from "../repositories/stockRepository.js";

export const stockService = {
  async getConsolidado(id_subalmacen: number) {
    return stockRepository.getConsolidado(id_subalmacen);
  }
};
