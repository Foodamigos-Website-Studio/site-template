"use client"

import { useEffect, useState } from "react"

type Phase = "hold" | "delete" | "type"

/** The words after "ICH HAB LUST AUF": typed out one by one on a yellow dotted line (a plain swap with reduced motion). */
export function HeroWords({ words }: { words: string[] }) {
  const [index, setIndex] = useState(0)
  const [text, setText] = useState(words[0] ?? "")
  const [phase, setPhase] = useState<Phase>("hold")

  useEffect(() => {
    if (words.length < 2) return
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    const target = words[index]
    let timer: ReturnType<typeof setTimeout>

    if (reduced) {
      timer = setTimeout(() => {
        const next = (index + 1) % words.length
        setIndex(next)
        setText(words[next])
      }, 2600)
      return () => clearTimeout(timer)
    }

    if (phase === "hold") {
      timer = setTimeout(() => setPhase("delete"), 1900)
    } else if (phase === "delete") {
      if (text.length > 0) timer = setTimeout(() => setText((value) => value.slice(0, -1)), 35)
      else {
        setIndex((index + 1) % words.length)
        setPhase("type")
      }
    } else if (text.length < target.length) {
      timer = setTimeout(() => setText(target.slice(0, text.length + 1)), 75)
    } else {
      setPhase("hold")
    }
    return () => clearTimeout(timer)
  }, [index, phase, text, words])

  return (
    <span className="mx-auto block w-fit min-w-[10ch] border-b-[0.07em] border-dotted border-primary pb-[0.04em] text-primary" aria-hidden="true">
      {text || "\u200b"}
      <span className="typewriter-caret ml-[0.06em] inline-block h-[0.72em] w-[0.07em] bg-primary align-baseline" />
    </span>
  )
}
