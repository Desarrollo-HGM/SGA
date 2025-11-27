// src/types/User.ts
export interface User {
  id: number;
  username: string;
  role: "Administrador" | "Usuario"; // puedes ampliar con más roles
  acceso: string;            // si tu backend lo devuelve
  nombreCompleto: string;    // este es el que falta
  rfc: string;               // también lo devuelve tu AuthService
}
