// src/routes/authRoutes.ts
import { Router } from "express";
import { AuthService } from "../services/AuthService.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = Router();

// Login
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const result = await AuthService.login(username, password);
    res.json(result);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// Refresh
router.post("/refresh", async (req, res) => {
  try {
    const { token } = req.body;
    const result = await AuthService.refresh(token);
    res.json(result);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// Validate: usa authMiddleware para verificar el accessToken
router.get("/validate", authMiddleware, (req, res) => {
  res.json({ valid: true, user: (req as any).user });
});

export default router;
