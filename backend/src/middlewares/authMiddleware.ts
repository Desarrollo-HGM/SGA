import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import type { User } from "../types/user";

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers["authorization"];
    if (!authHeader) {
      return res.status(401).json({ message: "Token no proporcionado" });
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Token inválido" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as User;
    req.user = decoded; // ✅ ahora TS reconoce y tipa correctamente

    next();
  } catch (error) {
    return res.status(403).json({ message: "Token inválido o expirado" });
  }
};
