// src/types/User.ts
export type Rol = "solicitante" | "guarda" | "almacen" | "admin";

export interface User {
  id: number;
  username: string;
  rol: Rol;
  acceso: string;           
  nombreCompleto: string;    
  rfc: string;    
  servicio?: string;
  subalmacen?: string;   // 
  id_subalmacen?: number; //          
}
