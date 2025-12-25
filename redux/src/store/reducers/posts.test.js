import { describe, expect, it } from "vitest";
import postsReducer, { fetchPosts, initialState, setError } from "./posts";

describe("posts", () => {
  it("should have correct initial state", () => {
    const newState = postsReducer(initialState, { type: "unknown" });
    expect(newState).toEqual({
      data: [],
      isLoading: false,
      error: null,
    });
  });

  it("should handle setError", () => {
    const newState = postsReducer(initialState, setError("Client error"));
    expect(newState).toEqual({
      data: [],
      isLoading: false,
      error: "Client error",
    });
  });

  it("should handle fetchPosts start", () => {
    const newState = postsReducer(initialState, { type: fetchPosts.pending });
    expect(newState).toEqual({
      data: [],
      isLoading: true,
      error: null,
    });
  });

  it("should handle fetchPosts success", () => {
    const newState = postsReducer(initialState, {
      type: fetchPosts.fulfilled,
      payload: [{ id: "1", name: "foo" }],
    });
    expect(newState).toEqual({
      data: [{ id: "1", name: "foo" }],
      isLoading: false,
      error: null,
    });
  });
});
