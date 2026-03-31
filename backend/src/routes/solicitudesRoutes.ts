// src/routes/solicitudesRoutes.ts
import { Router } from 'express';
import { solicitudesController } from '../controllers/solicitudesController.js';

const router = Router();

router.post('/final', solicitudesController.create);
router.get('/', solicitudesController.getAll);
router.get('/:id', solicitudesController.getById);

export default router;