"use client";

export default function QuantityStepper({
  value,
  onChange,
  label = "Quantity",
  compact = false,
}: {
  value: number;
  onChange: (next: number) => void;
  label?: string;
  compact?: boolean;
}) {
  const size = compact ? "h-9 w-9" : "h-11 w-11";
  const box = compact ? "h-9" : "h-11";

  return (
    <div
      className={`inline-flex items-center rounded-full border border-rosedust bg-white/80 ${box}`}
      role="group"
      aria-label={label}
    >
      <button
        type="button"
        onClick={() => onChange(Math.max(1, value - 1))}
        disabled={value <= 1}
        aria-label="Decrease quantity"
        className={`${size} flex items-center justify-center rounded-full text-ink transition-colors duration-200 hover:bg-babypink/60 disabled:opacity-35 disabled:hover:bg-transparent`}
      >
        <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" aria-hidden="true">
          <path d="M3 8h10" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
        </svg>
      </button>

      <span
        className={`min-w-8 text-center font-sans text-[15px] tabular-nums text-ink`}
        aria-live="polite"
        aria-atomic="true"
      >
        {value}
      </span>

      <button
        type="button"
        onClick={() => onChange(Math.min(99, value + 1))}
        disabled={value >= 99}
        aria-label="Increase quantity"
        className={`${size} flex items-center justify-center rounded-full text-ink transition-colors duration-200 hover:bg-babypink/60 disabled:opacity-35 disabled:hover:bg-transparent`}
      >
        <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" aria-hidden="true">
          <path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
        </svg>
      </button>
    </div>
  );
}
