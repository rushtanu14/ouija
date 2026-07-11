const defaultAllowedOrigins = [
  "https://ouija-olive.vercel.app",
  "http://127.0.0.1:5188"
];

export function isAllowedOrigin(origin: string | undefined, configured = process.env.OUIJA_ALLOWED_ORIGIN) {
  if (!origin) return true;
  const extraOrigins = (configured ?? "")
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean);
  return new Set([...defaultAllowedOrigins, ...extraOrigins]).has(origin);
}

export function readRequestHeader(
  headers: Record<string, string | string[] | undefined> | undefined,
  name: string
) {
  const value = headers?.[name] ?? headers?.[name.toLowerCase()];
  return Array.isArray(value) ? value[0] : value;
}

export function requestClientKey(headers: Record<string, string | string[] | undefined> | undefined) {
  const forwarded = readRequestHeader(headers, "x-forwarded-for");
  return forwarded?.split(",")[0]?.trim() || "unknown";
}

export const apiAllowedHeaders = "Content-Type, Authorization";
