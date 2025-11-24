// src/services/auth.ts
import api from "../config/api";

export async function login(username: string, password: string) {
  const response = await api.post("/auth/login", { username, password });
  return response.data;
}


export async function validateToken() {
  const response = await api.get("/auth/validate");
  return response.data; // { valid: true, user: {...} }
}