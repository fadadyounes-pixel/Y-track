// Brain (idea) merging into a map pin (map) — the IdeaMap brand mark used on
// the auth screen. Left hemisphere is a plain lobed outline with a few
// sulcus wrinkles (white); right hemisphere is the same lobed silhouette
// traced as a node/network path (blue) that resolves into the pin, echoing
// "idea" meeting "map".
export default function IdeaMapMark({ size = 96 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M100,20 C82,8 58,8 48,22 C30,18 14,30 16,48 C0,52 -4,74 8,86 C-4,96 -2,118 14,126
           C14,144 30,160 50,156 C58,170 78,178 92,168 C96,174 100,176 100,176"
        fill="none"
        stroke="#FFFFFF"
        strokeWidth="6"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      <g fill="none" stroke="#FFFFFF" strokeWidth="4" strokeLinecap="round">
        <path d="M46,34 C60,38 55,48 65,52 C75,56 68,66 56,66" />
        <path d="M28,72 C42,76 36,86 46,90 C56,94 48,104 36,104" />
        <path d="M32,114 C46,118 40,128 50,132 C60,136 52,146 40,146" />
        <path d="M50,152 C60,156 55,162 62,166" />
      </g>

      <path
        d="M100,20 C118,8 142,8 152,22 C170,18 186,30 184,48 C200,52 204,74 192,86 C204,96 202,118 186,126
           C186,144 170,160 150,156 C142,170 122,178 108,168 C104,174 100,176 100,176"
        fill="none"
        stroke="#2B5CFF"
        strokeWidth="6"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      <g fill="#2B5CFF">
        <circle cx="146" cy="30" r="5" />
        <circle cx="170" cy="42" r="5" />
        <circle cx="182" cy="66" r="5" />
        <circle cx="180" cy="92" r="5" />
        <circle cx="168" cy="118" r="5" />
        <circle cx="146" cy="140" r="5" />
        <circle cx="120" cy="155" r="5" />
      </g>
      <path
        d="M146,30 C160,34 168,40 170,42 C176,50 180,58 182,66 C184,76 182,84 180,92
           C176,102 172,110 168,118 C160,128 154,134 146,140 C136,148 128,152 120,155"
        fill="none"
        stroke="#2B5CFF"
        strokeWidth="2.5"
      />

      <path
        d="M100,88 C115,88 127,100 127,115 C127,135 100,166 100,166 C100,166 73,135 73,115 C73,100 85,88 100,88 Z"
        fill="#2B5CFF"
      />
      <circle cx="100" cy="115" r="11" fill="#0A0F2C" />
    </svg>
  );
}
