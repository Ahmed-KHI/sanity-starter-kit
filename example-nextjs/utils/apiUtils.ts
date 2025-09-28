import type { NextApiRequest } from 'next';

// Simple in-memory rate limiter (per IP + route) - not production ready
const rateBuckets = new Map<string, { count: number; reset: number }>();
const WINDOW_MS = 60_000; // 1 minute
const MAX_REQ = 30;

export function rateLimit(key: string) {
    const now = Date.now();
    const bucket = rateBuckets.get(key);
    if (!bucket || bucket.reset < now) {
        rateBuckets.set(key, { count: 1, reset: now + WINDOW_MS });
        return { allowed: true, remaining: MAX_REQ - 1 };
    }
    if (bucket.count >= MAX_REQ) return { allowed: false, remaining: 0, retryAfter: bucket.reset - now };
    bucket.count += 1;
    return { allowed: true, remaining: MAX_REQ - bucket.count };
}

// Naive CSRF token check (expects X-CSRF-Token header to match cookie value)
export function verifyCsrf(req: NextApiRequest) {
    const tokenHeader = req.headers['x-csrf-token'];
    const cookie = req.headers.cookie || '';
    const match = /csrfToken=([^;]+)/.exec(cookie);
    if (!match) return false;
    return tokenHeader === match[1];
}

// Very simplified auth extraction. In real world, use JWT/session provider.
export interface AuthContext { userId: string; role: 'customer' | 'admin' | 'seller'; }

export function getAuth(req: NextApiRequest): AuthContext | null {
    // Expect header: Authorization: Bearer userId:role
    const auth = req.headers.authorization;
    if (!auth) return null;
    const parts = auth.replace(/^Bearer\s+/i, '').split(':');
    if (parts.length !== 2) return null;
    const [userId, role] = parts as [string, AuthContext['role']];
    if (!userId || !role) return null;
    return { userId, role };
}

export function requireRole(ctx: AuthContext | null, roles: AuthContext['role'][]): asserts ctx is AuthContext {
    if (!ctx || !roles.includes(ctx.role)) {
        throw Object.assign(new Error('Forbidden'), { status: 403 });
    }
}

export function requireUserMatch(ctx: AuthContext | null, userId: string) {
    if (!ctx || (ctx.userId !== userId && ctx.role !== 'admin')) {
        throw Object.assign(new Error('Forbidden'), { status: 403 });
    }
}
