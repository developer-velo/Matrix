import type { BuildConfig } from "bun";

const config: BuildConfig = {
  entrypoints: ["index.ts"],
  target: "node",
  outdir: "output",
  sourcemap: "external",
  external: ["canvas"],
};

await Bun.build({
  ...config,
  format: "cjs",
  naming: "[name].cjs"
})

await Bun.build({
  ...config,
  format: "esm",
  naming: "[name].mjs"
});
