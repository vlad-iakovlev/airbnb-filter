import "dotenv/config";
import * as esbuild from "esbuild";
import { clean } from "esbuild-plugin-clean";
import { copy } from "esbuild-plugin-copy";

const options = {
  bundle: true,
  entryPoints: ["src/popup/popup.jsx", "src/popup/popup.css"],
  format: "esm",
  jsx: "automatic",
  minify: true,
  outbase: "src",
  outdir: "dist",
  platform: "browser",
  plugins: [
    clean({ patterns: "dist/**/*" }),
    copy({ assets: { from: "public/**/*", to: "." } }),
  ],
  sourcemap: true,
};

switch (process.argv[2]) {
  case "build":
    await esbuild.build(options);
    break;

  default:
    throw new Error("Invalid command");
}
