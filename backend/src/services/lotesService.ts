// src/services/lotesService.ts
import { lotesRepository } from "../repositories/loteRepository.js";
import type { Lote } from "../models/lote.js";
import { logger } from "../config/logger.js";

export const lotesService = {
  async create(data: Lote) {
    logger.debug("[LotesService] Creando lote", { data });
    if (data.totales <= 0) {
      logger.warn("[LotesService] Validación fallida: totales <= 0", { totales: data.totales });
      throw new Error("La cantidad del lote debe ser mayor a 0");
    }
    const lote = await lotesRepository.create(data);
    logger.info("[LotesService] Lote creado", { id: lote.id_lote });
    return lote;
  },

  async list(filter?: { id_insumo?: number; id_subalmacen?: number }) {
    logger.debug("[LotesService] Listando lotes", { filter });
    return lotesRepository.findAll(filter);
  },

  async get(id: number) {
    logger.debug("[LotesService] Obteniendo lote", { id });
    const lote = await lotesRepository.findById(id);
    if (!lote) {
      logger.warn("[LotesService] Lote no encontrado", { id });
      throw new Error("Lote no encontrado");
    }
    logger.info("[LotesService] Lote obtenido", { id });
    return lote;
  },

  async update(id: number, data: Partial<Lote>) {
    logger.debug("[LotesService] Actualizando lote", { id, data });
    return lotesRepository.update(id, data);
  },

  async remove(id: number) {
    logger.debug("[LotesService] Eliminando lote", { id });
    return lotesRepository.remove(id);
  },
};
