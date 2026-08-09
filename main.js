import * as Kit from "https://cdn.jsdelivr.net/npm/@observablehq/notebook-kit/+esm";
import * as Runtime from "https://cdn.jsdelivr.net/npm/@observablehq/notebook-kit/runtime/+esm";

const compile = (value) => (1, eval)(`"use strict";(\n${value}\n)\n`);

const runtime = new Runtime.NotebookRuntime();
const main = document.querySelector("main");

const cells = new Map();
const order = [];
let nextId = 0;

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
  const id = nextId++;

  const container = document.createElement("div");

  const output = document.createElement("div");
  container.appendChild(output);

  const editor = document.createElement("div");

  const select = document.createElement("select");
  for (const type of ["ojs", "js", "ts", "html", "md", "tex", "dot"]) {
    const option = document.createElement("option");
    option.value = type;
    option.textContent = type;
    select.appendChild(option);
  }
  select.value = cell.mode;

  const textarea = document.createElement("textarea");
  textarea.value = cell?.value ?? "";

  const toolbar = document.createElement("div");

  const run = document.createElement("button");
  run.textContent = "Run";

  const del = document.createElement("button");
  del.textContent = "Delete";

  const pin = document.createElement("button");
  pin.textContent = cell.pinned ? "Unpin" : "Pin";

  const hide = document.createElement("button");
  hide.textContent = cell.hidden ? "Show" : "Hide";
  output.hidden = cell.hidden;

  const up = document.createElement("button");
  up.textContent = "↑";

  const down = document.createElement("button");
  down.textContent = "↓";

  toolbar.append(
    run,
    pin,
    hide,
    up,
    down,
    del
  );

  editor.append(
    select,
    textarea,
    toolbar
  );

  container.appendChild(editor);
  main.appendChild(container);

  const state = {
    root: output,
    variables: [],
    expanded: []
  };

  const execute = () => {
    cell.value = textarea.value;
    cell.mode = select.value;
    const old = state.variables;
    old.forEach(v => v.delete());
    //state.variables.forEach(v => v.delete());
    state.variables = [];
    try {
      const definition = Kit.transpile(cell);
      const body = compile(definition.body);
      runtime.define(
        state,
        {
          ...definition,
          body
        }
      );
    } catch (error) {
      showError(output, error);
    }
  }
  run.onclick = execute;

  del.onclick = () => {
    state.variables.forEach(v => v.delete());
    container.remove();
    cells.delete(id);
  };

  pin.onclick = () => {
    cell.pinned = !cell.pinned;
    pin.textContent = cell.pinned ? "Unpin" : "Pin";
  };

  hide.onclick = () => {
    cell.hidden = !cell.hidden;
    hide.textContent = cell.hidden ? "Show" : "Hide";
    output.hidden = cell.hidden;
    execute();
  };

  up.onclick = () => {
    const index = order.indexOf(id);
    if (index <= 0) return;
    [order[index - 1], order[index]] =
    [order[index], order[index - 1]];
    const current = cells.get(id);
    const previous = cells.get(order[index]);
    main.insertBefore(
      current.container,
      previous.container
    );
  };

  down.onclick = () => {
    const index = order.indexOf(id);
    if (index === -1 || index >= order.length - 1) return;
    [order[index], order[index + 1]] =
    [order[index + 1], order[index]];
    const current = cells.get(id);
    const next = cells.get(order[index]);
    main.insertBefore(
      next.container,
      current.container
    );
  };

  cells.set(id, {
    id,
    cell,
    state,
    container
  });
  order.push(id);

  execute();
  return id;
}

const load = (html) => {
  const notebook = Kit.deserialize(html);
  for (const cell of notebook.cells) {
    createCell(cell);
  }
};

(async () => {
  load(await (await fetch("test.txt")).text())
})()

const handleFiles = (files) => {
  if (files.length === 1 && (
      files[0].type === "text/html" ||
      files[0].name.toLowerCase().endsWith(".html") ||
      files[0].name.toLowerCase().endsWith(".htm")
    )) {
    const file = files[0];
    file.text().then(load);
    return;
  }
}

loadButton.addEventListener("click", () => {
  const input = document.createElement("input");
  input.type = "file";
  input.multiple = true;
  input.addEventListener("change", () => {
    if (input.files?.length) {
      handleFiles([...input.files]);
    }
  });
  input.click();
});

newButton.addEventListener("click", () => {
  createCell({
    value: "",
    mode: "ojs"
  });
})

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