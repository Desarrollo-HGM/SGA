// src/types/User.ts
export interface User {
  id: number;
  username: string;
  role: string; // puedes ampliar con más roles
  acceso: string;            // si tu backend lo devuelve
  nombreCompleto: string;    // este es el que falta
  rfc: string;               // también lo devuelve tu AuthService
}
