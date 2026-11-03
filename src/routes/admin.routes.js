import { Router } from 'express';
import { db } from '../db/connection.js';
import { requireAuth, requireRole } from '../middleware/auth.js';
import { asyncHandler } from '../utils/errors.js';
import { seed } from '../db/seed.js';

const router = Router();
router.use(requireAuth);

// POST /api/admin/reset — wipes and reseeds the database with demo data.
// Mirrors the frontend's original "Reset to demo data" button.
router.post(
  '/reset',
  requireRole('administrator'),
  asyncHandler(async (req, res) => {
    seed({ wipe: true });
    res.json({ success: true, message: 'Database reset to demo dataset.' });
  }),
);

// GET /api/admin/stats — quick counts for the dashboard
router.get(
  '/stats',
  asyncHandler(async (req, res) => {
    const patientCount = db.prepare('SELECT COUNT(*) AS c FROM patients').get().c;
    const caseCount = db.prepare('SELECT COUNT(*) AS c FROM cases').get().c;
    const userCount = db.prepare('SELECT COUNT(*) AS c FROM users').get().c;
    res.json({ patientCount, caseCount, userCount });
  }),
);

export default router;
