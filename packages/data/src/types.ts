export interface Photo {
  id: string;
  title: string;
  src: string;
  alt: string;
  caption: string;
  location: string;
}

export interface ItineraryStop {
  day: string;
  title: string;
  description: string;
}

export interface Trip {
  slug: string;
  title: string;
  subtitle: string;
  country: string;
  city: string;
  continent: string;
  year: number;
  notes: string;
  /** The database-facing date alias always matches startDate. */
  date: string;
  startDate: string;
  endDate: string;
  travelers: string[];
  /** Geographic coordinates always use longitude, latitude order. */
  coordinates: [longitude: number, latitude: number] | null;
  cover: string;
  /** The database-facing photo alias always matches cover. */
  cover_photo: string;
  coverAlt: string;
  accent: string;
  story: string[];
  itinerary: ItineraryStop[];
  photos: Photo[];
}

export interface TripRepository {
  list(): Promise<Trip[]>;
  get(slug: string): Promise<Trip | undefined>;
}
