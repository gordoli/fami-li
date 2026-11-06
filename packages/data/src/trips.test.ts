import { existsSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { getTrip, mockTripRepository, trips } from "./index";

describe("mock trip collection", () => {
  it("contains the five requested adventures in chronological order", () => {
    expect(trips).toHaveLength(5);
    expect(trips.at(0)?.year).toBe(2016);
    expect(trips.at(-1)?.year).toBe(2025);
    expect(trips.map((trip) => [trip.title, trip.year])).toEqual([
      ["Iceland", 2016],
      ["South Africa", 2017],
      ["China", 2018],
      ["Wimbledon", 2023],
      ["Greece", 2025],
    ]);
    expect(trips.map((trip) => trip.year)).toEqual(
      trips.map((trip) => trip.year).toSorted((left, right) => left - right),
    );
    expect(new Set(trips.map((trip) => trip.slug)).size).toBe(trips.length);
  });

  it.each(trips)(
    "provides complete, local gallery content for $title",
    (trip) => {
      expect(Date.parse(trip.startDate)).toBeLessThanOrEqual(
        Date.parse(trip.endDate),
      );
      expect(new Date(trip.startDate).getUTCFullYear()).toBe(trip.year);
      expect(trip.date).toBe(trip.startDate);
      expect(trip.cover_photo).toBe(trip.cover);
      expect(trip.city.length).toBeGreaterThan(0);
      expect(trip.notes.length).toBeGreaterThan(0);
      expect(trip.travelers.length).toBeGreaterThan(0);
      expect(trip.story.length).toBeGreaterThanOrEqual(2);
      expect(trip.itinerary.length).toBeGreaterThanOrEqual(3);
      if (!trip.coordinates) throw new Error("Mock trips require globe pins.");
      expect(trip.coordinates[0]).toBeGreaterThanOrEqual(-180);
      expect(trip.coordinates[0]).toBeLessThanOrEqual(180);
      expect(trip.coordinates[1]).toBeGreaterThanOrEqual(-90);
      expect(trip.coordinates[1]).toBeLessThanOrEqual(90);
      expect(trip.photos.length).toBeGreaterThanOrEqual(3);
      expect(new Set(trip.photos.map((photo) => photo.id)).size).toBe(
        trip.photos.length,
      );
      for (const photo of trip.photos) {
        expect(photo.title.length).toBeGreaterThan(0);
        expect(photo.caption.length).toBeGreaterThan(0);
        expect(photo.alt.length).toBeGreaterThan(0);
        expect(photo.location.length).toBeGreaterThan(0);
      }
      for (const src of [
        trip.cover,
        ...trip.photos.map((photo) => photo.src),
      ]) {
        const file = fileURLToPath(
          new URL(`../../../apps/web/public${src}`, import.meta.url),
        );
        expect(existsSync(file), src).toBe(true);
        expect(readFileSync(file).subarray(0, 2)).toEqual(
          Buffer.from([0xff, 0xd8]),
        );
      }
    },
  );

  it("finds trips by slug and leaves unknown slugs unresolved", () => {
    expect(getTrip("iceland")?.title).toBe("Iceland");
    expect(getTrip("south-africa")?.country).toBe("South Africa");
    expect(getTrip("not-a-trip")).toBeUndefined();
    expect(getTrip("")).toBeUndefined();
  });

  it("exposes the same collection through the async repository contract", async () => {
    await expect(mockTripRepository.list()).resolves.toEqual(trips);
    await expect(mockTripRepository.get("iceland")).resolves.toEqual(
      getTrip("iceland"),
    );
    await expect(mockTripRepository.get("not-a-trip")).resolves.toBeUndefined();
  });
});
