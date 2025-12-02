// src/controllers/insumosController.ts
import type { Request, Response } from "express";
import { insumosService } from "../services/insumoService.js";
import { logger } from "../config/logger.js";

export const insumosController = {
  async create(req: Request, res: Response) {
    logger.info("[InsumosController] POST /api/insumos", { body: req.body });
    try {
      const insumo = await insumosService.create(req.body);
      logger.info("[InsumosController] Insumo creado", { id: insumo.id_insumos });
      res.status(201).json(insumo);
    } catch (err: any) {
      logger.error("[InsumosController] Error al crear insumo", { error: err.message, body: req.body });
      res.status(400).json({ error: err.message });
    }
  },

  async list(req: Request, res: Response) {
    logger.info("[InsumosController] GET /api/insumos", { query: req.query });
    try {
      const insumos = await insumosService.list();
      logger.info("[InsumosController] Insumos listados", { count: insumos.length });
      res.json(insumos);
    } catch (err: any) {
      logger.error("[InsumosController] Error al listar insumos", { error: err.message });
      res.status(500).json({ error: err.message });
    }
  },

  async get(req: Request, res: Response) {
    logger.info("[InsumosController] GET /api/insumos/:id", { id: req.params.id });
    try {
      const insumo = await insumosService.get(Number(req.params.id));
      logger.info("[InsumosController] Insumo obtenido", { id: insumo.id_insumos });
      res.json(insumo);
    } catch (err: any) {
      logger.error("[InsumosController] Error al obtener insumo", { error: err.message, id: req.params.id });
      res.status(404).json({ error: err.message });
    }
  },

  async update(req: Request, res: Response) {
    logger.info("[InsumosController] PUT /api/insumos/:id", { id: req.params.id, body: req.body });
    try {
      const insumo = await insumosService.update(Number(req.params.id), req.body);
      logger.info("[InsumosController] Insumo actualizado", { id: insumo?.id_insumos });
      res.json(insumo);
    } catch (err: any) {
      logger.error("[InsumosController] Error al actualizar insumo", { error: err.message, id: req.params.id });
      res.status(400).json({ error: err.message });
    }
  },

  async remove(req: Request, res: Response) {
    logger.info("[InsumosController] DELETE /api/insumos/:id", { id: req.params.id });
    try {
      await insumosService.remove(Number(req.params.id));
      logger.info("[InsumosController] Insumo eliminado", { id: req.params.id });
      res.json({ deleted: true });
    } catch (err: any) {
      logger.error("[InsumosController] Error al eliminar insumo", { error: err.message, id: req.params.id });
      res.status(400).json({ error: err.message });
    }
  },
};
