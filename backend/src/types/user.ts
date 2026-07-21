export type Rol = "solicitante" | "guarda" | "almacen" | "admin";

export interface User {
  id: number;
  username: string;
  rol: Rol;
  acceso: string;            // si tu backend lo devuelve
  nombreCompleto: string;    // nombre completo del usuario
  rfc: string;    
  servicio?: string; 
  subalmacen?: string;   // 
  id_subalmacen?: number; //         // servicio/subalmacén al que pertenece
}
