import { useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate, useParams } from 'react-router-dom'
import { isAuthenticated } from './utils/auth'
import { useMeasurements } from './hooks/useMeasurements'
import LoginGate from './components/auth/LoginGate'
import Layout from './components/layout/Layout'
import Dashboard from './components/dashboard/Dashboard'
import HistoryView from './components/history/HistoryView'
import MeasurementForm from './components/measurements/MeasurementForm'
import type { MeasurementEntry } from './types'

export default function App() {
  const [authed, setAuthed] = useState(isAuthenticated)
  const { entries, addEntry, updateEntry, deleteEntry, mergeEntries } = useMeasurements()

  if (!authed) {
    return <LoginGate onAuth={() => setAuthed(true)} />
  }

  return (
    <BrowserRouter>
      <Layout onLogout={() => setAuthed(false)}>
        <Routes>
          <Route path="/" element={<Dashboard entries={entries} />} />
          <Route
            path="/historik"
            element={
              <HistoryView
                entries={entries}
                onDelete={deleteEntry}
                onImport={mergeEntries}
              />
            }
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
