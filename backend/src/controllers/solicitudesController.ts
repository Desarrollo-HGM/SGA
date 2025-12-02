// src/controllers/solicitudesController.ts
import type { Request, Response } from "express";
import { solicitudesService } from "../services/solicitudesService.js";
import { movimientosService } from "../services/movimientosService.js";
import { logger } from "../config/logger.js";

export const solicitudesController = {
  async create(req: Request, res: Response) {
    logger.info("[SolicitudesController] POST /api/solicitudes", { body: req.body });
    try {
      const solicitud = await solicitudesService.create(req.body);
      logger.info("[SolicitudesController] Solicitud creada", { id: solicitud.id_solicitudes });
      res.status(201).json(solicitud);
    } catch (err: any) {
      logger.error("[SolicitudesController] Error al crear solicitud", { error: err.message, body: req.body });
      res.status(400).json({ error: err.message });
    }
  },

  async list(req: Request, res: Response) {
    logger.info("[SolicitudesController] GET /api/solicitudes", { query: req.query });
    const { estado, id_subalmacen } = req.query;
    const filter: Partial<{ estado: string; id_subalmacen: number }> = {};
    if (estado) filter.estado = estado as string;
    if (id_subalmacen) filter.id_subalmacen = Number(id_subalmacen);

    try {
      const solicitudes = await solicitudesService.list(filter);
      logger.info("[SolicitudesController] Solicitudes listadas", { count: solicitudes.length });
      res.json(solicitudes);
    } catch (err: any) {
      logger.error("[SolicitudesController] Error al listar solicitudes", { error: err.message, filter });
      res.status(500).json({ error: err.message });
    }
  },

  async get(req: Request, res: Response) {
    logger.info("[SolicitudesController] GET /api/solicitudes/:id", { id: req.params.id });
    try {
      const solicitud = await solicitudesService.get(Number(req.params.id));
      logger.info("[SolicitudesController] Solicitud obtenida", { id: solicitud.id_solicitudes });
      res.json(solicitud);
    } catch (err: any) {
      logger.error("[SolicitudesController] Error al obtener solicitud", { error: err.message, id: req.params.id });
      res.status(404).json({ error: err.message });
    }
  },

  async update(req: Request, res: Response) {
    logger.info("[SolicitudesController] PUT /api/solicitudes/:id", { id: req.params.id, body: req.body });
    try {
      const { estado, id_lote } = req.body;
      const solicitud = await solicitudesService.update(Number(req.params.id), { estado });

      if (estado === "Aprobada" && id_lote) {
        logger.info("[SolicitudesController] Creando movimiento de salida", { solicitudId: solicitud.id_solicitudes, id_lote });
        await movimientosService.create({
          tipo_movimiento: "Salida",
          cantidad: solicitud.cantidad!,
          fecha_movimiento: new Date(),
          id_solicitudes: solicitud.id_solicitudes!,
          id_lote,
          id_subalmacen: solicitud.id_subalmacen!,
          estado_verificacion: "Pendiente",
        });
      }

      if (estado === "Ejecutada" && id_lote) {
        logger.info("[SolicitudesController] Creando movimiento de entrada", { solicitudId: solicitud.id_solicitudes, id_lote });
        await movimientosService.create({
          tipo_movimiento: "Entrada",
          cantidad: solicitud.cantidad!,
          fecha_movimiento: new Date(),
          id_solicitudes: solicitud.id_solicitudes!,
          id_lote,
          id_subalmacen: solicitud.id_subalmacen!,
          estado_verificacion: "Verificado",
        });
      }

      res.json(solicitud);
    } catch (err: any) {
      logger.error("[SolicitudesController] Error al actualizar solicitud", { error: err.message, id: req.params.id });
      res.status(400).json({ error: err.message });
    }
  },

  async remove(req: Request, res: Response) {
    logger.info("[SolicitudesController] DELETE /api/solicitudes/:id", { id: req.params.id });
    try {
      await solicitudesService.remove(Number(req.params.id));
      logger.info("[SolicitudesController] Solicitud eliminada", { id: req.params.id });
      res.json({ deleted: true });
    } catch (err: any) {
      logger.error("[SolicitudesController] Error al eliminar solicitud", { error: err.message, id: req.params.id });
      res.status(400).json({ error: err.message });
    }
  },
};
