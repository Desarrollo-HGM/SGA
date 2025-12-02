// src/routes/authRoutes.ts
import { Router } from "express";
import { AuthService } from "../services/AuthService.js";
import { logger } from "../config/logger.js";

const router = Router();

// Login
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const result = await AuthService.login(username, password);
    logger.info("[AuthRoutes] Usuario logueado", { userId: result.user.id });
    res.json(result);
  } catch (err: any) {
    logger.error("[AuthRoutes] Error en login", { error: err.message });
    res.status(400).json({ error: err.message });
  }
});

// Refresh
router.post("/refresh", async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return res.status(401).json({ error: "Refresh token requerido" });
    }

    const result = await AuthService.refresh(refreshToken);
    logger.info("[AuthRoutes] Token refrescado", { userId: result.user.id });
    res.json(result);
  } catch (err: any) {
    logger.warn("[AuthRoutes] Refresh token inválido o expirado", { error: err.message });
    res.status(403).json({ error: err.message });
  }
});

export default router;
