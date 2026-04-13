import type { Request, Response } from 'express';
import { solicitudesService } from '../services/solicitudesService.js';
import { logger } from '../config/logger.js';

export const solicitudesController = {
  // POST /api/solicitudes/final
  async create(req: Request, res: Response) {
    try {
      const result = await solicitudesService.crearSolicitudFinal(req.body);
      res.status(201).json(result);
    } catch (error: any) {
      logger.error("[SolicitudesController] Error en create", { error: error.message });
      res.status(500).json({ success: false, message: error.message || 'Error al crear solicitud' });
    }
  },

  // GET /api/solicitudes
  async getAll(req: Request, res: Response) {
    try {
      const { estado, id_subalmacen, tipo_solicitud } = req.query;
      const result = await solicitudesService.listarSolicitudes(
        estado as string,
        id_subalmacen ? Number(id_subalmacen) : undefined,
        tipo_solicitud as string
      );
      res.json(result);
    } catch (error: any) {
      logger.error("[SolicitudesController] Error en getAll", { error: error.message });
      res.status(500).json({ success: false, message: 'Error al listar solicitudes' });
    }
  },

  // GET /api/solicitudes/:id
  async getById(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      const result = await solicitudesService.detalleSolicitud(id);
      
      if (!result) {
        return res.status(404).json({ success: false, message: 'Solicitud no encontrada' });
      }
      
      res.json(result);
    } catch (error: any) {
      logger.error("[SolicitudesController] Error en getById", { error: error.message });
      res.status(500).json({ success: false, message: 'Error al obtener detalle' });
    }
  }
};
