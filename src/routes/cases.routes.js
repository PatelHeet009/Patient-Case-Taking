import { Router } from 'express';
import { v4 as uuid } from 'uuid';
import { z } from 'zod';
import { db } from '../db/connection.js';
import { serializeCase } from '../serializers.js';
import { requireAuth } from '../middleware/auth.js';
import { asyncHandler, badRequest, notFound } from '../utils/errors.js';

const router = Router();
router.use(requireAuth);

const vitalsSchema = z
  .object({
    blood_pressure: z.string().optional(),
    pulse_rate: z.string().optional(),
    temperature: z.string().optional(),
    respiratory_rate: z.string().optional(),
    spo2: z.string().optional(),
    weight: z.string().optional(),
  })
  .optional();

const caseSchema = z.object({
  patient_id: z.string().min(1),
  chief_complaint: z.string().min(1),
  present_illness: z.string().optional().default(''),
  past_history: z.string().optional().default(''),
  allergies: z.string().optional().default(''),
  medications: z.string().optional().default(''),
  examination_notes: z.string().optional().default(''),
  vitals: vitalsSchema,
  additional_notes: z.string().optional().default(''),
  recorded_by_name: z.string().min(1),
  recorded_by_role: z.enum(['doctor', 'staff', 'administrator']),
});

// GET /api/cases?patient_id=xxx — list all cases, or filter by patient, newest first
router.get(
  '/',
  asyncHandler(async (req, res) => {
    const { patient_id } = req.query;
    const rows = patient_id
      ? db.prepare('SELECT * FROM cases WHERE patient_id = ? ORDER BY created_at DESC').all(patient_id)
      : db.prepare('SELECT * FROM cases ORDER BY created_at DESC').all();
    res.json({ cases: rows.map(serializeCase) });
  }),
);

// GET /api/cases/:id
router.get(
  '/:id',
  asyncHandler(async (req, res, next) => {
    const row = db.prepare('SELECT * FROM cases WHERE id = ?').get(req.params.id);
    if (!row) return next(notFound('Case not found.'));
    res.json({ case: serializeCase(row) });
  }),
);

// POST /api/cases — record a new case for a patient
router.post(
  '/',
  asyncHandler(async (req, res, next) => {
    const parsed = caseSchema.safeParse(req.body);
    if (!parsed.success) return next(badRequest('Invalid case payload.', parsed.error.flatten()));

    const c = parsed.data;
    const patient = db.prepare('SELECT id FROM patients WHERE id = ?').get(c.patient_id);
    if (!patient) return next(badRequest(`Patient "${c.patient_id}" does not exist.`));

    const now = new Date().toISOString();
    const id = `case-${uuid().slice(0, 8)}`;

    db.prepare(
      `INSERT INTO cases
        (id, patient_id, chief_complaint, present_illness, past_history, allergies, medications,
         examination_notes, vitals_json, additional_notes, recorded_by_id, recorded_by_name, recorded_by_role,
         created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    ).run(
      id,
      c.patient_id,
      c.chief_complaint,
      c.present_illness,
      c.past_history,
      c.allergies,
      c.medications,
      c.examination_notes,
      c.vitals ? JSON.stringify(c.vitals) : null,
      c.additional_notes,
      req.user.id,
      c.recorded_by_name,
      c.recorded_by_role,
      now,
      now,
    );

    const row = db.prepare('SELECT * FROM cases WHERE id = ?').get(id);
    res.status(201).json({ case: serializeCase(row) });
  }),
);

// PUT /api/cases/:id — update an existing case record
router.put(
  '/:id',
  asyncHandler(async (req, res, next) => {
    const existing = db.prepare('SELECT * FROM cases WHERE id = ?').get(req.params.id);
    if (!existing) return next(notFound('Case not found.'));

    const parsed = caseSchema.partial().safeParse(req.body);
    if (!parsed.success) return next(badRequest('Invalid case payload.', parsed.error.flatten()));

    const c = parsed.data;
    const merged = {
      chief_complaint: c.chief_complaint ?? existing.chief_complaint,
      present_illness: c.present_illness ?? existing.present_illness,
      past_history: c.past_history ?? existing.past_history,
      allergies: c.allergies ?? existing.allergies,
      medications: c.medications ?? existing.medications,
      examination_notes: c.examination_notes ?? existing.examination_notes,
      vitals_json: c.vitals ? JSON.stringify(c.vitals) : existing.vitals_json,
      additional_notes: c.additional_notes ?? existing.additional_notes,
    };

    db.prepare(
      `UPDATE cases SET
        chief_complaint = ?, present_illness = ?, past_history = ?, allergies = ?, medications = ?,
        examination_notes = ?, vitals_json = ?, additional_notes = ?, updated_at = ?
       WHERE id = ?`,
    ).run(
      merged.chief_complaint,
      merged.present_illness,
      merged.past_history,
      merged.allergies,
      merged.medications,
      merged.examination_notes,
      merged.vitals_json,
      merged.additional_notes,
      new Date().toISOString(),
      req.params.id,
    );

    const row = db.prepare('SELECT * FROM cases WHERE id = ?').get(req.params.id);
    res.json({ case: serializeCase(row) });
  }),
);

// DELETE /api/cases/:id
router.delete(
  '/:id',
  asyncHandler(async (req, res, next) => {
    const existing = db.prepare('SELECT id FROM cases WHERE id = ?').get(req.params.id);
    if (!existing) return next(notFound('Case not found.'));
    db.prepare('DELETE FROM cases WHERE id = ?').run(req.params.id);
    res.status(204).send();
  }),
);

export default router;
