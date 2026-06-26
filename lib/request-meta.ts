import crypto from "crypto";

type HeaderReader = {
  get(name: string): string | null;
};

export type RequestMeta = {
  ip: string;
  userAgent: string;
};

function firstHeaderValue(value: string | null) {
  return value?.split(",")[0]?.trim() || "";
}

export function normalizeIp(value: string | null | undefined) {
  const raw = firstHeaderValue(value ?? null);

  if (!raw) return "unknown";
  if (raw.startsWith("[") && raw.includes("]")) return raw.slice(1, raw.indexOf("]")).toLowerCase();

  const withoutPort = /^\d{1,3}(?:\.\d{1,3}){3}:\d+$/.test(raw)
    ? raw.slice(0, raw.lastIndexOf(":"))
    : raw;

  return withoutPort.toLowerCase();
}

function hashPart(value: string) {
  return crypto.createHash("sha256").update(value).digest("hex").slice(0, 16);
}

export function getRequestMeta(headers: HeaderReader): RequestMeta {
  return {
    ip: normalizeIp(headers.get("x-forwarded-for") || headers.get("x-real-ip")),
    userAgent: headers.get("user-agent")?.trim() || "unknown",
  };
}

export function buildRateLimitKey(scope: string, meta: RequestMeta, identifier?: string | null) {
  const parts = [scope, meta.ip, hashPart(meta.userAgent)];

  if (identifier) {
    parts.push(hashPart(identifier.trim().toLowerCase()));
  }

  return parts.join(":");
}
