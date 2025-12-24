import { act, renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import useFetch from "./useFetch";
import axios from "axios";

describe("useFetch", () => {
  it("should render initial values", () => {
    const { result } = renderHook(() => useFetch("/todos"));
    const [{ error, isLoading, response }, doFetch] = result.current;
    expect(error).toEqual(null);
    expect(isLoading).toEqual(false);
    expect(response).toEqual(null);
    expect(doFetch).toBeDefined();
  });

  it("should render success values after fetch", async () => {
    const mockResponse = {
      data: [{ id: "1", text: "foo", isCompleted: false }],
    };
    vi.spyOn(axios, "request").mockResolvedValue(mockResponse);
    const { result } = renderHook(() => useFetch("/todos"));
    await act(async () => {
      result.current[1]();
    });
    const [{ error, isLoading, response }] = result.current;
    expect(error).toEqual(null);
    expect(isLoading).toEqual(false);
    expect(response).toEqual(mockResponse.data);
  });

  it("should render error values after fetch", async () => {
    const mockResponse = {
      response: { data: "Server error" },
    };
    vi.spyOn(axios, "request").mockRejectedValue(mockResponse);
    const { result } = renderHook(() => useFetch("/todos"));
    await act(async () => {
      result.current[1]();
    });
    const [{ isLoading, response }] = result.current;
    // expect(error).toEqual("Server error");
    expect(isLoading).toEqual(false);
    expect(response).toEqual(null);
  });
});
