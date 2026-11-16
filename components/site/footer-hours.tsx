"use client"

import { useEffect, useState } from "react"

import { localTime } from "@/lib/hours"
import type { HoursGroup } from "@/lib/hours-groups"

/** Large opening hours for the footer: today's hours (once in the browser) and the weekly ranges. */
export function FooterHours({ timezone, groups }: { timezone: string; groups: HoursGroup[] }) {
  const [today, setToday] = useState<number | null>(null)
  useEffect(() => setToday(localTime(new Date(), timezone).day), [timezone])

  const current = today === null ? null : groups.find((group) => group.days.includes(today))

  return (
    <div className="flex flex-col items-center gap-6">
      {current ? (
        <p className="display text-3xl sm:text-4xl">
          <span className="label mb-3 block text-accent">Heute</span>
          {current.ranges.length ? current.ranges.join(", ") : "geschlossen"}
        </p>
      ) : null}
      <ul className="flex flex-col gap-2 text-lg sm:text-xl">
        {groups.map((group) => (
          <li key={group.label}>
            <span>{group.label}</span>
            <span aria-hidden="true" className="mx-3 text-accent">
              ·
            </span>
            <span>{group.ranges.length ? group.ranges.join(", ") : "geschlossen"}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
