// src/controllers/movimientosController.ts
import type { Request, Response } from "express";
import { movimientosService } from "../services/movimientosService.js";
import { logger } from "../config/logger.js";

export const movimientosController = {
  async create(req: Request, res: Response) {
    logger.info("[MovimientosController] POST /api/movimientos", { body: req.body });
    try {
      const mov = await movimientosService.create(req.body);
      logger.info("[MovimientosController] Movimiento creado", { id: mov.id_movimiento });
      res.status(201).json(mov);
    } catch (err: any) {
      logger.error("[MovimientosController] Error al crear movimiento", { error: err.message, body: req.body });
      res.status(400).json({ error: err.message });
    }
  },

  async list(req: Request, res: Response) {
    logger.info("[MovimientosController] GET /api/movimientos", { query: req.query });
    const { id_lote, id_subalmacen } = req.query;
    const filter: Partial<{ id_lote: number; id_subalmacen: number }> = {};
    if (id_lote) filter.id_lote = Number(id_lote);
    if (id_subalmacen) filter.id_subalmacen = Number(id_subalmacen);

    try {
      const movimientos = await movimientosService.list(filter);
      logger.info("[MovimientosController] Movimientos listados", { count: movimientos.length });
      res.json(movimientos);
    } catch (err: any) {
      logger.error("[MovimientosController] Error al listar movimientos", { error: err.message, filter });
      res.status(500).json({ error: err.message });
    }
  },

  async get(req: Request, res: Response) {
    logger.info("[MovimientosController] GET /api/movimientos/:id", { id: req.params.id });
    try {
      const mov = await movimientosService.get(Number(req.params.id));
      logger.info("[MovimientosController] Movimiento obtenido", { id: mov.id_movimiento });
      res.json(mov);
    } catch (err: any) {
      logger.error("[MovimientosController] Error al obtener movimiento", { error: err.message, id: req.params.id });
      res.status(404).json({ error: err.message });
    }
  },

  async update(req: Request, res: Response) {
    logger.info("[MovimientosController] PUT /api/movimientos/:id", { id: req.params.id, body: req.body });
    try {
      const mov = await movimientosService.update(Number(req.params.id), req.body);
      logger.info("[MovimientosController] Movimiento actualizado", { id: mov?.id_movimiento });
      res.json(mov);
    } catch (err: any) {
      logger.error("[MovimientosController] Error al actualizar movimiento", { error: err.message, id: req.params.id });
      res.status(400).json({ error: err.message });
    }
  },

  async remove(req: Request, res: Response) {
    logger.info("[MovimientosController] DELETE /api/movimientos/:id", { id: req.params.id });
    try {
      await movimientosService.remove(Number(req.params.id));
      logger.info("[MovimientosController] Movimiento eliminado", { id: req.params.id });
      res.json({ deleted: true });
    } catch (err: any) {
      logger.error("[MovimientosController] Error al eliminar movimiento", { error: err.message, id: req.params.id });
      res.status(400).json({ error: err.message });
    }
  },
};
