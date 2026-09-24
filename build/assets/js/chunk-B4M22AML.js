// node_modules/@observablehq/notebook-kit/dist/src/runtime/stdlib/dsv.js
var DATE_TEST = /^([-+]\d{2})?\d{4}-\d{2}-\d{2}|\d{1,2}\/\d{1,2}\/\d{2,4}([T ]\d{2}:\d{2}(:\d{2}(\.\d{3})?)?(Z|[-+]\d{2}:\d{2})?)?$/;
var SAMPLE_SIZE = 100;
function inferTypes(rows, columns) {
  const output = rows;
  const n = rows.length;
  const k = Math.min(n, SAMPLE_SIZE);
  for (const column of columns) {
    let booleans = 0;
    let numbers = 0;
    let dates = 0;
    let strings = 0;
    for (let i = 0; i < k; ++i) {
      const value = rows[i][column]?.trim();
      if (!value)
        continue;
      ++strings;
      if (/^(true|false)$/i.test(value))
        ++booleans;
      else if (!isNaN(Number(value)))
        ++numbers;
      else if (DATE_TEST.test(value))
        ++dates;
    }
    let coerce = void 0;
    let typeCount = Math.max(1, Math.ceil(strings * 0.9)) - 1;
    if (booleans > typeCount)
      coerce = coerceBoolean, typeCount = booleans;
    if (numbers > typeCount)
      coerce = coerceNumber, typeCount = numbers;
    if (dates > typeCount)
      coerce = coerceDate, typeCount = dates;
    if (!coerce)
      continue;
    for (let i = 0; i < n; ++i) {
      output[i][column] = coerce(rows[i][column]);
    }
  }
  return output;
}
function coerceBoolean(value) {
  const trimmed = value.trim().toLowerCase();
  return trimmed === "true" ? true : trimmed === "false" ? false : trimmed ? void 0 : null;
}
function coerceNumber(value) {
  const trimmed = value.trim();
  return trimmed ? Number(value) : NaN;
}
function coerceDate(value) {
  const trimmed = value.trim();
  return trimmed ? new Date(DATE_TEST.test(trimmed) ? trimmed : NaN) : null;
}

// node_modules/@observablehq/notebook-kit/dist/src/runtime/stdlib/fileAttachment.js
var files = /* @__PURE__ */ new Map();
var strict = false;
var FileAttachment = (name, base = document.baseURI) => {
  const href = new URL(name, base).href;
  let file = files.get(href);
  if (!file) {
    if (strict) {
      throw new Error(`File not found: ${name}`);
    } else {
      file = new FileAttachmentImpl(href, name.split("/").pop());
      files.set(href, file);
    }
  }
  return file;
};
async function fetchFile(file) {
  const response = await fetch(file.href);
  if (!response.ok)
    throw new Error(`Unable to load file: ${file.name}`);
  return response;
}
var AbstractFile = class {
  constructor(name, mimeType = guessMimeType(name), lastModified, size) {
    Object.defineProperty(this, "name", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "mimeType", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "lastModified", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "size", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperties(this, {
      name: { value: `${name}`, enumerable: true },
      mimeType: { value: `${mimeType}`, enumerable: true },
      lastModified: { value: lastModified === void 0 ? void 0 : +lastModified, enumerable: true },
      // prettier-ignore
      size: { value: size === void 0 ? void 0 : +size, enumerable: true }
    });
  }
  async url() {
    return this.href;
  }
  async blob() {
    return (await fetchFile(this)).blob();
  }
  async arrayBuffer() {
    return (await fetchFile(this)).arrayBuffer();
  }
  async text(encoding) {
    return encoding === void 0 ? (await fetchFile(this)).text() : new TextDecoder(encoding).decode(await this.arrayBuffer());
  }
  async json() {
    return (await fetchFile(this)).json();
  }
  async stream() {
    return (await fetchFile(this)).body;
  }
  async dsv({ delimiter = ",", array = false, typed = false } = {}) {
    const [text, d3] = await Promise.all([this.text(), import("https://cdn.jsdelivr.net/npm/d3-dsv/+esm")]);
    const format = d3.dsvFormat(delimiter);
    const parse = array ? (typed && (typed = true), format.parseRows) : format.parse;
    const output = parse(text, typed === true ? d3.autoType : void 0);
    if (typed === "auto")
      inferTypes(output, output.columns);
    return output;
  }
  async csv(options) {
    return this.dsv({ ...options, delimiter: "," });
  }
  async tsv(options) {
    return this.dsv({ ...options, delimiter: "	" });
  }
  async image(props) {
    const url = await this.url();
    return new Promise((resolve, reject) => {
      const i = new Image();
      if (new URL(url, document.baseURI).origin !== location.origin)
        i.crossOrigin = "anonymous";
      Object.assign(i, props);
      i.onload = () => resolve(i);
      i.onerror = () => reject(new Error(`Unable to load file: ${this.name}`));
      i.src = url;
    });
  }
  async arrow() {
    const [Flechette, buffer] = await Promise.all([import("https://cdn.jsdelivr.net/npm/@uwdata/flechette/+esm"), this.arrayBuffer()]);
    return Flechette.tableFromIPC(buffer, { useDate: true });
  }
  async arquero(options) {
    let request;
    let from;
    switch (this.mimeType) {
      case "application/json":
        request = this.text();
        from = "fromJSON";
        break;
      // @ts-expect-error fall through
      case "text/tab-separated-values":
        if (options?.delimiter === void 0)
          options = { ...options, delimiter: "	" };
      // fall through
      case "text/csv":
        request = this.text();
        from = "fromCSV";
        break;
      default:
        if (/\.arrow$/i.test(this.name)) {
          request = this.arrow();
          from = "fromArrow";
        } else if (/\.parquet$/i.test(this.name)) {
          request = this.parquet();
          from = "fromArrow";
        } else {
          throw new Error(`unable to determine Arquero loader: ${this.name}`);
        }
        break;
    }
    const [aq, body] = await Promise.all([import("https://cdn.jsdelivr.net/npm/arquero/+esm"), request]);
    return aq[from](body, options);
  }
  async parquet() {
    const [Flechette, Parquet, buffer] = await Promise.all([import("https://cdn.jsdelivr.net/npm/@uwdata/flechette/+esm"), import("https://cdn.jsdelivr.net/npm/parquet-wasm/+esm").then(async (Parquet2) => (await Parquet2.default("https://cdn.jsdelivr.net/npm/parquet-wasm/esm/parquet_wasm_bg.wasm"), Parquet2)), this.arrayBuffer()]);
    return Flechette.tableFromIPC(Parquet.readParquet(new Uint8Array(buffer)).intoIPCStream(), { useDate: true });
  }
  async zip() {
    const [{ ZipArchive }, buffer] = await Promise.all([import("./zip-JI7MPCYU.js"), this.arrayBuffer()]);
    return ZipArchive.from(buffer);
  }
  async xml(mimeType = "application/xml") {
    return new DOMParser().parseFromString(await this.text(), mimeType);
  }
  async html() {
    return this.xml("text/html");
  }
  async xlsx() {
    const [{ Workbook }, buffer] = await Promise.all([import("./xlsx-ZJNPUQ5S.js"), this.arrayBuffer()]);
    return Workbook.load(buffer);
  }
};
function guessMimeType(name) {
  const i = name.lastIndexOf(".");
  const j = name.lastIndexOf("/");
  const extension = i > 0 && (j < 0 || i > j) ? name.slice(i).toLowerCase() : "";
  switch (extension) {
    case ".csv":
      return "text/csv";
    case ".tsv":
      return "text/tab-separated-values";
    case ".json":
      return "application/json";
    case ".html":
      return "text/html";
    case ".xml":
      return "application/xml";
    case ".png":
      return "image/png";
    case ".jpg":
      return "image/jpg";
    case ".js":
      return "text/javascript";
    default:
      return "application/octet-stream";
  }
}
var FileAttachmentImpl = class extends AbstractFile {
  constructor(href, name, mimeType, lastModified, size) {
    super(name, mimeType, lastModified, size);
    Object.defineProperty(this, "href", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "href", { value: href });
  }
};
Object.defineProperty(FileAttachmentImpl, "name", { value: "FileAttachment" });
FileAttachment.prototype = FileAttachmentImpl.prototype;
function fileAttachments(resolve) {
  function FileAttachment2(name) {
    const result = resolve(name += "");
    if (result == null)
      throw new Error(`File not found: ${name}`);
    if (typeof result === "object" && "url" in result) {
      const { url, mimeType, lastModified, size } = result;
      return new FileAttachmentImpl(url, name, mimeType, lastModified, size);
    }
    return new FileAttachmentImpl(result, name);
  }
  FileAttachment2.prototype = FileAttachmentImpl.prototype;
  return FileAttachment2;
}

export {
  FileAttachment,
  AbstractFile,
  fileAttachments
};
