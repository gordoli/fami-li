import type { Trip } from "@fami-li/data";
export type TimelineYear = {
  year: number;
  entries: { trip: Trip; index: number }[];
};
/** Preserve chronological trip order while showing each year label only once. */
export function groupTripsByYear(trips: readonly Trip[]): TimelineYear[] {
  const groups = new Map<number, TimelineYear>();
  trips.forEach((trip, index) => {
    const group = groups.get(trip.year) ?? { year: trip.year, entries: [] };
    group.entries.push({ trip, index });
    groups.set(trip.year, group);
  });
  return [...groups.values()];
}
