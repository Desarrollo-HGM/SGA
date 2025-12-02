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

  async findById(id: number): Promise<User | undefined> {
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
      .where("usuarios.id_usuarios", id)
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



async findActiveRefreshToken(userId: number) {
  return await db("refresh_tokens")
    .where({ usuario_id: userId })
    .andWhere("expira", ">", new Date())
    .first();
},

async saveRefreshToken(userId: number, token: string, ultimoUso: Date) {
  // Borra tokens previos para asegurar sesión única
  await db("refresh_tokens").where({ usuario_id: userId }).del();

  await db("refresh_tokens").insert({
    usuario_id: userId,
    token,
    ultimo_uso: ultimoUso,
    expira: new Date(ultimoUso.getTime() + 2 * 60 * 60 * 1000), // 2 horas
  });
},

async updateRefreshTokenUsage(userId: number, nuevoUso: Date) {
  await db("refresh_tokens")
    .where({ usuario_id: userId })
    .update({
      ultimo_uso: nuevoUso,
      expira: new Date(nuevoUso.getTime() + 2 * 60 * 60 * 1000),
    });
},

async invalidateRefreshToken(userId: number) {
  await db("refresh_tokens").where({ usuario_id: userId }).del();
}
};
