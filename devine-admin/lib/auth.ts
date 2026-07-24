import { cookies } from 'next/headers'
import { verifyToken } from './jwt'
import type { JWTPayload } from './jwt'

export { signToken, verifyToken } from './jwt'
export type { JWTPayload } from './jwt'

export const COOKIE_NAME = 'devine_token'

export async function getSession(): Promise<JWTPayload | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get(COOKIE_NAME)?.value
  if (!token) return null
  return verifyToken(token)
}
