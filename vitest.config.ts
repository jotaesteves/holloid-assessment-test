import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    setupFiles: ["./src/test/test-setup.ts"],
    globals: true,
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html", "lcov"],
      reportsDirectory: "./coverage",
      exclude: [
        "node_modules/",
        "src/test/",
        "**/*.d.ts",
        "**/*.test.{ts,tsx}",
        "**/__tests__/**",
        "**/coverage/**",
        "dist/",
        ".eslintrc.cjs",
        "postcss.config.js",
        "tailwind.config.ts",
        "vite.config.ts",
        "vitest.config.ts",
        // Exclude main entry files and sample data
        "src/main.tsx",
        "src/App.tsx",
        "src/types/robot.ts", // Contains sample data, not logic to test
        "src/index.css",
        "src/theme.css",
        "src/vite-env.d.ts",
        "src/assets/**",
      ],
      include: ["src/components/**/*.{ts,tsx}", "src/contexts/**/*.{ts,tsx}", "src/utils/**/*.{ts,tsx}"],
      all: true,
      thresholds: {
        lines: 80,
        functions: 80,
        branches: 80,
        statements: 80,
      },
    },
  },
});
