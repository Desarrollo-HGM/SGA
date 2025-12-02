// src/repositories/insumosRepository.ts
import { db } from "../config/db.js";
import type { Insumo } from "../models/insumo.js";
import { logger } from "../config/logger.js";

export const insumosRepository = {
  async create(insumo: Insumo) {
    logger.debug("[InsumosRepository] Insertando insumo en DB", { insumo });
    try {
      const [id] = await db("cat_insumos").insert(insumo);
      logger.info("[InsumosRepository] Insumo creado", { id });
      return { ...insumo, id_insumos: id };
    } catch (err: any) {
      logger.error("[InsumosRepository] Error al crear insumo", { error: err.message, insumo });
      throw err;
    }
  },

  async findAll(filter?: { q?: string; clave?: string }) {
    logger.debug("[InsumosRepository] Buscando insumos con filtro", { filter });
    try {
      let query = db<Insumo>("cat_insumos").select("*");
      if (filter?.q) {
        query = query.whereILike("descripcion_corta", `%${filter.q}%`)
                     .orWhereILike("descripcion_larga", `%${filter.q}%`);
      }
      if (filter?.clave) {
        query = query.where("clave", filter.clave);
      }
      const result = await query.orderBy("id_insumos", "desc");
      logger.info("[InsumosRepository] Insumos encontrados", { count: result.length });
      return result;
    } catch (err: any) {
      logger.error("[InsumosRepository] Error al buscar insumos", { error: err.message, filter });
      throw err;
    }
  },

  async findById(id: number) {
    logger.debug("[InsumosRepository] Buscando insumo por ID", { id });
    try {
      const insumo = await db<Insumo>("cat_insumos").where({ id_insumos: id }).first();
      if (insumo) {
        logger.info("[InsumosRepository] Insumo encontrado", { id });
      } else {
        logger.warn("[InsumosRepository] Insumo no encontrado", { id });
      }
      return insumo;
    } catch (err: any) {
      logger.error("[InsumosRepository] Error al buscar insumo por ID", { error: err.message, id });
      throw err;
    }
  },

  async update(id: number, data: Partial<Insumo>) {
    logger.debug("[InsumosRepository] Actualizando insumo", { id, data });
    try {
      await db("cat_insumos").where({ id_insumos: id }).update(data);
      logger.info("[InsumosRepository] Insumo actualizado", { id });
      return this.findById(id);
    } catch (err: any) {
      logger.error("[InsumosRepository] Error al actualizar insumo", { error: err.message, id, data });
      throw err;
    }
  },

  async remove(id: number) {
    logger.debug("[InsumosRepository] Eliminando insumo", { id });
    try {
      const deleted = await db("cat_insumos").where({ id_insumos: id }).del();
      if (deleted > 0) {
        logger.info("[InsumosRepository] Insumo eliminado", { id });
      } else {
        logger.warn("[InsumosRepository] No se encontró insumo para eliminar", { id });
      }
      return deleted;
    } catch (err: any) {
      logger.error("[InsumosRepository] Error al eliminar insumo", { error: err.message, id });
      throw err;
    }
  },
};
