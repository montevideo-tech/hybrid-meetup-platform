import { describe, test, expect } from "vitest";
import { render } from "@testing-library/react";
import LandingPage from "./LandingPage";

describe("LandingPage Test", () => {
  test("Render landing page", () => {
    render(LandingPage());
    expect(
      screen.getByText(
        "A hybrid event platform withadaptable WebRTC providers",
      ),
    ).toBeDefined();
  });
});
