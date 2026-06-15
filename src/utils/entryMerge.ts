import type { MeasurementEntry } from '../types'

export function mergeSameDate(existing: MeasurementEntry, incoming: MeasurementEntry): MeasurementEntry {
  return {
    ...existing,
    values: { ...existing.values, ...incoming.values },
    note: incoming.note || existing.note,
  }
}

export function findByDate(entries: MeasurementEntry[], date: string): MeasurementEntry | undefined {
  return entries.find(e => e.date === date)
}
