"use client"

import { useEffect, useState } from "react"

import type { HoursGroup } from "@/lib/hours-groups"

export type BoardLocation = { slug: string; name: string; timezone: string; groups: HoursGroup[] }

function dayIn(timezone: string, now: Date): number {
  const weekday = new Intl.DateTimeFormat("en-US", { weekday: "short", timeZone: timezone }).format(now)
  return ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(weekday)
}

/** Opening hours in large type; the run of days that contains today is highlighted once the page is in the browser. */
export function HoursBoard({ locations, todayLabel }: { locations: BoardLocation[]; todayLabel: string }) {
  const [now, setNow] = useState<Date | null>(null)
  useEffect(() => setNow(new Date()), [])

  return (
    <div className="grid gap-10 md:grid-cols-2">
      {locations.map((location) => {
        const today = now ? dayIn(location.timezone, now) : -1
        return (
          <div key={location.slug}>
            {locations.length > 1 ? <h3 className="label mb-3">{location.name}</h3> : null}
            <ul className="flex flex-col gap-2">
              {location.groups.map((group) => {
                const isToday = group.days.includes(today)
                return (
                  <li key={group.label} className={`flex flex-wrap items-baseline justify-between gap-x-4 border-b border-text-primary/20 pb-2 ${isToday ? "text-accent" : ""}`}>
                    <span className="display text-xl sm:text-2xl">
                      {group.label}
                      {isToday ? <span className="label ml-3 align-middle text-xs">{todayLabel}</span> : null}
                    </span>
                    <span className="display text-2xl sm:text-3xl">{group.ranges.length ? group.ranges.join(", ") : "geschlossen"}</span>
                  </li>
                )
              })}
            </ul>
          </div>
        )
      })}
    </div>
  )
}
