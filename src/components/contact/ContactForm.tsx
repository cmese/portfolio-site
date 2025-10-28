"use client";

import { useEffect, useRef, useState } from "react";

export default function ContactForm() {
  const [status, setStatus] = useState<"idle" | "sending" | "ok" | "error">(
    "idle"
  );
  const [err, setErr] = useState<string | null>(null);
  const startedAt = useRef<number>(Date.now());

  useEffect(() => {
    startedAt.current = Date.now();
  }, []);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErr(null);

    const form = e.currentTarget;
    const data = new FormData(form);

    // anti-spam: min time on page
    const elapsed = Date.now() - startedAt.current;
    data.set("elapsed", String(elapsed));

    setStatus("sending");
    try {
      // Disabled for now for static azure deployment
      // const res = await fetch("/api/contact", {
      //   method: "POST",
      //   body: data,
      // });
      // if (!res.ok) throw new Error(await res.text());
      setStatus("ok");
      form.reset();
      startedAt.current = Date.now();
    } catch (e: any) {
      setStatus("error");
      setErr(e?.message ?? "Something went wrong.");
    }
  };

  const disabled = status === "sending";

  return (
    <form
      onSubmit={onSubmit}
      className="rounded-2xl border border-white/10 bg-white/5 dark:bg-white/5
                 backdrop-blur-md p-5 md:p-6 shadow-xl"
    >
      {/* Honeypot (bots will fill this) */}
      <input
        type="text"
        name="company"
        tabIndex={-1}
        autoComplete="off"
        className="hidden"
        aria-hidden="true"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm opacity-80 mb-1">Name</label>
          <input
            name="name"
            required
            autoComplete="name"
            className="w-full rounded-lg border border-white/10 bg-black/20 px-3 py-2
                       focus:outline-none focus:ring-2 focus:ring-blue-500/60"
            placeholder="Your name"
          />
        </div>
        <div>
          <label className="block text-sm opacity-80 mb-1">Email</label>
          <input
            type="email"
            name="email"
            required
            autoComplete="email"
            className="w-full rounded-lg border border-white/10 bg-black/20 px-3 py-2
                       focus:outline-none focus:ring-2 focus:ring-blue-500/60"
            placeholder="you@email.com"
          />
        </div>
      </div>

      <div className="mt-4">
        <label className="block text-sm opacity-80 mb-1">Message</label>
        <textarea
          name="message"
          required
          rows={6}
          className="w-full rounded-lg border border-white/10 bg-black/20 px-3 py-2
                     focus:outline-none focus:ring-2 focus:ring-blue-500/60"
          placeholder="Tell me a bit about the project…"
        />
      </div>

      <div className="mt-4 flex items-center justify-between">
        <p className="text-xs opacity-60">
          I read everything. No recruiters/scrapers please :)
        </p>
        <button
          type="submit"
          disabled={disabled}
          className={`rounded-full px-5 py-2 text-sm font-medium transition
            ${disabled ? "opacity-60 cursor-not-allowed" : "hover:scale-[1.02]"}
            text-white bg-blue-600`}
        >
          {status === "sending" ? "Sending…" : "Send message"}
        </button>
      </div>

      {/* inline feedback */}
      {status === "ok" && (
        <div className="mt-3 rounded-md bg-emerald-600/15 border border-emerald-600/30 p-2 text-sm">
          Thanks! Your message is on its way. I’ll reply soon.
        </div>
      )}
      {status === "error" && (
        <div className="mt-3 rounded-md bg-red-600/15 border border-red-600/30 p-2 text-sm">
          {err}
        </div>
      )}
    </form>
  );
}
