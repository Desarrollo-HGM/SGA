import {
  insertHojaSuministro,
  insertHojaDetalle,
  updateLoteCantidad,
  updateReservaEstado,
  updateDetalleEstado,
  updateSolicitudEstado
} from '../repositories/hojaSuministroRepository.js';

import type { SurtidoPayload, EstadoSolicitud, EstadoDetalle } from '../models/solicitud.js';

export async function surtirSolicitud(payload: SurtidoPayload) {
  // 1. Crear hoja de suministro (ahora siempre devuelve number)
  const idHoja: number = await insertHojaSuministro(payload.id_solicitudes, payload.observaciones);

  let estadoGlobal: EstadoSolicitud = 'Completada';

  // 2. Procesar insumos
  for (const insumo of payload.insumos) {
    await insertHojaDetalle(
      idHoja,
      insumo.id_insumos,
      insumo.cantidad_solicitada,
      insumo.cantidad_suministrada
    );

    // 3. Actualizar lote y reserva
    if (insumo.cantidad_suministrada > 0) {
      await updateLoteCantidad(insumo.id_lote, insumo.cantidad_suministrada);
      await updateReservaEstado(payload.id_solicitudes, insumo.id_lote, 'Consumida');
    } else {
      await updateReservaEstado(payload.id_solicitudes, insumo.id_lote, 'Liberada');
    }

    // 4. Actualizar detalle de solicitud
    const estadoDetalle: EstadoDetalle =
      insumo.cantidad_suministrada === insumo.cantidad_solicitada
        ? 'Completada'
        : insumo.cantidad_suministrada > 0
        ? 'Parcial'
        : 'Rechazada';

    await updateDetalleEstado(insumo.id_detalle, estadoDetalle);

    if (estadoDetalle !== 'Completada') {
      estadoGlobal = 'Parcial';
    }
  }

  // 5. Actualizar estado global de solicitud
  await updateSolicitudEstado(payload.id_solicitudes, estadoGlobal);

  return { success: true, id_hoja: idHoja, estado: estadoGlobal };
}
