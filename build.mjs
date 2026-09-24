import esbuild from "esbuild";
import { cp, rm } from "node:fs/promises";

const outdir = "build";

await rm(outdir, { recursive: true, force: true });

await esbuild.build({
  entryPoints: {
    "assets/js/index": "src/assets/js/index.js",
    "assets/js/worker": "src/assets/js/worker.js"
  },
  outdir,
  chunkNames: "assets/js/[name]-[hash]",
  bundle: true,
  splitting: true,
  format: "esm",
  platform: "browser",
  target: "es2022",
  minify: false,
  sourcemap: false,
  logLevel: "info"
});

await cp("src/index.html", `${outdir}/index.html`);
await cp("src/worker.html", `${outdir}/worker.html`);
await cp("src/favicon.ico", `${outdir}/favicon.ico`);
await cp("src/assets/js/theme.js", `${outdir}/assets/js/theme.js`);
await cp("src/assets/css", `${outdir}/assets/css`, { recursive: true });

console.log("Build complete -> build/");
