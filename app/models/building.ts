export interface IBuilding {
  id: number;
  rd: string;
  name: string;
  rdFirstName: string;
  rdLastName: string;
  lastName: string;
  rooms: number;
  zones: number;
  capacity: string | null;
  latitude: number;
  longitude: number;
}
