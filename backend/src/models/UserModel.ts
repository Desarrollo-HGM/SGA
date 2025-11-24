export interface User {
  id: number;              // usuarios.id_usuarios
  username: string;        // valores.usuario
  password: string;        // valores.password (hashed)
  role: string;            // roles.rol
  acceso: "Alto" | "Medio" | "Bajo"; // roles.acceso
  nombreCompleto: string;  // cat_medicos.nombre + apaterno + amaterno
  rfc: string;             // cat_medicos.rfc
}
