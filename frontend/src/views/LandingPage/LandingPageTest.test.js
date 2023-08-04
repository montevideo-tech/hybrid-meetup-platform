import { vi, describe, test, expect } from "vitest";
import { screen, render } from "@testing-library/react";
import LandingPage from "./LandingPage";

vi.mock("react-router-dom");
describe("LandingPage Test", () => {
  render(LandingPage());
  test("Render landing page first line", () => {
    expect(screen.getByText("A hybrid event platform with")).toBeDefined();
  });
  test("Rendender landing page second line", () => {
    expect(screen.getByText("adaptable WebRTC providers")).toBeDefined();
  });
});
