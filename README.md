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

```
