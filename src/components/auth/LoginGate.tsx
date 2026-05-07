import { useState } from 'react'
import { supabase } from '../../utils/supabase'

type Mode = 'login' | 'signup'

export default function LoginGate() {
  const [mode, setMode] = useState<Mode>('login')
  const [email, setEmail] = useState('')
  const [pw, setPw] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    if (mode === 'signup') {
      if (pw.length < 6) { setError('Minst 6 tecken.'); setLoading(false); return }
      if (pw !== confirm) { setError('Lösenorden matchar inte.'); setLoading(false); return }
      const { error } = await supabase.auth.signUp({ email, password: pw })
      if (error) { setError(error.message); setLoading(false) }
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password: pw })
      if (error) { setError('Fel e-post eller lösenord.'); setLoading(false) }
    }
  }

  return (
    <div className="min-h-screen bg-stone-950 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <h1 className="text-3xl font-bold text-stone-100 mb-1">Idun</h1>
        <p className="text-stone-400 mb-8 text-sm">Kroppsmått</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs text-stone-400 mb-1">E-post</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              autoFocus
              required
              className="w-full bg-stone-900 border border-stone-700 rounded-lg px-3 py-2.5 text-stone-100 focus:outline-none focus:border-teal-500 transition-colors"
            />
          </div>
          <div>
            <label className="block text-xs text-stone-400 mb-1">Lösenord</label>
            <input
              type="password"
              value={pw}
              onChange={e => setPw(e.target.value)}
              required
              className="w-full bg-stone-900 border border-stone-700 rounded-lg px-3 py-2.5 text-stone-100 focus:outline-none focus:border-teal-500 transition-colors"
            />
          </div>

          {mode === 'signup' && (
            <div>
              <label className="block text-xs text-stone-400 mb-1">Bekräfta lösenord</label>
              <input
                type="password"
                value={confirm}
                onChange={e => setConfirm(e.target.value)}
                required
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
            {loading ? '...' : mode === 'login' ? 'Logga in' : 'Skapa konto'}
          </button>
        </form>

        <p className="text-stone-500 text-sm mt-4 text-center">
          {mode === 'login' ? (
            <>Inget konto?{' '}
              <button onClick={() => { setMode('signup'); setError('') }} className="text-teal-400 hover:text-teal-300">
                Skapa ett
              </button>
            </>
          ) : (
            <>Har du redan ett konto?{' '}
              <button onClick={() => { setMode('login'); setError('') }} className="text-teal-400 hover:text-teal-300">
                Logga in
              </button>
            </>
          )}
        </p>
      </div>
    </div>
  )
}
