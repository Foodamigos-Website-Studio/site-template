// A legal page's sections from the site API, block by block. Style it to the site's design (typography, spacing);
// keep every block type and the content as it comes. Until then it has a neutral, readable layout that inherits the
// site's fonts and colours: a centred column with side padding and top spacing clear of a fixed header
// (--legal-page-top, default 7rem). Ticket 1220948108100971: a live site's legal pages kept the bare markup, with their
// text under the fixed header and against the screen's left edge.
import type { LegalBlock, LegalPage } from "@/lib/studio-api"

import { InlineText } from "./inline-text"

/** A table cell: a hairline in the text's own colour, so it fits light and dark sites. */
const CELL = "border-b border-[color-mix(in_srgb,currentColor_15%,transparent)] py-2 pr-4 align-top"

function Block({ block }: { block: LegalBlock }) {
  switch (block.type) {
    case "paragraph":
      return (
        <p className="mb-4 leading-relaxed">
          <InlineText text={block.text} />
        </p>
      )
    case "subheading":
      return (
        <h3 className="mt-6 mb-2 text-lg font-semibold">
          <InlineText text={block.text} />
        </h3>
      )
    case "list":
      return (
        <ul className="mb-4 list-disc space-y-1 pl-5 leading-relaxed">
          {block.items.map((item, index) => (
            <li key={index}>
              <InlineText text={item} />
            </li>
          ))}
        </ul>
      )
    case "definition_list":
      return (
        <div className="mb-6">
          {block.heading ? <h3 className="mt-6 mb-2 text-lg font-semibold">{block.heading}</h3> : null}
          <dl className="grid gap-x-6 gap-y-1 sm:grid-cols-[minmax(8rem,auto)_1fr]">
            {block.items.map((item) => (
              <div key={item.term} className="contents">
                <dt className="font-semibold">{item.term}</dt>
                <dd className="mb-2 sm:mb-0">{item.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      )
    case "table":
      return (
        <div className="mb-6 overflow-x-auto">
          <table className="w-full border-collapse text-left text-sm">
            <thead>
              <tr>
                {block.columns.map((column) => (
                  <th key={column} className={CELL}>
                    {column}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {block.rows.map((row, index) => (
                <tr key={index}>
                  {row.map((cell, cellIndex) => (
                    <td key={cellIndex} className={CELL}>
                      <InlineText text={cell} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )
    case "link":
      return (
        <p className="mb-4">
          <InlineText text={`[${block.label}](${block.url})`} />
        </p>
      )
  }
}

export function LegalBlocks({ page }: { page: LegalPage }) {
  return (
    <article
      data-slot="legal-page"
      className="mx-auto w-full max-w-3xl px-5 pt-[var(--legal-page-top,7rem)] pb-16 [overflow-wrap:anywhere] sm:px-8 [&_a]:underline [&_a]:underline-offset-2"
    >
      <h1 className="mb-8 text-3xl leading-tight font-semibold sm:text-4xl">{page.title}</h1>
      {page.sections.map((section, index) => (
        <section key={index} className="mt-10 first-of-type:mt-0">
          {section.heading ? <h2 className="mb-4 text-xl font-semibold">{section.heading}</h2> : null}
          {section.blocks.map((block, blockIndex) => (
            <Block key={blockIndex} block={block} />
          ))}
        </section>
      ))}
    </article>
  )
}
