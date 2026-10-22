"use client"

import { useState, type FormEvent } from "react"

import { PROJECT_UUID, STUDIO_API_URL } from "@/lib/config"
import { ctaClass } from "@/components/site/cta"

export const CONTACT_FORM_UUID = "01a15eb1-8bac-7176-b6da-8d6b5e63e8b7"

const TOPICS = ["Frage", "Lob / Kritik", "Catering / Gruppen", "Sonstiges"]

const field =
  "w-full rounded border-2 border-secondary bg-background px-4 py-3 text-base text-secondary transition-colors duration-[150ms] ease-in-out placeholder:text-secondary/50 focus:bg-primary/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-secondary"

type State =
  | { status: "idle" }
  | { status: "sending" }
  | { status: "done"; message: string }
  | { status: "error"; message: string; errors: Record<string, string[]> }

export function ContactForm() {
  const [state, setState] = useState<State>({ status: "idle" })

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = event.currentTarget
    const data = new FormData(form)
    const phone = String(data.get("telefon") ?? "").replace(/[^+\d]/g, "")
    const values: Record<string, unknown> = {
      name: String(data.get("name") ?? ""),
      email: String(data.get("email") ?? ""),
      anliegen: String(data.get("anliegen") ?? ""),
      nachricht: String(data.get("nachricht") ?? ""),
      datenschutz: data.get("datenschutz") === "on",
    }
    if (phone) values.telefon = phone

    setState({ status: "sending" })
    try {
      const response = await fetch(`${STUDIO_API_URL}/api/projects/${PROJECT_UUID}/forms/${CONTACT_FORM_UUID}/submissions`, {
        method: "POST",
        headers: { Accept: "application/json", "Content-Type": "application/json" },
        body: JSON.stringify({ values }),
      })
      const body = (await response.json().catch(() => ({}))) as {
        data?: { message?: string }
        message?: string
        errors?: Record<string, string[]>
      }
      if (response.status === 201) {
        form.reset()
        setState({ status: "done", message: body.data?.message ?? "Danke! Wir melden uns so schnell wie möglich." })
      } else if (response.status === 429) {
        setState({ status: "error", message: "Gerade kamen zu viele Nachrichten an. Bitte versuche es in einer Minute noch einmal.", errors: {} })
      } else if (response.status === 422) {
        setState({ status: "error", message: body.message ?? "Bitte prüfe deine Angaben.", errors: body.errors ?? {} })
      } else {
        setState({ status: "error", message: "Das hat leider nicht geklappt. Bitte versuche es später noch einmal.", errors: {} })
      }
    } catch {
      setState({ status: "error", message: "Keine Verbindung. Bitte versuche es später noch einmal.", errors: {} })
    }
  }

  const errorsFor = (key: string) => (state.status === "error" ? (state.errors[`values.${key}`] ?? []) : [])
  const fieldError = (key: string) =>
    errorsFor(key).length > 0 ? (
      <p id={`${key}-error`} className="mt-1 text-sm font-semibold text-secondary underline decoration-wavy">
        {errorsFor(key).join(" ")}
      </p>
    ) : null
  const describe = (key: string) => (errorsFor(key).length > 0 ? `${key}-error` : undefined)

  if (state.status === "done") {
    return (
      <div role="status" className="rounded border-2 border-secondary bg-primary p-8 text-secondary">
        <p className="font-heading text-4xl uppercase leading-none md:text-5xl">Danke!</p>
        <p className="mt-3 text-lg">{state.message}</p>
      </div>
    )
  }

  return (
    <form onSubmit={onSubmit} noValidate className="flex flex-col gap-5 text-secondary">
      <div className="grid gap-5 md:grid-cols-2">
        <div>
          <label htmlFor="name" className="mb-1 block text-sm font-bold">
            Name *
          </label>
          <input id="name" name="name" type="text" required maxLength={255} autoComplete="name" className={field} aria-describedby={describe("name")} />
          {fieldError("name")}
        </div>
        <div>
          <label htmlFor="email" className="mb-1 block text-sm font-bold">
            E-Mail *
          </label>
          <input id="email" name="email" type="email" required autoComplete="email" className={field} aria-describedby={describe("email")} />
          {fieldError("email")}
        </div>
        <div>
          <label htmlFor="telefon" className="mb-1 block text-sm font-bold">
            Telefon
          </label>
          <input id="telefon" name="telefon" type="tel" autoComplete="tel" placeholder="+49 …" className={field} aria-describedby={describe("telefon")} />
          {fieldError("telefon")}
        </div>
        <div>
          <label htmlFor="anliegen" className="mb-1 block text-sm font-bold">
            Worum geht es? *
          </label>
          <select id="anliegen" name="anliegen" required defaultValue="" className={field} aria-describedby={describe("anliegen")}>
            <option value="" disabled>
              Bitte wählen
            </option>
            {TOPICS.map((topic) => (
              <option key={topic} value={topic}>
                {topic}
              </option>
            ))}
          </select>
          {fieldError("anliegen")}
        </div>
      </div>
      <div>
        <label htmlFor="nachricht" className="mb-1 block text-sm font-bold">
          Nachricht *
        </label>
        <textarea id="nachricht" name="nachricht" required rows={6} maxLength={5000} className={field} aria-describedby={describe("nachricht")} />
        {fieldError("nachricht")}
      </div>
      <div>
        <label className="flex items-start gap-3 text-sm">
          <input type="checkbox" name="datenschutz" required className="mt-1 size-5 shrink-0 accent-secondary" aria-describedby={describe("datenschutz")} />
          <span>Ich stimme der Verarbeitung meiner Daten zu *</span>
        </label>
        {fieldError("datenschutz")}
      </div>
      {state.status === "error" ? (
        <p role="alert" className="rounded border-2 border-secondary bg-primary px-4 py-3 font-semibold">
          {state.message}
        </p>
      ) : null}
      <button type="submit" disabled={state.status === "sending"} className={ctaClass("primary", "lg", "self-start disabled:opacity-60")}>
        {state.status === "sending" ? "Wird gesendet …" : "Nachricht senden"}
      </button>
    </form>
  )
}
