// src/repositories/stockRepository.ts
import { db } from "../config/db.js";
import { logger } from "../config/logger.js";

export const stockRepository = {
  async getConsolidado(subalmacenId: number = 2) {
    logger.debug("[StockRepository] Consultando stock consolidado por insumo", { subalmacenId });

    try {
      const query = db
        .select(
          "i.id_insumos as id",
          "i.clave as clave",
          "i.descripcion_corta as insumo",
          "a.nombre_almacen as tipo_insumo",
          "i.unidad_distribucion as unidad_distribucion",
          "i.codigo_barras as codigo_barras",
          "sa.nombre as subalmacen",
          "s.servicio as servicio",
          "s.centro_costo as centro_costo",
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
        .join("cat_servicios as s", "sa.id_servicio", "s.id_servicios")
        .where("sa.id_subalmacen", subalmacenId)
        .groupBy(
          "i.id_insumos",
          "i.clave",
          "i.descripcion_corta",
          "a.nombre_almacen",
          "i.unidad_distribucion",
          "i.codigo_barras",
          "sa.nombre",
          "s.servicio",
          "s.centro_costo",
          "cs.minimo",
          "cs.maximo"
        )
        .orderBy("i.id_insumos");

      // 👇 imprime la query SQL final antes de ejecutarla
      logger.debug("[StockRepository] SQL generada:", query.toString());

      const rows = await query;

      logger.info("[StockRepository] Stock consolidado obtenido", { count: rows.length });
      return rows;
    } catch (err: any) {
      // 👇 imprime el error completo con todas sus propiedades
      logger.error("[StockRepository] Error al consultar stock consolidado", { error: err });
      console.error("Error completo:", err); // imprime stack y propiedades
      if (err.sqlMessage) console.error("SQL Message:", err.sqlMessage);
      if (err.sqlState) console.error("SQL State:", err.sqlState);
      if (err.code) console.error("Error Code:", err.code);
      throw err;
    }
  }
};