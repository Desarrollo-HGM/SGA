// src/routes/insumosRoutes.ts
import { Router } from "express";
import { insumosController } from "../controllers/insumosController.js";

const router = Router();

router.post("/", insumosController.create);
router.get("/", insumosController.list);
router.get("/:id", insumosController.get);
router.put("/:id", insumosController.update);
router.delete("/:id", insumosController.remove);

export default router;
