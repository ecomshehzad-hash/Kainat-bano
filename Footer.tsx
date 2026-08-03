import Link from "next/link";
import { Instagram, Facebook, Twitter, MapPin } from "lucide-react";
import Newsletter from "./Newsletter";
import { CATEGORIES } from "@/lib/products";

export default function Footer() {
  return (
    <footer className="border-t border-gold/15 bg-charcoal">
      <div className="container-lux py-16 grid grid-cols-1 md:grid-cols-4 gap-12">
        <div>
          <div className="font-display text-2xl mb-4">KAINAT BANO</div>
          <p className="text-smoke text-sm leading-relaxed max-w-xs">
            A premium fashion house crafting abayas, formal wear and modest
            essentials with hand-finished detail, designed in Pakistan and
            worn worldwide.
          </p>
          <div className="flex items-start gap-2 mt-5 text-smoke text-sm max-w-xs">
            <MapPin size={15} className="text-gold shrink-0 mt-0.5" />
            <span>Parachinar, Kurram District, Khyber Pakhtunkhwa, Pakistan</span>
          </div>
          <div className="flex gap-4 mt-6">
            <a href="#" aria-label="Instagram" className="text-smoke hover:text-gold"><Instagram size={18} /></a>
            <a href="#" aria-label="Facebook" className="text-smoke hover:text-gold"><Facebook size={18} /></a>
            <a href="#" aria-label="Twitter" className="text-smoke hover:text-gold"><Twitter size={18} /></a>
          </div>
        </div>

        <div>
          <div className="eyebrow mb-5">Shop</div>
          <ul className="space-y-3 text-sm text-bone/80">
            {CATEGORIES.map((c) => (
              <li key={c}>
                <Link href={`/categories/${c.toLowerCase().replace(/\s+/g, "-")}`} className="hover:text-gold">
                  {c}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <div className="eyebrow mb-5">Support</div>
          <ul className="space-y-3 text-sm text-bone/80">
            <li><Link href="/contact" className="hover:text-gold">Contact Us</Link></li>
            <li><Link href="/track-order" className="hover:text-gold">Track Order</Link></li>
            <li><Link href="/about" className="hover:text-gold">About Us</Link></li>
            <li><Link href="/privacy-policy" className="hover:text-gold">Privacy Policy</Link></li>
            <li><Link href="/terms" className="hover:text-gold">Terms &amp; Conditions</Link></li>
          </ul>
        </div>

        <div>
          <div className="eyebrow mb-5">Stay in touch</div>
          <p className="text-smoke text-sm mb-4">
            New arrivals and private previews, twice a month.
          </p>
          <Newsletter />
        </div>
      </div>

      <div className="border-t border-gold/10">
        <div className="container-lux py-6 flex flex-col sm:flex-row justify-between items-center gap-3 text-[11px] tracking-widest2 uppercase text-smoke">
          <span>© {new Date().getFullYear()} Kainat Bano. All rights reserved.</span>
          <span>Parachinar, Kurram District, Khyber Pakhtunkhwa, Pakistan</span>
        </div>
      </div>
    </footer>
  );
}
