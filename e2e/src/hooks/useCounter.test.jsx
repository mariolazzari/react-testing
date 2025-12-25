import { describe, expect, it } from "vitest";
import useCounter from "./useCounter";
import { act, renderHook } from "@testing-library/react";

describe("useCounter", () => {
  it("should render initial count", () => {
    const { result } = renderHook(() => useCounter());
    expect(result.current.count).toEqual(0);
  });

  it("should render initial count", () => {
    const { result } = renderHook(() => useCounter(10));
    expect(result.current.count).toEqual(10);
  });

  it("should increment the count", () => {
    const { result } = renderHook(() => useCounter());
    act(() => {
      result.current.increment();
    });
    expect(result.current.count).toEqual(1);
  });
});
