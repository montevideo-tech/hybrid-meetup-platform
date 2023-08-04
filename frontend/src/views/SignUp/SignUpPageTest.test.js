import { vi, describe, test, expect } from "vitest";
import { screen, render } from "@testing-library/react";
import SignUp from "./SignUp";

vi.mock("react-router-dom");
describe("SignUp", () => {
  render(SignUp());
  test("Should render correctly Signup", () => {
    expect(screen.getByText("Create an Account")).toBeDefined();
  });
});
