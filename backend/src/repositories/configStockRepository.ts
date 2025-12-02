// src/repositories/configStockRepository.ts
import { db } from "../config/db.js";
import { logger } from "../config/logger.js";

export const configStockRepository = {
  async setConfig(id_subalmacen: number, id_insumo: number, minimo: number, maximo: number) {
    logger.debug("[ConfigStockRepository] Guardando configuración de stock", { id_subalmacen, id_insumo, minimo, maximo });
    await db("config_stock")
      .insert({ id_subalmacen, id_insumo, minimo, maximo })
      .onConflict(["id_subalmacen", "id_insumo"])
      .merge({ minimo, maximo });
    logger.info("[ConfigStockRepository] Configuración guardada", { id_subalmacen, id_insumo });
  },

  async getConfig(id_subalmacen: number, id_insumo: number) {
    logger.debug("[ConfigStockRepository] Obteniendo configuración de stock", { id_subalmacen, id_insumo });
    return db("config_stock")
      .where({ id_subalmacen, id_insumo })
      .first();
  },
};
