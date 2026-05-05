export type MeasurementKey =
  | 'weight'
  | 'navel'
  | 'waist'
  | 'chest'
  | 'leftBicep'
  | 'rightBicep'
  | 'leftThigh'
  | 'rightThigh'
  | 'hips'

export interface MeasurementField {
  key: MeasurementKey
  label: string
  instruction: string
  unit: string
}

export interface MeasurementEntry {
  id: string
  date: string
  note: string
  values: Partial<Record<MeasurementKey, number>>
}
