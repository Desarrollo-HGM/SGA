// src/controllers/lotesController.ts
import type { Request, Response } from "express";
import { lotesService } from "../services/lotesService.js";
import { logger } from "../config/logger.js";

export const lotesController = {
  async create(req: Request, res: Response) {
    logger.info("[LotesController] POST /api/lotes", { body: req.body });
    try {
      const lote = await lotesService.create(req.body);
      logger.info("[LotesController] Lote creado", { id: lote.id_lote });
      res.status(201).json(lote);
    } catch (err: any) {
      logger.error("[LotesController] Error al crear lote", { error: err.message, body: req.body });
      res.status(400).json({ error: err.message });
    }
  },

  async list(req: Request, res: Response) {
    logger.info("[LotesController] GET /api/lotes", { query: req.query });
    const { id_insumo, id_subalmacen } = req.query;
    const filter: Partial<{ id_insumo: number; id_subalmacen: number }> = {};
    if (id_insumo) filter.id_insumo = Number(id_insumo);
    if (id_subalmacen) filter.id_subalmacen = Number(id_subalmacen);

    try {
      const lotes = await lotesService.list(filter);
      logger.info("[LotesController] Lotes listados", { count: lotes.length });
      res.json(lotes);
    } catch (err: any) {
      logger.error("[LotesController] Error al listar lotes", { error: err.message, filter });
      res.status(500).json({ error: err.message });
    }
  },

  async get(req: Request, res: Response) {
    logger.info("[LotesController] GET /api/lotes/:id", { id: req.params.id });
    try {
      const lote = await lotesService.get(Number(req.params.id));
      logger.info("[LotesController] Lote obtenido", { id: lote.id_lote });
      res.json(lote);
    } catch (err: any) {
      logger.error("[LotesController] Error al obtener lote", { error: err.message, id: req.params.id });
      res.status(404).json({ error: err.message });
    }
  },

  async update(req: Request, res: Response) {
    logger.info("[LotesController] PUT /api/lotes/:id", { id: req.params.id, body: req.body });
    try {
      const lote = await lotesService.update(Number(req.params.id), req.body);
      logger.info("[LotesController] Lote actualizado", { id: lote?.id_lote });
      res.json(lote);
    } catch (err: any) {
      logger.error("[LotesController] Error al actualizar lote", { error: err.message, id: req.params.id });
      res.status(400).json({ error: err.message });
    }
  },

  async remove(req: Request, res: Response) {
    logger.info("[LotesController] DELETE /api/lotes/:id", { id: req.params.id });
    try {
      await lotesService.remove(Number(req.params.id));
      logger.info("[LotesController] Lote eliminado", { id: req.params.id });
      res.json({ deleted: true });
    } catch (err: any) {
      logger.error("[LotesController] Error al eliminar lote", { error: err.message, id: req.params.id });
      res.status(400).json({ error: err.message });
    }
  },
};
