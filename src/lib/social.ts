/**
 * The social platforms a link can point at.
 *
 * One list for both the Studio's dropdown and the site's labels, so a platform
 * added here is selectable and correctly named at the same time. The Studio
 * schema imports this module, so it stays free of framework imports.
 */
export const SOCIAL_PLATFORMS = [
  { title: "LinkedIn", value: "linkedin" },
  { title: "Facebook", value: "facebook" },
  { title: "Instagram", value: "instagram" },
  { title: "X (Twitter)", value: "x" },
  { title: "YouTube", value: "youtube" },
  { title: "TikTok", value: "tiktok" },
  { title: "WhatsApp", value: "whatsapp" },
] as const;

/** The name the footer prints for a platform: "X", not "X (Twitter)". */
export function socialLabel(platform: string): string {
  const match = SOCIAL_PLATFORMS.find((entry) => entry.value === platform);
  return match ? match.title.replace(/\s*\(.*\)$/, "") : platform;
}
