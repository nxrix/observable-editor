import * as Kit from "https://cdn.jsdelivr.net/npm/@observablehq/notebook-kit/+esm";
import * as Runtime from "https://cdn.jsdelivr.net/npm/@observablehq/notebook-kit/runtime/+esm";

const compile = (body, id) => {
  return eval(`"use strict";(\n${body}\n)\n${id ? `//# sourceURL=observablehq-${id}` : ""}`);
}

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
  container.dataset.name = "container";
  container.style.marginTop = "1rem";
  container.style.marginBottom = "1rem";
  main.appendChild(container);

  const output = document.createElement("div");
  output.dataset.name = "output";

  const editor = document.createElement("div");
  editor.dataset.name = "editor";
  editor.style.display = "flex";
  editor.style.flexDirection = "column";
  editor.style.gap = "4px";
  editor.style.padding = "9px";
  editor.style.borderRadius = "5px";
  editor.style.outlineOffset = "-1px";
  editor.style.outline = "1px solid var(--theme-foreground-faintest)";

  container.append(output,editor);

  const textarea = document.createElement("textarea");
  textarea.style.resize = "none";
  textarea.style.overflow = "hidden";
  textarea.value = cell?.value ?? "";
  const resize = () => {
    textarea.style.height = "0px";
    textarea.style.height = textarea.scrollHeight+"px";
  };
  textarea.addEventListener("input", resize);
  window.addEventListener("resize", resize);

  const select = document.createElement("select");
  for (const type of ["ojs", "js", "ts", "html", "md", "tex", "dot"]) {
    const option = document.createElement("option");
    option.value = type;
    option.textContent = type;
    select.appendChild(option);
  }
  select.value = cell.mode;

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
  up.textContent = "▲";

  const down = document.createElement("button");
  down.textContent = "▼";

  const toolbar = document.createElement("div");
  toolbar.dataset.name = "toolbar";
  toolbar.style.display = "flex";
  toolbar.style.gap = "4px";
  //toolbar.style.marginBottom = "1rem";
  toolbar.append(select,run,pin,hide,up,down,del);

  editor.append(textarea,toolbar);

  const state = {
    root: output,
    variables: []
  };

  const execute = async () => {
    cell.value = textarea.value;
    cell.mode = select.value;
    state.variables.forEach(v => {
      v._observer = {};
      v.delete();
    });
    state.variables = [];
    try {
      const definition = Kit.transpile(cell);
      const body = compile(definition.body);
      await runtime.define(
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
    state.variables.forEach(v => {
      v._observer = {};
      v.delete();
    });
    textarea.removeEventListener("input", resize);
    window.removeEventListener("resize", resize);
    container.remove();
    cells.delete(id);
    const i = order.indexOf(id);
    if (i !== -1) order.splice(i, 1);
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
    state,
    container
  });
  order.push(id);

  execute();
  resize();
  return id;
}

const load = (html) => {
  const notebook = Kit.deserialize(html);
  for (const cell of notebook.cells) {
    createCell(cell);
  }
};

/*(async () => {
  const params = new URLSearchParams(location.search);
  const path = params.get("path");
  load(await (await fetch(path)).text());
})();*/

newButton.addEventListener("click", () => {
  createCell({
    value: "",
    mode: "ojs"
  });
});

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

openButton.addEventListener("click", () => {
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