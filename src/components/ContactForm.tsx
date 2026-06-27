import { useState, type FormEvent } from "react";
import emailjs from "@emailjs/browser";
import { Send, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { emailConfig, profile } from "../data/content";

type Status = "idle" | "sending" | "success" | "error";

export default function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  const update =
    (field: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((f) => ({ ...f, [field]: e.target.value }));

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (status === "sending") return;
    setStatus("sending");
    try {
      await emailjs.send(
        emailConfig.serviceId,
        emailConfig.templateId,
        {
          name: form.name,
          email: form.email,
          reply_to: form.email,
          subject: `Portfolio message from ${form.name}`,
          message: form.message,
          to_name: profile.name,
        },
        { publicKey: emailConfig.publicKey },
      );
      setStatus("success");
      setForm({ name: "", email: "", message: "" });
    } catch (err) {
      console.error("EmailJS error:", err);
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
        <p className="flex items-center gap-2 text-sm text-red-400">
          <AlertCircle size={16} /> Something went wrong. Please email me directly at{" "}
          {profile.email}.
        </p>
      )}
    </form>
  );
}
