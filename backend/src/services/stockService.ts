// src/services/stockService.ts
import { stockRepository } from "../repositories/stockRepository.js";
import { logger } from "../config/logger.js";

export const stockService = {
  async getConsolidado() {
    logger.debug("[StockService] Obteniendo stock consolidado");
    return await stockRepository.getConsolidado();
  }
};
