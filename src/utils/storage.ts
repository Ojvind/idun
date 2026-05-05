import type { MeasurementEntry } from '../types'

const KEY = 'idun_measurements'

export function loadEntries(): MeasurementEntry[] {
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

export function saveEntries(entries: MeasurementEntry[]): void {
  localStorage.setItem(KEY, JSON.stringify(entries))
}

export function exportJSON(entries: MeasurementEntry[]): void {
  const blob = new Blob([JSON.stringify(entries, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `idun-export-${new Date().toISOString().slice(0, 10)}.json`
  a.click()
  URL.revokeObjectURL(url)
}

export function importJSON(file: File): Promise<MeasurementEntry[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string)
        resolve(data)
      } catch {
        reject(new Error('Ogiltig JSON-fil'))
      }
    }
    reader.onerror = () => reject(new Error('Kunde inte läsa filen'))
    reader.readAsText(file)
  })
}
