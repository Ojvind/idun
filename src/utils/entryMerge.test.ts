import { describe, it, expect } from 'vitest'
import { mergeSameDate, findByDate } from './entryMerge'
import type { MeasurementEntry } from '../types'

function entry(overrides: Partial<MeasurementEntry> & { id: string; date: string }): MeasurementEntry {
  return { note: '', values: {}, ...overrides }
}

describe('mergeSameDate', () => {
  it('keeps the existing id and date', () => {
    const existing = entry({ id: 'a', date: '2026-06-15', values: { weight: 92 } })
    const incoming = entry({ id: 'b', date: '2026-06-15', values: { navel: 90 } })
    const result = mergeSameDate(existing, incoming)
    expect(result.id).toBe('a')
    expect(result.date).toBe('2026-06-15')
  })

  it('merges values — incoming overwrites existing for shared keys', () => {
    const existing = entry({ id: 'a', date: '2026-06-15', values: { weight: 92, navel: 88 } })
    const incoming = entry({ id: 'b', date: '2026-06-15', values: { navel: 90, chest: 100 } })
    const result = mergeSameDate(existing, incoming)
    expect(result.values).toEqual({ weight: 92, navel: 90, chest: 100 })
  })

  it('uses incoming note when non-empty', () => {
    const existing = entry({ id: 'a', date: '2026-06-15', note: 'morgon' })
    const incoming = entry({ id: 'b', date: '2026-06-15', note: 'kväll' })
    expect(mergeSameDate(existing, incoming).note).toBe('kväll')
  })

  it('falls back to existing note when incoming note is empty', () => {
    const existing = entry({ id: 'a', date: '2026-06-15', note: 'morgon' })
    const incoming = entry({ id: 'b', date: '2026-06-15', note: '' })
    expect(mergeSameDate(existing, incoming).note).toBe('morgon')
  })

  it('preserves all existing fields not in incoming values', () => {
    const existing = entry({ id: 'a', date: '2026-06-15', values: { weight: 92, waist: 87, navel: 88 } })
    const incoming = entry({ id: 'b', date: '2026-06-15', values: { weight: 91 } })
    expect(mergeSameDate(existing, incoming).values.waist).toBe(87)
    expect(mergeSameDate(existing, incoming).values.navel).toBe(88)
  })
})

describe('findByDate', () => {
  const entries: MeasurementEntry[] = [
    entry({ id: '1', date: '2026-06-10' }),
    entry({ id: '2', date: '2026-06-15' }),
    entry({ id: '3', date: '2026-06-20' }),
  ]

  it('returns the entry matching the date', () => {
    expect(findByDate(entries, '2026-06-15')?.id).toBe('2')
  })

  it('returns undefined when no entry matches', () => {
    expect(findByDate(entries, '2026-06-01')).toBeUndefined()
  })

  it('returns undefined for an empty list', () => {
    expect(findByDate([], '2026-06-15')).toBeUndefined()
  })
})
