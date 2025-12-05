// src/services/auth.ts
import api from "../config/api";


// Login: recibe accessToken y user del backend
export const login = async (username: string, password: string) => {
  const res = await api.post("/auth/login", { username, password });
  const { accessToken, user } = res.data;
  return { token: accessToken, user };
};

// Refresh: obtiene un nuevo accessToken usando refreshToken
export const refreshToken = async (refreshToken: string) => {
  const res = await api.post("/auth/refresh", { token: refreshToken });
  const { accessToken, user } = res.data;
  return { token: accessToken, user };
};

// Validate: endpoint protegido que confirma si el token es válido
export const validateToken = async () => {
  try {
    const res = await api.get("/auth/validate");
    return { valid: true, user: res.data.user };
  } catch {
    return { valid: false };
  }
};
