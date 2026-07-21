//src/routes/surtirRoutes.ts
import { Router } from 'express';
import { surtirController, cancelarController, cancelacionController } from '../controllers/surtirController.js';

const router = Router();

// Ruta para surtir una solicitud
router.post('/solicitudes/:id/surtir', surtirController.surtir);
router.post('/solicitudes/:id/cancelar', cancelarController.cancelar);
router.get('/solicitudes/:id/cancelacion', cancelacionController.getCancelacion);
router.get('/solicitudes/:id/hoja', surtirController.getHoja);
export default router;
