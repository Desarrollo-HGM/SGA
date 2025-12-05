// src/repositories/stockRepository.ts
import { db } from "../config/db.js";
import { logger } from "../config/logger.js"; // si ya tienes Winston integrado

export const stockRepository = {
  async getConsolidado() {
    logger.debug("[StockRepository] Consultando stock consolidado");

    try {
      const rows = await db
        .select(
          "sa.id_subalmacen",
          "sa.nombre as nombre_subalmacen",
          "i.id_insumos",
          "i.descripcion_corta as nombre_insumo",
          "a.id_almacen",
          "a.nombre_almacen",
          "cs.minimo",
          "cs.maximo"
        )
        .sum("l.cantidad_actual as stock_total_insumo")
        .from("lotes as l")
        .join("cat_insumos as i", "l.id_insumo", "i.id_insumos")
        .join("subalmacenes as sa", "l.id_subalmacen", "sa.id_subalmacen")
        .join("almacenes as a", "i.id_almacen", "a.id_almacen")
        .leftJoin("config_stock as cs", function () {
          this.on("cs.id_insumo", "=", "i.id_insumos")
              .andOn("cs.id_subalmacen", "=", "sa.id_subalmacen");
        })
        .groupBy(
          "sa.id_subalmacen",
          "sa.nombre",
          "i.id_insumos",
          "i.descripcion_corta",
          "a.id_almacen",
          "a.nombre_almacen",
          "cs.minimo",
          "cs.maximo"
        )
        .orderBy(["sa.id_subalmacen", "a.id_almacen", "i.id_insumos"]);

      logger.info("[StockRepository] Stock consolidado obtenido", { count: rows.length });
      return rows;
    } catch (err: any) {
      logger.error("[StockRepository] Error al consultar stock consolidado", { error: err.message });
      throw err;
    }
  }
};

