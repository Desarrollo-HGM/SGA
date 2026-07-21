// src/controllers/stockController.ts
import type { Request, Response } from "express";
import { stockService } from "../services/stockService.js";
import { logger } from "../config/logger.js";

export const stockController = {
  async getConsolidado(req: Request, res: Response) {
    try {
      const id_subalmacen = req.user?.id_subalmacen; // 👈 viene del token
      if (!id_subalmacen) {
        return res.status(403).json({ message: "Usuario sin subalmacén asignado" });
      }

      const data = await stockService.getConsolidado(id_subalmacen); // 👈 se pasa al service
      res.json(data);
    } catch (error: any) {
      logger.error("[StockController] Error al obtener stock consolidado", { error: error.message });
      res.status(500).json({ error: "Error interno al consultar stock" });
    }
  }
};
