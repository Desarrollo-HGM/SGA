// src/repositories/movimientosRepository.ts
import { db } from "../config/db.js";
import type { Movimiento } from "../models/movimiento.js";
import { logger } from "../config/logger.js";

export const movimientosRepository = {
  async create(mov: Movimiento): Promise<Movimiento> {
    logger.debug("[MovimientosRepository] Creando movimiento", { mov });
    try {
      const [id] = await db("movimientos").insert({
        tipo_movimiento: mov.tipo_movimiento,
        cantidad: mov.cantidad,
        fecha_movimiento: mov.fecha_movimiento,
        id_solicitudes: mov.id_solicitudes,
        id_lote: mov.id_lote,
        id_subalmacen: mov.id_subalmacen,
        estado_verificacion: mov.estado_verificacion ?? "Pendiente",
      });

      logger.info("[MovimientosRepository] Movimiento creado", { id });
      return { ...mov, id_movimiento: id };
    } catch (err: any) {
      logger.error("[MovimientosRepository] Error al crear movimiento", { error: err.message, mov });
      throw err;
    }
  },

  async getStock(id_subalmacen: number, id_insumo: number) {
    const result = await db("movimientos")
      .join("solicitudes", "movimientos.id_solicitudes", "solicitudes.id_solicitudes")
      .where("solicitudes.id_subalmacen", id_subalmacen)
      .andWhere("solicitudes.id_insumos", id_insumo)
      .sum({
        entradas: db.raw("CASE WHEN tipo_movimiento = 'Entrada' THEN cantidad ELSE 0 END"),
        salidas: db.raw("CASE WHEN tipo_movimiento = 'Salida' THEN cantidad ELSE 0 END"),
      })
      .first();

    const entradas = Number(result?.entradas || 0);
    const salidas = Number(result?.salidas || 0);
    return entradas - salidas;
  },

  async findAll(filter?: { id_lote?: number; id_subalmacen?: number }) {
    logger.debug("[MovimientosRepository] Buscando movimientos con filtro", { filter });
    try {
      let query = db<Movimiento>("movimientos").select("*");
      if (filter?.id_lote) query = query.where("id_lote", filter.id_lote);
      if (filter?.id_subalmacen) query = query.where("id_subalmacen", filter.id_subalmacen);
      const result = await query.orderBy("fecha_movimiento", "desc");
      logger.info("[MovimientosRepository] Movimientos encontrados", { count: result.length });
      return result;
    } catch (err: any) {
      logger.error("[MovimientosRepository] Error al buscar movimientos", { error: err.message, filter });
      throw err;
    }
  },

  async findById(id: number) {
    logger.debug("[MovimientosRepository] Buscando movimiento por ID", { id });
    try {
      const mov = await db<Movimiento>("movimientos").where({ id_movimiento: id }).first();
      if (mov) {
        logger.info("[MovimientosRepository] Movimiento encontrado", { id });
      } else {
        logger.warn("[MovimientosRepository] Movimiento no encontrado", { id });
      }
      return mov;
    } catch (err: any) {
      logger.error("[MovimientosRepository] Error al buscar movimiento por ID", { error: err.message, id });
      throw err;
    }
  },

  async update(id: number, data: Partial<Movimiento>) {
    logger.debug("[MovimientosRepository] Actualizando movimiento", { id, data });
    try {
      await db("movimientos").where({ id_movimiento: id }).update(data);
      logger.info("[MovimientosRepository] Movimiento actualizado", { id });
      return this.findById(id);
    } catch (err: any) {
      logger.error("[MovimientosRepository] Error al actualizar movimiento", { error: err.message, id, data });
      throw err;
    }
  },

  async remove(id: number) {
    logger.debug("[MovimientosRepository] Eliminando movimiento", { id });
    try {
      const deleted = await db("movimientos").where({ id_movimiento: id }).del();
      if (deleted > 0) {
        logger.info("[MovimientosRepository] Movimiento eliminado", { id });
      } else {
        logger.warn("[MovimientosRepository] No se encontró movimiento para eliminar", { id });
      }
      return deleted;
    } catch (err: any) {
      logger.error("[MovimientosRepository] Error al eliminar movimiento", { error: err.message, id });
      throw err;
    }
  },
};
