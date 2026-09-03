import Link from "next/link";

export default function NotFound() {
  return (
    <div className="max-w-lg mx-auto px-5 py-28 text-center">
      <h1 className="font-display text-4xl font-semibold text-ajwa-navy mb-3">Page Not Found</h1>
      <p className="text-ajwa-ink/60 mb-8">The page you're looking for doesn't exist or has moved.</p>
      <Link href="/" className="inline-block bg-ajwa-navy text-white px-7 py-3 rounded-full font-semibold hover:bg-ajwa-navydark transition-colors">
        Back to Home
      </Link>
    </div>
  );
}
