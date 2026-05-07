import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate, useParams } from 'react-router-dom'
import type { Session } from '@supabase/supabase-js'
import { supabase } from './utils/supabase'
import { useMeasurements } from './hooks/useMeasurements'
import LoginGate from './components/auth/LoginGate'
import Layout from './components/layout/Layout'
import Dashboard from './components/dashboard/Dashboard'
import HistoryView from './components/history/HistoryView'
import MeasurementForm from './components/measurements/MeasurementForm'
import type { MeasurementEntry } from './types'

export default function App() {
  const [session, setSession] = useState<Session | null>(null)
  const [authLoading, setAuthLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setAuthLoading(false)
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })
    return () => subscription.unsubscribe()
  }, [])

  if (authLoading) return <div className="min-h-screen bg-stone-950" />
  if (!session) return <LoginGate />

  return <AuthenticatedApp userId={session.user.id} />
}

function AuthenticatedApp({ userId }: { userId: string }) {
  const { entries, loading, addEntry, updateEntry, deleteEntry, mergeEntries } = useMeasurements(userId)

  if (loading) return <div className="min-h-screen bg-stone-950" />

  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard entries={entries} />} />
          <Route
            path="/historik"
            element={<HistoryView entries={entries} onDelete={deleteEntry} onImport={mergeEntries} />}
          />
          <Route path="/ny" element={<MeasurementForm onSave={addEntry} />} />
          <Route
            path="/redigera/:id"
            element={<EditRoute entries={entries} onSave={updateEntry} />}
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  )
}

function EditRoute({
  entries,
  onSave,
}: {
  entries: MeasurementEntry[]
  onSave: (entry: MeasurementEntry) => void
}) {
  const { id } = useParams()
  const entry = entries.find(e => e.id === id)
  if (!entry) return <Navigate to="/" replace />
  return <MeasurementForm initial={entry} onSave={onSave} />
}
