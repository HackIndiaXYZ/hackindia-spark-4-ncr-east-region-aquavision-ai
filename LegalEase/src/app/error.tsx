"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-6">
      <div className="w-full max-w-md rounded-xl border border-border bg-white p-6 shadow-sm">
        <div className="mb-2 text-lg" style={{ fontWeight: 700 }}>
          Something went wrong
        </div>
        <p className="mb-4 text-sm text-muted-foreground">
          Please try again. If this keeps happening, restart the dev server.
        </p>
        <button
          onClick={reset}
          className="rounded-lg bg-[#4f46e5] px-4 py-2 text-sm text-white transition-opacity hover:opacity-90"
          style={{ fontWeight: 600 }}
        >
          Retry
        </button>
      </div>
    </div>
  );
}
