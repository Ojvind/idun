import type { MeasurementField } from '../types'

export const FIELDS: MeasurementField[] = [
  { key: 'weight',     label: 'Vikt',             instruction: 'På morgonen, utan kläder', unit: 'kg' },
  { key: 'navel',      label: 'Rakt över naveln', instruction: 'Spänn magen',              unit: 'cm' },
  { key: 'waist',      label: 'Midja',            instruction: 'Spänn magen',              unit: 'cm' },
  { key: 'chest',      label: 'Bröst',            instruction: 'Rakt över bröstvårtorna, spänn', unit: 'cm' },
  { key: 'leftBicep',  label: 'Vänster biceps',   instruction: 'Spänn muskeln',            unit: 'cm' },
  { key: 'rightBicep', label: 'Höger biceps',     instruction: 'Spänn muskeln',            unit: 'cm' },
  { key: 'leftThigh',  label: 'Vänster lår',      instruction: 'I höjd med P',             unit: 'cm' },
  { key: 'rightThigh', label: 'Höger lår',        instruction: 'I höjd med P',             unit: 'cm' },
  { key: 'hips',       label: 'Höft',             instruction: 'Rakt över höftbenen',      unit: 'cm' },
]
