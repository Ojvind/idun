import { useState } from 'react'
import { hasPassword, checkPassword, setPassword } from '../../utils/auth'

interface Props {
  onAuth: () => void
}

export default function LoginGate({ onAuth }: Props) {
  const firstTime = !hasPassword()
  const [pw, setPw] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    if (firstTime) {
      if (pw.length < 6) { setError('Minst 6 tecken.'); setLoading(false); return }
      if (pw !== confirm) { setError('Lösenorden matchar inte.'); setLoading(false); return }
      await setPassword(pw)
      await checkPassword(pw)
      onAuth()
    } else {
      const ok = await checkPassword(pw)
      if (ok) {
        onAuth()
      } else {
        setError('Fel lösenord.')
        setLoading(false)
      }
    }
  }

  return (
    <div className="min-h-screen bg-stone-950 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <h1 className="text-3xl font-bold text-stone-100 mb-1">Idun</h1>
        <p className="text-stone-400 mb-8 text-sm">Kroppsmått</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs text-stone-400 mb-1">
              {firstTime ? 'Välj lösenord' : 'Lösenord'}
            </label>
            <input
              type="password"
              value={pw}
              onChange={e => setPw(e.target.value)}
              autoFocus
              className="w-full bg-stone-900 border border-stone-700 rounded-lg px-3 py-2.5 text-stone-100 focus:outline-none focus:border-teal-500 transition-colors"
            />
          </div>

          {firstTime && (
            <div>
              <label className="block text-xs text-stone-400 mb-1">Bekräfta lösenord</label>
              <input
                type="password"
                value={confirm}
                onChange={e => setConfirm(e.target.value)}
                className="w-full bg-stone-900 border border-stone-700 rounded-lg px-3 py-2.5 text-stone-100 focus:outline-none focus:border-teal-500 transition-colors"
              />
            </div>
          )}

          {error && <p className="text-red-400 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-teal-600 hover:bg-teal-500 disabled:opacity-50 text-white font-medium py-2.5 rounded-lg transition-colors"
          >
            {firstTime ? 'Skapa lösenord' : 'Logga in'}
          </button>
        </form>
      </div>
    </div>
  )
}
