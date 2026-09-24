import "./chunk-RRBDIJ6C.js";

// node_modules/@observablehq/notebook-kit/dist/src/runtime/stdlib/xlsx.js
import Excel from "https://cdn.jsdelivr.net/npm/exceljs/+esm";
var Workbook = class _Workbook {
  constructor(workbook) {
    Object.defineProperties(this, {
      _: { value: workbook },
      sheetNames: { value: workbook.worksheets.map((s) => s.name), enumerable: true }
    });
  }
  static async load(buffer) {
    const workbook = new Excel.Workbook();
    await workbook.xlsx.load(buffer);
    return new _Workbook(workbook);
  }
  sheet(name, options) {
    const sname = typeof name === "number" ? this.sheetNames[name] : this.sheetNames.includes(name = `${name}`) ? name : null;
    if (sname == null)
      throw new Error(`Sheet not found: ${name}`);
    const sheet = this._.getWorksheet(sname);
    if (!sheet)
      throw new Error(`Sheet not found: ${name}`);
    return extract(sheet, options);
  }
};
Object.defineProperty(Workbook, "name", { value: "Workbook" });
function extract(sheet, { range, headers } = {}) {
  let [[c0, r0], [c1, r1]] = parseRange(range, sheet);
  const headerRow = headers ? sheet.getRow(++r0) : null;
  const nameset = /* @__PURE__ */ new Set(["#"]);
  for (let n = c0; n <= c1; n++) {
    const value = headerRow ? valueOf(headerRow.findCell(n + 1)) : null;
    let name = value && value + "" || toColumn(n);
    while (nameset.has(name))
      name += "_";
    nameset.add(name);
  }
  const names = new Array(c0).concat(Array.from(nameset));
  const columns = names.filter(() => true);
  const output = Object.assign(new Array(r1 - r0 + 1), { columns });
  for (let r = r0; r <= r1; r++) {
    const row = output[r - r0] = Object.create(null, { "#": { value: r + 1 } });
    const _row = sheet.getRow(r + 1);
    if (_row.hasValues)
      for (let c = c0; c <= c1; c++) {
        const value = valueOf(_row.findCell(c + 1));
        if (value != null)
          row[names[c + 1]] = value;
      }
  }
  return output;
}
function isPrimitive(value) {
  return !value || typeof value !== "object" || value instanceof Date;
}
function isFormula(value) {
  return "formula" in value || "sharedFormula" in value;
}
function isRichText(value) {
  return "richText" in value;
}
function isHyperlink(value) {
  return "hyperlink" in value;
}
function valueOf(cell) {
  if (!cell)
    return;
  const { value } = cell;
  if (isPrimitive(value))
    return value;
  if (isFormula(value))
    return isPrimitive(value.result) ? value.result : NaN;
  if (isRichText(value))
    return richText(value);
  if (isHyperlink(value))
    return hyperlink(value);
  return void 0;
}
function richText(value) {
  return value.richText.map((d) => d.text).join("");
}
function hyperlink({ hyperlink: hyperlink2, text }) {
  return hyperlink2 && hyperlink2 !== text ? `${hyperlink2} ${text}` : text;
}
function parseRange(specifier = ":", { columnCount, rowCount }) {
  specifier = `${specifier}`;
  if (!specifier.match(/^[A-Z]*\d*:[A-Z]*\d*$/))
    throw new Error("Malformed range specifier");
  const [[c0 = 0, r0 = 0], [c1 = columnCount - 1, r1 = rowCount - 1]] = specifier.split(":").map(fromCellReference);
  return [
    [c0, r0],
    [c1, r1]
  ];
}
function toColumn(c) {
  let sc = "";
  c++;
  do
    sc = String.fromCharCode(64 + (c % 26 || 26)) + sc;
  while (c = Math.floor((c - 1) / 26));
  return sc;
}
function fromCellReference(specifier) {
  const [, sc, sr] = specifier.match(/^([A-Z]*)(\d*)$/);
  let c = 0;
  if (sc) {
    for (let i = 0; i < sc.length; i++) {
      c += Math.pow(26, sc.length - i - 1) * (sc.charCodeAt(i) - 64);
    }
  }
  return [c ? c - 1 : void 0, sr ? +sr - 1 : void 0];
}
export {
  Workbook
};
