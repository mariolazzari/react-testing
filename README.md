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

```js
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
          <Footer />j
        </TodosContext.Provider>
      );
      const filterLinks = screen.getAllByTestId("filterLink");
      await user.click(filterLinks[1]);
      expect(mockChangeFilter).toHaveBeenCalledWith("active");
    });
  });
});
```

### Custom render

```js
import React from "react";
import { render } from "@testing-library/react";
import { TodosContext } from "../../contexts/todos";
import { vi } from "vitest";

export function renderWithTodos(
  ui,
  {
    state = { todos: [], filter: "all" },
    dispatch = vi.fn(),
    actions = {},
    ...renderOptions
  } = {}
) {
  function Wrapper({ children }) {
    return (
      <TodosContext.Provider value={[state, dispatch, actions]}>
        {children}
      </TodosContext.Provider>
    );
  }

  return {
    dispatch,
    actions,
    ...render(ui, { wrapper: Wrapper, ...renderOptions }),
  };
}
```

### Testing todo component

```js
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { TodosContext } from "../contexts/todos";
import Todo from "./Todo";
import userEvent from "@testing-library/user-event";

describe("Todo", () => {
  const mockDispatch = vi.fn();
  const mockUpdateTodo = vi.fn();
  const mockRemoveTodo = vi.fn();
  it("renders default state", () => {
    const todoEntity = { id: "1", text: "foo", isCompleted: false };
    const mockSetEditingId = vi.fn();
    render(
      <TodosContext.Provider
        value={[
          {},
          mockDispatch,
          { updateTodo: mockUpdateTodo, removeTodo: mockRemoveTodo },
        ]}
      >
        <Todo
          todo={todoEntity}
          isEditing={false}
          setEditingId={mockSetEditingId}
        />
      </TodosContext.Provider>
    );
    const todo = screen.getByTestId("todo");
    const edit = screen.queryByTestId("edit");
    const label = screen.getByTestId("label");
    expect(todo).not.toHaveClass("completed");
    expect(todo).not.toHaveClass("editing");
    expect(edit).not.toBeInTheDocument();
    expect(label).toHaveTextContent("foo");
  });

  it("should toggle a todo", async () => {
    const user = userEvent.setup();
    const todoEntity = { id: "1", text: "foo", isCompleted: false };
    const mockSetEditingId = vi.fn();
    render(
      <TodosContext.Provider
        value={[
          {},
          mockDispatch,
          { updateTodo: mockUpdateTodo, removeTodo: mockRemoveTodo },
        ]}
      >
        <Todo
          todo={todoEntity}
          isEditing={false}
          setEditingId={mockSetEditingId}
        />
      </TodosContext.Provider>
    );
    const toggle = screen.getByTestId("toggle");
    await user.click(toggle);
    expect(mockUpdateTodo).toHaveBeenCalledWith(todoEntity.id, {
      text: todoEntity.text,
      isCompleted: true,
    });
  });

  it("should remove a todo", async () => {
    const user = userEvent.setup();
    const todoEntity = { id: "1", text: "foo", isCompleted: false };
    const mockSetEditingId = vi.fn();
    render(
      <TodosContext.Provider
        value={[
          {},
          mockDispatch,
          { updateTodo: mockUpdateTodo, removeTodo: mockRemoveTodo },
        ]}
      >
        <Todo
          todo={todoEntity}
          isEditing={false}
          setEditingId={mockSetEditingId}
        />
      </TodosContext.Provider>
    );
    const destroy = screen.getByTestId("destroy");
    await user.click(destroy);
    expect(mockRemoveTodo).toHaveBeenCalledWith(todoEntity.id);
  });

  it("should activate editing mode", async () => {
    const user = userEvent.setup();
    const todoEntity = { id: "1", text: "foo", isCompleted: false };
    const mockSetEditingId = vi.fn();
    render(
      <TodosContext.Provider
        value={[
          {},
          mockDispatch,
          { updateTodo: mockUpdateTodo, removeTodo: mockRemoveTodo },
        ]}
      >
        <Todo
          todo={todoEntity}
          isEditing={false}
          setEditingId={mockSetEditingId}
        />
      </TodosContext.Provider>
    );
    const label = screen.getByTestId("label");
    await user.dblClick(label);
    expect(mockSetEditingId).toHaveBeenCalledWith(todoEntity.id);
  });

  it("should update todo", async () => {
    const user = userEvent.setup();
    const todoEntity = { id: "1", text: "foo", isCompleted: false };
    const mockSetEditingId = vi.fn();
    render(
      <TodosContext.Provider
        value={[
          {},
          mockDispatch,
          { updateTodo: mockUpdateTodo, removeTodo: mockRemoveTodo },
        ]}
      >
        <Todo
          todo={todoEntity}
          isEditing={true}
          setEditingId={mockSetEditingId}
        />
      </TodosContext.Provider>
    );
    const edit = screen.getByTestId("edit");
    await user.clear(edit);
    await user.type(edit, "bar{enter}");
    expect(mockUpdateTodo).toHaveBeenCalledWith(todoEntity.id, {
      text: "bar",
      isCompleted: false,
    });
  });

  it("should focus on the input after editing activation", async () => {
    const todoEntity = { id: "1", text: "foo", isCompleted: false };
    const mockSetEditingId = vi.fn();
    render(
      <TodosContext.Provider
        value={[
          {},
          mockDispatch,
          { updateTodo: mockUpdateTodo, removeTodo: mockRemoveTodo },
        ]}
      >
        <Todo
          todo={todoEntity}
          isEditing={true}
          setEditingId={mockSetEditingId}
        />
      </TodosContext.Provider>
    );
    const edit = screen.getByTestId("edit");
    expect(edit.matches(":focus")).toEqual(true);
  });
});
```

### Testing main

```js
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { TodosContext } from "../contexts/todos";
import Main from "./Main";
import userEvent from "@testing-library/user-event";

const mockTodo = vi.fn();
vi.mock("./Todo", () => {
  return {
    default: props => {
      mockTodo(props);
      return <div>todo</div>;
    },
  };
});

describe("Main", () => {
  const mockDispatch = vi.fn();
  const mockToggleAll = vi.fn();
  it("should be hidden wehn no todos", () => {
    const state = {
      todos: [],
      filter: "all",
    };
    render(
      <TodosContext.Provider
        value={[state, mockDispatch, { toggleAll: mockToggleAll }]}
      >
        <Main />
      </TodosContext.Provider>
    );
    expect(screen.getByTestId("main")).toHaveClass("hidden");
  });

  it("should be visible with todos", () => {
    const state = {
      todos: [{ id: "1", text: "foo", isCompleted: false }],
      filter: "all",
    };
    render(
      <TodosContext.Provider
        value={[state, mockDispatch, { toggleAll: mockToggleAll }]}
      >
        <Main />
      </TodosContext.Provider>
    );
    expect(screen.getByTestId("main")).not.toHaveClass("hidden");
  });

  it("should render a list of todos", () => {
    const state = {
      todos: [
        { id: "1", text: "foo", isCompleted: false },
        { id: "2", text: "bar", isCompleted: false },
      ],
      filter: "all",
    };
    render(
      <TodosContext.Provider
        value={[state, mockDispatch, { toggleAll: mockToggleAll }]}
      >
        <Main />
      </TodosContext.Provider>
    );
    expect(mockTodo).toHaveBeenCalledTimes(2);
    expect(mockTodo).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({
        isEditing: false,
        todo: {
          id: "1",
          text: "foo",
          isCompleted: false,
        },
      })
    );
  });

  it("should hightlight toggle all checkbox", () => {
    const state = {
      todos: [{ id: "1", text: "foo", isCompleted: true }],
      filter: "all",
    };
    render(
      <TodosContext.Provider
        value={[state, mockDispatch, { toggleAll: mockToggleAll }]}
      >
        <Main />
      </TodosContext.Provider>
    );
    expect(screen.getByTestId("toggleAll")).toBeChecked();
  });

  it("should toggle all todos", async () => {
    const user = userEvent.setup();
    const state = {
      todos: [{ id: "1", text: "foo", isCompleted: true }],
      filter: "all",
    };
    render(
      <TodosContext.Provider
        value={[state, mockDispatch, { toggleAll: mockToggleAll }]}
      >
        <Main />
      </TodosContext.Provider>
    );
    const toggleAll = screen.getByTestId("toggleAll");
    await user.click(toggleAll);
    expect(mockToggleAll).toHaveBeenCalledWith(false);
  });
});
```

### Testing setTimeout

```js
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
```

## Testing Redux

### Testing reducers

```js
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
```

### Testing redux state

```js
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
```
