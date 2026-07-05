// Brain (idea) merging into a map pin (map) — the IdeaMap brand mark. Left
// hemisphere is a plain lobed outline with sulcus wrinkles; right hemisphere
// is the same lobed silhouette in blue, with a node/network route curving
// down to the pin, and a vertical stem connecting the crown to the pin.
// `leftColor`/`holeColor` are the only parts that vary by background — dark
// screens (login, sidebar) use white/navy, light screens (dashboards,
// landing page) use ink/white — the blue and gold stay constant everywhere.
export default function IdeaMapMark({
  size = 96,
  leftColor = "#FFFFFF",
  holeColor = "#0A0F2C",
}: {
  size?: number;
  leftColor?: string;
  holeColor?: string;
}) {
  return (
    <svg width={size} height={size} viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M100,28 C86,14 62,12 50,26 C24,26 8,52 14,74 C-2,88 -2,116 14,130
           C10,150 24,168 46,166 C56,180 76,182 92,172 C96,176 100,178 100,178"
        fill="none"
        stroke={leftColor}
        strokeWidth="6.5"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      <path
        d="M58,44 C68,40 76,46 74,54 C72,61 62,60 60,52"
        fill="none"
        stroke={leftColor}
        strokeWidth="4.5"
        strokeLinecap="round"
      />
      <path
        d="M34,70 C50,76 50,88 34,94 C20,100 20,112 34,118"
        fill="none"
        stroke={leftColor}
        strokeWidth="4.5"
        strokeLinecap="round"
      />
      <path
        d="M38,132 C54,138 54,150 38,156"
        fill="none"
        stroke={leftColor}
        strokeWidth="4.5"
        strokeLinecap="round"
      />

      <path
        d="M100,28 C114,14 138,12 150,26 C176,26 192,52 186,74 C202,88 202,116 186,130
           C190,150 176,168 154,166 C144,180 124,182 108,172 C104,176 100,178 100,178"
        fill="none"
        stroke="#2B5CFF"
        strokeWidth="6.5"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      <line x1="100" y1="28" x2="100" y2="88" stroke="#2B5CFF" strokeWidth="5" />
      <path
        d="M148,44 C168,50 182,62 184,76 C186,92 180,106 172,116 C160,130 148,138 134,150"
        fill="none"
        stroke="#2B5CFF"
        strokeWidth="2.5"
      />
      <g fill="#2B5CFF">
        <circle cx="148" cy="44" r="5.5" />
        <circle cx="184" cy="76" r="5.5" />
        <circle cx="172" cy="116" r="5.5" />
        <circle cx="134" cy="150" r="5.5" />
      </g>

      <path
        d="M100,86 C116,86 129,99 129,115 C129,136 100,168 100,168 C100,168 71,136 71,115 C71,99 84,86 100,86 Z"
        fill="#2B5CFF"
      />
      <circle cx="100" cy="115" r="12" fill={holeColor} />
    </svg>
  );
}
