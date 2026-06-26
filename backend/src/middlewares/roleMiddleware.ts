// src/middlewares/roleMiddleware.ts
import type { Response, NextFunction } from "express";
import type { AuthRequest } from "./authMiddleware";

export const requireRole = (rolesPermitidos: ("solicitante" | "guarda" | "almacen" | "admin")[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ message: "No autenticado" });
    }

    const { role } = req.user;
    if (!rolesPermitidos.includes(role)) {
      return res.status(403).json({ message: "Acceso denegado: rol insuficiente" });
    }

    next();
  };
};

export const requireAccessLevel = (nivelesPermitidos: ("Alto" | "Medio" | "Bajo")[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ message: "No autenticado" });
    }

    const { acceso } = req.user;
    if (!nivelesPermitidos.includes(acceso)) {
      return res.status(403).json({ message: "Acceso denegado: nivel insuficiente" });
    }

    next();
  };
};
