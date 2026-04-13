import { Router } from 'express';
import { surtirController } from '../controllers/surtirController.js';

const router = Router();

// Ruta para surtir una solicitud
router.post('/solicitudes/:id/surtir', surtirController.surtir);

export default router;
