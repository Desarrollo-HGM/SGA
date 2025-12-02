// src/routes/stockRoutes.ts
import { Router } from "express";
import { stockController } from "../controllers/stockController.js";

const router = Router();

router.get("/consolidado", stockController.getConsolidado);

export default router;