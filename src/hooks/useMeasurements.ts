import { useState, useEffect, useCallback } from 'react'
import type { MeasurementEntry } from '../types'
import { supabase } from '../utils/supabase'

function fromRow(row: Record<string, unknown>): MeasurementEntry {
  return {
    id: row.id as string,
    date: row.date as string,
    note: (row.note as string) ?? '',
    values: (row.values as MeasurementEntry['values']) ?? {},
  }
}

export function useMeasurements(userId: string) {
  const [entries, setEntries] = useState<MeasurementEntry[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    supabase
      .from('measurements')
      .select('*')
      .order('date', { ascending: true })
      .then(({ data }) => {
        setEntries(data?.map(fromRow) ?? [])
        setLoading(false)
      })
  }, [userId])

  const addEntry = useCallback(async (entry: MeasurementEntry) => {
    const { error } = await supabase.from('measurements').insert({
      id: entry.id, user_id: userId, date: entry.date, note: entry.note, values: entry.values,
    })
    if (!error) setEntries(prev => [...prev, entry].sort((a, b) => a.date.localeCompare(b.date)))
  }, [userId])

  const updateEntry = useCallback(async (entry: MeasurementEntry) => {
    const { error } = await supabase.from('measurements')
      .update({ date: entry.date, note: entry.note, values: entry.values })
      .eq('id', entry.id)
    if (!error) setEntries(prev => prev.map(e => e.id === entry.id ? entry : e))
  }, [])

  const deleteEntry = useCallback(async (id: string) => {
    const { error } = await supabase.from('measurements').delete().eq('id', id)
    if (!error) setEntries(prev => prev.filter(e => e.id !== id))
  }, [])

  const mergeEntries = useCallback(async (incoming: MeasurementEntry[]) => {
    const rows = incoming.map(e => ({
      id: e.id, user_id: userId, date: e.date, note: e.note, values: e.values,
    }))
    const { error } = await supabase.from('measurements').upsert(rows)
    if (!error) {
      setEntries(prev => {
        const byId = new Map(prev.map(e => [e.id, e]))
        incoming.forEach(e => byId.set(e.id, e))
        return [...byId.values()].sort((a, b) => a.date.localeCompare(b.date))
      })
    }
  }, [userId])

  return { entries, loading, addEntry, updateEntry, deleteEntry, mergeEntries }
}
