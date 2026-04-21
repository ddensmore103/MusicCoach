'use client';

import { ListChecks } from 'lucide-react';

export default function TodoPage() {
  return (
    <div className="flex flex-col items-center px-6 pt-16">
      {/* Empty State */}
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-indigo/10 mb-4">
        <ListChecks className="h-8 w-8 text-brand-indigo" />
      </div>
      <h1 className="text-xl font-bold text-text-primary mb-2">
        Practice To-Do
      </h1>
      <p className="text-sm text-text-secondary text-center max-w-xs">
        Your AI-generated practice plan will appear here after your first
        recording analysis.
      </p>
    </div>
  );
}
