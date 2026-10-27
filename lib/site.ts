const FALLBACK_SITE_URL = "http://localhost:3000";

export function getSiteUrl() {
  const raw = process.env.SITE_URL?.trim() || FALLBACK_SITE_URL;
  const withProtocol = /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;
  return withProtocol.replace(/\/$/, "");
}
