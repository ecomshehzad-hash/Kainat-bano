"use client";

import { useState } from "react";
import { Tag, Check, X } from "lucide-react";
import { validateCoupon, Coupon } from "@/lib/coupons";

export default function CouponInput({ onApply }: { onApply: (coupon: Coupon | null) => void }) {
  const [code, setCode] = useState("");
  const [applied, setApplied] = useState<Coupon | null>(null);
  const [error, setError] = useState("");

  function handleApply(e: React.FormEvent) {
    e.preventDefault();
    const coupon = validateCoupon(code);
    if (coupon) {
      setApplied(coupon);
      setError("");
      onApply(coupon);
    } else {
      setError("Invalid or expired code");
      setApplied(null);
      onApply(null);
    }
  }

  function remove() {
    setApplied(null);
    setCode("");
    onApply(null);
  }

  if (applied) {
    return (
      <div className="flex items-center justify-between card-hairline px-4 py-3 bg-charcoal">
        <span className="flex items-center gap-2 text-sm text-gold">
          <Check size={15} /> {applied.code} applied — {applied.description}
        </span>
        <button onClick={remove} aria-label="Remove coupon" className="text-smoke hover:text-bone">
          <X size={15} />
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleApply} className="space-y-2">
      <div className="flex items-center gap-2 card-hairline px-3 py-2.5 bg-charcoal">
        <Tag size={15} className="text-gold shrink-0" />
        <input
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="Discount code"
          className="flex-1 bg-transparent outline-none text-sm placeholder:text-smoke"
        />
        <button type="submit" className="text-[11px] tracking-widest2 uppercase text-gold hover:text-gold-light">
          Apply
        </button>
      </div>
      {error && <p className="text-xs text-red-400">{error}</p>}
    </form>
  );
}
