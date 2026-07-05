// Brain (idea) merging into a map pin (map) — the IdeaMap brand mark used on
// the auth screen. Left hemisphere is a plain outline (white); right
// hemisphere is a node/network pattern (blue) that resolves into the pin,
// echoing "idea" meeting "map".
export default function IdeaMapMark({ size = 96 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M100,22 C82,14 60,18 50,32 C34,34 24,48 26,64 C14,72 10,90 18,104 C12,118 18,134 32,140 C36,156 52,168 70,166 C80,176 92,180 100,178"
        fill="none"
        stroke="#FFFFFF"
        strokeWidth="7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M62,50 C72,56 72,66 62,72 M50,86 C62,90 62,102 50,108 M60,122 C70,126 70,136 60,142"
        fill="none"
        stroke="#FFFFFF"
        strokeWidth="5"
        strokeLinecap="round"
      />

      <path
        d="M100,22 C118,14 140,18 150,32 C166,34 176,48 174,64 C186,72 190,90 182,104 C188,118 182,134 168,140 C164,156 148,168 130,166 C120,176 108,180 100,178"
        fill="none"
        stroke="#2B5CFF"
        strokeWidth="7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <g fill="#2B5CFF">
        <circle cx="128" cy="46" r="5.5" />
        <circle cx="155" cy="60" r="5.5" />
        <circle cx="160" cy="95" r="5.5" />
        <circle cx="148" cy="128" r="5.5" />
        <circle cx="118" cy="150" r="5.5" />
      </g>
      <g stroke="#2B5CFF" strokeWidth="2.5">
        <line x1="128" y1="46" x2="155" y2="60" />
        <line x1="155" y1="60" x2="160" y2="95" />
        <line x1="160" y1="95" x2="148" y2="128" />
        <line x1="148" y1="128" x2="118" y2="150" />
      </g>

      <path
        d="M100,80 C114,80 125,91 125,105 C125,123 100,150 100,150 C100,150 75,123 75,105 C75,91 86,80 100,80 Z"
        fill="#2B5CFF"
      />
      <circle cx="100" cy="105" r="10" fill="#0A0F2C" />
    </svg>
  );
}
