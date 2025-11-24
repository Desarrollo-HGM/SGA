// src/repositories/UserRepository.ts
import { db } from "../config/db.js";
import type { User } from "../models/UserModel";

export const UserRepository = {
  async findByUsername(username: string): Promise<User | undefined> {
    const result = await db("valores")
      .join("usuarios", "valores.id_usuarios", "usuarios.id_usuarios")
      .join("cat_medicos", "usuarios.id_medico", "cat_medicos.id_medico")
      .join("roles", "usuarios.id_roles", "roles.id_roles")
      .select(
        "usuarios.id_usuarios as id",
        "valores.usuario as username",
        "valores.password as password",
        "roles.rol as role",
        "roles.acceso as acceso",
        "cat_medicos.nombre",
        "cat_medicos.apaterno",
        "cat_medicos.amaterno",
        "cat_medicos.rfc"
      )
      .where("valores.usuario", username)
      .first();

    if (!result) return undefined;

    return {
      id: result.id,
      username: result.username,
      password: result.password,
      role: result.role,
      acceso: result.acceso,
      nombreCompleto: `${result.nombre} ${result.apaterno} ${result.amaterno}`,
      rfc: result.rfc,
    };
  },
};