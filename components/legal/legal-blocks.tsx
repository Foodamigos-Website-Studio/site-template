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
        <h3>
          <InlineText text={block.text} />
        </h3>
      )
    case "list":
      return (
        <ul>
          {block.items.map((item, index) => (
            <li key={index}>
              <InlineText text={item} />
            </li>
          ))}
        </ul>
      )
    case "definition_list":
      return (
        <div>
          {block.heading ? <h3>{block.heading}</h3> : null}
          <dl>
            {block.items.map((item) => (
              <div key={item.term}>
                <dt>{item.term}</dt>
                <dd>{item.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      )
    case "table":
      return (
        <div>
          <table>
            <thead>
              <tr>
                {block.columns.map((column) => (
                  <th key={column}>
                    {column}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {block.rows.map((row, index) => (
                <tr key={index}>
                  {row.map((cell, cellIndex) => (
                    <td key={cellIndex}>
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
    <article>
      <h1>{page.title}</h1>
      {page.sections.map((section, index) => (
        <section key={index}>
          {section.heading ? <h2>{section.heading}</h2> : null}
          {section.blocks.map((block, blockIndex) => (
            <Block key={blockIndex} block={block} />
          ))}
        </section>
      ))}
    </article>
  )
}
