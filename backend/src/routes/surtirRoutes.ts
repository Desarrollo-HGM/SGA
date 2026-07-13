//src/routes/surtirRoutes.ts
import { Router } from 'express';
import { surtirController } from '../controllers/surtirController.js';

const router = Router();

// Ruta para surtir una solicitud
router.post('/solicitudes/:id/surtir', surtirController.surtir);
//router.post('/solicitudes/:id/cancelar', cancelarController.cancelar);

export default router;
