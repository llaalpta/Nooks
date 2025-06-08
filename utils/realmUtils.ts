export function formatArea(radio: number): string {
  const area = Math.PI * Math.pow(radio, 2);

  if (area < 10000) {
    return `${area.toFixed(2)} m²`;
  } else if (area < 1000000) {
    const hectareas = area / 10000;
    return `${hectareas.toFixed(2)} ha`;
  } else {
    const km2 = area / 1000000;
    return `${km2.toFixed(2)} km²`;
  }
}
