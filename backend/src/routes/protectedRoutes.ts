// src/routes/protectedRoutes.ts
import { Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = Router();

// Ejemplo de ruta protegida
router.get("/perfil", authMiddleware, (req, res) => {
  res.json({
    message: "Acceso permitido",
    user: (req as any).user, // datos del token
  });
});

export default router;
