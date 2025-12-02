// src/routes/solicitudesRoutes.ts
import { Router } from "express";
import { solicitudesController } from "../controllers/solicitudesController.js";

const router = Router();

router.post("/", solicitudesController.create);
router.get("/", solicitudesController.list);
router.get("/:id", solicitudesController.get);
router.put("/:id", solicitudesController.update);
router.delete("/:id", solicitudesController.remove);

export default router;
