import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts", "src/types-only.ts"],
  format: ["esm"],
  dts: true,
  clean: true,
  sourcemap: true,
  minify: false,
  external: ["@nethercore/logger"],
});
