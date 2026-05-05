const HASH_KEY = 'idun_pw_hash'
const SESSION_KEY = 'idun_authed'

async function sha256(text: string): Promise<string> {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text))
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('')
}

export function isAuthenticated(): boolean {
  return sessionStorage.getItem(SESSION_KEY) === '1'
}

export function hasPassword(): boolean {
  return !!localStorage.getItem(HASH_KEY)
}

export async function setPassword(password: string): Promise<void> {
  localStorage.setItem(HASH_KEY, await sha256(password))
}

export async function checkPassword(password: string): Promise<boolean> {
  const stored = localStorage.getItem(HASH_KEY)
  if (!stored) return false
  const ok = (await sha256(password)) === stored
  if (ok) sessionStorage.setItem(SESSION_KEY, '1')
  return ok
}

export function logout(): void {
  sessionStorage.removeItem(SESSION_KEY)
}

export function changePassword(newHash: string): void {
  localStorage.setItem(HASH_KEY, newHash)
}
