export function BrandMark({ size = 32 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden="true">
      <rect width="32" height="32" rx="6" fill="#111827" />
      <path d="M9 11h14M16 11v11" stroke="#fff" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}
