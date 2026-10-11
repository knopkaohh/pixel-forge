export type GeoPlace = { country: string; city: string };

const LOCAL: GeoPlace = { country: "Локально", city: "" };

function isPrivate(ip: string) {
  return !ip
    || ip === "127.0.0.1"
    || ip === "::1"
    || ip.startsWith("10.")
    || ip.startsWith("192.168.")
    || ip.startsWith("172.16.")
    || ip.startsWith("172.17.")
    || ip.startsWith("172.18.")
    || ip.startsWith("172.19.")
    || ip.startsWith("172.2")
    || ip.startsWith("172.30.")
    || ip.startsWith("172.31.")
    || ip.startsWith("::ffff:127.");
}

export function clientIp(request: Request) {
  const headers = request.headers;
  const forwarded = headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  return forwarded
    || headers.get("cf-connecting-ip")
    || headers.get("x-real-ip")
    || headers.get("x-forwarded-host")
    || "";
}

export function geoFromHeaders(request: Request): GeoPlace | null {
  const country = request.headers.get("cf-ipcountry") || request.headers.get("x-vercel-ip-country");
  if (!country || country === "XX" || country === "T1") return null;
  const city = request.headers.get("cf-ipcity") || request.headers.get("x-vercel-ip-city") || "";
  return { country, city: city ? decodeURIComponent(city) : "" };
}

export async function lookupGeo(ip: string, cached?: GeoPlace): Promise<GeoPlace> {
  if (cached) return cached;
  if (isPrivate(ip)) return LOCAL;
  try {
    const response = await fetch(`http://ip-api.com/json/${encodeURIComponent(ip)}?fields=status,country,city&lang=ru`, {
      signal: AbortSignal.timeout(2500),
    });
    const data = await response.json() as { status?: string; country?: string; city?: string };
    if (data.status !== "success" || !data.country) return { country: "Неизвестно", city: "" };
    return { country: data.country, city: data.city || "" };
  } catch {
    return { country: "Неизвестно", city: "" };
  }
}

export function placeLabel(place: GeoPlace) {
  return place.city ? `${place.country}, ${place.city}` : place.country || "Неизвестно";
}
