import { trips } from "./trips";
import type { Trip, TripRepository } from "./types";

export { trips } from "./trips";
export type { ItineraryStop, Photo, Trip, TripRepository } from "./types";
export type {
  AdventureRow,
  Database,
  ItineraryStopRow,
  PhotoRow,
} from "./database";

export function getTrip(slug: string): Trip | undefined {
  return trips.find((trip) => trip.slug === slug);
}

/** Swap this implementation for Supabase without changing album components. */
export const mockTripRepository: TripRepository = {
  async list() {
    return trips;
  },
  async get(slug) {
    return getTrip(slug);
  },
};
