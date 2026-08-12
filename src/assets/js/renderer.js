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
  root.className = "observablehq observablehq--cell";
  main.appendChild(root);
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
}

const open = (html) => {
  const notebook = Kit.deserialize(html);
  document.title = notebook.title;
  //const t = window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light";
  //document.documentElement.dataset.theme = notebook.theme==="air"?"light":t;
  const t = localStorage.getItem("theme")||"auto";
  document.documentElement.setAttribute("data-theme",t === "auto"?
    (window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light"):
    t
  );
  for (const cell of notebook.cells) {
    createCell(cell);
  }
};

(async () => {
  const params = new URLSearchParams(location.search);
  const path = params.get("path");
  if (path) open(await (await fetch(path)).text());
})();

const handleFiles = (files) => {
  if (files.length === 1 && (
      files[0].type === "text/html" ||
      files[0].name.toLowerCase().endsWith(".html") ||
      files[0].name.toLowerCase().endsWith(".htm")
    )) {
    const file = files[0];
    file.text().then(open);
    return;
  }
}

document.addEventListener("dragover", (event) => {
  event.preventDefault();
  event.dataTransfer.dropEffect = "copy";
});

document.addEventListener("drop", (event) => {
  event.preventDefault();
  const files = [...event.dataTransfer.files];
  if (files.length) {
    handleFiles(files);
  }
});