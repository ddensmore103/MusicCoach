'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { BottomNav } from '@/components/BottomNav';
import { Spinner } from '@/components/ui/Spinner';

/**
 * Protected layout — guards all child routes behind authentication.
 * Renders the sticky BottomNav for all protected pages.
 */
export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/login');
    }
  }, [user, loading, router]);

  // Loading state while auth resolves
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-surface-secondary">
        <Spinner />
      </div>
    );
  }

  // Don't render content if unauthenticated (redirect is in-flight)
  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-surface-secondary">
      {/* Page content — padded at bottom for BottomNav */}
      <main className="safe-bottom">{children}</main>

      {/* Sticky bottom navigation */}
      <BottomNav />
    </div>
  );
}
