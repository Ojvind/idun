import { useState, useCallback } from 'react'
import type { MeasurementEntry } from '../types'
import { loadEntries, saveEntries } from '../utils/storage'

export function useMeasurements() {
  const [entries, setEntries] = useState<MeasurementEntry[]>(() =>
    loadEntries().sort((a, b) => a.date.localeCompare(b.date))
  )

  const addEntry = useCallback((entry: MeasurementEntry) => {
    setEntries(prev => {
      const next = [...prev, entry].sort((a, b) => a.date.localeCompare(b.date))
      saveEntries(next)
      return next
    })
  }, [])

  const updateEntry = useCallback((entry: MeasurementEntry) => {
    setEntries(prev => {
      const next = prev.map(e => e.id === entry.id ? entry : e)
      saveEntries(next)
      return next
    })
  }, [])

  const deleteEntry = useCallback((id: string) => {
    setEntries(prev => {
      const next = prev.filter(e => e.id !== id)
      saveEntries(next)
      return next
    })
  }, [])

  const replaceAll = useCallback((incoming: MeasurementEntry[]) => {
    const sorted = [...incoming].sort((a, b) => a.date.localeCompare(b.date))
    saveEntries(sorted)
    setEntries(sorted)
  }, [])

  const mergeEntries = useCallback((incoming: MeasurementEntry[]) => {
    setEntries(prev => {
      const byId = new Map(prev.map(e => [e.id, e]))
      incoming.forEach(e => byId.set(e.id, e))
      const merged = [...byId.values()].sort((a, b) => a.date.localeCompare(b.date))
      saveEntries(merged)
      return merged
    })
  }, [])

  return { entries, addEntry, updateEntry, deleteEntry, replaceAll, mergeEntries }
}
