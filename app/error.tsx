"use client";

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="text-center space-y-4">
        <h2 className="text-2xl font-light text-[#5C306C]">Something went wrong</h2>
        <p className="text-[#5C306C]/60">We&apos;re sorry — please try refreshing the page.</p>
        <button
          onClick={reset}
          className="px-6 py-3 rounded-full bg-[#5C306C] text-white text-sm font-medium hover:bg-[#4A2756] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#5C306C] focus-visible:ring-offset-2"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
