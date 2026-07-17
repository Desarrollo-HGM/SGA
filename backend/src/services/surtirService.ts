//src/services/surtirService.ts
import {
  insertHojaSuministro,
  insertHojaDetalle,
  updateLoteCantidad,
  updateReservaEstado,
  updateDetalleEstado,
  updateSolicitudEstado,
  getHojaById
} from '../repositories/hojaSuministroRepository.js';

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


//export async function cancelarSolicitud(id_solicitudes: number) {
//  await updateSolicitudEstado(id_solicitudes, 'Rechazada');
//  await updateDetalleEstado(id_solicitudes, 'Rechazada');
//  await liberarReservas(id_solicitudes);
//
//  return { success: true, id_solicitudes, estado: 'Rechazada' };
//}