import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import type { MeasurementEntry } from '../../types'
import { FIELDS } from '../../utils/fields'

interface Props {
  initial?: MeasurementEntry
  onSave: (entry: MeasurementEntry) => void
}

export default function MeasurementForm({ initial, onSave }: Props) {
  const navigate = useNavigate()
  const isEdit = !!initial

  const [date, setDate] = useState(initial?.date ?? today())
  const [note, setNote] = useState(initial?.note ?? '')
  const [values, setValues] = useState<Record<string, string>>(() => {
    const init: Record<string, string> = {}
    FIELDS.forEach(f => {
      const v = initial?.values[f.key]
      init[f.key] = v !== undefined ? String(v) : ''
    })
    return init
  })

  function handleSave(e: React.FormEvent) {
    e.preventDefault()
    const parsed: MeasurementEntry['values'] = {}
    FIELDS.forEach(f => {
      const n = parseFloat(values[f.key])
      if (!isNaN(n)) parsed[f.key] = n
    })
    onSave({
      id: initial?.id ?? crypto.randomUUID(),
      date,
      note,
      values: parsed,
    })
    navigate('/')
  }

  return (
    <div className="max-w-lg">
      <h2 className="text-xl font-semibold mb-6">
        {isEdit ? 'Redigera mätning' : 'Ny mätning'}
      </h2>

      <form onSubmit={handleSave} className="space-y-5">
        <div>
          <label className="block text-xs text-stone-400 mb-1">Datum</label>
          <input
            type="date"
            value={date}
            onChange={e => setDate(e.target.value)}
            required
            className="bg-stone-900 border border-stone-700 rounded-lg px-3 py-2.5 text-stone-100 focus:outline-none focus:border-teal-500 transition-colors [color-scheme:dark]"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          {FIELDS.map(field => (
            <div key={field.key}>
              <label className="block text-xs text-stone-400 mb-1">
                {field.label}
                <span className="text-stone-600 ml-1">— {field.instruction}</span>
              </label>
              <div className="relative">
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="300"
                  value={values[field.key]}
                  onChange={e => setValues(v => ({ ...v, [field.key]: e.target.value }))}
                  placeholder="–"
                  className="w-full bg-stone-900 border border-stone-700 rounded-lg px-3 py-2.5 text-stone-100 focus:outline-none focus:border-teal-500 transition-colors pr-10"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-stone-600">{field.unit}</span>
              </div>
            </div>
          ))}
        </div>

        <div>
          <label className="block text-xs text-stone-400 mb-1">Anteckning</label>
          <textarea
            value={note}
            onChange={e => setNote(e.target.value)}
            rows={2}
            placeholder="Valfri kommentar..."
            className="w-full bg-stone-900 border border-stone-700 rounded-lg px-3 py-2.5 text-stone-100 focus:outline-none focus:border-teal-500 transition-colors resize-none"
          />
        </div>

        <div className="flex gap-3 pt-1">
          <button
            type="submit"
            className="bg-teal-600 hover:bg-teal-500 text-white font-medium px-5 py-2.5 rounded-lg transition-colors"
          >
            {isEdit ? 'Spara ändringar' : 'Spara mätning'}
          </button>
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="text-stone-400 hover:text-stone-100 px-4 py-2.5 rounded-lg transition-colors"
          >
            Avbryt
          </button>
        </div>
      </form>
    </div>
  )
}

function today() {
  return new Date().toISOString().slice(0, 10)
}
