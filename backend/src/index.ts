import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { db } from './config/db.js';
import authRoutes from "./routes/authRoutes.js";

dotenv.config({ path: '.env.local' });

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({
  origin: process.env.CLIENT_URL, // ✅ origen permitido
  credentials: true
}));

app.use(express.json());

app.use("/auth", authRoutes);

app.get('/', async (_req, res) => {
  try {
    const result = await db.raw('SELECT 1 + 1 AS result');
    res.json({ message: 'Conexión exitosa', result: result[0] });
  } catch (error) {
    console.error('Error de conexión:', error);
    res.status(500).json({ error: 'Error al conectar con la base de datos' });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor backend escuchando en http://localhost:${PORT}`);
});
