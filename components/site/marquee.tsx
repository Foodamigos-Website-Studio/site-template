import { cn } from "@/lib/utils"

/** An infinite horizontal text band. Decorative, so hidden from assistive technology. */
export function Marquee({
  text,
  direction = "left",
  className,
  textClassName,
}: {
  text: string
  direction?: "left" | "right"
  className?: string
  textClassName?: string
}) {
  const half = Array.from({ length: 6 }, (_, index) => (
    <span key={index} className={cn("display-heading shrink-0 whitespace-pre px-2", textClassName)}>
      {`${text} `}
    </span>
  ))
  return (
    <div aria-hidden="true" className={cn("overflow-hidden", className)}>
      <div className="marquee-track pt-[0.14em]" data-direction={direction}>
        <div className="flex shrink-0">{half}</div>
        <div className="flex shrink-0">{half}</div>
      </div>
    </div>
  )
}
