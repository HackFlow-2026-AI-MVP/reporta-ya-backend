import { Router } from 'express';
import {
  listEvidenceTypes,
  createEvidence,
  getTimeline,
  getSummary,
} from '../controllers/evidenceController.js';

const router = Router();

router.get('/evidence-types', listEvidenceTypes);
router.post('/cases/:id/evidences', createEvidence);
router.get('/cases/:id/timeline', getTimeline);
router.get('/cases/:id/summary', getSummary);

export default router;