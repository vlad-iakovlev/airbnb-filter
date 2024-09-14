import "dotenv/config";
import * as esbuild from "esbuild";
import { clean } from "esbuild-plugin-clean";
import { copy } from "esbuild-plugin-copy";
import { polyfillNode } from "esbuild-plugin-polyfill-node";
import { tailwindPlugin } from "esbuild-plugin-tailwindcss";
import * as esbuildServer from "esbuild-server";

const buildOptions: esbuild.BuildOptions = {
  bundle: true,
  entryPoints: ["src/popup/popup.tsx"],
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
    tailwindPlugin(),
  ],
  sourcemap: true,
};

switch (process.argv[2]) {
  case "build":
    await esbuild.build(buildOptions);
    break;

  case "dev":
    await esbuildServer
      .createServer(buildOptions, {
        static: "public",
        port: 3000,
      })
      .start();
    break;

  default:
    throw new Error("Invalid command");
}
