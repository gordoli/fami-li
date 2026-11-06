import type { Trip, Photo } from "@fami-li/data";
const DATABASE_NAME = "fami-li-album";
const STORE_NAME = "album";
const ALBUM_KEY = "adventures-v1";

function openAlbumDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DATABASE_NAME, 1);
    request.onupgradeneeded = () => {
      request.result.createObjectStore(STORE_NAME);
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
    request.onblocked = () =>
      reject(new Error("Close other album tabs to update browser storage."));
  });
}
function isIsoDate(value: unknown): value is string {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value))
    return false;
  const parsed = new Date(value);
  return (
    Number.isFinite(parsed.getTime()) &&
    parsed.toISOString().slice(0, 10) === value
  );
}
function isPhoto(value: unknown): value is Photo {
  if (!value || typeof value !== "object") return false;
  const photo = value as Record<string, unknown>;
  return (
    ["id", "src", "alt", "title", "caption", "location"].every(
      (key) => typeof photo[key] === "string",
    ) &&
    typeof photo.src === "string" &&
    (photo.src.startsWith("/images/") ||
      /^data:image\/(jpeg|png|webp|avif);base64,/.test(photo.src))
  );
}
/** Validate persisted browser data before it enters rendering or date formatting. */
export function isTrip(value: unknown): value is Trip {
  if (!value || typeof value !== "object") return false;
  const trip = value as Record<string, unknown>;
  const strings = [
    "slug",
    "title",
    "subtitle",
    "country",
    "city",
    "continent",
    "startDate",
    "endDate",
    "date",
    "notes",
    "cover",
    "cover_photo",
    "coverAlt",
    "accent",
  ];
  return (
    strings.every((key) => typeof trip[key] === "string") &&
    typeof trip.year === "number" &&
    Number.isFinite(trip.year) &&
    isIsoDate(trip.date) &&
    trip.date === trip.startDate &&
    trip.year === Number(trip.date.slice(0, 4)) &&
    isIsoDate(trip.endDate) &&
    typeof trip.startDate === "string" &&
    Number.isFinite(Date.parse(trip.startDate)) &&
    typeof trip.endDate === "string" &&
    Date.parse(trip.endDate) >= Date.parse(String(trip.startDate)) &&
    (trip.coordinates === null ||
      (Array.isArray(trip.coordinates) &&
        trip.coordinates.length === 2 &&
        trip.coordinates.every(
          (item) => typeof item === "number" && Number.isFinite(item),
        ) &&
        Math.abs(trip.coordinates[0]) <= 180 &&
        Math.abs(trip.coordinates[1]) <= 90)) &&
    Array.isArray(trip.travelers) &&
    trip.travelers.every((item) => typeof item === "string") &&
    Array.isArray(trip.story) &&
    trip.story.every((item) => typeof item === "string") &&
    Array.isArray(trip.photos) &&
    trip.photos.length > 0 &&
    trip.photos.every(isPhoto) &&
    trip.photos.some(
      (photo) => photo.src === trip.cover && trip.cover_photo === trip.cover,
    ) &&
    Array.isArray(trip.itinerary) &&
    trip.itinerary.every(
      (stop) =>
        stop &&
        typeof stop === "object" &&
        ["day", "title", "description"].every(
          (key) => typeof stop[key] === "string",
        ),
    )
  );
}
export async function loadAlbum(): Promise<Trip[] | null> {
  const database = await openAlbumDatabase();
  try {
    return await new Promise((resolve, reject) => {
      const request = database
        .transaction(STORE_NAME, "readonly")
        .objectStore(STORE_NAME)
        .get(ALBUM_KEY);
      request.onsuccess = () => {
        const saved: unknown = request.result;
        if (saved === undefined) {
          resolve(null);
          return;
        }
        if (!Array.isArray(saved) || !saved.every(isTrip)) {
          reject(new Error("The saved album format could not be read."));
          return;
        }
        resolve(saved);
      };
      request.onerror = () => reject(request.error);
    });
  } finally {
    database.close();
  }
}
export async function saveAlbum(trips: readonly Trip[]): Promise<void> {
  const database = await openAlbumDatabase();
  try {
    await new Promise<void>((resolve, reject) => {
      const transaction = database.transaction(STORE_NAME, "readwrite");
      transaction.objectStore(STORE_NAME).put(trips, ALBUM_KEY);
      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject(transaction.error);
      transaction.onabort = () =>
        reject(transaction.error ?? new Error("Browser storage is full."));
    });
  } finally {
    database.close();
  }
}

/** Add new mock chapters after updates without replacing this browser's edited trips. */
export function mergeAlbum(
  saved: readonly Trip[],
  seedTrips: readonly Trip[],
): Trip[] {
  const savedSlugs = new Set(saved.map((trip) => trip.slug));
  return [
    ...saved,
    ...seedTrips.filter((trip) => !savedSlugs.has(trip.slug)),
  ].sort((a, b) => a.date.localeCompare(b.date));
}
