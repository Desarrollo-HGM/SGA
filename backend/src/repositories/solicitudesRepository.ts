// src/repositories/solicitudesRepository.ts
import { db } from '../config/db.js';
import { logger } from '../config/logger.js'; // Usamos tu logger para consistencia
import type { Solicitud, SolicitudDetalle } from '../models/solicitud.js';
import { format } from 'date-fns';

export const solicitudesRepository = {
  // Insertar cabecera de solicitud
  async insertSolicitud(data: Partial<Solicitud>): Promise<number> {
    try {
      if (data.fecha_solicitud instanceof Date) {
        data.fecha_solicitud = format(data.fecha_solicitud, 'yyyy-MM-dd');
      }

      const ids = await db('solicitudes').insert(data);
      const id = ids[0];
      
      if (!id) throw new Error("No se pudo insertar la solicitud");
      
      logger.info("[SolicitudesRepository] Cabecera insertada", { id });
      return id;
    } catch (err: any) {
      logger.error("[SolicitudesRepository] Error en insertSolicitud", { error: err.message });
      throw err;
    }
  },

  // Insertar detalle de solicitud
  async insertDetalle(data: Partial<SolicitudDetalle>): Promise<number> {
    try {
      const ids = await db('solicitudes_detalle').insert(data);
      const id = ids[0];

      if (!id) throw new Error("No se pudo insertar el detalle");

      return id;
    } catch (err: any) {
      logger.error("[SolicitudesRepository] Error en insertDetalle", { error: err.message });
      throw err;
    }
  },

  async insertReserva(id_solicitud: number, id_lote: number, cantidad: number) {
    try {
      return await db('reservas').insert({
        id_solicitud,
        id_lote,
        cantidad,
        estado: 'Pendiente'
      });
    } catch (err: any) {
      logger.error("[SolicitudesRepository] Error en insertReserva", { error: err.message });
      throw err;
    }
  },

  // Obtener lotes disponibles
  async getLotesDisponibles(id_insumo: number, id_subalmacen: number) {
    try {
      return await db('lotes')
        .where({ id_insumo, id_subalmacen })
        .andWhere('cantidad_actual', '>', 0)
        .orderBy('fecha_caducidad', 'asc');
    } catch (err: any) {
      logger.error("[SolicitudesRepository] Error en getLotesDisponibles", { error: err.message });
      throw err;
    }
  },

  // Listar solicitudes
  async getSolicitudes(estado?: string, id_subalmacen?: number) {
    try {
      let query = db('solicitudes as so')
        .join('cat_servicios as s', 'so.id_servicio', 's.id_servicios')
        .join('subalmacenes as sa', 'so.id_subalmacen', 'sa.id_subalmacen')
        .leftJoin('cat_medicos as m', 'so.id_medico', 'm.id_medico')
        .select(
          'so.id_solicitudes',
          'so.tipo_solicitud',
          'so.fecha_solicitud',
          'so.estado',
          'so.justificacion',
          'so.id_servicio',
          's.servicio as nombre_servicio',
          'so.id_subalmacen',
          'sa.nombre as nombre_subalmacen',
          'so.id_medico',
          db.raw("CONCAT(COALESCE(m.nombre, ''), ' ', COALESCE(m.apaterno, ''), ' ', COALESCE(m.amaterno, '')) as nombre_requisitor")
        );

      if (estado) query = query.where('so.estado', estado);
      if (id_subalmacen) query = query.where('so.id_subalmacen', id_subalmacen);

      return await query;
    } catch (err: any) {
      logger.error("[SolicitudesRepository] Error en getSolicitudes", { error: err.message });
      throw err;
    }
  },

  // Obtener detalle por ID
  async getSolicitudById(id_solicitudes: number) {
    try {
      const solicitud = await db('solicitudes as so')
        .join('cat_servicios as s', 'so.id_servicio', 's.id_servicios')
        .join('subalmacenes as sa', 'so.id_subalmacen', 'sa.id_subalmacen')
        .leftJoin('cat_medicos as m', 'so.id_medico', 'm.id_medico')
        .select(
          'so.id_solicitudes',
          'so.tipo_solicitud',
          'so.fecha_solicitud',
          'so.estado',
          'so.justificacion',
          'so.id_servicio',
          's.servicio as nombre_servicio',
          'so.id_subalmacen',
          'sa.nombre as nombre_subalmacen',
          'so.id_medico',
          db.raw("CONCAT(COALESCE(m.nombre, ''), ' ', COALESCE(m.apaterno, ''), ' ', COALESCE(m.amaterno, '')) as nombre_requisitor")
        )
        .where('so.id_solicitudes', id_solicitudes)
        .first();

      if (!solicitud) return null;

      const detalles = await db('solicitudes_detalle as sd')
        .join('cat_insumos as i', 'sd.id_insumos', 'i.id_insumos')
        .select(
          'sd.id_detalle',
          'sd.id_insumos',
          'i.descripcion_corta as descripcion',
          'sd.cantidad',
          'sd.id_lote',
          'sd.estado'
        )
        .where('sd.id_solicitudes', id_solicitudes);

      return { ...solicitud, insumos: detalles };
    } catch (err: any) {
      logger.error("[SolicitudesRepository] Error en getSolicitudById", { error: err.message });
      throw err;
    }
  }
};