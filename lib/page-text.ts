// Shared German copy helpers: diet keywords from the API and SEO titles/descriptions of every page.
import { mainCompany } from "./open-status"
import type { Company, Project } from "./studio-api"

const DIET_LABELS: Record<string, string> = {
  vegetarian: "vegetarisch",
  vegan: "vegan",
  halal: "halal",
  gluten_free: "glutenfrei",
  dairy_free: "laktosefrei",
  spicy: "scharf",
}

export function dietLabels(project: Project | null): string[] {
  return (project?.dietary_attributes ?? []).map((key) => DIET_LABELS[key]).filter(Boolean)
}

/** "vegetarisch, vegan, halal und glutenfrei" */
export function dietPhrase(project: Project | null): string {
  const labels = dietLabels(project)
  if (labels.length === 0) return ""
  if (labels.length === 1) return labels[0]
  return `${labels.slice(0, -1).join(", ")} und ${labels[labels.length - 1]}`
}

export function clip(text: string, max: number): string {
  return text.length <= max ? text : `${text.slice(0, max - 1).trimEnd()}…`
}

export function cityOf(project: Project | null, companies: Company[] | null): string {
  return mainCompany(project, companies)?.city ?? ""
}

/** "{name} – {topic} in {city}", at most 60 characters. */
export function seoTitle(project: Project | null, companies: Company[] | null, topic: string): string {
  const city = cityOf(project, companies)
  const name = project?.name ?? ""
  return clip([name, [topic, city ? `in ${city}` : ""].filter(Boolean).join(" ")].filter(Boolean).join(" – "), 60)
}

export function seoDescription(project: Project | null, companies: Company[] | null, text: string): string {
  const city = cityOf(project, companies)
  const diets = dietPhrase(project)
  const base = [project?.name, city].filter(Boolean).join(" in ")
  const full = `${base}: ${text}${diets ? ` – ${diets}.` : ""}`
  return clip(full, 158)
}
