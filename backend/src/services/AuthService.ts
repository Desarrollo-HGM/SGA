// src/services/AuthService.ts
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { UserRepository } from "../repositories/UserRepository.js";

export const AuthService = {
  async login(username: string, password: string) {
    // Buscar usuario en base de datos con JOINs
    const user = await UserRepository.findByUsername(username);
    if (!user) throw new Error("Usuario no encontrado");

    // Validar contraseña
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) throw new Error("Credenciales inválidas");

    // Generar token JWT con datos relevantes
    const token = jwt.sign(
      {
        id: user.id,
        role: user.role,
        acceso: user.acceso,
        nombreCompleto: user.nombreCompleto,
        rfc: user.rfc,
      },
      process.env.JWT_SECRET as string,
      { expiresIn: "1h" }
    );

    // Retornar token y datos del usuario
    return {
      token,
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
        acceso: user.acceso,
        nombreCompleto: user.nombreCompleto,
        rfc: user.rfc,
      },
    };
  },
};
