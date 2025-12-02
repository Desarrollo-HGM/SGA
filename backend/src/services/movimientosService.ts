// src/services/movimientosService.ts
import { movimientosRepository } from "../repositories/movimientosRepository.js";
import { configStockService } from "./configStockService.js";
import { solicitudesRepository } from "../repositories/solicitudesRepository.js";
import type { Movimiento } from "../models/movimiento.js";
import { logger } from "../config/logger.js";

export const movimientosService = {
  async create(movimiento: Movimiento) {
    if (movimiento.cantidad <= 0) throw new Error("La cantidad debe ser mayor a 0");

    // Crear movimiento en DB
    const mov = await movimientosRepository.create(movimiento);
    logger.info("[MovimientosService] Movimiento creado", { id: mov.id_movimiento });

    // Obtener solicitud asociada
    const solicitud = await solicitudesRepository.findById(movimiento.id_solicitudes);
    if (!solicitud) throw new Error("Solicitud no encontrada");

    const { id_subalmacen, id_insumos } = solicitud;

    // Calcular stock actual
    const nuevoStock = await movimientosRepository.getStock(id_subalmacen, id_insumos);

    // Verificar configuración de stock
    const config = await configStockService.getConfig(id_subalmacen, id_insumos);
    if (config && nuevoStock < config.minimo) {
      logger.warn("[MovimientosService] Stock bajo mínimo, generando solicitud automática", {
        id_subalmacen,
        id_insumos,
        stock: nuevoStock,
        minimo: config.minimo,
      });

      await solicitudesRepository.create({
        id_subalmacen,
        id_insumos,
        cantidad: config.maximo - nuevoStock,
        estado: "Pendiente",
        tipo_solicitud: "ReabastecimientoAutomatico", // ✅ coincide con tu modelo Solicitud
        fecha_solicitud: new Date(),
        id_medico: solicitud.id_medico,
        id_servicio: solicitud.id_servicio,
        id_lote: movimiento.id_lote, // ✅ ahora consistente con tu modelo
      });
    }

    return mov;
  },

  async list(filter?: { id_lote?: number; id_subalmacen?: number }) {
    logger.debug("[MovimientosService] Listando movimientos", { filter });
    return movimientosRepository.findAll(filter);
  },

  async get(id: number) {
    logger.debug("[MovimientosService] Obteniendo movimiento", { id });
    const mov = await movimientosRepository.findById(id);
    if (!mov) {
      logger.warn("[MovimientosService] Movimiento no encontrado", { id });
      throw new Error("Movimiento no encontrado");
    }
    logger.info("[MovimientosService] Movimiento obtenido", { id });
    return mov;
  },

  async update(id: number, data: Partial<Movimiento>) {
    logger.debug("[MovimientosService] Actualizando movimiento", { id, data });
    return movimientosRepository.update(id, data);
  },

  async remove(id: number) {
    logger.debug("[MovimientosService] Eliminando movimiento", { id });
    return movimientosRepository.remove(id);
  },
};
