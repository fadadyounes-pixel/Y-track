// Brain (idea) merging into a map pin (map) — the IdeaMap brand mark used on
// the auth screen. Left hemisphere is a plain lobed outline with a few
// sulcus wrinkles (white); right hemisphere is the same lobed silhouette
// traced as a node/network path (blue) that resolves into the pin, echoing
// "idea" meeting "map".
export default function IdeaMapMark({ size = 96 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M100,22 C85,10 65,8 55,20 C40,15 25,25 25,42 C10,45 8,65 18,78 C5,85 5,105 18,115
           C10,125 12,145 28,150 C30,165 45,178 65,172 C75,180 90,182 100,178 Z"
        fill="none"
        stroke="#FFFFFF"
        strokeWidth="5"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      <g fill="none" stroke="#FFFFFF" strokeWidth="3.5" strokeLinecap="round">
        <path d="M52,36 C64,40 60,48 68,52 C76,56 70,64 60,64" />
        <path d="M40,70 C52,74 48,82 56,86 C64,90 58,98 48,98" />
        <path d="M42,108 C54,112 50,120 58,124 C66,128 60,136 50,136" />
        <path d="M55,142 C64,146 60,152 66,156" />
      </g>

      <path
        d="M100,22 C115,10 135,8 145,20 C160,15 175,25 175,42 C190,45 192,65 182,78 C195,85 195,105 182,115
           C190,125 188,145 172,150 C170,165 155,178 135,172 C125,180 110,182 100,178 Z"
        fill="none"
        stroke="#2B5CFF"
        strokeWidth="5"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      <g fill="#2B5CFF">
        <circle cx="140" cy="40" r="4.5" />
        <circle cx="160" cy="55" r="4.5" />
        <circle cx="168" cy="80" r="4.5" />
        <circle cx="162" cy="108" r="4.5" />
        <circle cx="145" cy="135" r="4.5" />
        <circle cx="122" cy="155" r="4.5" />
      </g>
      <g stroke="#2B5CFF" strokeWidth="2">
        <line x1="140" y1="40" x2="160" y2="55" />
        <line x1="160" y1="55" x2="168" y2="80" />
        <line x1="168" y1="80" x2="162" y2="108" />
        <line x1="162" y1="108" x2="145" y2="135" />
        <line x1="145" y1="135" x2="122" y2="155" />
      </g>

      <path
        d="M100,85 C113,85 123,95 123,108 C123,124 100,152 100,152 C100,152 77,124 77,108 C77,95 87,85 100,85 Z"
        fill="#2B5CFF"
      />
      <circle cx="100" cy="108" r="9" fill="#0A0F2C" />
    </svg>
  );
}
