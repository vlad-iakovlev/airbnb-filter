import "dotenv/config";
import * as esbuild from "esbuild";
import { clean } from "esbuild-plugin-clean";
import { copy } from "esbuild-plugin-copy";

const options = {
  bundle: true,
  entryPoints: ["src/app.mjs", "src/styles.css"],
  format: "esm",
  minify: true,
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
