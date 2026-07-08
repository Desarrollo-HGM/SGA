import type { Response, NextFunction } from "express";
import type { AuthRequest } from "./authMiddleware";

/**
 * Middleware para validar roles.
 * - Admin siempre pasa.
 * - Los demás roles deben estar en la lista permitida.
 */
export const requireRole = (
  rolesPermitidos: ("solicitante" | "guarda" | "almacen" | "admin")[]
) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ message: "No autenticado" });
    }

    const { rol } = req.user;

    
    if (rol === "admin") {
      return next();
    }

    if (!rolesPermitidos.includes(rol)) {
      return res
        .status(403)
        .json({ message: "Acceso denegado: rol insuficiente" });
    }

    next();
  };
};

/**
 * Middleware para validar niveles de acceso.
 * - Admin siempre pasa.
 * - Los demás deben cumplir con el nivel requerido.
 */
export const requireAccessLevel = (
  nivelesPermitidos: ("Alto" | "Medio" | "Bajo")[]
) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ message: "No autenticado" });
    }

    const { acceso, rol } = req.user;

    // ✅ Admin siempre pasa
    if (rol === "admin") {
      return next();
    }

    if (!nivelesPermitidos.includes(acceso)) {
      return res
        .status(403)
        .json({ message: "Acceso denegado: nivel insuficiente" });
    }

    next();
  };
};
