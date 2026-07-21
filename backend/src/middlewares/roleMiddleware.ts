import type { Request, Response, NextFunction } from "express";

export const requireRole = (
  rolesPermitidos: ("solicitante" | "guarda" | "almacen" | "admin")[]
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) return res.status(401).json({ message: "No autenticado" });

    const { rol } = req.user;
    if (rol === "admin") return next();

    if (!rolesPermitidos.includes(rol)) {
      return res.status(403).json({ message: "Acceso denegado: rol insuficiente" });
    }

    next();
  };
};

export const requireAccessLevel = (
  nivelesPermitidos: ("Alto" | "Medio" | "Bajo")[]
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) return res.status(401).json({ message: "No autenticado" });

    const { acceso, rol } = req.user;
    if (rol === "admin") return next();

    if (!nivelesPermitidos.includes(acceso)) {
      return res.status(403).json({ message: "Acceso denegado: nivel insuficiente" });
    }

    next();
  };
};

export const requireServicio = (serviciosPermitidos: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) return res.status(401).json({ message: "No autenticado" });

    const { servicio, rol } = req.user;
    if (rol === "admin") return next();

    if (!serviciosPermitidos.includes(servicio!)) {
      return res.status(403).json({ message: "Acceso denegado: servicio no autorizado" });
    }

    next();
  };
};

export const requireSubalmacen = (subalmacenesPermitidos: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) return res.status(401).json({ message: "No autenticado" });

    const { subalmacen, rol } = req.user;

    // Admin siempre pasa
    if (rol === "admin") return next();

    if (!subalmacenesPermitidos.includes(subalmacen!)) {
      return res.status(403).json({ message: "Acceso denegado: subalmacén no autorizado" });
    }

    next();
  };
};
