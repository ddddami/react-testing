import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "jsdom",
    globals: true, //  with this, you don't need to import vi
    setupFiles: "tests/setup.ts",
  },
});
