import type { Request, Response } from 'express';
import { surtirSolicitud } from '../services/surtirService.js';
import { logger } from '../config/logger.js';

export const surtirController = {
  // POST /api/solicitudes/:id/surtir
  async surtir(req: Request, res: Response) {
    try {
      const id_solicitudes = Number(req.params.id);

      const payload = {
        id_solicitudes,
        observaciones: req.body.observaciones,
        insumos: req.body.insumos
      };

      const result = await surtirSolicitud(payload);
      res.status(201).json(result);
    } catch (error: any) {
      logger.error("[SurtirController] Error en surtir", { error: error.message });
      res.status(500).json({ success: false, message: error.message || 'Error al surtir solicitud' });
    }
  }
};
