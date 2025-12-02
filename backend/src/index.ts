import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { db } from './config/db.js';
import authRoutes from "./routes/authRoutes.js";
import insumosRoutes from "./routes/insumosRoutes.js";
import lotesRoutes from "./routes/lotesRoutes.js";
import movimientosRoutes from "./routes/movimientosRoutes.js";
import solicitudesRoutes from "./routes/solicitudesRoutes.js";
import { authMiddleware } from "./middlewares/authMiddleware.js"; 
import { requireRole } from "./middlewares/roleMiddleware.js";   
import { logger } from "./config/logger.js"; 
import stockRoutes from "./routes/stockRoutes.js";


dotenv.config({ path: '.env.local' });

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({
  origin: process.env.CLIENT_URL, // ✅ origen permitido
  credentials: true
}));

app.use(express.json());

// 🔐 Rutas de autenticación (login, refresh, etc.)
app.use("/auth", authRoutes);

// 🔍 Healthcheck con log
app.get('/', async (_req, res) => {
  try {
    const result = await db.raw('SELECT 1 + 1 AS result');
    logger.info("[Server] Healthcheck OK", { result: result[0] });
    res.json({ message: 'Conexión exitosa', result: result[0] });
  } catch (error: any) {
    logger.error("[Server] Error de conexión DB", { error: error.message });
    res.status(500).json({ error: 'Error al conectar con la base de datos' });
  }
});

// ✅ Protegemos las rutas de API con authMiddleware
app.use("/api/insumos", authMiddleware, requireRole(["Administrador", "Almacen"]), insumosRoutes);
app.use("/api/lotes", authMiddleware, requireRole(["Administrador", "Almacen"]), lotesRoutes);
app.use("/api/movimientos", authMiddleware, requireRole(["Administrador", "Almacen"]), movimientosRoutes);
app.use("/api/solicitudes", authMiddleware, requireRole(["Administrador", "Almacen", "Auditor"]), solicitudesRoutes);
app.use(
  "/api/stock",
  authMiddleware,
  requireRole(["Administrador", "Almacen", "Auditor"]),
  stockRoutes
);

app.listen(PORT, () => {
  logger.info(`[Server] Servidor backend escuchando en http://localhost:${PORT}`);
});
