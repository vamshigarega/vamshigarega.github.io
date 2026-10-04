import { useState, type FormEvent } from "react";
import { Send, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { contact, profile } from "../data/content";

type Status = "idle" | "sending" | "success" | "error";

export default function ContactForm({ onSent }: { onSent?: () => void }) {
  const [status, setStatus] = useState<Status>("idle");
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  const update =
    (field: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((f) => ({ ...f, [field]: e.target.value }));

  // Reliable fallback: open the visitor's mail client prefilled with the message.
  const mailtoHref = `mailto:${profile.email}?subject=${encodeURIComponent(
    `Portfolio message from ${form.name || "a visitor"}`,
  )}&body=${encodeURIComponent(
    `${form.message}\n\nFrom: ${form.name} (${form.email})`,
  )}`;

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (status === "sending") return;
    setStatus("sending");
    try {
      const res = await fetch(contact.formEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          message: form.message,
          _subject: `Portfolio message from ${form.name}`,
          _template: "table",
          _captcha: "false",
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && (data.success === "true" || data.success === true)) {
        setStatus("success");
        setForm({ name: "", email: "", message: "" });
        onSent?.();
      } else {
        setStatus("error");
      }
    } catch (err) {
      console.error("Contact form error:", err);
      setStatus("error");
    }
  }

  const label = "mb-2 block font-mono text-[0.7rem] uppercase tracking-[0.16em] text-faint";

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="cf-name" className={label}>
            Name
          </label>
          <input
            id="cf-name"
            type="text"
            required
            autoComplete="name"
            value={form.name}
            onChange={update("name")}
            placeholder="Your name"
            className="field"
          />
        </div>
        <div>
          <label htmlFor="cf-email" className={label}>
            Email
          </label>
          <input
            id="cf-email"
            type="email"
            required
            autoComplete="email"
            value={form.email}
            onChange={update("email")}
            placeholder="you@example.com"
            className="field"
          />
        </div>
      </div>

      <div>
        <label htmlFor="cf-message" className={label}>
          Message
        </label>
        <textarea
          id="cf-message"
          required
          rows={6}
          value={form.message}
          onChange={update("message")}
          placeholder="Tell me about the role, the team, or the problem."
          className="field resize-none"
        />
      </div>

      <button type="submit" disabled={status === "sending"} className="btn btn-primary disabled:opacity-60">
        {status === "sending" ? (
          <>
            <Loader2 size={16} className="animate-spin" /> Sending...
          </>
        ) : (
          <>
            <Send size={16} /> Send message
          </>
        )}
      </button>

      <div aria-live="polite">
        {status === "success" && (
          <p className="flex items-center gap-2 text-sm text-emerald-500">
            <CheckCircle2 size={16} /> Thanks. Your message is on its way to my inbox.
          </p>
        )}
        {status === "error" && (
          <div className="flex flex-col gap-2 text-sm">
            <p className="flex items-center gap-2 text-amber-500">
              <AlertCircle size={16} /> Direct send is unavailable right now.
            </p>
            <a href={mailtoHref} className="link w-fit font-medium text-accent">
              Send it from your email app instead.
            </a>
          </div>
        )}
      </div>
    </form>
  );
}
