//src/controllers/surtirController.ts
import type { Request, Response } from 'express';
import { surtirSolicitud, cancelarSolicitud, getCancelacionBySolicitud, getHojaBySolicitud  } from '../services/surtirService.js';
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

  async getHoja(req: Request, res: Response) {
    try {
      const id_solicitudes = Number(req.params.id);
      const result = await getHojaBySolicitud(id_solicitudes);
      res.status(200).json(result);
    } catch (error: any) {
      logger.error("[SurtirController] Error en getHoja", { error: error.message });
      res.status(500).json({ success: false, message: error.message });
    }
  }
};

export const cancelarController = {
  async cancelar(req: Request, res: Response) {
    try {
      const id_solicitudes = Number(req.params.id);
      const observaciones = req.body.observaciones || null;

      const result = await cancelarSolicitud(id_solicitudes, observaciones);
      res.status(200).json(result);
    } catch (error: any) {
      logger.error("[CancelarController] Error en cancelar", { error: error.message });
      res.status(500).json({ success: false, message: error.message || 'Error al cancelar solicitud' });
    }
  }
};

export const cancelacionController = {
  async getCancelacion(req: Request, res: Response) {
    try {
      const id_solicitudes = Number(req.params.id);
      const result = await getCancelacionBySolicitud(id_solicitudes);
      res.status(200).json(result);
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
};


