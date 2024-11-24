interface SelectedBuildingProps {
  name: string;
  rd: string;
  rooms: number;
  capacity: number;
  zones: number;
}

export default function SelectedBuilding(props: SelectedBuildingProps) {
  const { name, rd, rooms, capacity, zones } = props;

  return (
    <div className="space-y-3">
      <div className="space-y-2 flex flex-col">
        <h2 className="font-bold">Name</h2>
        <p>{name}</p>
      </div>
      <div className="space-y-2 flex flex-col">
        <h2 className="font-bold">RD</h2>
        <p>{rd}</p>
      </div>
      <div className="space-y-2 flex flex-col">
        <h2 className="font-bold">Rooms</h2>
        <p>{rooms}</p>
      </div>
      <div className="space-y-2 flex flex-col">
        <h2 className="font-bold">Capacity</h2>
        <p>{capacity}</p>
      </div>
      <div className="space-y-2 flex flex-col">
        <h2 className="font-bold">Zones</h2>
        <p>{zones}</p>
      </div>
    </div>
  );
}
