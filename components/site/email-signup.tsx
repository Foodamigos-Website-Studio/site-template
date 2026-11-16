"use client"

import { Mail, X } from "lucide-react"
import { useEffect, useRef, useState, type FormEvent } from "react"
import useSWR from "swr"

import { formatPrice } from "@/lib/format"

const SEEN_KEY = "signup-popup-seen"

type Component = { discount: number; usage_threshold?: number | null; max_discount?: number | null }
type Settings = { discount_type?: string; components?: Component[] } | null
type SettingsResponse = { data: { settings: Settings } }

const fetcher = async (url: string): Promise<SettingsResponse> => {
  const response = await fetch(url, { headers: { Accept: "application/json" } })
  if (!response.ok) throw new Error("settings")
  return response.json()
}

function offer(settings: Settings, currency: string, language: string) {
  if (!settings?.components?.length) return null
  const total = settings.components.reduce((sum, component) => sum + Number(component.discount || 0), 0)
  if (total <= 0) return null
  const percent = settings.discount_type === "percentage"
  const first = settings.components[0]
  return {
    value: percent ? `${total} %` : formatPrice(total, currency, language),
    threshold: first.usage_threshold && first.usage_threshold > 0 ? formatPrice(Number(first.usage_threshold), currency, language) : null,
    max: first.max_discount && first.max_discount > 0 ? formatPrice(Number(first.max_discount), currency, language) : null,
  }
}

export function EmailSignup({ apiBase, currency, language, name }: { apiBase: string; currency: string; language: string; name: string }) {
  const { data, error } = useSWR(`${apiBase}/shop/marketing-settings`, fetcher, { revalidateOnFocus: false, shouldRetryOnError: false })
  const [open, setOpen] = useState(false)
  const [status, setStatus] = useState<"idle" | "sending" | "done">("idle")
  const [message, setMessage] = useState("")
  const emailRef = useRef<HTMLInputElement>(null)
  const ready = Boolean(data) && !error

  useEffect(() => {
    if (!ready) return
    let seen = false
    try {
      seen = localStorage.getItem(SEEN_KEY) === "1"
    } catch {}
    if (seen) return
    const timer = window.setTimeout(() => {
      setOpen(true)
      try {
        localStorage.setItem(SEEN_KEY, "1")
      } catch {}
    }, 8000)
    return () => window.clearTimeout(timer)
  }, [ready])

  useEffect(() => {
    if (!open) return
    emailRef.current?.focus()
    const onKey = (event: KeyboardEvent) => event.key === "Escape" && setOpen(false)
    document.addEventListener("keydown", onKey)
    return () => document.removeEventListener("keydown", onKey)
  }, [open])

  if (!ready) return null
  const deal = offer(data?.data.settings ?? null, currency, language)

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    setStatus("sending")
    setMessage("")
    try {
      const response = await fetch(`${apiBase}/shop/subscriptions`, {
        method: "POST",
        headers: { Accept: "application/json", "Content-Type": "application/json", "x-preferred-locale": language },
        body: JSON.stringify({
          email: String(form.get("email") ?? ""),
          first_name: String(form.get("first_name") ?? "") || undefined,
          marketing_subscription_source: "storefront",
          marketing_subscription_type: "vip_members",
        }),
      })
      if (response.ok) {
        setStatus("done")
        return
      }
      const body = await response.json().catch(() => null)
      setStatus("idle")
      if (response.status === 429) setMessage("Gerade kommen sehr viele Anmeldungen. Bitte versuche es in einer Minute noch einmal.")
      else if (response.status === 422) setMessage(body?.message ?? "Bitte prüfe deine E-Mail-Adresse.")
      else setMessage("Das hat leider nicht geklappt. Bitte versuche es später noch einmal.")
    } catch {
      setStatus("idle")
      setMessage("Das hat leider nicht geklappt. Bitte versuche es später noch einmal.")
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="label fixed bottom-[5.25rem] left-4 z-30 flex items-center gap-2 rounded-[3px] border-2 border-text-primary bg-background px-4 py-3 text-sm shadow-sm hover:bg-text-primary hover:text-background md:bottom-5 md:left-5"
      >
        <Mail className="size-4" aria-hidden="true" />
        {deal ? "Dein Rabatt" : "Newsletter"}
      </button>

      {open ? (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-ink/60 p-4" onClick={() => setOpen(false)}>
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="signup-title"
            onClick={(event) => event.stopPropagation()}
            className="card-label relative w-full max-w-md !p-8 text-left"
          >
            <button type="button" onClick={() => setOpen(false)} aria-label="Schließen" className="absolute right-4 top-4 z-10 p-1 hover:opacity-60">
              <X className="size-5" aria-hidden="true" />
            </button>
            {status === "done" ? (
              <div className="py-6 text-center">
                <h2 id="signup-title" className="display text-3xl">
                  Danke und willkommen!
                </h2>
                <p className="mt-4">Wir haben dich eingetragen. Schau gleich in dein Postfach.</p>
              </div>
            ) : (
              <>
                <p className="label text-xs">{name}</p>
                <h2 id="signup-title" className="display mt-2 text-3xl">
                  {deal ? `${deal.value} Rabatt für dich` : "Bleib auf dem Laufenden"}
                </h2>
                <p className="mt-3 text-base">
                  {deal
                    ? `Trag dich ein und sichere dir ${deal.value} Rabatt auf deine Bestellung.${deal.threshold ? ` Gilt ab einem Bestellwert von ${deal.threshold}.` : ""}${deal.max ? ` Der Rabatt beträgt höchstens ${deal.max}.` : ""}`
                    : "Neuigkeiten und Aktionen direkt in dein Postfach: Trag dich in unseren Newsletter ein."}
                </p>
                <form onSubmit={submit} className="mt-5 flex flex-col gap-3">
                  <label className="flex flex-col gap-1 text-sm">
                    <span className="label text-xs">Vorname</span>
                    <input name="first_name" autoComplete="given-name" className="rounded-[3px] border border-text-primary bg-transparent px-3 py-2.5 text-base" />
                  </label>
                  <label className="flex flex-col gap-1 text-sm">
                    <span className="label text-xs">E-Mail</span>
                    <input ref={emailRef} name="email" type="email" required autoComplete="email" className="rounded-[3px] border border-text-primary bg-transparent px-3 py-2.5 text-base" />
                  </label>
                  {message ? (
                    <p role="alert" className="text-sm">
                      {message}
                    </p>
                  ) : null}
                  <button type="submit" disabled={status === "sending"} className="btn btn-solid mt-1 disabled:opacity-60">
                    {status === "sending" ? "Einen Moment …" : deal ? "Rabatt sichern" : "Anmelden"}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      ) : null}
    </>
  )
}
