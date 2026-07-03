import { COLORS } from "../lib/constants";

export default function Logo({ size = 48 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <circle cx="100" cy="100" r="80" fill="none" stroke={COLORS.primary} strokeWidth="10" />
      <circle cx="100" cy="100" r="58" fill="none" stroke={COLORS.primaryDark} strokeWidth="4" opacity={0.4} />
      <path
        d="M 75 65 L 100 105 L 125 65 M 100 105 L 100 145"
        fill="none"
        stroke={COLORS.onSurface}
        strokeWidth="14"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="100" cy="45" r="8" fill={COLORS.gold} />
    </svg>
  );
}
