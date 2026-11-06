import { describe, expect, it } from "vitest";
import { formatDate, formatMonth, tripDuration } from "./format";

describe("travel date formatting", () => {
  it("derives the month in UTC so local time zones cannot move it to the previous month", () => {
    expect(formatMonth("2016-03-01")).toBe("March");
    expect(formatMonth("2025-01-01")).toBe("January");
  });

  it("keeps year and day boundaries intact", () => {
    expect(formatDate("2023-12-31")).toBe("Dec 31, 2023");
    expect(formatDate("2024-01-01")).toBe("Jan 1, 2024");
  });

  it("counts both the departure and return days", () => {
    expect(tripDuration("2025-06-01", "2025-06-01")).toBe(1);
    expect(tripDuration("2025-06-01", "2025-06-07")).toBe(7);
  });

  it("handles leap days and daylight-saving boundaries without losing a day", () => {
    expect(tripDuration("2024-02-28", "2024-03-01")).toBe(3);
    expect(tripDuration("2025-03-08", "2025-03-10")).toBe(3);
    expect(tripDuration("2025-11-01", "2025-11-03")).toBe(3);
  });
});
