import "dotenv/config";
import * as esbuild from "esbuild";
import { clean } from "esbuild-plugin-clean";
import { copy } from "esbuild-plugin-copy";
import { polyfillNode } from "esbuild-plugin-polyfill-node";

const buildOptions: esbuild.BuildOptions = {
  bundle: true,
  entryPoints: ["src/popup/popup.tsx", "src/popup/popup.css"],
  format: "esm",
  jsx: "automatic",
  minify: true,
  outbase: "src",
  outdir: "dist",
  platform: "browser",
  plugins: [
    clean({ patterns: "dist/**/*" }),
    copy({ assets: { from: "public/**/*", to: "." } }),
    polyfillNode(),
  ],
  sourcemap: true,
};

switch (process.argv[2]) {
  case "build":
    await esbuild.build(buildOptions);
    break;

  default:
    throw new Error("Invalid command");
}
