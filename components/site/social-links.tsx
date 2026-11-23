// Icon links to the restaurant's social profiles (lib/socials.ts), for the footer and the menu: design them like the
// inspiration, keep one link per set network and nothing when none is set. Icons are currentColor SVGs.
import type { ReactNode } from "react"

import { socialLinks, type SocialNetwork } from "@/lib/socials"

const ICONS: Record<SocialNetwork, ReactNode> = {
  instagram: (
    <>
      <rect x="3" y="3" width="18" height="18" rx="5" fill="none" stroke="currentColor" strokeWidth="2" />
      <circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" strokeWidth="2" />
      <circle cx="17.5" cy="6.5" r="1.25" fill="currentColor" />
    </>
  ),
  facebook: <path fill="currentColor" d="M14 8h3V4h-3c-2.8 0-4.5 1.8-4.5 4.6V11H7v4h2.5v7h4v-7H17l.5-4h-4V8.8c0-.5.3-.8.5-.8Z" />,
  tiktok: <path fill="currentColor" d="M16.5 3c.4 2.2 1.8 3.6 4 3.9v3.3c-1.5 0-2.9-.4-4-1.2v6.3a5.8 5.8 0 1 1-5.8-5.8c.3 0 .6 0 .9.1v3.4a2.5 2.5 0 1 0 1.6 2.3V3h3.3Z" />,
}

export function SocialLinks({ socials, slot = "social-links" }: { socials: Record<string, string> | null | undefined; slot?: string }) {
  const links = socialLinks(socials)
  if (links.length === 0) return null
  return (
    <ul data-slot={slot}>
      {links.map((link) => (
        <li key={link.network}>
          <a href={link.href} target="_blank" rel="noopener noreferrer" aria-label={link.label} data-network={link.network}>
            <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" focusable="false">
              {ICONS[link.network]}
            </svg>
          </a>
        </li>
      ))}
    </ul>
  )
}
