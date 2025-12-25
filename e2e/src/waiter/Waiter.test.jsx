import { act, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import Waiter from "./Waiter";

describe("Waiter", () => {
  beforeEach(() => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("renders corrent result", async () => {
    render(<Waiter />);
    act(() => {
      vi.advanceTimersByTime(2000);
    });
    const waiter = await screen.findByTestId("waiter");
    expect(waiter).toHaveTextContent("passed");
  });
});
