// "Geöffnet bis 02:00" / "Geschlossen · öffnet um 10:00" for the status pill, from the API's opening hours.
import { localTime, weekHours } from "./hours"
import type { Company, OpeningPeriod, OpeningPoint, Project } from "./studio-api"

export type OpenStatus = { open: boolean; label: string }

const WEEK = 7 * 1440
const clock = (point: OpeningPoint) => `${String(point.hour).padStart(2, "0")}:${String(point.minute).padStart(2, "0")}`
const minuteOfWeek = (point: OpeningPoint) => point.day * 1440 + point.hour * 60 + point.minute

export function openStatus(periods: OpeningPeriod[], timezone: string, language: string, now = new Date()): OpenStatus | null {
  if (periods.length === 0) return null
  const { day, minutes } = localTime(now, timezone)
  const week = day * 1440 + minutes

  for (const period of periods) {
    const open = minuteOfWeek(period.open)
    let close = minuteOfWeek(period.close)
    if (close <= open) close += WEEK
    if ((week >= open && week < close) || (week + WEEK >= open && week + WEEK < close)) {
      return { open: true, label: `Geöffnet bis ${clock(period.close)}` }
    }
  }

  let next: { delta: number; period: OpeningPeriod } | null = null
  for (const period of periods) {
    const delta = (minuteOfWeek(period.open) - week + WEEK) % WEEK
    if (!next || delta < next.delta) next = { delta, period }
  }
  if (!next) return null
  if (next.delta < 1440 - minutes) return { open: false, label: `Geschlossen · öffnet um ${clock(next.period.open)}` }
  const weekday = new Intl.DateTimeFormat(language, { weekday: "short", timeZone: "UTC" }).format(new Date(Date.UTC(2024, 0, 7 + next.period.open.day)))
  return { open: false, label: `Geschlossen · öffnet ${weekday} ${clock(next.period.open)}` }
}

/** Today's opening ranges at the location, e.g. "10:00–02:00". */
export function todayHours(company: Company, language: string, now = new Date()): string | null {
  const { day } = localTime(now, company.timezone)
  const ranges = weekHours(company.opening_hours, language).find((entry) => entry.day === day)?.ranges ?? []
  return ranges.length > 0 ? ranges.join(", ") : null
}

/** The restaurant's own location (its slug matches the project's), else the first one. */
export function mainCompany(project: Project | null, companies: Company[] | null): Company | null {
  if (!companies || companies.length === 0) return null
  return companies.find((company) => company.slug === project?.slug) ?? companies[0]
}
