// src/services/configStockService.ts
import { configStockRepository } from "../repositories/configStockRepository.js";
import { logger } from "../config/logger.js";

export const configStockService = {
  async setConfig(id_subalmacen: number, id_insumo: number, minimo: number, maximo: number) {
    if (minimo > maximo) {
      logger.warn("[ConfigStockService] Validación fallida: mínimo > máximo", { minimo, maximo });
      throw new Error("El mínimo no puede ser mayor que el máximo");
    }
    await configStockRepository.setConfig(id_subalmacen, id_insumo, minimo, maximo);
    logger.info("[ConfigStockService] Configuración establecida", { id_subalmacen, id_insumo });
  },

  async getConfig(id_subalmacen: number, id_insumo: number) {
    const config = await configStockRepository.getConfig(id_subalmacen, id_insumo);
    if (!config) {
      logger.warn("[ConfigStockService] Configuración no encontrada", { id_subalmacen, id_insumo });
      throw new Error("Configuración de stock no encontrada");
    }
    return config;
  },
};