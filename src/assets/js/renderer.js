import * as Kit from "https://cdn.jsdelivr.net/npm/@observablehq/notebook-kit/+esm";
import * as Runtime from "https://cdn.jsdelivr.net/npm/@observablehq/notebook-kit/runtime/+esm";

const compile = (value) => (1, eval)(`"use strict";(\n${value}\n)\n`);

const runtime = new Runtime.NotebookRuntime();
const main = document.querySelector("main");

const showError = (root, error) => {
  root.replaceChildren();
  const outer = document.createElement("div");
  outer.className = "observablehq observablehq--error";
  const inner = document.createElement("div");
  inner.className = "observablehq--inspect";
  inner.textContent =
    error instanceof Error
      ? `${error.name}: ${error.message}`
      : String(error);
  outer.appendChild(inner);
  root.appendChild(outer);
}

const createCell = (cell) => {
  const root = document.createElement("div");
  const state = {
    root,
    variables: []
  };
  try {
    const definition = Kit.transpile(cell);
    runtime.define(
      state,
      {
        ...definition,
        body: compile(definition.body)
      }
    );
  } catch (error) {
    showError(root, error);
  }
  main.appendChild(root);
}

const load = (html) => {
  const notebook = Kit.deserialize(html);
  document.title = notebook.title;
  const t = window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light";
  document.documentElement.dataset.theme = notebook.theme==="air"?"light":t;
  for (const cell of notebook.cells) {
    createCell(cell);
  }
};

(async () => {
  const params = new URLSearchParams(location.search);
  const path = params.get("path");
  load(await (await fetch(path)).text());
})();