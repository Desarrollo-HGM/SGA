import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { UserRepository } from "../repositories/UserRepository.js";
import { logger } from "../config/logger.js";

const ACCESS_EXPIRATION = "15m"; // token corto
const INACTIVITY_LIMIT = 2 * 60 * 60 * 1000; // 2 horas en ms

const generateAccessToken = (user: any) => {
  return jwt.sign(
    {
      id: user.id,
      role: user.role,
      acceso: user.acceso,
      nombreCompleto: user.nombreCompleto,
      rfc: user.rfc,
    },
    process.env.JWT_SECRET as string,
    { expiresIn: ACCESS_EXPIRATION }
  );
};

const generateRefreshToken = (user: any) => {
  return jwt.sign(
    { id: user.id },
    process.env.JWT_REFRESH_SECRET as string,
    { expiresIn: "7d" }
  );
};

export const AuthService = {
  async login(username: string, password: string) {
    const user = await UserRepository.findByUsername(username);
    if (!user) throw new Error("Usuario no encontrado");

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) throw new Error("Credenciales inválidas");

    // Verificar si ya existe sesión activa
    const activeToken = await UserRepository.findActiveRefreshToken(user.id);
    if (activeToken && new Date(activeToken.expira) > new Date()) {
      logger.info("[AuthService] Sesión activa detectada, devolviendo tokens existentes", { userId: user.id });

      // Generamos un nuevo access token corto, pero reutilizamos el refresh token existente
      const accessToken = generateAccessToken(user);

      return {
        accessToken,
        refreshToken: activeToken.token,
        user,
      };
    }

    // Si no hay sesión activa, crear nueva
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    await UserRepository.saveRefreshToken(user.id, refreshToken, new Date());

    return {
      accessToken,
      refreshToken,
      user,
    };
  },

  async refresh(token: string) {
    try {
      const decoded: any = jwt.verify(token, process.env.JWT_REFRESH_SECRET as string);
      const user = await UserRepository.findById(decoded.id);
      if (!user) throw new Error("Usuario no encontrado");

      const storedToken = await UserRepository.findActiveRefreshToken(user.id);
      if (!storedToken || storedToken.token !== token) {
        throw new Error("Refresh token inválido");
      }

      // Validar inactividad
      const ultimoUso = new Date(storedToken.ultimo_uso);
      const ahora = new Date();
      if (ahora.getTime() - ultimoUso.getTime() > INACTIVITY_LIMIT) {
        await UserRepository.invalidateRefreshToken(user.id);
        throw new Error("Sesión expirada por inactividad");
      }

      // Actualizar último uso
      await UserRepository.updateRefreshTokenUsage(user.id, ahora);

      const newAccessToken = generateAccessToken(user);
      return { accessToken: newAccessToken, user };
    } catch (err) {
      logger.warn("[AuthService] Refresh token inválido o expirado", { error: (err as any).message });
      throw err;
    }
  },
};
