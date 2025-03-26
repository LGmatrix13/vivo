import { IRAOnDuty } from "~/models/shifts";

export function haversine(
  lata: number,
  longa: number,
  latb: number,
  longb: number
): number {
  const R = 6371; // Radius of the Earth in km
  const toRadians = (deg: number) => (deg * Math.PI) / 180;
  const dlat = toRadians(latb - lata);
  const dlon = toRadians(longb - longa);
  const a =
    Math.sin(dlat / 2) ** 2 +
    Math.cos(toRadians(lata)) *
      Math.cos(toRadians(latb)) *
      Math.sin(dlon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export function locataionSort(
  items: IRAOnDuty[],
  lat: number,
  long: number
): IRAOnDuty[] {
  return [...items].sort((a, b) => {
    const distanceA = haversine(lat, long, a.latitude, a.longitude);
    const distanceB = haversine(lat, long, b.latitude, b.longitude);
    return distanceA - distanceB;
  });
}
