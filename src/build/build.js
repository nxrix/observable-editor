import esbuild from "esbuild";
import fs from "node:fs";

const httpPlugin = {
  name: "http-resolver",
  setup(build) {
    build.onResolve({ filter: /^https?:\/\// }, (args) => ({
      path: args.path,
      namespace: "http-url",
    }));

    build.onResolve({ filter: /.*/, namespace: "http-url" }, (args) => {
      const url = new URL(args.path, args.importer).href;
      return { path: url, namespace: "http-url" };
    });

    build.onLoad({ filter: /.*/, namespace: "http-url" }, async (args) => {
      console.log("Bundling remote dependency:", args.path);
      const response = await fetch(args.path);
      if (!response.ok) throw new Error(`Failed to load: ${args.path}`);
      const text = await response.text();
      
      let loader = "js";
      if (args.path.endsWith(".css")) loader = "css";
      if (args.path.endsWith(".json")) loader = "json";
      
      return { contents: text, loader };
    });
  },
};

await esbuild.build({
  entryPoints: ["bundle.js"],
  bundle: true,
  format: "esm",
  //outfile: "dist/bundle.js",
  outdir: "dist",
  platform: "browser",
  minify: true,
  splitting: true,
  //packages: "bundle",
  //target: "esnext",
  //sourcemap: true,
  plugins: [httpPlugin],
});

const cssFile = "dist/bundle.css";
let css = fs.readFileSync(cssFile, "utf8");
const imports = [...css.matchAll(
  /@import\s+["'](https?:\/\/[^"']+)["'];?/g
)];
for (const [, url] of imports) {
  console.log("Inlining CSS:", url);
  const response = await fetch(url);
  const remoteCss = await response.text();
  css = css.replace(
    `@import "${url}";`,
    remoteCss
  );
}
fs.writeFileSync(cssFile, css);

console.log("Build complete");