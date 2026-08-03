import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container-lux py-32 text-center">
      <div className="eyebrow mb-4">404</div>
      <h1 className="font-display text-4xl md:text-5xl mb-6">Page Not Found</h1>
      <p className="text-smoke mb-8">The page you&apos;re looking for doesn&apos;t exist or has moved.</p>
      <Link href="/" className="btn-gold px-8 py-3.5 text-[12px] tracking-widest2 uppercase inline-block">
        Back to Home
      </Link>
    </div>
  );
}
