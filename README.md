# React testing

## Introduction

### Setup

[Vite](https://vite.dev/)

```sh
pnpm create vite@latest
```

## Unit testing

### What is unit testing?

Unit testing is a software testing method where you test individual units of code—usually small pieces like functions, methods, or classes—to make sure they work correctly on their own.

### Vitest setup

[Vitest](https://vitest.dev/)
[Testing lib](https://testing-library.com/docs/react-testing-library/intro/)

```sh
pnpm add -D vitest jsdom @testing-library/jest-dom @testing-library/react @testing-library/user-event
```

```ts
// vite.config.ts
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./tests/setup.ts",
  },
});
```

```ts
// tests/setup.ts
import { afterEach, vi } from "vitest";
import { cleanup } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});
```

### Testing utilities and helpers

```ts
import { describe, expect, it } from "vitest";
import { range } from "../src/utils";

describe("utils", () => {
  describe("range", () => {
    it("returns correct result from 1-6 range", () => {
      const result = range(1, 6);
      expect(result).toEqual([1, 2, 3, 4, 5]);
    });

    it("returns correct result from 41-45 range", () => {
      const result = range(41, 45);
      expect(result).toEqual([41, 42, 43, 44]);
    });
  });
});
```

### Testing simple component

```ts
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import ErrorMessage from "./ErrorMessage";

describe("ErrorMessage", () => {
  it("renders default error state", () => {
    render(<ErrorMessage />);
    expect(screen.getByTestId("message-container")).toHaveTextContent(
      "Something went wrong"
    );
  });

  it("renders custom error state", () => {
    render(<ErrorMessage message="Email is already taken" />);
    expect(screen.getByTestId("message-container")).toHaveTextContent(
      "Email is already taken"
    );
  });
});
```

### Testing inputs & outputs

```ts
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import Pagination from "./Pagination";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";

describe("Pagination", () => {
  it("renders correct pagination", () => {
    render(<Pagination total={50} limit={10} currentPage={1} />);
    const pageContainers = screen.getAllByTestId("page-container");
    expect(pageContainers).toHaveLength(5);
    expect(pageContainers[0]).toHaveTextContent("1");
  });

  it("should emit clicked page", async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();
    render(
      <Pagination
        total={50}
        limit={10}
        currentPage={1}
        selectPage={handleClick}
      />
    );
    const pageContainers = screen.getAllByTestId("page-container");
    await user.click(pageContainers[0]);
    expect(handleClick).toHaveBeenCalledWith(1);
  });
});
```

### Mock and Spy functions

```ts
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import Pagination from "./Pagination";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";

vi.mock("../utils", () => {
  return {
    range: () => [1, 2, 3, 4, 5],
  };
});

describe("Pagination", () => {
  it("renders correct pagination", () => {
    render(<Pagination total={50} limit={10} currentPage={1} />);
    const pageContainers = screen.getAllByTestId("page-container");
    expect(pageContainers).toHaveLength(5);
    expect(pageContainers[0]).toHaveTextContent("1");
  });

  it("should emit clicked page", async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();
    render(
      <Pagination
        total={50}
        limit={10}
        currentPage={1}
        selectPage={handleClick}
      />
    );
    const pageContainers = screen.getAllByTestId("page-container");
    await user.click(pageContainers[0]);
    expect(handleClick).toHaveBeenCalledWith(1);
  });
});
```

### Testing useState

```ts
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
```

### Testing useEffect

```sh
pnpm add -D msw
```

```ts
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import Tags from "./Tags";
import axios from "axios";

describe("Tags", () => {
  it("renders tags", async () => {
    const mockResponse = {
      data: [{ id: "1", name: "bar" }],
    };
    vi.spyOn(axios, "get").mockResolvedValue(mockResponse);
    render(<Tags />);
    const tags = await screen.findAllByTestId("tag");
    expect(tags).toHaveLength(1);
    expect(tags[0]).toHaveTextContent("bar");
  });
});
```

### Testing custom hook

```ts
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
```

### Testing complex hooks

```js
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
    const [{ error, isLoading, response }] = result.current;
    expect(error).toEqual("Server error");
    expect(isLoading).toEqual(false);
    expect(response).toEqual(null);
  });
});
```

### Testing context

```js
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import {
  TodosContext,
  TodosProvider,
  addTodo,
  initialState,
  reducer,
} from "./todos";
import { useContext, useEffect } from "react";
import axios from "axios";

describe("TodosProvider", () => {
  it("addTodo", async () => {
    const mockResponse = {
      data: { id: "1", text: "foo", isCompleted: false },
    };
    vi.spyOn(axios, "post").mockResolvedValue(mockResponse);
    const TestComponent = () => {
      const [todosState, , { addTodo }] = useContext(TodosContext);
      useEffect(() => {
        addTodo({ text: "foo", isCompleted: false });
      }, [addTodo]);
      return <div data-testid="content">{todosState.todos.length}</div>;
    };
    render(
      <TodosProvider>
        <TestComponent />
      </TodosProvider>
    );

    const content = await screen.findByTestId("content");
    expect(content).toHaveTextContent(1);
  });
});

describe("TodosContext reducer", () => {
  it("has correct default state", () => {
    const newState = reducer(initialState, { type: "unknown" });
    expect(newState).toEqual({
      filter: "all",
      todos: [],
    });
  });

  it("addTodo", () => {
    const newState = reducer(initialState, {
      type: "addTodo",
      payload: { id: "1", text: " foo", isCompleted: false },
    });
    expect(newState.todos[0]).toEqual({
      id: "1",
      text: " foo",
      isCompleted: false,
    });
  });

  it("toggleAll", () => {
    const oldState = {
      ...initialState,
      todos: [{ id: "1", name: "foo", isCompleted: false }],
    };
    const newState = reducer(oldState, {
      type: "toggleAll",
      payload: true,
    });
    expect(newState.todos[0].isCompleted).toEqual(true);
  });

  it("updateTodo", () => {
    const oldState = {
      ...initialState,
      todos: [{ id: "1", name: "foo", isCompleted: false }],
    };
    const newState = reducer(oldState, {
      type: "updateTodo",
      payload: { id: "1", text: "bar" },
    });
    expect(newState.todos[0].text).toEqual("bar");
  });

  it("removeTodo", () => {
    const oldState = {
      ...initialState,
      todos: [{ id: "1", name: "foo", isCompleted: false }],
    };
    const newState = reducer(oldState, {
      type: "removeTodo",
      payload: "1",
    });
    expect(newState.todos).toHaveLength(0);
  });

  it("changeFilter", () => {
    const newState = reducer(initialState, {
      type: "changeFilter",
      payload: "active",
    });
    expect(newState.filter).toEqual("active");
  });
});

describe("api", () => {
  const mockDispatch = vi.fn();
  it("addTodo", async () => {
    const mockResponse = {
      data: { id: "1", text: "foo", isCompleted: false },
    };
    vi.spyOn(axios, "post").mockResolvedValue(mockResponse);
    await addTodo(mockDispatch, { text: "foo", isCompleted: false });
    expect(mockDispatch).toHaveBeenCalledWith({
      type: "addTodo",
      payload: mockResponse.data,
    });
  });
});
```

### Testing footer

```ts
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
```
