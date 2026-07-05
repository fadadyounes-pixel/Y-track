import { LogoConcept, LogoIcon, LogoState } from "./types";

// Small, simple glyphs (24x24) — not decorative flourish, just enough to
// recognize the sector at a glance on a generated badge.
const ICON_PATHS: Record<LogoIcon, string> = {
  leaf: `<path d="M12 3c-5 2-8 6-8 11a7 7 0 0 0 7 7c5 0 9-4 9-11 0-3-3-6-8-7Z" />`,
  wheat: `<path d="M12 2v20M8 6l4 3 4-3M8 11l4 3 4-3M8 16l4 3 4-3" fill="none" stroke-width="1.6"/>`,
  fish: `<path d="M2 12c3-4 8-6 13-4 3 1.3 5 3.6 7 4-2 .4-4 2.7-7 4-5 2-10 0-13-4Z"/><circle cx="16.5" cy="11" r="1"/>`,
  thread: `<path d="M3 18c4 0 4-5 9-5s5 5 9 5" fill="none" stroke-width="1.6"/><circle cx="19" cy="5.5" r="2.2" fill="none" stroke-width="1.6"/>`,
  hammer: `<path d="M13.5 3.5l7 7-2.6 2.6-7-7 2.6-2.6Z"/><path d="M10.8 6.2 3.5 13.5l3 3 7.3-7.3-3-3Z"/>`,
  house: `<path d="M12 2 2 11h3v11h6v-7h2v7h6V11h3L12 2Z"/>`,
  book: `<path d="M3 4.5c3-1.5 6.5-1.5 9 0v15c-2.5-1.5-6-1.5-9 0v-15Z"/><path d="M21 4.5c-3-1.5-6.5-1.5-9 0v15c2.5-1.5 6-1.5 9 0v-15Z"/>`,
  chip: `<rect x="6" y="6" width="12" height="12" rx="1.5" fill="none" stroke-width="1.6"/><path d="M9 2.5v3M15 2.5v3M9 18.5v3M15 18.5v3M2.5 9h3M2.5 15h3M18.5 9h3M18.5 15h3" stroke-width="1.6"/>`,
  hand: `<path d="M7 22v-9a2 2 0 1 1 4 0v-3a2 2 0 1 1 4 0v1.4a2 2 0 1 1 4 0V16c0 3.3-2.2 6-6 6H10c-2 0-3.6-1-4.6-2.7l-2-3.4a1.7 1.7 0 0 1 2.8-1.9L7 19" fill="none" stroke-width="1.6"/>`,
  sun: `<circle cx="12" cy="12" r="4.5"/><path d="M12 1.5v3M12 19.5v3M1.5 12h3M19.5 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M19.1 4.9 17 7M7 17l-2.1 2.1" stroke-width="1.6" stroke-linecap="round"/>`,
};

function escapeXml(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

/** Renders a generated logo concept as a self-contained SVG badge. */
export function renderLogoSvg(concept: LogoConcept, size = 120): string {
  const iconMarkup = ICON_PATHS[concept.icon] ?? ICON_PATHS.sun;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 96 96" width="${size}" height="${size}">
<circle cx="48" cy="48" r="45" fill="${concept.primaryColor}" stroke="${concept.secondaryColor}" stroke-width="3" />
<g transform="translate(30,20) scale(1.5)" fill="${concept.secondaryColor}" stroke="${concept.secondaryColor}">${iconMarkup}</g>
<text x="48" y="80" text-anchor="middle" font-family="Georgia, serif" font-size="15" font-weight="700" fill="${concept.secondaryColor}">${escapeXml(concept.initials)}</text>
</svg>`;
}

export function svgToDataUrl(svgMarkup: string): string {
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svgMarkup)}`;
}

/** Fits any image (raster or SVG) into a square white-background PNG — a
 * normalized format safe to embed in a generated .pptx regardless of source. */
export function rasterizeImage(dataUrl: string, size = 512): Promise<string> {
  if (typeof window === "undefined") return Promise.reject(new Error("rasterizeImage requires a browser"));
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        reject(new Error("Canvas not supported"));
        return;
      }
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, size, size);
      const scale = Math.min(size / img.width, size / img.height);
      const w = img.width * scale;
      const h = img.height * scale;
      ctx.drawImage(img, (size - w) / 2, (size - h) / 2, w, h);
      resolve(canvas.toDataURL("image/png"));
    };
    img.onerror = () => reject(new Error("Failed to load image"));
    img.src = dataUrl;
  });
}

/** Normalizes whichever logo the holder has (uploaded or generated) into a
 * single embeddable PNG data URL, or null if there is no logo. */
export async function getLogoPngDataUrl(logo: LogoState | null, size = 512): Promise<string | null> {
  if (!logo) return null;
  if (logo.source === "uploaded" && logo.imageDataUrl) return rasterizeImage(logo.imageDataUrl, size);
  if (logo.source === "generated" && logo.concept) return rasterizeImage(svgToDataUrl(renderLogoSvg(logo.concept, 256)), size);
  return null;
}
