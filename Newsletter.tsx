"use client";

import { useState } from "react";
import { ArrowRight, Check } from "lucide-react";

export default function Newsletter({ dark = false }: { dark?: boolean }) {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.includes("@")) return;
    // TODO: wire up to your email provider (Mailchimp, Klaviyo, etc.)
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <p className="flex items-center gap-2 text-sm text-gold">
        <Check size={16} /> You&apos;re on the list.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex items-center border-b border-gold/40 pb-2 gap-3">
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="your@email.com"
        className="flex-1 bg-transparent outline-none text-sm placeholder:text-smoke"
      />
      <button type="submit" aria-label="Subscribe" className="text-gold hover:text-gold-light">
        <ArrowRight size={17} />
      </button>
    </form>
  );
}
