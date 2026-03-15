export type NearbyPlaceType = 'pharmacy' | 'hospital';

export interface GeoPosition {
  lat: number;
  lng: number;
  accuracy?: number;
}

export async function getCurrentGeoPosition(options?: { timeoutMs?: number }): Promise<GeoPosition> {
  const timeoutMs = options?.timeoutMs ?? 8000;
  if (typeof window === 'undefined') throw new Error('no_window');
  if (!('geolocation' in navigator)) throw new Error('geolocation_unavailable');

  return await new Promise<GeoPosition>((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        resolve({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          accuracy: pos.coords.accuracy
        });
      },
      (err) => reject(err),
      { enableHighAccuracy: true, timeout: timeoutMs, maximumAge: 30_000 }
    );
  });
}

export function buildNearbyQuery(params: { type: NearbyPlaceType; locale: 'en' | 'zh'; medicineName?: string }): string {
  const base = params.type === 'pharmacy'
    ? (params.locale === 'zh' ? '药店' : 'pharmacy')
    : (params.locale === 'zh' ? '医院' : 'hospital');

  const med = params.medicineName?.trim();
  if (!med) return params.locale === 'zh' ? `附近${base}` : `${base} near me`;
  return params.locale === 'zh' ? `${med} 附近${base}` : `${base} near me ${med}`;
}

export function buildGoogleMapsSearchUrl(query: string, pos?: GeoPosition): string {
  const q = encodeURIComponent(query);
  if (pos) {
    return `https://www.google.com/maps/search/${q}/@${pos.lat},${pos.lng},14z`;
  }
  return `https://www.google.com/maps/search/?api=1&query=${q}`;
}

export function buildAppleMapsSearchUrl(query: string, pos?: GeoPosition): string {
  const q = encodeURIComponent(query);
  if (pos) {
    return `https://maps.apple.com/?q=${q}&ll=${pos.lat},${pos.lng}`;
  }
  return `https://maps.apple.com/?q=${q}`;
}

export async function openNearbyInMaps(params: {
  type: NearbyPlaceType;
  locale: 'en' | 'zh';
  medicineName?: string;
  prefer?: 'google' | 'apple';
}): Promise<void> {
  const query = buildNearbyQuery({ type: params.type, locale: params.locale, medicineName: params.medicineName });

  let pos: GeoPosition | undefined;
  try {
    pos = await getCurrentGeoPosition();
  } catch {
    pos = undefined;
  }

  const url = params.prefer === 'apple' ? buildAppleMapsSearchUrl(query, pos) : buildGoogleMapsSearchUrl(query, pos);
  window.open(url, '_blank', 'noopener,noreferrer');
}

