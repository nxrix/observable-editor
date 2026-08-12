import * as Kit from "https://cdn.jsdelivr.net/npm/@observablehq/notebook-kit/+esm";
import * as Runtime from "https://cdn.jsdelivr.net/npm/@observablehq/notebook-kit/runtime/+esm";

const compile = (body, id) => {
  return eval(`"use strict";(\n${body}\n)\n${id ? `//# sourceURL=observablehq-${id}` : ""}`);
}

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

const pendingResizes = new Map();
let resizeScheduled = false;

const sendResize = (id, value) => {
  pendingResizes.set(id, value);
  if (!resizeScheduled) {
    resizeScheduled = true;
    requestAnimationFrame(() => {
      parent.postMessage({
        type: "resizeCells",
        values: [...pendingResizes]
      }, "*");
      pendingResizes.clear();
      resizeScheduled = false;
    });
  }
}

const main = document.querySelector("main");

const runtime = new Runtime.NotebookRuntime();

const cells = new Map();
const order = [];
let nextId = 0;

const createCell = (cell) => {
  const id = nextId++;

  const container = document.createElement("div");
  container.className = "observablehq observablehq--cell";
  container.style.minHeight = "1px";
  //container.style.background = "#00f5";
  main.appendChild(container);

  const observer = new ResizeObserver(() => {
    const r = container.getBoundingClientRect();
    sendResize(id,r.height);//container.offsetHeight);
  });
  observer.observe(container);

  const output = document.createElement("div");
  container.appendChild(output);

  const state = {
    root: output,
    variables: []
  };

  const execute = async (mode,value) => {
    if (mode !== undefined) cell.mode = mode;
    if (value !== undefined) cell.value = value;
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
  
  const remove = () => {
    observer.disconnect();
    state.variables.forEach(v => {
      v._observer = {};
      v.delete();
    });
    container.remove();
    cells.delete(id);
    const i = order.indexOf(id);
    if (i !== -1) {
      order.splice(i, 1);
    }
    pendingResizes.delete(id);
  };

  const pin = () => {
    cell.pinned = !cell.pinned;
  };

  const hide = () => {
    cell.hidden = !cell.hidden;
    //container.hidden = cell.hidden;
    //container.style.minHeight = cell.hidden?"1px":"1.5rem";
    execute();
  };

  const up = () => {
    const index = order.indexOf(id);
    if (index <= 0) return;
    [order[index - 1], order[index]] = [order[index], order[index - 1]];
    const previous = cells.get(order[index]);
    main.insertBefore(
      container,
      previous.container
    );
  };

  const down = () => {
    const index = order.indexOf(id);
    if (index === -1 || index >= order.length - 1) return;
    [order[index], order[index + 1]] = [order[index + 1], order[index]];
    const next = cells.get(order[index]);
    main.insertBefore(
      next.container,
      container
    );
  };

  cells.set(id,{
    state,
    cell,
    container,
    execute,
    remove,
    hide,
    pin,
    up,
    down
  });
  order.push(id);

  execute();
  return id;
}

const clear = () => {
  nextId = 0;
  for (const id of [...order]) {
    cells.get(id)?.remove();
  }
  order.length = 0;
};

let notebook = null;

const open = (html) => {
  clear();
  notebook = Kit.deserialize(html);
  parent.postMessage({
    type: "notebook",
    value: notebook
  }, "*");
  for (const c of notebook.cells) {
    createCell(c);
  }
}

window.addEventListener("message", e => {
  if(e.source !== parent) return;
  const msg = e.data;
  switch (msg.type) {
    case "open":
      if (msg.path) {
        /*const path = msg.path;
        const originalFetch = window.fetch;
        window.fetch = (input, init) => {
          const base = path.slice(0, path.lastIndexOf("/") + 1);
          if (typeof input === "string" && input.startsWith(".")) {
            input = new URL(input, base).href;
          }
          return originalFetch(input, init);
        };*/
        //const base = document.createElement("base");
        //base.href = path.slice(0, path.lastIndexOf("/") + 1);
        //document.head.appendChild(base);
      }
      open(msg.value);
      break;
    case "save":
      notebook.cells = order.map(id => cells.get(id).cell);
      parent.postMessage({
        type: "save",
        value: Kit.serialize(notebook)
      }, "*");
      break;
    case "insert":
      const index = order.indexOf(msg.id);
      const nid = createCell(msg.cell);
      order.splice(order.indexOf(nid),1);
      order.splice(index+1,0,nid);
      const current = cells.get(msg.id);
      const inserted = cells.get(nid);
      main.insertBefore(
        inserted.container,
        current.container.nextSibling
      );
      break;
    case "remove":
      cells.get(msg.id)?.remove();
      break;
    case "modify":
      cells.get(msg.id)?.execute(msg.mode,msg.value);
      break;
    case "pin":
      cells.get(msg.id)?.pin();
      break;
    case "hide":
      cells.get(msg.id)?.hide();
      break;
    case "up":
      cells.get(msg.id)?.up();
      break;
    case "down":
      cells.get(msg.id)?.down();
      break;
    case "overlaysResize":
      for (const [id, value] of msg.values) {
        const cell = cells.get(id);
        if (!cell) continue;
        cell.container.style.marginBottom = `${value}px`;
      }
      break;
  }
});

parent.postMessage({
  type: "hello"
},"*");

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