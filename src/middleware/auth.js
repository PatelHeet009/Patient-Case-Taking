import jwt from 'jsonwebtoken';
import { db } from '../db/connection.js';
import { unauthorized, forbidden } from '../utils/errors.js';

const JWT_SECRET = process.env.JWT_SECRET || 'dev-only-insecure-secret';

export function signToken(user) {
  return jwt.sign({ sub: user.id, role: user.role }, JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '8h',
  });
}

// Verifies the Bearer token, loads the current user from the DB, and
// attaches it to req.user. Rejects with 401 if missing/invalid/expired.
export function requireAuth(req, res, next) {
  const header = req.headers.authorization || '';
  const [scheme, token] = header.split(' ');

  if (scheme !== 'Bearer' || !token) {
    return next(unauthorized('Missing or malformed Authorization header.'));
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    const user = db.prepare('SELECT * FROM users WHERE id = ?').get(payload.sub);
    if (!user) return next(unauthorized('User for this token no longer exists.'));
    req.user = user;
    next();
  } catch (err) {
    return next(unauthorized('Invalid or expired token.'));
  }
}

// Usage: requireRole('administrator') or requireRole('administrator', 'doctor')
export function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user) return next(unauthorized());
    if (!roles.includes(req.user.role)) {
      return next(forbidden(`This action requires role: ${roles.join(' or ')}.`));
    }
    next();
  };
}
