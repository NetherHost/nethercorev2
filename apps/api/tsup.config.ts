import { defineConfig } from "tsup";

declare const process: { env: Record<string, string | undefined> };

export default defineConfig({
  entry: {
    index: "src/index.ts",
  },
  format: ["esm"],
  dts: true,
  clean: true,
  sourcemap: true,
  minify: true,
  external: ["express", "zod", "dotenv", "axios"],
  ...(process.env.CI
    ? {}
    : {
        onSuccess: "node dist/index.js",
      }),
});
