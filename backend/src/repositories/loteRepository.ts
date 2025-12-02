// src/repositories/lotesRepository.ts
import { db } from "../config/db.js";
import type { Lote } from "../models/lote.js";
import { logger } from "../config/logger.js";

export const lotesRepository = {
  async create(lote: Lote) {
    logger.debug("[LotesRepository] Insertando lote en DB", { lote });
    try {
      const [id] = await db("lotes").insert(lote);
      logger.info("[LotesRepository] Lote creado", { id });
      return { ...lote, id_lote: id };
    } catch (err: any) {
      logger.error("[LotesRepository] Error al crear lote", { error: err.message, lote });
      throw err;
    }
  },

  async findAll(filter?: { id_insumo?: number; id_subalmacen?: number }) {
    logger.debug("[LotesRepository] Buscando lotes con filtro", { filter });
    try {
      let query = db<Lote>("lotes").select("*");
      if (filter?.id_insumo) query = query.where("id_insumo", filter.id_insumo);
      if (filter?.id_subalmacen) query = query.where("id_subalmacen", filter.id_subalmacen);
      const result = await query.orderBy("fecha_caducidad", "asc");
      logger.info("[LotesRepository] Lotes encontrados", { count: result.length });
      return result;
    } catch (err: any) {
      logger.error("[LotesRepository] Error al buscar lotes", { error: err.message, filter });
      throw err;
    }
  },

  async findById(id: number) {
    logger.debug("[LotesRepository] Buscando lote por ID", { id });
    try {
      const lote = await db<Lote>("lotes").where({ id_lote: id }).first();
      if (lote) {
        logger.info("[LotesRepository] Lote encontrado", { id });
      } else {
        logger.warn("[LotesRepository] Lote no encontrado", { id });
      }
      return lote;
    } catch (err: any) {
      logger.error("[LotesRepository] Error al buscar lote por ID", { error: err.message, id });
      throw err;
    }
  },

  async update(id: number, data: Partial<Lote>) {
    logger.debug("[LotesRepository] Actualizando lote", { id, data });
    try {
      await db("lotes").where({ id_lote: id }).update(data);
      logger.info("[LotesRepository] Lote actualizado", { id });
      return this.findById(id);
    } catch (err: any) {
      logger.error("[LotesRepository] Error al actualizar lote", { error: err.message, id, data });
      throw err;
    }
  },

  async remove(id: number) {
    logger.debug("[LotesRepository] Eliminando lote", { id });
    try {
      const deleted = await db("lotes").where({ id_lote: id }).del();
      if (deleted > 0) {
        logger.info("[LotesRepository] Lote eliminado", { id });
      } else {
        logger.warn("[LotesRepository] No se encontró lote para eliminar", { id });
      }
      return deleted;
    } catch (err: any) {
      logger.error("[LotesRepository] Error al eliminar lote", { error: err.message, id });
      throw err;
    }
  },
};
