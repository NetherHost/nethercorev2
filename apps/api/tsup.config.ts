import { defineConfig } from "tsup";

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

  onSuccess: "node dist/index.js",
});
