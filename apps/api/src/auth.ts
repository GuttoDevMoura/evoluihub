import { SignJWT, jwtVerify, JWTPayload } from 'jose';
import { createHash, randomBytes } from 'crypto';

const secret = new TextEncoder().encode(process.env.AUTH_JWT_SECRET || 'dev-secret-change-me');
const accessTtlMin = Number(process.env.AUTH_ACCESS_TTL_MIN || 15);
const refreshTtlDays = Number(process.env.AUTH_REFRESH_TTL_DAYS || 14);

export type AccessPayload = {
  userId: string;
  tenantId: number;
  email: string;
};

export async function signAccessToken(payload: AccessPayload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setSubject(payload.userId)
    .setIssuedAt()
    .setExpirationTime(`${accessTtlMin}m`)
    .sign(secret);
}

export async function verifyAccessToken(token: string) {
  return jwtVerify<AccessPayload>(token, secret);
}

export type RefreshPayload = {
  sessionId: number;
  tenantId: number;
  userId: string;
  jti: string;
};

export async function signRefreshToken(payload: RefreshPayload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setSubject(payload.userId)
    .setIssuedAt()
    .setExpirationTime(`${refreshTtlDays}d`)
    .sign(secret);
}

export async function verifyRefreshToken(token: string) {
  return jwtVerify<RefreshPayload & JWTPayload>(token, secret);
}

export function hashToken(token: string) {
  return createHash('sha256').update(token).digest('hex');
}

export function randomToken() {
  return randomBytes(32).toString('base64url');
}
