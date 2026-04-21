import Link from 'next/link';
import { Music } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6 bg-surface-secondary">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-indigo/10 mb-4">
        <Music className="h-8 w-8 text-brand-indigo" />
      </div>
      <h1 className="text-2xl font-bold text-text-primary mb-2">
        Page Not Found
      </h1>
      <p className="text-sm text-text-secondary text-center mb-6 max-w-xs">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <Link
        href="/home"
        className="rounded-xl bg-brand-indigo px-6 py-2.5 text-sm font-semibold text-white transition-all hover:bg-brand-purple active:scale-95"
      >
        Go Home
      </Link>
    </div>
  );
}
