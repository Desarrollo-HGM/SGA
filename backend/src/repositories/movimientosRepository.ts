// src/repositories/movimientosRepository.ts
import { db } from "../config/db.js";
import type { Movimiento } from "../models/movimiento.js";
import { logger } from "../config/logger.js";

export const movimientosRepository = {
  async create(mov: Movimiento): Promise<Movimiento> {
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

      return { ...mov, id_movimiento: id };
    } catch (err: any) {
      logger.error("[MovimientosRepository] Error al crear movimiento", { error: err.message });
      throw err;
    }
  },

  async getStock(id_subalmacen: number, id_insumo: number): Promise<number> {
    // Nota: Esta query asume que los movimientos están ligados a solicitudes que tienen el id_insumo
    const result = await db("movimientos as m")
      .join("solicitudes as s", "m.id_solicitudes", "s.id_solicitudes")
      .where("s.id_subalmacen", id_subalmacen)
      .andWhere("s.id_insumos", id_insumo)
      .select(
        db.raw("SUM(CASE WHEN m.tipo_movimiento = 'Entrada' THEN m.cantidad ELSE 0 END) as entradas"),
        db.raw("SUM(CASE WHEN m.tipo_movimiento = 'Salida' THEN m.cantidad ELSE 0 END) as salidas")
      )
      .first();

    const entradas = Number(result?.entradas || 0);
    const salidas = Number(result?.salidas || 0);
    return entradas - salidas;
  },

  async findAll(filter?: { id_lote?: number; id_subalmacen?: number }) {
    let query = db<Movimiento>("movimientos");
    if (filter?.id_lote) query = query.where("id_lote", filter.id_lote);
    if (filter?.id_subalmacen) query = query.where("id_subalmacen", filter.id_subalmacen);
    return await query.orderBy("fecha_movimiento", "desc");
  },

  async findById(id: number) {
    return await db<Movimiento>("movimientos").where({ id_movimiento: id }).first();
  },

  async update(id: number, data: Partial<Movimiento>) {
    await db("movimientos").where({ id_movimiento: id }).update(data);
    return this.findById(id);
  },

  async remove(id: number) {
    return await db("movimientos").where({ id_movimiento: id }).del();
  }
};