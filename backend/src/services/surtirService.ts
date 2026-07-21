//src/services/surtirService.ts
import {
  insertHojaSuministro,
  insertHojaDetalle,
  updateLoteCantidad,
  updateReservaEstado,
  updateDetalleEstado,
  updateSolicitudEstado,
    updateDetalleEstadoBySolicitud,
      liberarReservasBySolicitud,
  getSolicitudDetalles,
  getReservasBySolicitud,
  getHojaById
} from '../repositories/hojaSuministroRepository.js';

import { db } from '../config/db.js';

import { solicitudesRepository } from '../repositories/solicitudesRepository.js';

import type { SurtidoPayload, EstadoSolicitud, EstadoDetalle } from '../models/solicitud.js';

export async function surtirSolicitud(payload: SurtidoPayload) {
  const idHoja: number = await insertHojaSuministro(payload.id_solicitudes, payload.observaciones);

  let estadoGlobal: EstadoSolicitud = 'Completo';

  for (const insumo of payload.insumos) {
    await insertHojaDetalle(
      idHoja,
      insumo.id_insumos,
      insumo.cantidad_solicitada,
      insumo.cantidad_suministrada
    );

    if (insumo.cantidad_suministrada > 0) {
      await updateLoteCantidad(insumo.id_lote, insumo.cantidad_suministrada);
      await updateReservaEstado(payload.id_solicitudes, insumo.id_lote, 'Consumida');
    } else {
      await updateReservaEstado(payload.id_solicitudes, insumo.id_lote, 'Liberada');
    }

    const estadoDetalle: EstadoDetalle =
      insumo.cantidad_suministrada === insumo.cantidad_solicitada
        ? 'Completo'
        : insumo.cantidad_suministrada > 0
        ? 'Parcial'
        : 'Rechazada';

    await updateDetalleEstado(insumo.id_detalle, estadoDetalle);

    if (estadoDetalle !== 'Completo') {
      estadoGlobal = 'Parcial';
    }
  }

  await updateSolicitudEstado(payload.id_solicitudes, estadoGlobal);

  // 🔎 Nuevo: obtener hoja completa
  const hoja = await getHojaById(idHoja);

  return {
    success: true,
    estado: estadoGlobal,
    cabecera: {
      id_hoja: hoja?.id_hoja,
      id_solicitudes: hoja?.id_solicitudes,
      fecha: hoja?.fecha,
      observaciones: hoja?.observaciones
    },
    detalles: hoja?.detalles || []
  };
}


export async function cancelarSolicitud(id_solicitudes: number, observaciones?: string) {
  // 1. Actualizar estado global
  await updateSolicitudEstado(id_solicitudes, 'Rechazada');

  // 2. Actualizar todos los detalles
  await updateDetalleEstadoBySolicitud(id_solicitudes, 'Rechazada');

  // 3. Liberar reservas
  await liberarReservasBySolicitud(id_solicitudes);

  // 4. Consultar detalles y reservas para respuesta
  const detalles = await getSolicitudDetalles(id_solicitudes);
  const reservas = await getReservasBySolicitud(id_solicitudes);

  return {
    success: true,
    id_solicitudes,
    estado: 'Rechazada',
    observaciones,
    detalles,
    reservas
  };
}

export async function getCancelacionBySolicitud(id_solicitudes: number) {
  const solicitud = await solicitudesRepository.getSolicitudById(id_solicitudes);
  const detalles = await getSolicitudDetalles(id_solicitudes);
  const reservas = await getReservasBySolicitud(id_solicitudes);

  return {
    success: true,
    id_solicitudes,
    estado: solicitud?.estado,
    observaciones: solicitud?.justificacion || null,
    detalles,
    reservas
  };
}

export async function getHojaBySolicitud(id_solicitudes: number) {
  // Buscar la hoja más reciente asociada a la solicitud
  const hoja = await db('hoja_suministro')
    .where({ id_solicitudes })
    .orderBy('fecha', 'desc')
    .first();

  if (!hoja) {
    return { success: false, message: "No existe hoja de suministro para esta solicitud" };
  }

  const detalles = await db('hoja_suministro_detalle as hd')
    .join('cat_insumos as i', 'hd.id_insumos', 'i.id_insumos')
    .select(
      'hd.id_detalle',
      'hd.id_insumos',
      'i.descripcion_corta as descripcion',
      'hd.cantidad_solicitada',
      'hd.cantidad_suministrada',
      'hd.estado'
    )
    .where('hd.id_hoja', hoja.id_hoja);

  return {
    success: true,
    id_hoja: hoja.id_hoja,
    id_solicitudes: hoja.id_solicitudes,
    fecha: hoja.fecha,
    observaciones: hoja.observaciones,
    detalles
  };
}