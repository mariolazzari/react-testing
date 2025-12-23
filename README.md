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
