import { describe, expect, it } from "vitest";
import { trips } from "@fami-li/data";
import { groupTripsByYear } from "./timeline";
import { mergeAlbum } from "./album-storage";
describe("timeline years", () => {
  it("groups both 2017 trips under one label while preserving navigation indices", () => {
    const groups = groupTripsByYear(trips);
    expect(groups.map((group) => group.year)).toEqual([
      2016, 2017, 2018, 2023, 2025,
    ]);
    expect(
      groups
        .find((group) => group.year === 2017)
        ?.entries.map((entry) => [entry.trip.title, entry.index]),
    ).toEqual([
      ["South Africa", 1],
      ["Paris", 2],
    ]);
  });
  it("handles an empty collection without inventing a year", () => {
    expect(groupTripsByYear([])).toEqual([]);
  });
  it("adds new seed chapters without overwriting saved edits or creating duplicates", () => {
    const first = trips[0];
    if (!first) throw new Error("Test requires an Iceland fixture.");
    const edited = { ...first, title: "Our Iceland adventure" };
    const merged = mergeAlbum(
      [
        edited,
        ...trips.filter(
          (trip) => trip.slug !== first.slug && trip.title !== "Paris",
        ),
      ],
      trips,
    );
    expect(merged).toHaveLength(6);
    expect(merged[0]?.title).toBe("Our Iceland adventure");
    expect(merged.filter((trip) => trip.title === "Paris")).toHaveLength(1);
    expect(mergeAlbum(merged, trips)).toEqual(merged);
  });
});
