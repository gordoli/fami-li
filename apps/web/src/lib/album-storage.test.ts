import { describe, expect, it } from "vitest";
import { trips } from "@fami-li/data";
import { isTrip, loadAlbum, saveAlbum } from "./album-storage";

function sampleTrip() {
  const first = trips.at(0);
  if (!first) throw new Error("The mock album requires at least one trip.");
  return structuredClone(first);
}

describe("persisted album validation", () => {
  it.each(trips)("accepts complete mock data for $title", (trip) => {
    expect(isTrip(trip)).toBe(true);
  });

  it("rejects malformed structures before components consume them", () => {
    expect(isTrip(null)).toBe(false);
    expect(isTrip([])).toBe(false);
    expect(isTrip({ title: "Incomplete" })).toBe(false);
    expect(isTrip({ ...sampleTrip(), story: [null] })).toBe(false);
    expect(isTrip({ ...sampleTrip(), travelers: [42] })).toBe(false);
    expect(isTrip({ ...sampleTrip(), itinerary: [{ day: "1" }] })).toBe(false);
  });

  it("rejects a canonical date that would crash month formatting", () => {
    expect(isTrip({ ...sampleTrip(), date: "not-a-date" })).toBe(false);
  });

  it("rejects inconsistent date aliases and year metadata", () => {
    const trip = sampleTrip();
    expect(isTrip({ ...trip, date: "2025-06-01" })).toBe(false);
    expect(isTrip({ ...trip, year: trip.year + 1 })).toBe(false);
  });

  it("keeps an unpinned adventure available without inventing a location", () => {
    expect(isTrip({ ...sampleTrip(), coordinates: null })).toBe(true);
  });

  it("rejects invalid travel ranges and globe coordinates", () => {
    const trip = sampleTrip();
    expect(isTrip({ ...trip, startDate: "invalid" })).toBe(false);
    expect(isTrip({ ...trip, endDate: "1900-01-01" })).toBe(false);
    expect(isTrip({ ...trip, coordinates: [181, 0] })).toBe(false);
    expect(isTrip({ ...trip, coordinates: [0, -91] })).toBe(false);
    expect(isTrip({ ...trip, coordinates: [NaN, 0] })).toBe(false);
    expect(isTrip({ ...trip, coordinates: [0] })).toBe(false);
  });

  it("requires the cover to match a safe photograph", () => {
    const trip = sampleTrip();
    expect(isTrip({ ...trip, photos: [] })).toBe(false);
    expect(isTrip({ ...trip, cover: "/images/not-in-the-gallery.jpg" })).toBe(
      false,
    );
    expect(
      isTrip({ ...trip, cover_photo: "/images/a-different-cover.jpg" }),
    ).toBe(false);
    const photos = trip.photos.map((photo) => ({
      ...photo,
      src: "https://unexpected.example/tracker.jpg",
    }));
    expect(
      isTrip({
        ...trip,
        photos,
        cover: photos[0]?.src,
        cover_photo: photos[0]?.src,
      }),
    ).toBe(false);
  });

  it("accepts uploaded image data URLs while rejecting executable formats", () => {
    const trip = sampleTrip();
    const photo = trip.photos[0];
    if (!photo) throw new Error("The sample trip requires a photo.");
    const src = "data:image/jpeg;base64,/9j/2Q==";
    expect(
      isTrip({
        ...trip,
        photos: [{ ...photo, src }],
        cover: src,
        cover_photo: src,
      }),
    ).toBe(true);
    const svg = "data:image/svg+xml;base64,PHN2Zz48L3N2Zz4=";
    expect(
      isTrip({
        ...trip,
        photos: [{ ...photo, src: svg }],
        cover: svg,
        cover_photo: svg,
      }),
    ).toBe(false);
  });

  it("reports unavailable browser storage through rejected promises", async () => {
    await expect(loadAlbum()).rejects.toThrow();
    await expect(saveAlbum(trips)).rejects.toThrow();
  });
});
