// src/repositories/stockRepository.ts
import { db } from "../config/db.js";
import { logger } from "../config/logger.js";

export const stockRepository = {
  async getConsolidado() {
    logger.debug("[StockRepository] Consultando stock consolidado");

    try {
      const rows = await db
        .select(
          "i.id_insumos as id",
          "i.clave as clave",
          "i.descripcion_corta as insumo",
          "a.nombre_almacen as tipo_insumo",
          "i.unidad_distribucion as unidad_distribucion",
          "sa.nombre as subalmacen",
          "l.id_lote as lote",
          db.raw("SUM(l.cantidad_actual) as stock"),
          "cs.minimo",
          "cs.maximo"
        )
        .from("lotes as l")
        .join("cat_insumos as i", "l.id_insumo", "i.id_insumos")
        .join("subalmacenes as sa", "l.id_subalmacen", "sa.id_subalmacen")
        .join("almacenes as a", "i.id_almacen", "a.id_almacen")
        .join("config_stock as cs", function () {
          this.on("cs.id_insumo", "=", "i.id_insumos")
              .andOn("cs.id_subalmacen", "=", "sa.id_subalmacen");
        })
        .groupBy(
          "i.id_insumos",
          "i.clave",
          "i.descripcion_corta",
          "a.nombre_almacen",
          "i.unidad_distribucion",
          "sa.nombre",
          "l.id_lote",
          "cs.minimo",
          "cs.maximo"
        )
        .orderBy(["sa.id_subalmacen", "i.id_insumos"]);

      logger.info("[StockRepository] Stock consolidado obtenido", { count: rows.length });
      return rows;
    } catch (err: any) {
      logger.error("[StockRepository] Error al consultar stock consolidado", { error: err.message });
      throw err;
    }
  }
};