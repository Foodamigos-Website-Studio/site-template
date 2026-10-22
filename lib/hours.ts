// Opening hours from the site API: periods {open: {day 0–6 (0 = Sunday), hour, minute}, close: {...}} in the location's
// timezone. Grouped per weekday for display, and "open now" in that timezone.
import type { OpeningPeriod } from "./studio-api"

export type DayHours = { day: number; name: string; ranges: string[] }

const clock = (hour: number, minute: number) => `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`

/** Monday first, every weekday, closed days with no ranges. */
export function weekHours(periods: OpeningPeriod[], language: string): DayHours[] {
  const names = new Intl.DateTimeFormat(language || "en", { weekday: "long", timeZone: "UTC" })
  return [1, 2, 3, 4, 5, 6, 0].map((day) => ({
    day,
    // 2024-01-07 was a Sunday: + day gives that weekday.
    name: names.format(new Date(Date.UTC(2024, 0, 7 + day))),
    ranges: periods
      .filter((period) => period.open.day === day)
      .sort((a, b) => a.open.hour * 60 + a.open.minute - (b.open.hour * 60 + b.open.minute))
      .map((period) => `${clock(period.open.hour, period.open.minute)}–${clock(period.close.hour, period.close.minute)}`),
  }))
}

/** The weekday (0 = Sunday) and minutes since midnight at `now` in the location's timezone. */
export function localTime(now: Date, timezone: string): { day: number; minutes: number } {
  const parts = new Intl.DateTimeFormat("en-US", { timeZone: timezone, weekday: "short", hour: "2-digit", minute: "2-digit", hourCycle: "h23" }).formatToParts(now)
  const get = (type: string) => parts.find((part) => part.type === type)?.value ?? ""
  const day = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(get("weekday"))
  return { day, minutes: Number(get("hour")) * 60 + Number(get("minute")) }
}

/** Whether the location is open at `now`; periods past midnight (close day after open day) count too. */
export function isOpenNow(periods: OpeningPeriod[], timezone: string, now = new Date()): boolean {
  const { day, minutes } = localTime(now, timezone)
  const week = day * 1440 + minutes
  return periods.some((period) => {
    const open = period.open.day * 1440 + period.open.hour * 60 + period.open.minute
    let close = period.close.day * 1440 + period.close.hour * 60 + period.close.minute
    if (close <= open) close += 7 * 1440
    return (week >= open && week < close) || (week + 7 * 1440 >= open && week + 7 * 1440 < close)
  })
}

/** A Google Maps search link for the address (no embedded map). */
export function mapsUrl(address: string): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`
}
