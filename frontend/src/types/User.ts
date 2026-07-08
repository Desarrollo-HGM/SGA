// src/types/User.ts
export type Rol = "solicitante" | "guarda" | "almacen" | "admin";

export interface User {
  id: number;
  username: string;
  rol: Rol;
  acceso: string;            // si tu backend lo devuelve
  nombreCompleto: string;    // este es el que falta
  rfc: string;               // también lo devuelve tu AuthService
}
