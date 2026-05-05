import { useNavigate } from 'react-router-dom'
import type { MeasurementEntry } from '../../types'
import { FIELDS } from '../../utils/fields'

interface Props {
  entries: MeasurementEntry[]
}

export default function Dashboard({ entries }: Props) {
  const navigate = useNavigate()
  const latest = entries[entries.length - 1]
  const prev = entries[entries.length - 2]

  if (entries.length === 0) {
    return (
      <div className="text-center py-24">
        <p className="text-stone-500 mb-4">Inga mätningar ännu.</p>
        <button
          onClick={() => navigate('/ny')}
          className="bg-teal-600 hover:bg-teal-500 text-white px-5 py-2.5 rounded-lg transition-colors"
        >
          Lägg till första mätning
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Senaste mätning</h2>
          <p className="text-stone-400 text-sm mt-0.5">{formatDate(latest.date)}</p>
        </div>
        <button
          onClick={() => navigate(`/redigera/${latest.id}`)}
          className="text-sm text-stone-400 hover:text-stone-100 border border-stone-700 hover:border-stone-500 px-3 py-1.5 rounded-lg transition-colors"
        >
          Redigera
        </button>
      </div>

      {latest.note && (
        <p className="text-stone-400 text-sm italic border-l-2 border-stone-700 pl-3">
          {latest.note}
        </p>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {FIELDS.map(field => {
          const val = latest.values[field.key]
          const prevVal = prev?.values[field.key]
          if (val === undefined) return null
          const diff = prevVal !== undefined ? val - prevVal : null

          return (
            <div key={field.key} className="bg-stone-900 rounded-xl p-4 border border-stone-800">
              <p className="text-xs text-stone-500 mb-1">{field.label}</p>
              <p className="text-2xl font-semibold text-stone-100">{val.toFixed(1)}</p>
              <p className="text-xs text-stone-600">{field.unit}</p>
              {diff !== null && (
                <p className={`text-xs mt-1 font-medium ${diff < 0 ? 'text-teal-400' : diff > 0 ? 'text-red-400' : 'text-stone-500'}`}>
                  {diff > 0 ? '+' : ''}{diff.toFixed(1)} {field.unit}
                </p>
              )}
            </div>
          )
        })}
      </div>

      <div className="pt-2">
        <button
          onClick={() => navigate('/historik')}
          className="text-sm text-teal-400 hover:text-teal-300 transition-colors"
        >
          Visa all historik →
        </button>
      </div>
    </div>
  )
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('sv-SE', {
    year: 'numeric', month: 'long', day: 'numeric',
  })
}
