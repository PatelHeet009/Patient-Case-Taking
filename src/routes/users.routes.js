import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { v4 as uuid } from 'uuid';
import { z } from 'zod';
import { db } from '../db/connection.js';
import { serializeUser } from '../serializers.js';
import { requireAuth, requireRole } from '../middleware/auth.js';
import { asyncHandler, badRequest, notFound, conflict, forbidden } from '../utils/errors.js';

const router = Router();
router.use(requireAuth);

const createSchema = z.object({
  name: z.string().min(1),
  username: z.string().min(3).max(32),
  email: z.string().email(),
  password: z.string().min(6),
  role: z.enum(['doctor', 'staff', 'administrator']),
  department: z.string().optional(),
});

const updateSchema = z.object({
  name: z.string().min(1).optional(),
  email: z.string().email().optional(),
  role: z.enum(['doctor', 'staff', 'administrator']).optional(),
  department: z.string().optional(),
  password: z.string().min(6).optional(),
});

// GET /api/users — administrators only
router.get(
  '/',
  requireRole('administrator'),
  asyncHandler(async (req, res) => {
    const rows = db.prepare('SELECT * FROM users ORDER BY created_at ASC').all();
    res.json({ users: rows.map(serializeUser) });
  }),
);

// POST /api/users — administrators only (create staff/doctor/admin accounts)
router.post(
  '/',
  requireRole('administrator'),
  asyncHandler(async (req, res, next) => {
    const parsed = createSchema.safeParse(req.body);
    if (!parsed.success) return next(badRequest('Invalid user payload.', parsed.error.flatten()));

    const { name, username, email, password, role, department } = parsed.data;
    const trimmedUsername = username.trim().toLowerCase();
    const trimmedEmail = email.trim().toLowerCase();

    const existing = db
      .prepare('SELECT id FROM users WHERE LOWER(username) = ? OR LOWER(email) = ?')
      .get(trimmedUsername, trimmedEmail);
    if (existing) return next(conflict('Username or email is already registered.'));

    const now = new Date().toISOString();
    const id = `usr-${uuid().slice(0, 8)}`;
    db.prepare(
      `INSERT INTO users (id, username, name, email, password_hash, role, department, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    ).run(id, username.trim(), name.trim(), email.trim(), bcrypt.hashSync(password, 10), role, department ?? null, now, now);

    const user = db.prepare('SELECT * FROM users WHERE id = ?').get(id);
    res.status(201).json({ user: serializeUser(user) });
  }),
);

// PUT /api/users/:id — administrators can edit anyone; users can edit themselves
// (but cannot change their own role, to prevent self-escalation).
router.put(
  '/:id',
  asyncHandler(async (req, res, next) => {
    const target = db.prepare('SELECT * FROM users WHERE id = ?').get(req.params.id);
    if (!target) return next(notFound('User not found.'));

    const isSelf = req.user.id === target.id;
    const isAdmin = req.user.role === 'administrator';
    if (!isSelf && !isAdmin) return next(forbidden('You can only edit your own account.'));

    const parsed = updateSchema.safeParse(req.body);
    if (!parsed.success) return next(badRequest('Invalid update payload.', parsed.error.flatten()));

    const updates = parsed.data;
    if (updates.role && !isAdmin) return next(forbidden('Only administrators can change roles.'));

    const next_ = {
      name: updates.name ?? target.name,
      email: updates.email ?? target.email,
      role: updates.role ?? target.role,
      department: updates.department ?? target.department,
      password_hash: updates.password ? bcrypt.hashSync(updates.password, 10) : target.password_hash,
    };

    db.prepare(
      `UPDATE users SET name = ?, email = ?, role = ?, department = ?, password_hash = ?, updated_at = ?
       WHERE id = ?`,
    ).run(next_.name, next_.email, next_.role, next_.department, next_.password_hash, new Date().toISOString(), target.id);

    const updated = db.prepare('SELECT * FROM users WHERE id = ?').get(target.id);
    res.json({ user: serializeUser(updated) });
  }),
);

// DELETE /api/users/:id — administrators only, cannot delete self
router.delete(
  '/:id',
  requireRole('administrator'),
  asyncHandler(async (req, res, next) => {
    if (req.params.id === req.user.id) return next(badRequest('You cannot delete your own account.'));
    const target = db.prepare('SELECT id FROM users WHERE id = ?').get(req.params.id);
    if (!target) return next(notFound('User not found.'));
    db.prepare('DELETE FROM users WHERE id = ?').run(req.params.id);
    res.status(204).send();
  }),
);

export default router;
