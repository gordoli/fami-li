/** Supabase-shaped contracts for the planned Postgres schema; no live client is configured. */
export interface AdventureRow {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  country: string;
  city: string;
  continent: string;
  date: string;
  end_date: string;
  notes: string;
  story: string[];
  travelers: string[];
  longitude: number | null;
  latitude: number | null;
  cover_photo: string;
  cover_alt: string;
  accent: string;
}

export interface PhotoRow {
  id: string;
  adventure_id: string;
  title: string;
  src: string;
  alt: string;
  caption: string;
  location: string;
  position: number;
}

export interface ItineraryStopRow {
  id: string;
  adventure_id: string;
  day: string;
  title: string;
  description: string;
  position: number;
}

type Table<Row extends { id: string }, Relationships extends unknown[]> = {
  Row: Row;
  Insert: Omit<Row, "id"> & { id?: string };
  Update: Partial<Row>;
  Relationships: Relationships;
};

type AdventureRelationship<ForeignKeyName extends string> = {
  foreignKeyName: ForeignKeyName;
  columns: ["adventure_id"];
  isOneToOne: false;
  referencedRelation: "adventures";
  referencedColumns: ["id"];
};

export type Database = {
  public: {
    Tables: {
      adventures: Table<AdventureRow, []>;
      photos: Table<
        PhotoRow,
        [AdventureRelationship<"photos_adventure_id_fkey">]
      >;
      itinerary_stops: Table<
        ItineraryStopRow,
        [AdventureRelationship<"itinerary_stops_adventure_id_fkey">]
      >;
    };
    Views: Record<never, never>;
    Functions: Record<never, never>;
    Enums: Record<never, never>;
    CompositeTypes: Record<never, never>;
  };
};
