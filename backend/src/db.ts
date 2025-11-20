import knex from 'knex';
import dotenv from 'dotenv';

// Cargar variables de entorno ANTES de leerlas
dotenv.config({ path: '.env.local' });

const { DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME } = process.env;

if (!DB_HOST || !DB_PORT || !DB_USER || !DB_PASSWORD || !DB_NAME) {
  throw new Error('Faltan variables de entorno para la conexión a la base de datos');
}

export const db = knex({
  client: 'mysql2',
  connection: {
    host: DB_HOST,
    port: Number(DB_PORT),
    user: DB_USER,
    password: DB_PASSWORD,
    database: DB_NAME,
  },
  pool: { min: 0, max: 7 },
});
