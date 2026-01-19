// src/middlewares/authMiddleware.ts
import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface AuthRequest extends Request {
  user?: any; // aquí guardaremos los datos del token
}

export const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    // El token normalmente viene en el header: Authorization: Bearer <token>
    const authHeader = req.headers["authorization"];
    if (!authHeader) {
      return res.status(401).json({ message: "Token no proporcionado" });
    }

    const token = authHeader.split(" ")[1]; // separar "Bearer" del token
    if (!token) {
      return res.status(401).json({ message: "Token inválido" });
    }

    // Verificar token
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);

    // Guardar datos del usuario en la request para usarlos en los controladores
    req.user = decoded;

    next();
  } catch (error) {
    return res.status(403).json({ message: "Token inválido o expirado" });
  }
};