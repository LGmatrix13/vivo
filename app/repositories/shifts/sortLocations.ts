export type OnDutyRA = {
    zoneId: number;
    date: string;
    name: string;
    email: string;
    phoneNumber: string | null;
    room: string;
    buildingId: number;
    latitude: number | null;
    longitude: number | null;
};

function haversine(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // Radius of the Earth in km
    const toRadians = (deg: number) => (deg * Math.PI) / 180;
    const dlat = toRadians(lat2 - lat1);
    const dlon = toRadians(lon2 - lon1);
    const a = Math.sin(dlat / 2) ** 2 + Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) * Math.sin(dlon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}

export function sortByDistance(items: OnDutyRA[], refLat: number, refLon: number): OnDutyRA[] {
    return items.sort((a, b) => {
        const distanceA = haversine(refLat, refLon, a.latitude?? 0, a.longitude ?? 0);
        const distanceB = haversine(refLat, refLon, b.latitude ?? 0, b.longitude ?? 0);
        return distanceA - distanceB;
    });
}

