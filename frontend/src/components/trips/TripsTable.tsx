import type { Trip } from "../../api/tripsApi";
import { StatusBadge } from "../ui/Badge";

type TripsTableProps = {
  trips: Trip[];
  onRowClick: (tripId: string) => void;
};

export function TripsTable({ trips, onRowClick }: TripsTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-[900px] w-full text-sm">
        <thead className="sticky top-0 z-10 border-b bg-gray-50">
          <tr>
            <th className="p-3 text-left font-semibold text-gray-600">Trip #</th>
            <th className="p-3 text-left font-semibold text-gray-600">Client</th>
            <th className="p-3 text-left font-semibold text-gray-600">Pickup Time</th>
            <th className="p-3 text-left font-semibold text-gray-600">Pickup</th>
            <th className="p-3 text-left font-semibold text-gray-600">Destination</th>
            <th className="p-3 text-left font-semibold text-gray-600">Passengers</th>
            <th className="p-3 text-left font-semibold text-gray-600">Status</th>
            <th className="p-3 text-left font-semibold text-gray-600">Duplicate</th>
          </tr>
        </thead>

        <tbody>
          {trips.map((trip) => (
            <tr
              key={trip.id}
              onClick={() => onRowClick(trip.id)}
              className="cursor-pointer border-b transition hover:bg-gray-50 last:border-b-0"
            >
              <td className="p-3 font-medium">{trip.tripNumber}</td>
              <td className="p-3">{trip.client.name}</td>
              <td className="p-3">{new Date(trip.pickupDateTime).toLocaleString()}</td>
              <td className="p-3">{trip.pickupLocation}</td>
              <td className="p-3">{trip.destination}</td>
              <td className="p-3">{trip.passengerCount}</td>
              <td className="p-3">
                <StatusBadge status={trip.status} />
              </td>
              <td className="p-3">
                {trip.duplicateWarning ? (
                  <span className="rounded-full bg-yellow-100 px-2 py-1 text-xs font-semibold text-yellow-800">
                    Yes
                  </span>
                ) : (
                  <span className="text-gray-400">No</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}