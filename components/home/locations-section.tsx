import { Reveal } from "@/components/reveal"
import { ButtonLink } from "@/components/ui/button-link"
import { WaveEdge } from "@/components/ui/decor"
import { SectionHeading } from "@/components/ui/section-heading"
import { SITE_LANGUAGE } from "@/lib/config"
import { mapsUrl } from "@/lib/hours"
import { localizedPath } from "@/lib/localized-routes"
import { fullAddress, ORDER_PATH, todayHours } from "@/lib/restaurant"
import type { Company } from "@/lib/studio-api"
import { cn } from "@/lib/utils"

export function LocationsSection({ companies, orderOn }: { companies: Company[]; orderOn: boolean }) {
  const now = new Date()
  return (
    <section className="texture-dots relative overflow-x-clip pb-24 pt-24 text-background sm:pb-32 sm:pt-32">
      <WaveEdge className="text-background" />
      <div className="mx-auto max-w-[1160px] px-6">
        <Reveal>
          <SectionHeading sparkleClassName="text-primary">Find us</SectionHeading>
        </Reveal>
        <ul className="mt-12 grid gap-6 sm:mt-16 md:grid-cols-2">
          {companies.map((company, index) => {
            const today = todayHours(company, SITE_LANGUAGE, now)
            return (
              <li key={company.uuid}>
                <Reveal index={index} className="h-full">
                  <article className="flex h-full flex-col gap-4 rounded-[7px] border-2 border-charcoal bg-background p-6 text-charcoal shadow-[6px_6px_0_0_var(--color-primary)] sm:p-8">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <h3 className="font-heading text-2xl uppercase leading-tight sm:text-3xl">{company.name}</h3>
                      <span
                        className={cn(
                          "rounded-[7px] border-2 border-charcoal px-3 py-1 text-xs font-bold uppercase",
                          today.open ? "bg-primary text-background" : "bg-background text-charcoal",
                        )}
                      >
                        {today.open ? "Open now" : "Closed now"}
                      </span>
                    </div>
                    <address className="not-italic text-lg leading-relaxed">
                      {fullAddress(company)}
                      {company.phone_number ? (
                        <>
                          <br />
                          <a href={`tel:${company.phone_number.replace(/\s+/g, "")}`} className="font-bold underline underline-offset-4 hover:text-primary">
                            {company.phone_number}
                          </a>
                        </>
                      ) : null}
                    </address>
                    <p className="text-lg">
                      <span className="font-bold">Today:</span> {today.label}
                    </p>
                    <div className="mt-auto flex flex-wrap gap-3 pt-2">
                      {orderOn ? (
                        <ButtonLink href={ORDER_PATH} size="sm">
                          Order now
                        </ButtonLink>
                      ) : null}
                      <ButtonLink href={mapsUrl(fullAddress(company))} variant="charcoal" size="sm" external>
                        Route
                      </ButtonLink>
                    </div>
                  </article>
                </Reveal>
              </li>
            )
          })}
        </ul>
        <Reveal className="mt-10 flex justify-center">
          <ButtonLink href={localizedPath("location-and-hours", SITE_LANGUAGE)} variant="outline" size="md">
            All opening hours
          </ButtonLink>
        </Reveal>
      </div>
    </section>
  )
}
