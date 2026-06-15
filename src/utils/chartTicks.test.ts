import { describe, it, expect } from 'vitest'
import { quarterlyTicks, monthlyTicks } from './chartTicks'

// Creates local midnight to match how tick functions interpret timestamps
function ts(year: number, month: number, day: number) {
  return new Date(year, month - 1, day).getTime()
}

function localDate(timestamp: number) {
  const d = new Date(timestamp)
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

function localYearMonth(timestamp: number) {
  const d = new Date(timestamp)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
}

describe('quarterlyTicks', () => {
  it('starts on the nearest quarter boundary at or before minTs', () => {
    const ticks = quarterlyTicks(ts(2025, 2, 15), ts(2025, 9, 1))
    expect(localDate(ticks[0])).toBe('2025-01-01')
  })

  it('generates ticks every 3 months', () => {
    const ticks = quarterlyTicks(ts(2025, 1, 1), ts(2025, 12, 31))
    const months = ticks.map(t => new Date(t).getMonth())
    expect(months).toEqual([0, 3, 6, 9])
  })

  it('includes the last quarter boundary within range', () => {
    const ticks = quarterlyTicks(ts(2025, 1, 1), ts(2026, 1, 1))
    const last = new Date(ticks[ticks.length - 1])
    expect(last.getFullYear()).toBe(2026)
    expect(last.getMonth()).toBe(0)
  })

  it('returns a single tick when range is within one quarter', () => {
    const ticks = quarterlyTicks(ts(2025, 4, 1), ts(2025, 5, 31))
    expect(ticks.length).toBe(1)
  })
})

describe('monthlyTicks', () => {
  it('starts on the first of the month containing minTs', () => {
    const ticks = monthlyTicks(ts(2025, 6, 15), ts(2025, 8, 31))
    expect(localDate(ticks[0])).toBe('2025-06-01')
  })

  it('generates one tick per month', () => {
    const ticks = monthlyTicks(ts(2025, 1, 1), ts(2025, 6, 30))
    expect(ticks.length).toBe(6)
  })

  it('each tick falls on the first of its month', () => {
    const ticks = monthlyTicks(ts(2025, 3, 10), ts(2025, 5, 20))
    ticks.forEach(t => expect(new Date(t).getDate()).toBe(1))
  })

  it('spans year boundary correctly', () => {
    const ticks = monthlyTicks(ts(2025, 11, 1), ts(2026, 2, 28))
    const labels = ticks.map(t => localYearMonth(t))
    expect(labels).toEqual(['2025-11', '2025-12', '2026-01', '2026-02'])
  })
})
