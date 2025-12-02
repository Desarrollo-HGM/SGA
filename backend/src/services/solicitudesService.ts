// src/services/solicitudesService.ts
import { solicitudesRepository } from "../repositories/solicitudesRepository.js";
import type { Solicitud } from "../models/solicitud.js";
import { logger } from "../config/logger.js";

export const solicitudesService = {
  async create(data: Solicitud) {
    logger.debug("[SolicitudesService] Creando solicitud", { data });
    if (data.cantidad <= 0) {
      logger.warn("[SolicitudesService] Validación fallida: cantidad <= 0", { cantidad: data.cantidad });
      throw new Error("La cantidad debe ser mayor a 0");
    }
    const solicitud = await solicitudesRepository.create(data);
    logger.info("[SolicitudesService] Solicitud creada", { id: solicitud.id_solicitudes });
    return solicitud;
  },

  async list(filter?: { estado?: string; id_subalmacen?: number }) {
    logger.debug("[SolicitudesService] Listando solicitudes", { filter });
    return solicitudesRepository.findAll(filter);
  },

  async get(id: number) {
    logger.debug("[SolicitudesService] Obteniendo solicitud", { id });
    const solicitud = await solicitudesRepository.findById(id);
    if (!solicitud) {
      logger.warn("[SolicitudesService] Solicitud no encontrada", { id });
      throw new Error("Solicitud no encontrada");
    }
    logger.info("[SolicitudesService] Solicitud obtenida", { id });
    return solicitud;
  },

  async update(id: number, data: Partial<Solicitud>) {
    logger.debug("[SolicitudesService] Actualizando solicitud", { id, data });
    const solicitud = await solicitudesRepository.update(id, data);

    if (!solicitud) {
      logger.error("[SolicitudesService] Solicitud no encontrada al actualizar", { id });
      throw new Error("Solicitud no encontrada");
    }

    if (!solicitud.id_solicitudes || !solicitud.id_subalmacen || !solicitud.cantidad) {
      logger.warn("[SolicitudesService] Solicitud incompleta para actualizar", { id });
      throw new Error("Solicitud incompleta para actualizar");
    }

    logger.info("[SolicitudesService] Solicitud actualizada", { id });
    return solicitud;
  },

  async remove(id: number) {
    logger.debug("[SolicitudesService] Eliminando solicitud", { id });
    return solicitudesRepository.remove(id);
  },
};
