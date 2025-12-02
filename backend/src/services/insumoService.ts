// src/services/insumosService.ts
import { insumosRepository } from "../repositories/insumosRepository.js";
import type { Insumo } from "../models/insumo.js";
import { logger } from "../config/logger.js";

export const insumosService = {
  async create(data: Insumo) {
    logger.debug("[InsumosService] Creando insumo", { data });
    if (data.minimo > data.maximo) {
      logger.warn("[InsumosService] Validación fallida: mínimo > máximo", { minimo: data.minimo, maximo: data.maximo });
      throw new Error("El mínimo no puede ser mayor que el máximo");
    }
    const insumo = await insumosRepository.create(data);
    logger.info("[InsumosService] Insumo creado", { id: insumo.id_insumos });
    return insumo;
  },

  async list(filter?: { q?: string; clave?: string }) {
    logger.debug("[InsumosService] Listando insumos", { filter });
    return insumosRepository.findAll(filter);
  },

  async get(id: number) {
    logger.debug("[InsumosService] Obteniendo insumo", { id });
    const insumo = await insumosRepository.findById(id);
    if (!insumo) {
      logger.warn("[InsumosService] Insumo no encontrado", { id });
      throw new Error("Insumo no encontrado");
    }
    logger.info("[InsumosService] Insumo obtenido", { id });
    return insumo;
  },

  async update(id: number, data: Partial<Insumo>) {
    logger.debug("[InsumosService] Actualizando insumo", { id, data });
    return insumosRepository.update(id, data);
  },

  async remove(id: number) {
    logger.debug("[InsumosService] Eliminando insumo", { id });
    return insumosRepository.remove(id);
  },
};
