import jwt from 'jsonwebtoken'

export interface JWTPayload {
  id: string
  role: 'admin' | 'telecaller'
  name: string
}

const JWT_SECRET = process.env.JWT_SECRET!

export function signToken(payload: JWTPayload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' })
}

export function verifyToken(token: string): JWTPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JWTPayload
  } catch {
    return null
  }
}
