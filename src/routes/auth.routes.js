import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { v4 as uuid } from 'uuid';
import { z } from 'zod';
import { db } from '../db/connection.js';
import { serializeUser } from '../serializers.js';
import { signToken, requireAuth } from '../middleware/auth.js';
import { asyncHandler, badRequest, unauthorized, conflict } from '../utils/errors.js';

const router = Router();

const loginSchema = z.object({
  identifier: z.string().min(1, 'Username or email is required.'),
  password: z.string().min(1, 'Password is required.'),
});

const registerSchema = z.object({
  name: z.string().min(1),
  username: z.string().min(3).max(32).regex(/^[a-zA-Z0-9._-]+$/, 'Username may only contain letters, numbers, dots, dashes and underscores.'),
  email: z.string().email(),
  password: z.string().min(6, 'Password must be at least 6 characters.'),
  role: z.enum(['doctor', 'staff', 'administrator']),
  department: z.string().optional(),
});

// POST /api/auth/login
router.post(
  '/login',
  asyncHandler(async (req, res, next) => {
    const parsed = loginSchema.safeParse(req.body);
    if (!parsed.success) return next(badRequest('Invalid login payload.', parsed.error.flatten()));

    const { identifier, password } = parsed.data;
    const ident = identifier.trim().toLowerCase();

    const user = db
      .prepare('SELECT * FROM users WHERE LOWER(username) = ? OR LOWER(email) = ?')
      .get(ident, ident);

    if (!user) return next(unauthorized(`No user found with username or email "${identifier}".`));

    const passwordOk = bcrypt.compareSync(password, user.password_hash);
    if (!passwordOk) return next(unauthorized('Invalid password. Please check your credentials.'));

    const token = signToken(user);
    res.json({ token, user: serializeUser(user) });
  }),
);

// POST /api/auth/register
router.post(
  '/register',
  asyncHandler(async (req, res, next) => {
    const parsed = registerSchema.safeParse(req.body);
    if (!parsed.success) return next(badRequest('Invalid registration payload.', parsed.error.flatten()));

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
    const token = signToken(user);
    res.status(201).json({ token, user: serializeUser(user) });
  }),
);

// GET /api/auth/me
router.get('/me', requireAuth, (req, res) => {
  res.json({ user: serializeUser(req.user) });
});

// POST /api/auth/logout — JWTs are stateless, so this is a no-op the
// client uses to clear its stored token. Kept for a consistent API surface.
router.post('/logout', requireAuth, (req, res) => {
  res.json({ success: true });
});

export default router;
