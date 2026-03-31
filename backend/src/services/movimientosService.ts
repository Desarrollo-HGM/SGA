// src/services/movimientosService.ts
import { movimientosRepository } from "../repositories/movimientosRepository.js";
import { configStockService } from "./configStockService.js";
import { solicitudesRepository } from "../repositories/solicitudesRepository.js"; // Importamos el objeto
import type { Movimiento } from "../models/movimiento.js";
import { logger } from "../config/logger.js";

export const movimientosService = {
  async create(movimiento: Movimiento) {
    if (movimiento.cantidad <= 0) throw new Error("La cantidad debe ser mayor a 0");

    // 1. Crear movimiento
    const mov = await movimientosRepository.create(movimiento);

    // 2. Obtener solicitud asociada usando el nombre correcto: getSolicitudById
    const solicitud = await solicitudesRepository.getSolicitudById(movimiento.id_solicitudes);
    if (!solicitud) {
        logger.warn("[MovimientosService] Movimiento creado sin solicitud previa o no encontrada");
        return mov; 
    }

    const { id_subalmacen, id_insumos } = solicitud;

    // 3. Calcular stock actual
    const nuevoStock = await movimientosRepository.getStock(id_subalmacen, id_insumos);

    // 4. Verificar configuración de stock
    const config = await configStockService.getConfig(id_subalmacen, id_insumos);
    
    if (config && nuevoStock < config.minimo) {
      logger.warn("[MovimientosService] Stock bajo mínimo, generando solicitud automática", { id_insumos });

      // Usar el nombre correcto: insertSolicitud
      await solicitudesRepository.insertSolicitud({
        id_subalmacen,
        id_servicio: solicitud.id_servicio,
        id_medico: solicitud.id_medico,
        tipo_solicitud: "ReabastecimientoAutomatico",
        fecha_solicitud: new Date(),
        estado: "Pendiente",
        justificacion: `Reabastecimiento automático: Stock actual (${nuevoStock}) debajo del mínimo (${config.minimo})`
      });
      
      // Nota: Aquí faltaría insertar el detalle de la solicitud automática si tu lógica lo requiere
    }

    return mov;
  },

  async list(filter?: { id_lote?: number; id_subalmacen?: number }) {
    return await movimientosRepository.findAll(filter);
  },

  async get(id: number) {
    const mov = await movimientosRepository.findById(id);
    if (!mov) throw new Error("Movimiento no encontrado");
    return mov;
  },

  async update(id: number, data: Partial<Movimiento>) {
    return await movimientosRepository.update(id, data);
  },

  async remove(id: number) {
    return await movimientosRepository.remove(id);
  }
};