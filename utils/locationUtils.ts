export function getDistanceMeters(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371000;
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export function formatCoords(lat: number, lon: number): string {
  return `${lat.toFixed(5)}, ${lon.toFixed(5)}`;
}

export function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const distanceMeters = getDistanceMeters(lat1, lon1, lat2, lon2);
  return distanceMeters / 1000; // Convertir a kilómetros
}
