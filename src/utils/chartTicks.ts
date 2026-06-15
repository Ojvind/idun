export function quarterlyTicks(minTs: number, maxTs: number): number[] {
  const start = new Date(minTs)
  start.setDate(1)
  start.setMonth(Math.floor(start.getMonth() / 3) * 3)
  start.setHours(0, 0, 0, 0)
  const ticks: number[] = []
  const cur = new Date(start)
  while (cur.getTime() <= maxTs) {
    ticks.push(cur.getTime())
    cur.setMonth(cur.getMonth() + 3)
  }
  return ticks
}

export function monthlyTicks(minTs: number, maxTs: number): number[] {
  const start = new Date(minTs)
  start.setDate(1)
  start.setHours(0, 0, 0, 0)
  const ticks: number[] = []
  const cur = new Date(start)
  while (cur.getTime() <= maxTs) {
    ticks.push(cur.getTime())
    cur.setMonth(cur.getMonth() + 1)
  }
  return ticks
}
