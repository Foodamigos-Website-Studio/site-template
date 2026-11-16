import { SITE_LANGUAGE } from "@/lib/config"
import { weekHours } from "@/lib/hours"
import type { Company } from "@/lib/studio-api"

export type HoursGroup = { label: string; days: number[]; ranges: string[] }

/** The week as runs of consecutive days with the same hours ("Montag – Sonntag 12:00 – 23:00"). */
export function groupedHours(company: Company): HoursGroup[] {
  const week = weekHours(company.opening_hours, SITE_LANGUAGE)
  const groups: HoursGroup[] = []
  const names: string[][] = []
  for (const day of week) {
    const key = day.ranges.join("|")
    const last = groups[groups.length - 1]
    if (last && last.ranges.join("|") === key) {
      last.days.push(day.day)
      names[names.length - 1].push(day.name)
    } else {
      groups.push({ label: "", days: [day.day], ranges: day.ranges })
      names.push([day.name])
    }
  }
  return groups.map((group, index) => {
    const list = names[index]
    return { ...group, label: list.length > 1 ? `${list[0]} – ${list[list.length - 1]}` : list[0] }
  })
}

/** "Trattoria Bella Mitte" → "Mitte" when the location's name starts with the restaurant's name. */
export function shortLocationName(company: Company, projectName: string | undefined): string {
  if (projectName && company.name.startsWith(projectName)) return company.name.slice(projectName.length).trim() || company.name
  return company.name
}
