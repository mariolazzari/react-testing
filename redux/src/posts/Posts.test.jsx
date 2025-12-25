import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import Posts from "./Posts";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import reducer from "../store/reducers";
import axios from "axios";
import userEvent from "@testing-library/user-event";

describe("Posts", () => {
  it("renders posts", async () => {
    const store = configureStore({ reducer });
    const mockResponse = {
      data: [{ id: "1", name: "foo" }],
    };
    vi.spyOn(axios, "get").mockResolvedValue(mockResponse);
    render(
      <Provider store={store}>
        <Posts />
      </Provider>
    );
    const posts = await screen.findAllByTestId("post");

    expect(posts).toHaveLength(1);
    expect(posts[0]).toHaveTextContent("foo");
  });

  it("renders an error", async () => {
    const store = configureStore({
      reducer,
      preloadedState: {
        posts: { data: [], error: "Server error", isLoading: false },
      },
    });
    const mockResponse = {
      data: [{ id: "1", name: "foo" }],
    };
    vi.spyOn(axios, "get").mockResolvedValue(mockResponse);
    render(
      <Provider store={store}>
        <Posts />
      </Provider>
    );
    const error = await screen.findByTestId("error");

    expect(error).toHaveTextContent("Server error");
  });

  it("triggers client error", async () => {
    const user = userEvent.setup();
    const store = configureStore({
      reducer,
    });
    vi.spyOn(store, "dispatch");
    render(
      <Provider store={store}>
        <Posts />
      </Provider>
    );
    const clientError = screen.getByTestId("client-error");
    await user.click(clientError);
    expect(store.dispatch).toHaveBeenCalledWith({
      payload: "Client error",
      type: "posts/setError",
    });
  });
});
