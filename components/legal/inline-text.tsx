// The legal texts' **bold** and [label](url), as elements (lib/inline.ts), never as HTML.
import Link from "next/link"

import { parseInline } from "@/lib/inline"

export function InlineText({ text }: { text: string }) {
  return (
    <>
      {parseInline(text).map((token, index) => {
        if (token.type === "bold") return <strong key={index}>{token.text}</strong>
        if (token.type === "link") {
          return token.href.startsWith("/") ? (
            <Link key={index} href={token.href}>
              {token.label}
            </Link>
          ) : (
            <a key={index} href={token.href} rel="noopener noreferrer" target="_blank">
              {token.label}
            </a>
          )
        }
        return <span key={index}>{token.text}</span>
      })}
    </>
  )
}
