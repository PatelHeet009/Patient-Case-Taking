import { Router } from 'express';
import { v4 as uuid } from 'uuid';
import { z } from 'zod';
import { db } from '../db/connection.js';
import { serializePatient } from '../serializers.js';
import { requireAuth } from '../middleware/auth.js';
import { asyncHandler, badRequest, notFound } from '../utils/errors.js';

const router = Router();
router.use(requireAuth);

const patientSchema = z.object({
  patient_code: z.string().min(1),
  name: z.string().min(1),
  age: z.number().int().min(0).max(150),
  gender: z.enum(['Male', 'Female', 'Other']),
  phone: z.string().min(1),
  address: z.string().min(1),
  emergency_contact: z.string().min(1),
  emergency_contact_phone: z.string().optional(),
  blood_group: z.string().optional(),
});

// GET /api/patients?search=xyz — list all patients, newest first, with optional search
router.get(
  '/',
  asyncHandler(async (req, res) => {
    const { search } = req.query;
    let rows;
    if (search && String(search).trim()) {
      const q = `%${String(search).trim().toLowerCase()}%`;
      rows = db
        .prepare(
          `SELECT * FROM patients
           WHERE LOWER(name) LIKE ? OR LOWER(patient_code) LIKE ? OR phone LIKE ?
           ORDER BY created_at DESC`,
        )
        .all(q, q, q);
    } else {
      rows = db.prepare('SELECT * FROM patients ORDER BY created_at DESC').all();
    }
    res.json({ patients: rows.map(serializePatient) });
  }),
);

// GET /api/patients/:id
router.get(
  '/:id',
  asyncHandler(async (req, res, next) => {
    const row = db.prepare('SELECT * FROM patients WHERE id = ?').get(req.params.id);
    if (!row) return next(notFound('Patient not found.'));
    res.json({ patient: serializePatient(row) });
  }),
);

// POST /api/patients — register a new patient
router.post(
  '/',
  asyncHandler(async (req, res, next) => {
    const parsed = patientSchema.safeParse(req.body);
    if (!parsed.success) return next(badRequest('Invalid patient payload.', parsed.error.flatten()));

    const p = parsed.data;
    const now = new Date().toISOString();
    const id = `pt-${uuid().slice(0, 8)}`;

    db.prepare(
      `INSERT INTO patients
        (id, patient_code, name, age, gender, phone, address, emergency_contact, emergency_contact_phone, blood_group, created_by, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    ).run(
      id,
      p.patient_code,
      p.name,
      p.age,
      p.gender,
      p.phone,
      p.address,
      p.emergency_contact,
      p.emergency_contact_phone ?? null,
      p.blood_group ?? null,
      req.user.id,
      now,
      now,
    );

    const row = db.prepare('SELECT * FROM patients WHERE id = ?').get(id);
    res.status(201).json({ patient: serializePatient(row) });
  }),
);

// PUT /api/patients/:id — update an existing patient
router.put(
  '/:id',
  asyncHandler(async (req, res, next) => {
    const existing = db.prepare('SELECT * FROM patients WHERE id = ?').get(req.params.id);
    if (!existing) return next(notFound('Patient not found.'));

    const parsed = patientSchema.partial().safeParse(req.body);
    if (!parsed.success) return next(badRequest('Invalid patient payload.', parsed.error.flatten()));

    const p = { ...existing, ...parsed.data };
    db.prepare(
      `UPDATE patients SET
        patient_code = ?, name = ?, age = ?, gender = ?, phone = ?, address = ?,
        emergency_contact = ?, emergency_contact_phone = ?, blood_group = ?, updated_at = ?
       WHERE id = ?`,
    ).run(
      p.patient_code,
      p.name,
      p.age,
      p.gender,
      p.phone,
      p.address,
      p.emergency_contact,
      p.emergency_contact_phone ?? null,
      p.blood_group ?? null,
      new Date().toISOString(),
      req.params.id,
    );

    const row = db.prepare('SELECT * FROM patients WHERE id = ?').get(req.params.id);
    res.json({ patient: serializePatient(row) });
  }),
);

// DELETE /api/patients/:id — also cascades to that patient's cases
router.delete(
  '/:id',
  asyncHandler(async (req, res, next) => {
    const existing = db.prepare('SELECT id FROM patients WHERE id = ?').get(req.params.id);
    if (!existing) return next(notFound('Patient not found.'));
    db.prepare('DELETE FROM patients WHERE id = ?').run(req.params.id);
    res.status(204).send();
  }),
);

export default router;
