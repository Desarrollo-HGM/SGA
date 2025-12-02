// src/repositories/solicitudesRepository.ts
import { db } from "../config/db.js";
import type { Solicitud } from "../models/solicitud.js";
import { logger } from "../config/logger.js";

export const solicitudesRepository = {
  async create(solicitud: Solicitud) {
    logger.debug("[SolicitudesRepository] Insertando solicitud en DB", { solicitud });
    try {
      const [id] = await db("solicitudes").insert(solicitud);
      logger.info("[SolicitudesRepository] Solicitud creada", { id });
      return { ...solicitud, id_solicitudes: id };
    } catch (err: any) {
      logger.error("[SolicitudesRepository] Error al crear solicitud", { error: err.message, solicitud });
      throw err;
    }
  },

  async findAll(filter?: { estado?: string; id_subalmacen?: number }) {
    logger.debug("[SolicitudesRepository] Buscando solicitudes con filtro", { filter });
    try {
      let query = db<Solicitud>("solicitudes").select("*");
      if (filter?.estado) query = query.where("estado", filter.estado);
      if (filter?.id_subalmacen) query = query.where("id_subalmacen", filter.id_subalmacen);
      const result = await query.orderBy("fecha_solicitud", "desc");
      logger.info("[SolicitudesRepository] Solicitudes encontradas", { count: result.length });
      return result;
    } catch (err: any) {
      logger.error("[SolicitudesRepository] Error al buscar solicitudes", { error: err.message, filter });
      throw err;
    }
  },

  async findById(id: number) {
    logger.debug("[SolicitudesRepository] Buscando solicitud por ID", { id });
    try {
      const solicitud = await db<Solicitud>("solicitudes").where({ id_solicitudes: id }).first();
      if (solicitud) {
        logger.info("[SolicitudesRepository] Solicitud encontrada", { id });
      } else {
        logger.warn("[SolicitudesRepository] Solicitud no encontrada", { id });
      }
      return solicitud;
    } catch (err: any) {
      logger.error("[SolicitudesRepository] Error al buscar solicitud por ID", { error: err.message, id });
      throw err;
    }
  },

  async update(id: number, data: Partial<Solicitud>) {
    logger.debug("[SolicitudesRepository] Actualizando solicitud", { id, data });
    try {
      await db("solicitudes").where({ id_solicitudes: id }).update(data);
      logger.info("[SolicitudesRepository] Solicitud actualizada", { id });
      return this.findById(id);
    } catch (err: any) {
      logger.error("[SolicitudesRepository] Error al actualizar solicitud", { error: err.message, id, data });
      throw err;
    }
  },

  async remove(id: number) {
    logger.debug("[SolicitudesRepository] Eliminando solicitud", { id });
    try {
      const deleted = await db("solicitudes").where({ id_solicitudes: id }).del();
      if (deleted > 0) {
        logger.info("[SolicitudesRepository] Solicitud eliminada", { id });
      } else {
        logger.warn("[SolicitudesRepository] No se encontró solicitud para eliminar", { id });
      }
      return deleted;
    } catch (err: any) {
      logger.error("[SolicitudesRepository] Error al eliminar solicitud", { error: err.message, id });
      throw err;
    }
  },
};
