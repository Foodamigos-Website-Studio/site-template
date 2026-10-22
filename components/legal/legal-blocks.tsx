// A legal page's sections from the site API, block by block. Style it to the site's design (typography, spacing);
// keep every block type and the content as it comes.
import type { LegalBlock, LegalPage } from "@/lib/studio-api"

import { InlineText } from "./inline-text"

function Block({ block }: { block: LegalBlock }) {
  switch (block.type) {
    case "paragraph":
      return (
        <p>
          <InlineText text={block.text} />
        </p>
      )
    case "subheading":
      return (
        <h3 className="text-lg font-semibold">
          <InlineText text={block.text} />
        </h3>
      )
    case "list":
      return (
        <ul className="list-disc space-y-1 pl-6">
          {block.items.map((item, index) => (
            <li key={index}>
              <InlineText text={item} />
            </li>
          ))}
        </ul>
      )
    case "definition_list":
      return (
        <div className="space-y-2">
          {block.heading ? <h3 className="text-lg font-semibold">{block.heading}</h3> : null}
          <dl className="grid gap-x-6 gap-y-1 sm:grid-cols-[max-content_1fr]">
            {block.items.map((item) => (
              <div key={item.term} className="contents">
                <dt className="font-medium">{item.term}</dt>
                <dd>{item.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      )
    case "table":
      return (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-sm">
            <thead>
              <tr>
                {block.columns.map((column) => (
                  <th key={column} className="border-b px-3 py-2 font-semibold">
                    {column}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {block.rows.map((row, index) => (
                <tr key={index}>
                  {row.map((cell, cellIndex) => (
                    <td key={cellIndex} className="border-b px-3 py-2 align-top">
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
        <p>
          <InlineText text={`[${block.label}](${block.url})`} />
        </p>
      )
  }
}

export function LegalBlocks({ page }: { page: LegalPage }) {
  return (
    <article className="mx-auto max-w-3xl space-y-8 px-4 py-16 leading-relaxed">
      <h1 className="text-3xl font-semibold">{page.title}</h1>
      {page.sections.map((section, index) => (
        <section key={index} className="space-y-4">
          {section.heading ? <h2 className="text-xl font-semibold">{section.heading}</h2> : null}
          {section.blocks.map((block, blockIndex) => (
            <Block key={blockIndex} block={block} />
          ))}
        </section>
      ))}
    </article>
  )
}
