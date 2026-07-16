//src/controllers/solicitudesController.ts
import type { Request, Response } from 'express';
import { solicitudesService } from '../services/solicitudesService.js';
import { logger } from '../config/logger.js';
import { db } from '../config/db.js';

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

  
async getAll(req: Request, res: Response) {
  try {
    const { estado, id_subalmacen, tipo_solicitud } = req.query;

    // Lógica de negocio/vista: Si no especifican tipo_solicitud, definimos una por defecto (ej: 'Clinica')
    const tipoFinal = (tipo_solicitud as string) || 'Clinica';

    const result = await solicitudesService.listarSolicitudes(
      tipoFinal, 
      estado as string,
      id_subalmacen ? Number(id_subalmacen) : undefined
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
  },

 // POST /api/solicitudes/:id// 
async surtirSolicitud(req: Request, res: Response) {
  try {
    const idSolicitud = Number(req.params.id);
    const { observaciones, insumos } = req.body;

    // 1. Validar existencia de la solicitud
    const solicitud = await db("solicitudes")
      .where({ id_solicitudes: idSolicitud })
      .first();

    if (!solicitud) {
      return res.status(404).json({ success: false, message: "Solicitud no encontrada" });
    }

    // 2. Crear cabecera en hoja_suministro
    const [hoja] = await db("hoja_suministro")
      .insert({
        id_solicitudes: idSolicitud,
        fecha: new Date(),
        observaciones: observaciones || "Surtido automático de Clínica",
      });

    // En MySQL, insert devuelve el ID directamente
    const idHoja = hoja;

    // 3. Determinar estado cabecera
    const todosCompletos = insumos.every(
      (i: any) => i.cantidad_suministrada === i.cantidad_solicitada
    );
    const estadoCabecera = todosCompletos ? "Completo" : "Parcial";

    // 4. Actualizar solicitud
    await db("solicitudes")
      .where({ id_solicitudes: idSolicitud })
      .update({
        estado: estadoCabecera,
        justificacion: observaciones || solicitud.justificacion,
      });

    // 5. Insertar detalle en hoja_suministro_detalle
    for (const insumo of insumos) {
      let estadoDetalle: string;
      if (insumo.cantidad_suministrada === 0) {
        estadoDetalle = "No Suministrado";
      } else if (insumo.cantidad_suministrada < insumo.cantidad_solicitada) {
        estadoDetalle = "Parcial";
      } else {
        estadoDetalle = "Completo";
      }

      await db("hoja_suministro_detalle").insert({
        id_hoja: idHoja, // ✅ ahora sí existe en hoja_suministro
        id_insumos: insumo.id_insumos,
        cantidad_solicitada: insumo.cantidad_solicitada,
        cantidad_suministrada: insumo.cantidad_suministrada,
        estado: estadoDetalle,
      });
    }

    res.json({ success: true, message: "Solicitud surtida correctamente" });
  } catch (error: any) {
    console.error("Error en surtirSolicitud:", error);
    res.status(500).json({ success: false, message: error.message });
  }
}





};

