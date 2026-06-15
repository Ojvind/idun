import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, ReferenceLine, Dot,
} from 'recharts'
import type { MeasurementEntry, MeasurementKey } from '../../types'
import { FIELDS } from '../../utils/fields'
import { exportJSON, importJSON } from '../../utils/storage'
import { quarterlyTicks, monthlyTicks } from '../../utils/chartTicks'

const MONTHS_SV = ['jan','feb','mar','apr','maj','jun','jul','aug','sep','okt','nov','dec']
const DAY_MS = 86_400_000

type ChartDatum = {
  date: string
  ts: number
  value: number | undefined
}

type RangeKey = '6m' | '1y' | '2y' | 'all'
const RANGES: { key: RangeKey; label: string; months: number | null }[] = [
  { key: '6m',  label: '6 mån', months: 6 },
  { key: '1y',  label: '1 år',  months: 12 },
  { key: '2y',  label: '2 år',  months: 24 },
  { key: 'all', label: 'Allt',  months: null },
]


function renderTimeTick(showAllMonths: boolean) {
  return function Tick(props: any) {
    const { x, y, payload } = props
    const date = new Date(payload.value)
    const month = date.getMonth()
    const isJan = month === 0

    if (showAllMonths) {
      return (
        <g transform={`translate(${x},${y + 6})`}>
          {isJan && (
            <text x={0} y={0} textAnchor="middle" fill="#c8c5c2" fontSize={10} fontWeight="700">
              {date.getFullYear()}
            </text>
          )}
          <text x={0} y={isJan ? 15 : 10} textAnchor="middle" fill={isJan ? '#78716c' : '#4a4540'} fontSize={10}>
            {MONTHS_SV[month]}
          </text>
        </g>
      )
    }

    return (
      <g transform={`translate(${x},${y + 6})`}>
        <text x={0} y={0} textAnchor="middle" fill="#c8c5c2" fontSize={11} fontWeight={isJan ? '700' : '400'} opacity={isJan ? 1 : 0}>
          {isJan ? date.getFullYear() : ''}
        </text>
        <text x={0} y={15} textAnchor="middle" fill={isJan ? '#78716c' : '#4a4540'} fontSize={10}>
          {MONTHS_SV[month]}
        </text>
      </g>
    )
  }
}

interface Props {
  entries: MeasurementEntry[]
  onDelete: (id: string) => void
  onImport: (entries: MeasurementEntry[]) => void
}

export default function HistoryView({ entries, onDelete, onImport }: Props) {
  const navigate = useNavigate()
  const [activeKey, setActiveKey] = useState<MeasurementKey>('navel')
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null)
  const [range, setRange] = useState<RangeKey>('all')

  const allChartData: ChartDatum[] = entries
    .filter(e => e.values[activeKey] !== undefined)
    .map(e => ({
      date: e.date,
      ts: new Date(e.date).getTime(),
      value: e.values[activeKey],
    }))

  const rangeMonths = RANGES.find(r => r.key === range)?.months ?? null
  const rangeStartTs = rangeMonths ? Date.now() - rangeMonths * 30.44 * DAY_MS : null
  const chartData = rangeStartTs ? allChartData.filter(d => d.ts >= rangeStartTs) : allChartData

  const useMonthlyTicks = range === '6m' || range === '1y'
  const domainStart = rangeStartTs ? rangeStartTs - 10 * DAY_MS : chartData.length > 0 ? chartData[0].ts - 45 * DAY_MS : 'auto'
  const domainEnd = chartData.length > 0 ? chartData[chartData.length - 1].ts + (rangeStartTs ? 10 * DAY_MS : 45 * DAY_MS) : 'auto'

  const tickMin = typeof domainStart === 'number' ? domainStart : chartData[0]?.ts ?? 0
  const tickMax = typeof domainEnd === 'number' ? domainEnd : chartData[chartData.length - 1]?.ts ?? 0
  const ticks = chartData.length > 0
    ? (useMonthlyTicks ? monthlyTicks(tickMin, tickMax) : quarterlyTicks(tickMin, tickMax))
    : []

  const domain: [number | string, number | string] = [domainStart, domainEnd]

  async function handleImport(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    try {
      const incoming = await importJSON(file)
      const existingIds = new Set(entries.map(e => e.id))
      const newCount = incoming.filter(e => !existingIds.has(e.id)).length
      onImport(incoming)
      alert(newCount > 0
        ? `${newCount} ny${newCount === 1 ? '' : 'a'} mätning${newCount === 1 ? '' : 'ar'} importerades.`
        : 'Inga nya mätningar — allt fanns redan.'
      )
    } catch {
      alert('Kunde inte importera filen.')
    }
    e.target.value = ''
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h2 className="text-xl font-semibold">Historik</h2>
        <div className="flex gap-2">
          <label className="text-sm text-stone-400 hover:text-stone-100 border border-stone-700 hover:border-stone-500 px-3 py-1.5 rounded-lg transition-colors cursor-pointer">
            Importera
            <input type="file" accept=".json" className="hidden" onChange={handleImport} />
          </label>
          <button
            onClick={() => exportJSON(entries)}
            className="text-sm text-stone-400 hover:text-stone-100 border border-stone-700 hover:border-stone-500 px-3 py-1.5 rounded-lg transition-colors"
          >
            Exportera
          </button>
        </div>
      </div>

      <div>
        <div className="flex flex-wrap gap-2 mb-3">
          {FIELDS.map(f => (
            <button
              key={f.key}
              onClick={() => setActiveKey(f.key)}
              className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                activeKey === f.key
                  ? 'bg-teal-600 border-teal-600 text-white'
                  : 'border-stone-700 text-stone-400 hover:border-stone-500 hover:text-stone-200'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
        <div className="flex gap-1.5 mb-4">
          {RANGES.map(r => (
            <button
              key={r.key}
              onClick={() => setRange(r.key)}
              className={`text-xs px-2.5 py-1 rounded-md border transition-colors ${
                range === r.key
                  ? 'bg-stone-700 border-stone-600 text-stone-100'
                  : 'border-stone-800 text-stone-500 hover:border-stone-700 hover:text-stone-300'
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>

        {chartData.length > 0 ? (
          <div className="bg-stone-900 rounded-xl p-4 border border-stone-800">
            <p className="text-sm text-stone-400 mb-4">
              {FIELDS.find(f => f.key === activeKey)?.label} ({FIELDS.find(f => f.key === activeKey)?.unit})
            </p>
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={chartData} margin={{ top: 8, right: 16, bottom: 0, left: -16 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#292524" />
                <XAxis
                  dataKey="ts"
                  type="number"
                  domain={domain}
                  ticks={ticks}
                  tick={renderTimeTick(useMonthlyTicks)}
                  tickLine={false}
                  interval={0}
                  height={50}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: '#78716c' }}
                  domain={['auto', 'auto']}
                />
                <Tooltip
                  contentStyle={{ background: '#1c1917', border: '1px solid #44403c', borderRadius: 8 }}
                  labelStyle={{ color: '#a8a29e' }}
                  itemStyle={{ color: '#2dd4bf' }}
                  labelFormatter={(ts) => {
                    const d = new Date(ts as number)
                    return `${d.getFullYear()} ${MONTHS_SV[d.getMonth()]}`
                  }}
                  formatter={(v) => {
                    const unit = FIELDS.find(f => f.key === activeKey)?.unit ?? 'cm'
                    return [typeof v === 'number' ? `${v.toFixed(1)} ${unit}` : v]
                  }}
                />
                {ticks.map(t => {
                  const isJan = new Date(t).getMonth() === 0
                  return (
                    <ReferenceLine
                      key={t}
                      x={t}
                      stroke={isJan ? '#4a4540' : '#252220'}
                      strokeWidth={isJan ? 1.5 : 1}
                      strokeDasharray={isJan || useMonthlyTicks ? undefined : '3 4'}
                    />
                  )
                })}
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#0d9488"
                  strokeWidth={2}
                  dot={<Dot r={4} fill="#0d9488" stroke="#0d9488" />}
                  activeDot={{ r: 6, fill: '#2dd4bf', stroke: '#2dd4bf' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <p className="text-stone-500 text-sm">Inga data för detta mått.</p>
        )}
      </div>

      <div>
        <h3 className="text-sm font-medium text-stone-400 mb-3">Alla mätningar</h3>
        <div className="space-y-2">
          {[...entries].reverse().map(entry => (
            <div
              key={entry.id}
              className="bg-stone-900 border border-stone-800 rounded-xl p-4"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-stone-200 text-sm">{formatDate(entry.date)}</p>
                  {entry.note && (
                    <p className="text-stone-500 text-xs mt-0.5 italic">{entry.note}</p>
                  )}
                  <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2">
                    {FIELDS.map(f => {
                      const v = entry.values[f.key]
                      if (v === undefined) return null
                      return (
                        <span key={f.key} className="text-xs text-stone-400">
                          <span className="text-stone-500">{f.label}:</span> {v.toFixed(1)}
                        </span>
                      )
                    })}
                  </div>
                </div>
                <div className="flex gap-2 shrink-0">
                  <button
                    onClick={() => navigate(`/redigera/${entry.id}`)}
                    className="text-xs text-stone-500 hover:text-stone-200 transition-colors"
                  >
                    Redigera
                  </button>
                  {confirmDelete === entry.id ? (
                    <div className="flex gap-2">
                      <button
                        onClick={() => { onDelete(entry.id); setConfirmDelete(null) }}
                        className="text-xs text-red-400 hover:text-red-300 transition-colors"
                      >
                        Bekräfta
                      </button>
                      <button
                        onClick={() => setConfirmDelete(null)}
                        className="text-xs text-stone-500 hover:text-stone-300 transition-colors"
                      >
                        Avbryt
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setConfirmDelete(entry.id)}
                      className="text-xs text-stone-600 hover:text-red-400 transition-colors"
                    >
                      Ta bort
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('sv-SE', {
    year: 'numeric', month: 'long', day: 'numeric',
  })
}
