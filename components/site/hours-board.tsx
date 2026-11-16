"use client"

import { useEffect, useState } from "react"

import { localTime } from "@/lib/hours"
import type { HoursGroup } from "@/lib/hours-groups"

/** Today's hours (once the page is in the browser) plus the weekly hours of one location. */
export function LocationHours({ timezone, groups }: { timezone: string; groups: HoursGroup[] }) {
  const [today, setToday] = useState<number | null>(null)
  useEffect(() => setToday(localTime(new Date(), timezone).day), [timezone])

  const current = today === null ? null : groups.find((group) => group.days.includes(today))

  return (
    <div>
      {current ? (
        <p className="label text-accent">
          Heute: <span className="text-ink">{current.ranges.length ? current.ranges.join(", ") : "geschlossen"}</span>
        </p>
      ) : null}
      <ul className="mt-4 flex flex-col">
        {groups.map((group) => {
          const isToday = today !== null && group.days.includes(today)
          return (
            <li key={group.label} className={`flex flex-wrap justify-between gap-x-4 border-b border-accent/30 py-2 text-sm ${isToday ? "text-ink" : ""}`}>
              <span>{group.label}</span>
              <span>{group.ranges.length ? group.ranges.join(", ") : "geschlossen"}</span>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
