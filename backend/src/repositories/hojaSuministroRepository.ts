import { db } from '../config/db.js';
import type { EstadoHojaDetalle, EstadoReserva, EstadoDetalle, EstadoSolicitud } from '../models/solicitud.js';

export async function insertHojaSuministro(id_solicitudes: number, observaciones?: string) {
  const [id] = await db('hoja_suministro').insert({
    id_solicitudes,
    fecha: new Date(),
    observaciones: observaciones || null
  });
  return id;
}

export async function insertHojaDetalle(
  id_hoja: number,
  id_insumos: number,
  cantidad_solicitada: number,
  cantidad_suministrada: number
) {
  const estado: EstadoHojaDetalle =
    cantidad_suministrada === cantidad_solicitada
      ? 'Completo'
      : cantidad_suministrada > 0
      ? 'Parcial'
      : 'No Suministrado';

  const [id] = await db('hoja_suministro_detalle').insert({
    id_hoja,
    id_insumos,
    cantidad_solicitada,
    cantidad_suministrada,
    estado
  });
  return id;
}

// Actualizar lote
export async function updateLoteCantidad(id_lote: number, cantidad: number) {
  await db('lotes')
    .where({ id_lote })
    .decrement('cantidad_actual', cantidad);
}

// Actualizar reserva
export async function updateReservaEstado(id_solicitud: number, id_lote: number, estado: EstadoReserva) {
  await db('reservas')
    .where({ id_solicitud, id_lote })
    .update({ estado });
}

// Actualizar detalle de solicitud
export async function updateDetalleEstado(id_detalle: number, estado: EstadoDetalle) {
  await db('solicitudes_detalle')
    .where({ id_detalle })
    .update({ estado });
}

// Actualizar estado global de solicitud
export async function updateSolicitudEstado(id_solicitudes: number, estado: EstadoSolicitud) {
  await db('solicitudes')
    .where({ id_solicitudes })
    .update({ estado });
}
