// The legal texts' inline markup: **bold** and [label](url). Parsed into tokens rendered as React elements, never as
// HTML, so the texts cannot inject markup. Only http(s), mailto, tel and site-relative links are kept.

export type InlineToken =
  | { type: "text"; text: string }
  | { type: "bold"; text: string }
  | { type: "link"; label: string; href: string }

const PATTERN = /\*\*(.+?)\*\*|\[([^\]]+)\]\(([^)\s]+)\)/g

export function safeHref(url: string): string | null {
  if (url.startsWith("/") && !url.startsWith("//")) return url
  return /^(https?:|mailto:|tel:)/i.test(url) ? url : null
}

export function parseInline(text: string): InlineToken[] {
  const tokens: InlineToken[] = []
  let last = 0
  for (const match of text.matchAll(PATTERN)) {
    const index = match.index ?? 0
    if (index > last) tokens.push({ type: "text", text: text.slice(last, index) })
    if (match[1] !== undefined) {
      tokens.push({ type: "bold", text: match[1] })
    } else {
      const href = safeHref(match[3] ?? "")
      tokens.push(href ? { type: "link", label: match[2] ?? "", href } : { type: "text", text: match[2] ?? "" })
    }
    last = index + match[0].length
  }
  if (last < text.length) tokens.push({ type: "text", text: text.slice(last) })
  return tokens
}

/** The text without its markup, e.g. for a meta description. */
export function plainText(text: string): string {
  return parseInline(text)
    .map((token) => (token.type === "link" ? token.label : token.text))
    .join("")
}
