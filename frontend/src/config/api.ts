// src/api.ts
import axios from "axios";
import { refreshToken as refreshTokenService } from "../services/auth";
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor para incluir accessToken en cada request
api.interceptors.request.use((config) => {
  const accessToken = localStorage.getItem("accessToken");

  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  return config;
});

// Interceptor para refrescar token automáticamente
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refresh = localStorage.getItem("refreshToken");
        if (!refresh) throw new Error("No hay refresh token");

        const { accessToken: newToken } = await refreshTokenService(refresh);

        // Actualizar headers
        api.defaults.headers.common["Authorization"] = `Bearer ${newToken}`;
        originalRequest.headers["Authorization"] = `Bearer ${newToken}`;

        return api(originalRequest);
      } catch (err) {
        console.error("Sesión expirada, redirigiendo a login");
        localStorage.clear();
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

export default api;
