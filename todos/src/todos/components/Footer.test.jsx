import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { TodosContext } from "../contexts/todos";
import Footer from "./Footer";
import userEvent from "@testing-library/user-event";

describe("Footer", () => {
  const mockDispatch = vi.fn();
  describe("component visibility", () => {
    it("should be hidden with no todos", () => {
      const state = {
        todos: [],
        filter: "all",
      };
      render(
        <TodosContext.Provider value={[state, mockDispatch, {}]}>
          <Footer />
        </TodosContext.Provider>
      );
      expect(screen.getByTestId("footer")).toHaveClass("hidden");
    });

    it("should be visible with todos", () => {
      const state = {
        todos: [{ id: "1", text: "foo", isCompleted: false }],
        filter: "all",
      };
      render(
        <TodosContext.Provider value={[state, mockDispatch, {}]}>
          <Footer />
        </TodosContext.Provider>
      );
      expect(screen.getByTestId("footer")).not.toHaveClass("hidden");
    });
  });

  describe("counters", () => {
    it("renders a counter for 1 todo", () => {
      const state = {
        todos: [{ id: "1", text: "foo", isCompleted: false }],
        filter: "all",
      };
      render(
        <TodosContext.Provider value={[state, mockDispatch, {}]}>
          <Footer />
        </TodosContext.Provider>
      );
      expect(screen.getByTestId("todoCount")).toHaveTextContent("1 item left");
    });

    it("renders a counter for 2 todo", () => {
      const state = {
        todos: [
          { id: "1", text: "foo", isCompleted: false },
          { id: "2", text: "bar", isCompleted: false },
        ],
        filter: "all",
      };
      render(
        <TodosContext.Provider value={[state, mockDispatch, {}]}>
          <Footer />
        </TodosContext.Provider>
      );
      expect(screen.getByTestId("todoCount")).toHaveTextContent("2 items left");
    });
  });

  describe("fiters", () => {
    it("highlights default filter", () => {
      const state = {
        todos: [{ id: "1", text: "foo", isCompleted: false }],
        filter: "all",
      };
      render(
        <TodosContext.Provider value={[state, mockDispatch, {}]}>
          <Footer />
        </TodosContext.Provider>
      );
      const filterLinks = screen.getAllByTestId("filterLink");
      expect(filterLinks[0]).toHaveClass("selected");
    });

    it("highlights changed filter", () => {
      const state = {
        todos: [{ id: "1", text: "foo", isCompleted: false }],
        filter: "active",
      };
      render(
        <TodosContext.Provider value={[state, mockDispatch, {}]}>
          <Footer />
        </TodosContext.Provider>
      );
      const filterLinks = screen.getAllByTestId("filterLink");
      expect(filterLinks[1]).toHaveClass("selected");
    });

    it("changes a filter", async () => {
      const mockChangeFilter = vi.fn();
      const user = userEvent.setup();
      const state = {
        todos: [{ id: "1", text: "foo", isCompleted: false }],
        filter: "all",
      };
      render(
        <TodosContext.Provider
          value={[state, mockDispatch, { changeFilter: mockChangeFilter }]}
        >
          <Footer />
        </TodosContext.Provider>
      );
      const filterLinks = screen.getAllByTestId("filterLink");
      await user.click(filterLinks[1]);
      expect(mockChangeFilter).toHaveBeenCalledWith("active");
    });
  });
});
