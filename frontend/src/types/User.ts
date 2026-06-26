// src/types/User.ts
export type Rol = "solicitante" | "guarda" | "almacen" | "admin";

export interface User {
  id: number;
  username: string;
  nombreCompleto: string;
  rfc: string;
  rol: Rol;          
  acceso: string;    
}
