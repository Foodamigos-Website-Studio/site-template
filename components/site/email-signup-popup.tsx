"use client"

import { Mail, X } from "lucide-react"
import { type FormEvent, useCallback, useEffect, useRef, useState } from "react"

const SEEN_KEY = "email-signup-seen"
const AUTO_OPEN_MS = 8000

type Status = "idle" | "sending" | "done"

export function EmailSignupPopup({ apiUrl, offer }: { apiUrl: string; offer: string | null }) {
  const [open, setOpen] = useState(false)
  const [status, setStatus] = useState<Status>("idle")
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState("")
  const dialogRef = useRef<HTMLDivElement>(null)
  const emailRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    let seen = false
    try {
      seen = window.localStorage.getItem(SEEN_KEY) === "1"
    } catch {
      seen = true
    }
    if (seen) return
    const timer = window.setTimeout(() => {
      setOpen(true)
      try {
        window.localStorage.setItem(SEEN_KEY, "1")
      } catch {
        // Storage is blocked: the popup then simply opens from the button only.
      }
    }, AUTO_OPEN_MS)
    return () => window.clearTimeout(timer)
  }, [])

  const close = useCallback(() => setOpen(false), [])

  useEffect(() => {
    if (!open) return
    emailRef.current?.focus()
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") close()
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [open, close])

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    const email = String(form.get("email") ?? "").trim()
    const firstName = String(form.get("first_name") ?? "").trim()
    if (!email) return
    setStatus("sending")
    setError(null)
    try {
      const response = await fetch(`${apiUrl}/shop/subscriptions`, {
        method: "POST",
        headers: { Accept: "application/json", "Content-Type": "application/json", "x-preferred-locale": "de" },
        body: JSON.stringify({
          email,
          ...(firstName ? { first_name: firstName } : {}),
          marketing_subscription_source: "storefront",
          marketing_subscription_type: "vip_members",
        }),
      })
      if (response.ok) {
        setMessage(offer ? "Vielen Dank! Ihr Willkommensvorteil ist unterwegs in Ihr Postfach." : "Vielen Dank für Ihre Anmeldung. Wir halten Sie auf dem Laufenden.")
        setStatus("done")
        return
      }
      const body = (await response.json().catch(() => null)) as { message?: string } | null
      if (response.status === 429) setError("Zu viele Anfragen. Bitte versuchen Sie es gleich noch einmal.")
      else if (response.status === 422) setError(body?.message ?? "Bitte prüfen Sie Ihre Eingabe.")
      else setError("Das hat leider nicht geklappt. Bitte versuchen Sie es später noch einmal.")
      setStatus("idle")
    } catch {
      setError("Das hat leider nicht geklappt. Bitte versuchen Sie es später noch einmal.")
      setStatus("idle")
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-haspopup="dialog"
        className="fixed bottom-[calc(var(--order-bar-height)+0.75rem)] left-3 z-40 flex min-h-11 items-center gap-2 rounded bg-secondary px-4 text-paper shadow-lg transition-colors duration-200 hover:bg-primary hover:text-secondary md:bottom-6 md:left-6"
      >
        <Mail className="size-4" strokeWidth={1.5} aria-hidden="true" />
        <span className="text-xs uppercase tracking-[0.18em]">{offer ? "Vorteil sichern" : "Newsletter"}</span>
      </button>

      {open ? (
        <div
          className="fixed inset-0 z-[65] flex items-center justify-center bg-secondary/60 p-4"
          onMouseDown={(event) => {
            if (dialogRef.current && !dialogRef.current.contains(event.target as Node)) close()
          }}
        >
          <div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="signup-title"
            className="relative w-full max-w-md rounded bg-background p-8 text-text-primary shadow-2xl md:p-10"
          >
            <button
              type="button"
              onClick={close}
              aria-label="Schließen"
              className="absolute right-3 top-3 flex size-11 items-center justify-center text-secondary transition-colors duration-200 hover:text-primary"
            >
              <X className="size-5" strokeWidth={1.5} />
            </button>
            <h2 id="signup-title" className="eyebrow text-balance pr-8 text-lg leading-snug text-secondary">
              {offer ? "Ein Willkommensgruß von Trattoria Bella" : "Neues aus der Trattoria"}
            </h2>
            {status === "done" ? (
              <p className="mt-6" role="status">
                {message}
              </p>
            ) : (
              <>
                <p className="mt-4 text-pretty">
                  {offer
                    ? `Tragen Sie sich ein und erhalten Sie ${offer} auf Ihre erste Bestellung.`
                    : "Tragen Sie sich ein und erfahren Sie als Erste oder Erster von neuen Gerichten, Weinen und Aktionen."}
                </p>
                <form onSubmit={submit} className="mt-6 flex flex-col gap-4">
                  <label className="flex flex-col gap-1 text-sm text-secondary">
                    Vorname
                    <input
                      name="first_name"
                      type="text"
                      autoComplete="given-name"
                      maxLength={100}
                      className="min-h-11 rounded border border-text-primary/40 bg-paper px-3 text-base text-secondary"
                    />
                  </label>
                  <label className="flex flex-col gap-1 text-sm text-secondary">
                    E-Mail-Adresse
                    <input
                      ref={emailRef}
                      name="email"
                      type="email"
                      required
                      autoComplete="email"
                      className="min-h-11 rounded border border-text-primary/40 bg-paper px-3 text-base text-secondary"
                    />
                  </label>
                  {error ? (
                    <p role="alert" className="text-sm text-secondary">
                      {error}
                    </p>
                  ) : null}
                  <button type="submit" disabled={status === "sending"} className="btn mt-2 disabled:opacity-60">
                    {status === "sending" ? "Wird gesendet …" : "Anmelden"}
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
