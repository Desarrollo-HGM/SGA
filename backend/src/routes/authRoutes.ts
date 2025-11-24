// src/routes/authRoutes.ts
import { Router } from "express";
import { AuthController } from "../controllers/Authcontroller.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import type {AuthRequest} from "../middlewares/authMiddleware.js";

const router = Router();

router.post("/login", AuthController.login);
router.get("/validate", authMiddleware, (req: AuthRequest, res) => {
  // Si llega aquí, el token es válido
  res.json({
    valid: true,
    user: req.user, // payload del token
  });
});

export default router;
