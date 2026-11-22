import { Router } from 'express';
import { createCaseHandler, getCaseHandler } from '../controllers/caseController.js';

const router = Router();

router.post('/cases', createCaseHandler);
router.get('/cases/:id', getCaseHandler);

export default router;