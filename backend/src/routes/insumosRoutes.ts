// src/routes/insumosRoutes.ts
import { Router } from "express";
import { insumosController } from "../controllers/insumosController.js";
import { requireRole, requireAccessLevel, requireServicio } from "../middlewares/roleMiddleware.js";


const router = Router();

// Crear insumo: solo admin y almacén con nivel Alto
router.post(
  "/",
  requireRole(["admin", "almacen"]),
  requireAccessLevel(["Alto"]),
  requireServicio(["Almacén Central"]), // 👈 ejemplo de servicio permitido
  insumosController.create
);

// Listar insumos: solicitante, guarda, almacén con nivel Medio o Alto
router.get(
  "/",
  requireRole(["solicitante", "guarda", "almacen"]),
  requireAccessLevel(["Medio", "Alto"]),
  requireServicio(["Clínica", "Urgencias", "Almacén Central"]),
  insumosController.list
);

// Obtener insumo por ID
router.get(
  "/:id",
  requireRole(["solicitante", "guarda", "almacen"]),
  requireAccessLevel(["Medio", "Alto"]),
  requireServicio(["Clínica", "Urgencias", "Almacén Central"]),
  insumosController.get
);

// Actualizar insumo: solo admin y almacén
router.put(
  "/:id",
  requireRole(["admin", "almacen"]),
  requireAccessLevel(["Alto"]),
  requireServicio(["Almacén Central"]),
  insumosController.update
);

// Eliminar insumo: solo admin
router.delete(
  "/:id",
  requireRole(["admin"]),
  requireAccessLevel(["Alto"]),
  requireServicio(["Almacén Central"]),
  insumosController.remove
);

export default router;
