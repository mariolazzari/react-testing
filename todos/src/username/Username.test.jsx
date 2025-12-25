import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import Username from "./Username";
import userEvent from "@testing-library/user-event";

describe("Username", () => {
  it("renders default empty text", () => {
    render(<Username />);
    expect(screen.getByTestId("username")).toHaveTextContent("");
  });

  it("renders changed username with button", async () => {
    const user = userEvent.setup();
    render(<Username />);
    await user.click(screen.getByTestId("button"));
    expect(screen.getByTestId("username")).toHaveTextContent("bar");
  });

  it("renders changed username with input", async () => {
    const user = userEvent.setup();
    render(<Username />);
    const usernameInput = screen.getByTestId("usernameInput");
    await user.type(usernameInput, "foo");
    expect(screen.getByTestId("username")).toHaveTextContent("foo");
  });
});
