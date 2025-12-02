// src/routes/movimientosRoutes.ts
import { Router } from "express";
import { movimientosController } from "../controllers/movimientosController.js";

const router = Router();

router.post("/", movimientosController.create);
router.get("/", movimientosController.list);
router.get("/:id", movimientosController.get);
router.put("/:id", movimientosController.update);
router.delete("/:id", movimientosController.remove);

export default router;
