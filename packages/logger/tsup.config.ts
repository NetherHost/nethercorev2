import { defineConfig } from "tsup";

export default defineConfig({
  entry: {
    index: "src/index.ts",
    example: "src/example.ts"
  },
  format: ["cjs", "esm"],
  dts: true,
  clean: true,
  sourcemap: true,
  minify: false,
  external: ["chalk"]
});
