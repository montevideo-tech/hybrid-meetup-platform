import { vi, describe, test, expect } from "vitest";
import { epochToISO8601 } from "../time";

vi.mock("react-hook-form");
describe("time utils", () => {
  test("Should convert epoch timestamp to ISO8601 formatted string", () => {
    // Example epoch timestamp: 1628083200000 corresponds to 2021-08-04T12:00:00.000Z
    const timestamp = 1628083200000;
    const result = epochToISO8601(timestamp);
    // Expect the result to be '2021-08-04 13:00:00.000+00'
    expect(result).toBe("2021-08-04 13:20:00.000+00");
  });
});
