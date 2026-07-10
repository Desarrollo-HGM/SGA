//src/repositories/hojaSuministroRepository.ts
import { db } from '../config/db.js';
import type { EstadoHojaDetalle, EstadoReserva, EstadoDetalle, EstadoSolicitud } from '../models/solicitud.js';

export async function insertHojaSuministro(
  id_solicitudes: number,
  observaciones?: string
      ): Promise<number> {
  const [id] = await db('hoja_suministro').insert({
    id_solicitudes,
    fecha: new Date(),
    observaciones: observaciones || null
  });

  if (!id) {
    throw new Error("No se pudo insertar la hoja de suministro");
  }

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

export async function getHojaById(id_hoja: number) {
  const hoja = await db('hoja_suministro')
    .where({ id_hoja })
    .first();

  if (!hoja) return null;

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
    .where('hd.id_hoja', id_hoja);

  return { ...hoja, detalles };
}
