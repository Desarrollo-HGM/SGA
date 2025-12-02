// src/routes/lotesRoutes.ts
import { Router } from "express";
import { lotesController } from "../controllers/lotesController.js";

const router = Router();

router.post("/", lotesController.create);
router.get("/", lotesController.list);
router.get("/:id", lotesController.get);
router.put("/:id", lotesController.update);
router.delete("/:id", lotesController.remove);

export default router;
