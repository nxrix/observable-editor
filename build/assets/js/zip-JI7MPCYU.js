import {
  AbstractFile
} from "./chunk-B4M22AML.js";
import "./chunk-RRBDIJ6C.js";

// node_modules/@observablehq/notebook-kit/dist/src/runtime/stdlib/zip.js
import JSZip from "https://cdn.jsdelivr.net/npm/jszip/+esm";
var ZipArchive = class _ZipArchive {
  constructor(archive) {
    Object.defineProperties(this, {
      _: { value: archive },
      filenames: { value: Object.keys(archive.files).filter((name) => !archive.files[name].dir) }
    });
  }
  static async from(buffer) {
    return new _ZipArchive(await JSZip.loadAsync(buffer));
  }
  file(path) {
    const object = this._.file(path = `${path}`);
    if (!object || object.dir)
      throw new Error(`file not found: ${path}`);
    return new ZipArchiveEntry(object);
  }
};
var ZipArchiveEntry = class extends AbstractFile {
  constructor(object) {
    super(object.name);
    Object.defineProperty(this, "href", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperties(this, {
      _: { value: object },
      _url: { writable: true }
    });
  }
  async url() {
    return this._url || (this._url = this.blob().then(URL.createObjectURL));
  }
  async blob() {
    return this._.async("blob");
  }
  async arrayBuffer() {
    return this._.async("arraybuffer");
  }
  async text() {
    return this._.async("text");
  }
  async json() {
    return JSON.parse(await this.text());
  }
  async stream() {
    return (await this.blob()).stream();
  }
};
Object.defineProperty(ZipArchive, "name", { value: "ZipArchive" });
Object.defineProperty(ZipArchiveEntry, "name", { value: "ZipArchiveEntry" });
export {
  ZipArchive
};
