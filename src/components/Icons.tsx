type IconProps = { className?: string };

const base = "h-full w-full";

export function DropIcon({ className = base }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className={className}>
      <path
        d="M12 3.2c3.1 3.5 5.4 6.3 5.4 9.1A5.4 5.4 0 0 1 12 17.7a5.4 5.4 0 0 1-5.4-5.4c0-2.8 2.3-5.6 5.4-9.1Z"
        stroke="currentColor"
        strokeWidth="1.1"
        strokeLinejoin="round"
      />
      <path
        d="M9.6 12.7a2.4 2.4 0 0 0 2.4 2.4"
        stroke="currentColor"
        strokeWidth="1.1"
        strokeLinecap="round"
        opacity="0.55"
      />
    </svg>
  );
}

export function LeafIcon({ className = base }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className={className}>
      <path
        d="M19 5c0 7-4.2 11-9 11a5.6 5.6 0 0 1-4-1.6C6 9.4 10.4 5.6 19 5Z"
        stroke="currentColor"
        strokeWidth="1.1"
        strokeLinejoin="round"
      />
      <path
        d="M15.6 8.3C11.8 9.6 8.4 13 6.4 19"
        stroke="currentColor"
        strokeWidth="1.1"
        strokeLinecap="round"
        opacity="0.55"
      />
    </svg>
  );
}

export function SparkleIcon({ className = base }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className={className}>
      <path
        d="M12 3.5c.7 4.3 1.7 5.3 6 6-4.3.7-5.3 1.7-6 6-.7-4.3-1.7-5.3-6-6 4.3-.7 5.3-1.7 6-6Z"
        stroke="currentColor"
        strokeWidth="1.1"
        strokeLinejoin="round"
      />
      <path
        d="M5.4 3.3c.25 1.5.6 1.85 2.1 2.1-1.5.25-1.85.6-2.1 2.1-.25-1.5-.6-1.85-2.1-2.1 1.5-.25 1.85-.6 2.1-2.1Z"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinejoin="round"
        opacity="0.6"
      />
    </svg>
  );
}

export function StarIcon({ className = "h-3.5 w-3.5" }: IconProps) {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M10 1.6l2.47 5.32 5.83.72-4.3 3.98 1.12 5.78L10 14.55l-5.12 2.85 1.12-5.78-4.3-3.98 5.83-.72L10 1.6Z" />
    </svg>
  );
}

export function Stars({ count = 5, className = "" }: { count?: number; className?: string }) {
  return (
    <span
      className={`inline-flex items-center gap-[3px] text-pink ${className}`}
      role="img"
      aria-label={`${count} out of 5 stars`}
    >
      {Array.from({ length: count }, (_, i) => (
        <StarIcon key={i} />
      ))}
    </span>
  );
}

export function ArrowIcon({ className = "h-4 w-4" }: IconProps) {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" className={className}>
      <path
        d="M3.5 10h13m0 0-4.8-4.6M16.5 10l-4.8 4.6"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function CloseIcon({ className = "h-4 w-4" }: IconProps) {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" className={className}>
      <path
        d="M5 5l10 10M15 5 5 15"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function BagIcon({ className = "h-[18px] w-[18px]" }: IconProps) {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" className={className}>
      <path
        d="M4.6 6.6h10.8l-.9 9.3a1.4 1.4 0 0 1-1.4 1.3H6.9a1.4 1.4 0 0 1-1.4-1.3l-.9-9.3Z"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
      <path
        d="M7.4 8.2V6.1a2.6 2.6 0 0 1 5.2 0v2.1"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function ShieldIcon({ className = "h-3.5 w-3.5" }: IconProps) {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" className={className}>
      <path
        d="M10 2.6l5.6 2v4.9c0 3.4-2.3 6.3-5.6 7.4-3.3-1.1-5.6-4-5.6-7.4V4.6l5.6-2Z"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
      <path
        d="m7.7 9.9 1.7 1.7 3.1-3.4"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function TruckIcon({ className = "h-3.5 w-3.5" }: IconProps) {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" className={className}>
      <path
        d="M2.6 5.4h8.2v8H2.6v-8Zm8.2 2.6h3l2.6 2.6v2.8h-5.6V8Z"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
      <circle cx="6.4" cy="15.1" r="1.5" stroke="currentColor" strokeWidth="1.2" />
      <circle cx="14" cy="15.1" r="1.5" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  );
}

export function DiamondIcon({ className = "h-2.5 w-2.5" }: IconProps) {
  return (
    <svg viewBox="0 0 12 12" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M6 0.6 7.4 4.6 11.4 6 7.4 7.4 6 11.4 4.6 7.4 0.6 6 4.6 4.6 6 0.6Z" />
    </svg>
  );
}
