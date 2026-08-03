"use client";

import { useState } from "react";
import { Star } from "lucide-react";
import { Review } from "@/lib/types";

function Stars({ rating, size = 14 }: { rating: number; size?: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((n) => (
        <Star
          key={n}
          size={size}
          className={n <= Math.round(rating) ? "fill-gold text-gold" : "text-smoke"}
        />
      ))}
    </div>
  );
}

export default function Reviews({
  reviews,
  rating,
  reviewCount,
}: {
  reviews: Review[];
  rating: number;
  reviewCount: number;
}) {
  const [localReviews, setLocalReviews] = useState(reviews);
  const [form, setForm] = useState({ author: "", rating: 5, comment: "" });
  const [showForm, setShowForm] = useState(false);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.author.trim() || !form.comment.trim()) return;
    setLocalReviews((prev) => [
      { id: String(Date.now()), author: form.author, rating: form.rating, comment: form.comment, date: new Date().toISOString().slice(0, 10) },
      ...prev,
    ]);
    setForm({ author: "", rating: 5, comment: "" });
    setShowForm(false);
  }

  return (
    <div>
      <div className="flex items-center gap-4 mb-8">
        <Stars rating={rating} size={18} />
        <span className="text-sm text-smoke">
          {rating.toFixed(1)} · {reviewCount} reviews
        </span>
        <button onClick={() => setShowForm((s) => !s)} className="ml-auto text-[12px] tracking-widest2 uppercase text-gold hover:text-gold-light">
          Write a review
        </button>
      </div>

      {showForm && (
        <form onSubmit={submit} className="card-hairline p-6 mb-8 space-y-4 bg-charcoal">
          <div className="flex gap-4">
            <input
              placeholder="Your name"
              value={form.author}
              onChange={(e) => setForm({ ...form, author: e.target.value })}
              className="flex-1 bg-ink border border-gold/20 px-3 py-2 text-sm outline-none focus:border-gold"
            />
            <select
              value={form.rating}
              onChange={(e) => setForm({ ...form, rating: Number(e.target.value) })}
              className="bg-ink border border-gold/20 px-3 py-2 text-sm outline-none focus:border-gold"
            >
              {[5, 4, 3, 2, 1].map((n) => (
                <option key={n} value={n}>{n} stars</option>
              ))}
            </select>
          </div>
          <textarea
            placeholder="Share your experience..."
            value={form.comment}
            onChange={(e) => setForm({ ...form, comment: e.target.value })}
            rows={3}
            className="w-full bg-ink border border-gold/20 px-3 py-2 text-sm outline-none focus:border-gold"
          />
          <button type="submit" className="btn-gold px-6 py-2.5 text-[12px] tracking-widest2 uppercase">
            Submit Review
          </button>
        </form>
      )}

      <div className="space-y-6">
        {localReviews.map((r) => (
          <div key={r.id} className="card-hairline p-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">{r.author}</span>
              <span className="text-xs text-smoke">{r.date}</span>
            </div>
            <Stars rating={r.rating} />
            <p className="text-sm text-bone/80 mt-3 leading-relaxed">{r.comment}</p>
          </div>
        ))}
        {localReviews.length === 0 && <p className="text-smoke text-sm">No reviews yet — be the first.</p>}
      </div>
    </div>
  );
}
