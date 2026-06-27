import { useState, type FormEvent } from "react";
import { Send, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { contact, profile } from "../data/content";

type Status = "idle" | "sending" | "success" | "error";

export default function ContactForm() {
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
      } else {
        setStatus("error");
      }
    } catch (err) {
      console.error("Contact form error:", err);
      setStatus("error");
    }
  }

  const inputClass =
    "w-full rounded-xl border border-line bg-[color:var(--chip-bg)] px-4 py-3 text-sm text-snow placeholder:text-mist outline-none transition-colors focus:border-accent/60 focus:bg-[color:var(--panel-bg-hover)]";

  return (
    <form
      onSubmit={onSubmit}
      className="gloss flex h-full flex-col gap-4 rounded-2xl p-6 sm:p-7"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="cf-name" className="mb-1.5 block text-xs font-medium text-mist">
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
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="cf-email" className="mb-1.5 block text-xs font-medium text-mist">
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
            className={inputClass}
          />
        </div>
      </div>

      <div className="flex flex-1 flex-col">
        <label htmlFor="cf-message" className="mb-1.5 block text-xs font-medium text-mist">
          Message
        </label>
        <textarea
          id="cf-message"
          required
          rows={5}
          value={form.message}
          onChange={update("message")}
          placeholder="Tell me about the role, project, or just say hello."
          className={`${inputClass} min-h-[120px] flex-1 resize-none`}
        />
      </div>

      <button
        type="submit"
        disabled={status === "sending"}
        className="btn-solid group inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold transition-all hover:opacity-90 disabled:opacity-60"
      >
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

      {status === "success" && (
        <p className="flex items-center gap-2 text-sm text-emerald-400">
          <CheckCircle2 size={16} /> Thanks. Your message is on its way to my inbox.
        </p>
      )}
      {status === "error" && (
        <div className="flex flex-col gap-2 text-sm">
          <p className="flex items-center gap-2 text-amber-400">
            <AlertCircle size={16} /> Direct send is unavailable right now.
          </p>
          <a
            href={mailtoHref}
            className="font-medium text-accent-soft underline-offset-2 hover:underline"
          >
            Tap here to send it from your email app instead.
          </a>
        </div>
      )}
    </form>
  );
}
