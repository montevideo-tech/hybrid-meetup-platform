import { vi, describe, test, expect } from "vitest";
import { screen, render } from "@testing-library/react";
import LandingPage from "./LandingPage";

vi.mock("react-router-dom");
describe("LandingPage", () => {
  render(LandingPage());
  test("Should render correctly first line of the title", () => {
    expect(screen.getByText("A hybrid event platform with")).toBeDefined();
  });
  test("Should render correctly secondly line of the title", () => {
    expect(screen.getByText("adaptable WebRTC providers")).toBeDefined();
  });
});
