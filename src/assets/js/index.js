const root = document.documentElement;
const main = document.querySelector("main");
const worker = document.querySelector("#worker");
const overlay = document.querySelector("#overlay");

const overlays = new Map();

const pendingOverlayResize = new Map();
let overlayResizeScheduled = false;

const sendOverlayResize = (id, value) => {
  pendingOverlayResize.set(id, value);
  if (!overlayResizeScheduled) {
    overlayResizeScheduled = true;
    requestAnimationFrame(() => {
      worker.contentWindow.postMessage({
        type: "overlaysResize",
        values: [...pendingOverlayResize]
      }, "*");
      pendingOverlayResize.clear();
      overlayResizeScheduled = false;
    });
  }
}

let resizeWorkerScheduled = false;
const resizeWorker = () => {
  if (resizeWorkerScheduled) return;
  resizeWorkerScheduled = true;
  requestAnimationFrame(() => {
    worker.style.height = `${overlay.scrollHeight + 112}px`;
    resizeWorkerScheduled = false;
  });
}

const order = [];
let nextId = 0;

const createOverlay = (id,cell) => {
  const container = document.createElement("div");
  container.style.marginTop = "17px";
  container.style.marginBottom = "17px";
  //container.style.background = "#f005";
  overlay.appendChild(container);

  const e = document.createElement("div");
  e.style.pointerEvents = "auto";
  e.style.background = "var(--theme-background-alt)";
  e.style.borderRadius = "5px";
  e.style.outlineOffset = "-1px";
  e.style.outline = "1px solid var(--theme-foreground-faintest)";
  e.style.marginTop = "17px";
  container.appendChild(e);

  const editor = document.createElement("div");

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
    createOverlay(nextId++,cell);
    const index = order.indexOf(id);
    const nid = nextId-1;
    order.splice(order.indexOf(nid),1);
    order.splice(index+1,0,nid);
    const current = overlays.get(id);
    const inserted = overlays.get(nid);
    overlay.insertBefore(
      inserted.container,
      current.container.nextSibling
    );
    worker.contentWindow.postMessage({
      type: "insert",
      cell,
      id
    }, "*");
  };

  const more = document.createElement("div");
  more.textContent = `${id}`;
  more.style.width = "100%";
  more.style.display = "flex";
  more.style.alignItems = "center";
  more.style.justifyContent = "center";
  more.style.cursor = "pointer";

  let textarea;
  const resize = () => {
    cell.value = textarea.value;
    textarea.style.height = "0px";
    textarea.style.height = textarea.scrollHeight+"px";
  };
  let select;
  const change = () => {
    cell.mode = select.value;
    worker.contentWindow.postMessage({
      type: "modify",
      id,
      mode: cell.mode,
      value: cell.value
    }, "*");
  }

  let expanded = false;
  more.onclick = () => {
    expanded = !expanded;
    if (expanded) {
      const ec = document.createElement("div");
      ec.style.display = "flex";
      ec.style.flexDirection = "column";
      ec.style.gap = "4px";
      ec.style.padding = "9px";
      editor.appendChild(ec);

      textarea = document.createElement("textarea");
      textarea.style.resize = "none";
      textarea.style.overflow = "hidden";
      textarea.value = cell?.value ?? "";
      textarea.addEventListener("input", resize);
      window.addEventListener("resize", resize);

      select = document.createElement("select");
      select.style.fontFamily = "inherit";
      for (const type of ["ojs", "js", "ts", "html", "md", "tex", "dot"]) {
        const option = document.createElement("option");
        option.value = type;
        option.textContent = type;
        select.appendChild(option);
      }
      select.value = cell.mode;
      select.addEventListener("input", change);

      const run = document.createElement("button");
      run.style.fontFamily = "inherit";
      run.textContent = "Run";
      run.onclick = () => {
        worker.contentWindow.postMessage({
          type: "modify",
          id,
          mode: cell.mode,
          value: cell.value
        }, "*");
      }

      const remove = document.createElement("button");
      remove.style.fontFamily = "inherit";
      remove.textContent = "Delete";
      remove.onclick = () => {
        if (order.length>1) {
          textarea.removeEventListener("input", resize);
          window.removeEventListener("resize", resize);
          select.removeEventListener("input", change);
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
          worker.contentWindow.postMessage({
            type: "remove",
            id
          }, "*");
          resizeWorker();
        }
      };

      const pin = document.createElement("button");
      pin.style.fontFamily = "inherit";
      pin.textContent = cell.pinned ? "Unpin" : "Pin";
      pin.onclick = () => {
        cell.pinned = !cell.pinned;
        pin.textContent = cell.pinned ? "Unpin" : "Pin";
        worker.contentWindow.postMessage({
          type: "pin",
          id
        }, "*");
      }

      const hide = document.createElement("button");
      hide.style.fontFamily = "inherit";
      hide.textContent = cell.hidden ? "Show" : "Hide";
      hide.onclick = () => {
        cell.hidden = !cell.hidden;
        hide.textContent = cell.hidden ? "Show" : "Hide";
        worker.contentWindow.postMessage({
          type: "hide",
          id
        }, "*");
      }

      const up = document.createElement("button");
      up.textContent = "↑";//"▲";
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
        worker.contentWindow.postMessage({
          type: "up",
          id
        }, "*");
      }

      const down = document.createElement("button");
      down.textContent = "↓";//"▼";
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
        worker.contentWindow.postMessage({
          type: "down",
          id
        }, "*");
      }

      const toolbar = document.createElement("div");
      //toolbar.style.fontFamily = "var(--serif)";
      toolbar.style.userSelect = "none";
      toolbar.style.display = "flex";
      toolbar.style.gap = "4px";
      toolbar.append(select,run,pin,hide,up,down,remove);

      ec.append(textarea,toolbar);
      resize();
    } else {
      textarea.removeEventListener("input", resize);
      window.removeEventListener("resize", resize);
      select.removeEventListener("input", change);
      editor.replaceChildren();
    }
  }

  menu.append(add,more);
  e.append(editor,menu);

  const observer = new ResizeObserver(() => {
    const r = e.getBoundingClientRect();
    sendOverlayResize(id,r.height+17+17);//e.offsetHeight+17);
    resizeWorker();
  });
  observer.observe(container);

  overlays.set(id, {
    container,
    e,
    cell,
    observer
  });
  order.push(id);

  if (cell.value.trim().length===0 || cell.pinned) more.onclick();

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

const params = new URLSearchParams(location.search);
const path = params.get("path");

window.addEventListener("message", e => {
  if (e.source !== worker.contentWindow) return;
  const msg = e.data;
  switch (msg.type) {
    case "hello":
      (async () => {
        if (path) {
          document.body.querySelector("div a").href = "./notebooks.html?path="+path.replace(/\/[^/]*\.html?$/,"");
          open(await (await fetch(path)).text());
        }
      })();
      break;
    case "notebook":
      clear();
      for (const cell of msg.value.cells) {
        createOverlay(nextId++,cell);
      }
      break;
    case "save":
      fetch("/api/save", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          path,
          html: msg.value
        })
      })
        .then(response => {
          if (!response.ok) {
            alert(`Save failed: Error ${response.status}`);
          }
          return response.text();
        })
        .then(() => {
          alert("Saved",msg.value.title);
        })
        .catch(error => {
          console.error(error);
        });
      break;
    case "resizeCells":
      for (const [id, m] of msg.values) {
        const current = overlays.get(id);
        if (!current) continue;
        const container = current.container;
        container.style.paddingTop = `${m}px`;
        const r = container.getBoundingClientRect();
        sendOverlayResize(id,r.height-m+17);//container.offsetHeight-m+17);
      }
      resizeWorker();
      break;
  }
});

const open = (html) => {
  clear();
  worker.contentWindow.postMessage({
    type: "open",
    value: html
  }, "*");
};

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

saveButton.onclick = () => {
  worker.contentWindow.postMessage({
    type: "save"
  }, "*");
};

/*
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
*/