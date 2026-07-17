// src/routes/solicitudesRoutes.ts
import { Router } from 'express';
import { solicitudesController } from '../controllers/solicitudesController.js';
import { surtirController } from '../controllers/surtirController.js';
const router = Router();

router.post('/final', solicitudesController.create);
router.get('/', solicitudesController.getAll);
router.get('/:id', solicitudesController.getById);


//  POST /api/solicitudes/:id

router.post('/:id', surtirController.surtir);


export default router;