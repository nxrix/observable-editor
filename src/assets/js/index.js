import { basicSetup } from "codemirror";
import { EditorView, keymap } from "@codemirror/view";
import { Compartment } from "@codemirror/state";
import { indentWithTab } from "@codemirror/commands";
import { HighlightStyle, indentUnit, syntaxHighlighting } from "@codemirror/language";
import { tags } from "@lezer/highlight";
import { javascript } from "@codemirror/lang-javascript";
import { markdown } from "@codemirror/lang-markdown";
import { html } from "@codemirror/lang-html";

const freshNotebook = `<!doctype html>
<notebook theme="air">
  <title>untitled</title>
  <script id="1" type="text/markdown">
    # untitled
  </script>
</notebook>
`;

const main = document.querySelector("main");
const worker = document.querySelector("#worker");
const overlay = document.querySelector("#overlay");
const fileName = document.querySelector("#fileName");
const status = document.querySelector("#status");

const overlays = new Map();
const pendingOverlayResize = new Map();
const order = [];
let nextId = 0;
let ready = false;
let fresh = false;
let queued = null;
let notebookTitle = "untitled";
let fileHandle = null;
let statusTimer;
let unsaved = false;

const channel = new MessageChannel();
let initialized = false;
const send = (msg) => channel.port1.postMessage(msg);

const pickerTypes = [{
  description: "Observable notebook",
  accept: { "text/html": [".html", ".htm"] }
}];

const isNotebook = (text) => /<notebook[\s>]/i.test(text);

const highlightStyle = HighlightStyle.define([
  { tag: tags.link, color: "var(--syntax-link)" },
  { tag: [tags.heading, tags.strong], fontWeight: "600" },
  { tag: tags.emphasis, fontStyle: "italic" },
  { tag: [tags.keyword, tags.typeName], color: "var(--syntax-keyword)" },
  { tag: tags.atom, color: "var(--syntax-atom)" },
  { tag: [tags.bool, tags.escape, tags.number], color: "var(--syntax-literal)" },
  { tag: [tags.string, tags.regexp], color: "var(--syntax-string)" },
  { tag: tags.comment, color: "var(--syntax-comment)" },
  { tag: tags.invalid, color: "var(--syntax-invalid)" },
  { tag: tags.variableName, color: "var(--syntax-variable)" },
  { tag: [tags.definition(tags.variableName), tags.className, tags.propertyName], color: "var(--syntax-definition)" },
  { tag: tags.meta, color: "var(--syntax-meta)" }
]);

const dark = new Compartment();
const isDark = () => document.documentElement.dataset.theme === "dark";

const editorTheme = EditorView.theme({
  "&": {
    color: "var(--theme-foreground)",
    backgroundColor: "var(--theme-background)",
    fontFamily: "var(--monospace)",
    fontSize: "14px",
    lineHeight: "1.5"
  },
  ".cm-content": {
    caretColor: "var(--theme-foreground-focus)",
    padding: "6px 0"
  },
  ".cm-line": {
    padding: "0 12px"
  },
  ".cm-cursor, .cm-dropCursor": {
    borderLeftColor: "var(--theme-foreground-focus)"
  },
  ".cm-selectionBackground, &.cm-focused .cm-selectionBackground": {
    backgroundColor: "color-mix(in srgb, var(--theme-foreground) 22%, var(--theme-background)) !important"
  },
  ".cm-matchingBracket": {
    backgroundColor: "var(--theme-foreground-faintest)",
    outline: "none"
  },
  ".cm-gutters": {
    backgroundColor: "transparent",
    border: "none",
    color: "var(--theme-foreground-faint)"
  },
  ".cm-activeLine": {
    backgroundColor: "color-mix(in srgb, var(--theme-foreground) 14%, transparent)"
  },
  ".cm-activeLineGutter": {
    backgroundColor: "transparent",
    color: "var(--theme-foreground)"
  },
  ".cm-foldPlaceholder": {
    backgroundColor: "var(--theme-foreground-faintest)",
    border: "none",
    color: "var(--theme-foreground-faint)"
  },
  ".cm-tooltip": {
    backgroundColor: "var(--theme-background-alt)",
    border: "1px solid var(--theme-foreground-faintest)",
    color: "var(--theme-foreground)"
  },
  ".cm-tooltip.cm-tooltip-autocomplete > ul": {
    fontFamily: "var(--monospace)",
    maxHeight: "180px"
  },
  ".cm-tooltip.cm-tooltip-autocomplete > ul > li": {
    color: "var(--theme-foreground)"
  },
  ".cm-tooltip.cm-tooltip-autocomplete > ul > li[aria-selected]": {
    backgroundColor: "color-mix(in srgb, var(--theme-foreground) 14%, var(--theme-background))",
    color: "var(--theme-foreground)"
  },
  ".cm-completionDetail": {
    color: "var(--theme-foreground-faint)",
    fontStyle: "normal"
  },
  "&.cm-focused": {
    outline: "none"
  }
});

const languageFor = (mode) => {
  switch (mode) {
    case "ojs":
    case "js": return javascript();
    case "ts": return javascript({ typescript: true });
    case "md": return markdown();
    case "html": return html();
    default: return [];
  }
};

const wraps = (mode) => mode !== "js" && mode !== "ts" && mode !== "ojs";

const createEditor = (cell, parent) => new EditorView({
  doc: cell.value,
  parent,
  extensions: [
    basicSetup,
    keymap.of([indentWithTab]),
    syntaxHighlighting(highlightStyle),
    editorTheme,
    dark.of(EditorView.darkTheme.of(isDark())),
    languageFor(cell.mode),
    indentUnit.of("  "),
    ...(wraps(cell.mode) ? [EditorView.lineWrapping] : []),
    EditorView.updateListener.of((update) => {
      if (update.docChanged) {
        cell.value = update.state.doc.toString();
        cell.dirty = true;
        unsaved = true;
      }
    })
  ]
});

new MutationObserver(() => {
  for (const record of overlays.values()) {
    record.view?.dispatch({
      effects: dark.reconfigure(EditorView.darkTheme.of(isDark()))
    });
  }
}).observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });

const setStatus = (text) => {
  status.textContent = text;
  status.style.opacity = 1;
  clearTimeout(statusTimer);
  statusTimer = setTimeout(() => (status.style.opacity = 0), 2000);
};

const suggestedName = () =>
  `${notebookTitle.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") || "untitled"}.html`;

const downloadNotebook = (html) => {
  const a = document.createElement("a");
  a.href = URL.createObjectURL(new Blob([html], { type: "text/html" }));
  a.download = suggestedName();
  a.click();
  URL.revokeObjectURL(a.href);
  unsaved = false;
  setStatus("Downloaded (use Chrome or Edge to save files directly)");
};

const saveNotebook = async (html) => {
  try {
    if (!fileHandle) {
      if (!window.showSaveFilePicker) return downloadNotebook(html);
      fileHandle = await window.showSaveFilePicker({
        suggestedName: suggestedName(),
        types: pickerTypes
      });
    }
    const writable = await fileHandle.createWritable();
    await writable.write(html);
    await writable.close();
    fileName.textContent = fileHandle.name;
    unsaved = false;
    setStatus("Saved");
  } catch (error) {
    if (error.name === "AbortError") return;
    if (error.name === "NotAllowedError") {
      fileHandle = null;
      return saveNotebook(html);
    }
    console.error(error);
    setStatus(`Save failed: ${error.message ?? error}`);
  }
};

const loadNotebook = async () => {
  if (!window.showOpenFilePicker) {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".html,.htm";
    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) return;
      const text = await file.text();
      if (!isNotebook(text)) return setStatus("Not an Observable notebook");
      fileHandle = null;
      fileName.textContent = file.name;
      unsaved = false;
      setStatus("Loaded");
      openNotebook(text);
    };
    input.click();
    return;
  }
  try {
    const [handle] = await window.showOpenFilePicker({ types: pickerTypes, multiple: false });
    const file = await handle.getFile();
    const text = await file.text();
    if (!isNotebook(text)) return setStatus("Not an Observable notebook");
    fileHandle = handle;
    fileName.textContent = file.name;
    unsaved = false;
    setStatus("Loaded");
    openNotebook(text);
  } catch (error) {
    if (error.name !== "AbortError") console.error(error);
  }
};

const sendOverlayResize = (id, value) => {
  pendingOverlayResize.set(id, value);
  if (!overlayResizeScheduled) {
    overlayResizeScheduled = true;
    requestAnimationFrame(() => {
      send({
        type: "overlaysResize",
        values: [...pendingOverlayResize]
      });
      pendingOverlayResize.clear();
      overlayResizeScheduled = false;
    });
  }
}

let overlayResizeScheduled = false;

let resizeWorkerScheduled = false;
const resizeWorker = () => {
  if (resizeWorkerScheduled) return;
  resizeWorkerScheduled = true;
  requestAnimationFrame(() => {
    worker.style.height = `${overlay.scrollHeight + 112}px`;
    resizeWorkerScheduled = false;
  });
}

const createOverlay = (id, cell) => {
  const container = document.createElement("div");
  container.style.marginTop = "17px";
  container.style.marginBottom = "17px";
  overlay.appendChild(container);

  const box = document.createElement("div");
  box.style.pointerEvents = "auto";
  box.style.background = "var(--theme-background-alt)";
  box.style.borderRadius = "5px";
  box.style.outlineOffset = "-1px";
  box.style.outline = "1px solid var(--theme-foreground-faintest)";
  box.style.marginTop = "17px";
  container.appendChild(box);

  const menu = document.createElement("div");
  menu.style.display = "flex";
  menu.style.height = "24px";
  menu.style.userSelect = "none";

  const add = document.createElement("div");
  add.textContent = "+";
  add.style.width = "24px";
  add.style.display = "flex";
  add.style.alignItems = "center";
  add.style.justifyContent = "center";
  add.style.cursor = "pointer";
  add.onclick = () => {
    const cell = {
      mode: "ojs",
      value: "",
      hidden: false,
      pinned: false
    }
    createOverlay(nextId++, cell);
    const index = order.indexOf(id);
    const nid = nextId - 1;
    order.splice(order.indexOf(nid), 1);
    order.splice(index + 1, 0, nid);
    const current = overlays.get(id);
    const inserted = overlays.get(nid);
    overlay.insertBefore(
      inserted.container,
      current.container.nextSibling
    );
    unsaved = true;
    send({
      type: "insert",
      cell,
      id
    });
  };

  const toggle = document.createElement("div");
  toggle.textContent = `${id}`;
  toggle.style.width = "100%";
  toggle.style.display = "flex";
  toggle.style.alignItems = "center";
  toggle.style.justifyContent = "center";
  toggle.style.cursor = "pointer";

  let panel = null;

  const expand = () => {
    if (record.view) return;

    panel = document.createElement("div");
    panel.style.display = "flex";
    panel.style.flexDirection = "column";
    panel.style.gap = "4px";
    panel.style.padding = "9px";

    const editorHost = document.createElement("div");
    panel.appendChild(editorHost);

    record.view = createEditor(cell, editorHost);

    const select = document.createElement("select");
    select.style.fontFamily = "inherit";
    for (const type of ["ojs", "js", "ts", "html", "md", "tex", "dot"]) {
      const option = document.createElement("option");
      option.value = type;
      option.textContent = type;
      select.appendChild(option);
    }
    select.value = cell.mode;
    select.oninput = () => {
      cell.mode = select.value;
      record.view.destroy();
      editorHost.replaceChildren();
      record.view = createEditor(cell, editorHost);
      unsaved = true;
      send({
        type: "modify",
        id,
        mode: cell.mode,
        value: cell.value
      });
    }

    const run = document.createElement("button");
    run.style.fontFamily = "inherit";
    run.textContent = "Run";
    run.onclick = () => {
      cell.dirty = false;
      send({
        type: "modify",
        id,
        mode: cell.mode,
        value: cell.value
      });
    }

    const remove = document.createElement("button");
    remove.style.fontFamily = "inherit";
    remove.textContent = "Delete";
    remove.onclick = () => {
      if (order.length > 1) {
        const index = order.indexOf(id);
        if (index !== -1) {
          order.splice(index, 1);
        }
        const current = overlays.get(id);
        if (current) {
          current.observer.disconnect();
          current.container.remove();
          overlays.delete(id);
        }
        pendingOverlayResize.delete(id);
        unsaved = true;
        send({
          type: "remove",
          id
        });
        resizeWorker();
      }
    };

    const close = document.createElement("button");
    close.style.fontFamily = "inherit";
    close.textContent = "Close";
    close.onclick = () => collapse();

    const pin = document.createElement("button");
    pin.style.fontFamily = "inherit";
    pin.textContent = cell.pinned ? "Unpin" : "Pin";
    pin.onclick = () => {
      cell.pinned = !cell.pinned;
      pin.textContent = cell.pinned ? "Unpin" : "Pin";
      unsaved = true;
      send({
        type: "pin",
        id
      });
    }

    const hide = document.createElement("button");
    hide.style.fontFamily = "inherit";
    hide.textContent = cell.hidden ? "Show" : "Hide";
    hide.onclick = () => {
      cell.hidden = !cell.hidden;
      hide.textContent = cell.hidden ? "Show" : "Hide";
      unsaved = true;
      send({
        type: "hide",
        id
      });
    }

    const up = document.createElement("button");
    up.textContent = "↑";
    up.style.fontFamily = "var(--sans-serif)";
    up.onclick = () => {
      const index = order.indexOf(id);
      if (index <= 0) return;
      [order[index - 1], order[index]] = [order[index], order[index - 1]];
      const previous = overlays.get(order[index]);
      overlay.insertBefore(
        container,
        previous.container
      );
      unsaved = true;
      send({
        type: "up",
        id
      });
    }

    const down = document.createElement("button");
    down.textContent = "↓";
    down.style.fontFamily = "var(--sans-serif)";
    down.onclick = () => {
      const index = order.indexOf(id);
      if (index === -1 || index >= order.length - 1) return;
      [order[index], order[index + 1]] = [order[index + 1], order[index]];
      const next = overlays.get(order[index]);
      overlay.insertBefore(
        next.container,
        container
      );
      unsaved = true;
      send({
        type: "down",
        id
      });
    }

    const toolbar = document.createElement("div");
    toolbar.style.userSelect = "none";
    toolbar.style.display = "flex";
    toolbar.style.gap = "4px";
    toolbar.append(select, run, pin, hide, up, down, remove, close);

    panel.appendChild(toolbar);
    box.appendChild(panel);
  }

  const collapse = () => {
    if (!record.view) return;
    if (cell.dirty) {
      cell.dirty = false;
      send({
        type: "modify",
        id,
        mode: cell.mode,
        value: cell.value
      });
    }
    record.view.destroy();
    record.view = null;
    panel.remove();
    panel = null;
  }

  toggle.onclick = () => {
    if (record.view) collapse();
    else expand();
  }

  menu.append(add, toggle);
  box.append(menu);

  const observer = new ResizeObserver(() => {
    const r = box.getBoundingClientRect();
    sendOverlayResize(id, r.height + 17 + 17);
    resizeWorker();
  });
  observer.observe(container);

  const record = {
    container,
    box,
    cell,
    observer,
    view: null,
    expand,
    collapse
  };
  overlays.set(id, record);
  order.push(id);

  if (cell.value.trim().length === 0 || cell.pinned) expand();

  return container;
}

const clear = () => {
  nextId = 0;
  for (const id of [...order]) {
    const current = overlays.get(id);
    if (!current) continue;
    current.observer.disconnect();
    current.container.remove();
    overlays.delete(id);
    pendingOverlayResize.delete(id);
  }
  order.length = 0;
};

const openNotebook = (html, isFresh = false) => {
  fresh = isFresh;
  if (isFresh) {
    fileHandle = null;
    fileName.textContent = "untitled";
  }
  if (!ready) {
    queued = html;
    return;
  }
  send({
    type: "open",
    value: html
  });
};

const handleMessage = (msg) => {
  switch (msg.type) {
    case "hello":
      ready = true;
      openNotebook(queued ?? freshNotebook, !queued);
      break;
    case "notebook":
      clear();
      for (const cell of msg.value.cells) {
        createOverlay(nextId++, cell);
      }
      notebookTitle = msg.value.title || "untitled";
      document.title = `${notebookTitle} | Observable Editor`;
      if (fresh && order.length) {
        const first = overlays.get(order[0]);
        if (!first.view) first.expand();
        first.view?.focus();
      }
      fresh = false;
      break;
    case "save":
      saveNotebook(msg.value);
      break;
    case "loaded":
      fileHandle = null;
      fileName.textContent = msg.value;
      unsaved = false;
      setStatus("Loaded");
      break;
    case "error":
      setStatus(msg.value);
      break;
    case "resizeCells":
      for (const [id, m] of msg.values) {
        const current = overlays.get(id);
        if (!current) continue;
        const container = current.container;
        container.style.paddingTop = `${m}px`;
        const r = container.getBoundingClientRect();
        sendOverlayResize(id, r.height - m + 17);
      }
      resizeWorker();
      break;
  }
};

channel.port1.onmessage = (e) => handleMessage(e.data);

const init = () => {
  if (initialized) return;
  initialized = true;
  worker.contentWindow.postMessage({ type: "init" }, "*", [channel.port2]);
};

worker.addEventListener("load", init);

window.addEventListener("message", (e) => {
  if (e.source === worker.contentWindow && e.data?.type === "hello") init();
});

const requestSave = () => {
  if (!ready) return;
  send({
    type: "sync",
    values: order.map((id) => [id, overlays.get(id).cell.value])
  });
  send({ type: "save" });
};

loadButton.onclick = () => loadNotebook();

saveButton.onclick = () => requestSave();

window.addEventListener("keydown", (event) => {
  if ((event.ctrlKey || event.metaKey) && !event.shiftKey && event.key.toLowerCase() === "s") {
    event.preventDefault();
    requestSave();
  }
});

window.addEventListener("beforeunload", (event) => {
  if (unsaved) {
    event.preventDefault();
    event.returnValue = "";
  }
});

document.addEventListener("dragover", (event) => {
  event.preventDefault();
  event.dataTransfer.dropEffect = "copy";
});

document.addEventListener("drop", async (event) => {
  event.preventDefault();
  const files = [...event.dataTransfer.files];
  if (!files.length) return;
  const file = files.find(file =>
    file.type === "text/html" || /\.html?$/i.test(file.name)
  );
  if (!file) return;
  const text = await file.text();
  if (!isNotebook(text)) return setStatus("Not an Observable notebook");
  fileHandle = null;
  for (const item of [...event.dataTransfer.items]) {
    if (item.kind !== "file") continue;
    const handle = await item.getAsFileSystemHandle?.();
    if (handle?.kind === "file" && handle.name === file.name) {
      fileHandle = handle;
      break;
    }
  }
  fileName.textContent = file.name;
  unsaved = false;
  setStatus("Loaded");
  openNotebook(text);
});
