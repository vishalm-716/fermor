"use client";

import { useId, useState, type FormEvent } from "react";
import { ArrowRight, Check, IconSpark } from "@/components/ui/icons";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";

const POINTS = [
  "Free to start — no card, no trial clock",
  "One email when your invite is ready, and never a newsletter",
  "Unsubscribe from any email, in one click",
];

type Status = "idle" | "sending" | "done" | "error";

export function WaitlistCta() {
  const emailId = useId();
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState(""); // honeypot
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === "sending") return;

    setStatus("sending");
    setMessage("");

    try {
      const response = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, company, source: "homepage" }),
      });
      const data = (await response.json()) as { ok?: boolean; message?: string };

      if (!response.ok || !data.ok) {
        setStatus("error");
        setMessage(data.message ?? "Something went wrong on our side. Try once more?");
        return;
      }

      setStatus("done");
      setMessage(data.message ?? "You’re on the list.");
    } catch {
      setStatus("error");
      setMessage("We couldn’t reach the server. Check your connection and try again.");
    }
  }

  return (
    <section id="waitlist" className="scroll-mt-24 pb-16 lg:pb-24">
      <div className="shell">
        <Reveal>
          <div
            data-theme="dark"
            className="relative overflow-hidden rounded-[1.5rem] bg-ink-900 px-5 py-12 text-paper sm:px-10 sm:py-14 lg:px-14 lg:py-16"
          >
            <div aria-hidden="true" className="pointer-events-none absolute inset-0">
              <div className="graph-paper-dark absolute inset-0 opacity-60 [mask-image:radial-gradient(90%_70%_at_80%_10%,black,transparent_70%)]" />
              <div className="absolute -right-20 -top-28 size-[26rem] rounded-full bg-jade-600/25 blur-[110px]" />
            </div>

            <div className="relative grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-14">
              <div className="lg:col-span-6">
                <p className="font-mono text-[0.68rem] uppercase tracking-[0.2em] text-jade-300">
                  06 — Early access
                </p>
                <h2 className="mt-4 font-display text-[2.1rem] leading-[1.08] tracking-[-0.015em] text-white sm:text-[2.8rem]">
                  Start with clarity.
                  <br />
                  The rest gets easier.
                </h2>
                <p className="mt-5 max-w-md text-[0.98rem] leading-relaxed text-white/65">
                  Join the list for Fermor. We’re opening access in small batches so there
                  are real people to answer questions — and the calculators are already
                  free to use, no account needed.
                </p>

                <ul className="mt-7 space-y-2.5">
                  {POINTS.map((point) => (
                    <li key={point} className="flex gap-2.5 text-[0.86rem] text-white/70">
                      <Check className="mt-0.5 size-4 shrink-0 text-jade-300" />
                      {point}
                    </li>
                  )                  )}
                </ul>
              </div>

              <div className="lg:col-span-6">
                <div className="rounded-2xl border border-white/12 bg-white/[0.05] p-5 backdrop-blur-sm sm:p-6">
                  {status === "done" ? (
                    <div className="flex flex-col items-start" aria-live="polite">
                      <span className="flex size-10 items-center justify-center rounded-xl bg-jade-400 text-ink-900">
                        <Check className="size-5" />
                      </span>
                      <p className="mt-4 font-display text-[1.4rem] leading-tight text-white">
                        You’re on the list.
                      </p>
                      <p className="mt-2 text-[0.86rem] leading-relaxed text-white/60">
                        We’ll email <span className="text-jade-200">{email.trim()}</span> when
                        your invite is ready. Nothing else lands in that inbox from us.
                      </p>
                      <button
                        type="button"
                        onClick={() => {
                          setStatus("idle");
                          setEmail("");
                          setMessage("");
                        }}
                        className="link-sweep mt-5 font-mono text-[0.7rem] uppercase tracking-[0.14em] text-white/50 transition-colors hover:text-white"
                      >
                        Add another email
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={onSubmit} noValidate>
                      <label
                        htmlFor={emailId}
                        className="block font-mono text-[0.66rem] uppercase tracking-[0.16em] text-white/50"
                      >
                        Your email
                      </label>
                      <div className="mt-3 flex flex-col gap-2.5 sm:flex-row sm:items-start">
                        <div className="flex-1">
                        <input
                          id={emailId}
                          type="email"
                          name="email"
                          autoComplete="email"
                          inputMode="email"
                          required
                          placeholder="you@example.com"
                          value={email}
                          onChange={(event) => {
                            setEmail(event.target.value);
                            if (status === "error") setStatus("idle");
                          }}
                          aria-describedby={message ? `${emailId}-error` : undefined}
                          aria-invalid={status === "error"}
                          className={`w-full rounded-xl border bg-ink-950/40 px-4 py-3 text-[0.92rem] text-white placeholder:text-white/30 transition-colors focus:outline-none ${
                            status === "error"
                              ? "border-clay-400"
                              : "border-white/15 focus:border-jade-300"
                          }`}
                        />
                        {status === "error" && message ? (
                          <p
                            id={`${emailId}-error`}
                            role="alert"
                            className="mt-2 rounded-lg border border-clay-400/40 bg-clay-400/10 px-3 py-2 text-[0.78rem] text-clay-300"
                          >
                            {message}
                          </p>
                        ) : null}
                        </div>
                        {/* Honeypot — hidden from people, tempting to bots. */}
                        <input
                          type="text"
                          name="company"
                          tabIndex={-1}
                          autoComplete="off"
                          aria-hidden="true"
                          value={company}
                          onChange={(event) => setCompany(event.target.value)}
                          className="pointer-events-none absolute -left-[9999px] size-0 opacity-0"
                        />
                        <Button
                          type="submit"
                          variant="onDark"
                          size="lg"
                          className="shrink-0"
                          disabled={status === "sending"}
                        >
                          {status === "sending" ? "Adding you…" : "Join the list"}
                          {status === "sending" ? null : (
                            <ArrowRight className="size-4 transition-transform duration-200 group-hover/btn:translate-x-0.5" />
                          )}
                        </Button>
                      </div>

                      <p className="mt-4 flex items-start gap-2 text-[0.72rem] leading-relaxed text-white/45">
                        <IconSpark className="mt-0.5 size-3.5 shrink-0 text-jade-300/70" />
                        We use your email to send the invite and nothing else. No sharing, no
                        list-selling, no “partner offers”.
                      </p>
                    </form>
                  )}
                </div>

                {/* What actually happens after you press the button. */}
                <ol className="mt-6 space-y-3">
                  {[
                    ["Now", "You get a one-line confirmation on this page."],
                    ["In a few days", "An email when your batch is open. No drip sequence."],
                    ["When you join", "Connect one account in about three minutes, read-only."],
                  ].map(([when, what]) => (
                    <li key={when} className="flex gap-4 text-[0.8rem]">
                      <span className="w-24 shrink-0 font-mono text-[0.66rem] uppercase tracking-[0.12em] text-white/40">
                        {when}
                      </span>
                      <span className="text-white/65">{what}</span>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
