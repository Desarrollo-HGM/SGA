// src/services/solicitudesService.ts
import { solicitudesRepository } from '../repositories/solicitudesRepository.js';
import { logger } from '../config/logger.js';
import type { SolicitudPayload } from '../models/solicitud.js';
import { format } from 'date-fns';

export const solicitudesService = {
  async crearSolicitudFinal(payload: SolicitudPayload) {
    logger.debug("[SolicitudesService] Iniciando creación de solicitud completa");
    try {
      // 1. Insertar cabecera usando el repositorio estructurado
      const idSolicitud = await solicitudesRepository.insertSolicitud({
        tipo_solicitud: payload.tipo_solicitud,
        id_medico: payload.id_medico || null,
        id_servicio: payload.id_servicio!,
        id_subalmacen: payload.id_subalmacen,
        fecha_solicitud: format(new Date(), 'yyyy-MM-dd'),
        estado: 'Pendiente',
        justificacion: payload.justificacion || null
      });

      // 2. Procesar insumos y asignar lotes (Lógica FIFO por fecha de caducidad)
      for (const insumo of payload.insumos) {
        let cantidadPendiente = insumo.cantidad;
        const lotes = await solicitudesRepository.getLotesDisponibles(insumo.id_insumos, payload.id_subalmacen);

        for (const lote of lotes) {
          if (cantidadPendiente <= 0) break;
          const cantidadAsignada = Math.min(cantidadPendiente, lote.cantidad_actual);

          // Insertar en detalle
          await solicitudesRepository.insertDetalle({
            id_solicitudes: idSolicitud,
            id_insumos: insumo.id_insumos,
            cantidad: cantidadAsignada,
            id_lote: lote.id_lote,
            estado: 'Pendiente'
          });

          // Crear la reserva
          await solicitudesRepository.insertReserva(idSolicitud, lote.id_lote, cantidadAsignada);

          cantidadPendiente -= cantidadAsignada;
        }
      }

      return { success: true, id_solicitudes: idSolicitud };
    } catch (err: any) {
      logger.error("[SolicitudesService] Error en crearSolicitudFinal", { error: err.message });
      throw err;
    }
  },

  async listarSolicitudes(estado?: string, id_subalmacen?: number) {
    logger.debug("[SolicitudesService] Listando solicitudes con filtros", { estado, id_subalmacen });
    return await solicitudesRepository.getSolicitudes(estado, id_subalmacen);
  },

  async detalleSolicitud(id_solicitudes: number) {
    logger.debug("[SolicitudesService] Obteniendo detalle de solicitud", { id_solicitudes });
    return await solicitudesRepository.getSolicitudById(id_solicitudes);
  }
};