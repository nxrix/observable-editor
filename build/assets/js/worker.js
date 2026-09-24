import {
  FileAttachment,
  fileAttachments
} from "./chunk-B4M22AML.js";
import {
  __export
} from "./chunk-RRBDIJ6C.js";

// node_modules/@observablehq/notebook-kit/dist/src/javascript/globals.js
var defaultGlobals = /* @__PURE__ */ new Set([
  "Array",
  "ArrayBuffer",
  "atob",
  "AudioContext",
  "Blob",
  "Boolean",
  "BigInt",
  "btoa",
  "clearInterval",
  "clearTimeout",
  "console",
  "crypto",
  "CustomEvent",
  "DataView",
  "Date",
  "decodeURI",
  "decodeURIComponent",
  "devicePixelRatio",
  "document",
  "encodeURI",
  "encodeURIComponent",
  "Error",
  "escape",
  "eval",
  "fetch",
  "File",
  "FileList",
  "FileReader",
  "Float32Array",
  "Float64Array",
  "Function",
  "Headers",
  "Image",
  "ImageData",
  "Infinity",
  "Int16Array",
  "Int32Array",
  "Int8Array",
  "Intl",
  "isFinite",
  "isNaN",
  "JSON",
  "Map",
  "Math",
  "NaN",
  "Number",
  "navigator",
  "Object",
  "observable",
  // for observable.params.foo
  "parseFloat",
  "parseInt",
  "performance",
  "Path2D",
  "Promise",
  "Proxy",
  "RangeError",
  "ReferenceError",
  "Reflect",
  "RegExp",
  "cancelAnimationFrame",
  "requestAnimationFrame",
  "Set",
  "setInterval",
  "setTimeout",
  "String",
  "Symbol",
  "SyntaxError",
  "TextDecoder",
  "TextEncoder",
  "this",
  "TypeError",
  "Uint16Array",
  "Uint32Array",
  "Uint8Array",
  "Uint8ClampedArray",
  "undefined",
  "unescape",
  "URIError",
  "URL",
  "WeakMap",
  "WeakSet",
  "WebSocket",
  "Worker",
  "window"
]);

// node_modules/@observablehq/notebook-kit/dist/src/javascript/imports/jsr.js
function resolveJsrImport(specifier) {
  if (!specifier.startsWith("jsr:"))
    return specifier;
  return `https://esm.sh/jsr/${specifier.slice(4)}`;
}

// node_modules/@observablehq/notebook-kit/dist/src/javascript/imports/npm.js
function parseNpmSpecifier(specifier) {
  const parts = specifier.split("/");
  const namerange = specifier.startsWith("@") ? [parts.shift(), parts.shift()].join("/") : parts.shift();
  const ranged = namerange.indexOf("@", 1);
  const name = ranged > 0 ? namerange.slice(0, ranged) : namerange;
  const range2 = ranged > 0 ? namerange.slice(ranged) : "";
  const path = parts.length > 0 ? `/${parts.join("/")}` : "";
  return { name, range: range2, path };
}
function resolveNpmImport(specifier) {
  if (!specifier.startsWith("npm:"))
    return specifier;
  const { name, range: range2, path } = parseNpmSpecifier(specifier.slice(4));
  return `https://cdn.jsdelivr.net/npm/${name}${range2 || getDefaultRange(name)}${path ? !/(\.\w+|\/|\/\+esm)$/.test(path) ? `${path}/+esm` : path : getDefaultPath(name)}`;
}
function getDefaultRange(name) {
  switch (name) {
    case "@duckdb/duckdb-wasm":
      return "@1.32.0";
    // https://github.com/duckdb/duckdb-wasm/issues/1994
    case "apache-arrow":
      return "@17.0.0";
    // to match @duckdb/duckdb-wasm 1.32.0
    default:
      return "";
  }
}
function getDefaultPath(name) {
  switch (name) {
    case "mermaid":
      return "/dist/mermaid.esm.min.mjs/+esm";
    case "echarts":
      return "/dist/echarts.esm.min.js/+esm";
    case "jquery-ui":
      return "/dist/jquery-ui.js/+esm";
    case "deck.gl":
      return "/dist.min.js/+esm";
    case "react-dom":
      return "/client/+esm";
    default:
      return "/+esm";
  }
}

// node_modules/@observablehq/notebook-kit/dist/src/javascript/imports/observable.js
function resolveObservableImport(specifier) {
  if (!specifier.startsWith("observable:"))
    return specifier;
  let path = specifier.slice("observable:".length);
  if (/^[0-9a-f]{16}(@|$)/.test(path))
    path = `d/${path}`;
  return `https://api.observablehq.com/${path}.js?v=4`;
}
function isObservableImport(node, specifier) {
  const type = node.attributes?.find((a) => getImportAttributeKey(a) === "type")?.value;
  return type ? type.value === "observable" : specifier.startsWith("observable:");
}
function getImportAttributeKey(node) {
  return node.key.type === "Identifier" ? node.key.name : String(node.key.value);
}
function renderObservableImport(source, node, inputs, renameImport = String) {
  if (!inputs.includes("@variable"))
    inputs.push("@variable");
  return `(import(${source}).then((_) => {
  const module = __variable._module._runtime.module(_.default)${"injections" in node ? `.derive([${renderObservableInjections(node)}], __variable._module)` : ""};
  const outputs = new Map(Array.from(__variable._outputs, (v) => [v._name, v]));${flatMapImportSpecifiers(node, (specifier) => {
    const i2 = renameImport(getImportedName(specifier));
    const l = getLocalName(specifier);
    return `
  outputs.get(${JSON.stringify(l)})?.import(${JSON.stringify(i2)}${i2 === l ? "" : `, ${JSON.stringify(l)}`}, module);`;
  }).join("")}
  return {};
}))`;
}
function renderObservableInjections(node) {
  return node.injections.map((node2) => {
    if (node2.imported.type !== "Identifier")
      throw new SyntaxError("unexpected import specifier");
    const imported = node2.imported.name;
    const local = node2.local.name;
    let injection;
    if (imported === local) {
      injection = `"${local}"`;
      if (node2.view)
        injection += `, "viewof ${local}"`;
      if (node2.mutable)
        injection += `, "mutable ${local}"`;
    } else {
      injection = `{name: "${imported}", alias: "${local}"}`;
      if (node2.view)
        injection += `, {name: "viewof ${imported}", alias: "viewof ${local}"}`;
      if (node2.mutable)
        injection += `, {name: "mutable ${imported}", alias: "mutable ${local}"}`;
    }
    return injection;
  }).join(", ");
}
function toSpecialIdentifier(identifier, type) {
  return { ...identifier, name: `${type}$${identifier.name}` };
}
function toSpecialImportSpecifier(specifier, type) {
  if (specifier.imported.type !== "Identifier")
    throw new SyntaxError("unexpected import specifier");
  return {
    ...specifier,
    imported: toSpecialIdentifier(specifier.imported, type),
    local: toSpecialIdentifier(specifier.local, type)
  };
}
function isViewImport(node) {
  return "view" in node && !!node.view;
}
function isMutableImport(node) {
  return "mutable" in node && !!node.mutable;
}
function dedollar(input3) {
  const match = /^(viewof|mutable)([$]+)([^$].*)$/.exec(input3);
  return match ? `${match[1]}${match[2].length > 1 ? match[2].slice(1) : " "}${match[3]}` : input3;
}

// node_modules/@observablehq/notebook-kit/dist/src/javascript/strings.js
function isLiteral(node) {
  return node.type === "Literal";
}
function isTemplateLiteral(node) {
  return node.type === "TemplateLiteral";
}
function isStringLiteral(node) {
  return isLiteral(node) ? /^['"]/.test(node.raw) : isTemplateLiteral(node) ? node.expressions.every(isStringLiteral) : isBinaryExpression(node) ? node.operator === "+" && isStringLiteral(node.left) && isStringLiteral(node.right) : isMemberExpression(node) ? "value" in node : false;
}
function getStringLiteralValue(node) {
  return node.type === "TemplateLiteral" ? getTemplateLiteralValue(node) : node.type === "BinaryExpression" ? getBinaryExpressionValue(node) : node.value;
}
function getTemplateLiteralValue(node) {
  let value = node.quasis[0].value.cooked;
  for (let i2 = 0; i2 < node.expressions.length; ++i2) {
    value += getStringLiteralValue(node.expressions[i2]);
    value += node.quasis[i2 + 1].value.cooked;
  }
  return value;
}
function getBinaryExpressionValue(node) {
  return getStringLiteralValue(node.left) + getStringLiteralValue(node.right);
}
function isMemberExpression(node) {
  return node.type === "MemberExpression";
}
function isBinaryExpression(node) {
  return node.type === "BinaryExpression";
}

// node_modules/acorn/dist/acorn.mjs
var acorn_exports = {};
__export(acorn_exports, {
  Node: () => Node,
  Parser: () => Parser,
  Position: () => Position,
  SourceLocation: () => SourceLocation,
  TokContext: () => TokContext,
  Token: () => Token,
  TokenType: () => TokenType,
  defaultOptions: () => defaultOptions,
  getLineInfo: () => getLineInfo,
  isIdentifierChar: () => isIdentifierChar,
  isIdentifierStart: () => isIdentifierStart,
  isNewLine: () => isNewLine,
  keywordTypes: () => keywords,
  lineBreak: () => lineBreak,
  lineBreakG: () => lineBreakG,
  nonASCIIwhitespace: () => nonASCIIwhitespace,
  parse: () => parse3,
  parseExpressionAt: () => parseExpressionAt2,
  tokContexts: () => types,
  tokTypes: () => types$1,
  tokenizer: () => tokenizer2,
  version: () => version
});
var astralIdentifierCodes = [509, 0, 227, 0, 150, 4, 294, 9, 1368, 2, 2, 1, 6, 3, 41, 2, 5, 0, 166, 1, 574, 3, 9, 9, 7, 9, 32, 4, 318, 1, 78, 5, 71, 10, 50, 3, 123, 2, 54, 14, 32, 10, 3, 1, 11, 3, 46, 10, 8, 0, 46, 9, 7, 2, 37, 13, 2, 9, 6, 1, 45, 0, 13, 2, 49, 13, 9, 3, 2, 11, 83, 11, 7, 0, 3, 0, 158, 11, 6, 9, 7, 3, 56, 1, 2, 6, 3, 1, 3, 2, 10, 0, 11, 1, 3, 6, 4, 4, 68, 8, 2, 0, 3, 0, 2, 3, 2, 4, 2, 0, 15, 1, 83, 17, 10, 9, 5, 0, 82, 19, 13, 9, 214, 6, 3, 8, 28, 1, 83, 16, 16, 9, 82, 12, 9, 9, 7, 19, 58, 14, 5, 9, 243, 14, 166, 9, 71, 5, 2, 1, 3, 3, 2, 0, 2, 1, 13, 9, 120, 6, 3, 6, 4, 0, 29, 9, 41, 6, 2, 3, 9, 0, 10, 10, 47, 15, 199, 7, 137, 9, 54, 7, 2, 7, 17, 9, 57, 21, 2, 13, 123, 5, 4, 0, 2, 1, 2, 6, 2, 0, 9, 9, 49, 4, 2, 1, 2, 4, 9, 9, 55, 9, 266, 3, 10, 1, 2, 0, 49, 6, 4, 4, 14, 10, 5350, 0, 7, 14, 11465, 27, 2343, 9, 87, 9, 39, 4, 60, 6, 26, 9, 535, 9, 470, 0, 2, 54, 8, 3, 82, 0, 12, 1, 19628, 1, 4178, 9, 519, 45, 3, 22, 543, 4, 4, 5, 9, 7, 3, 6, 31, 3, 149, 2, 1418, 49, 513, 54, 5, 49, 9, 0, 15, 0, 23, 4, 2, 14, 1361, 6, 2, 16, 3, 6, 2, 1, 2, 4, 101, 0, 161, 6, 10, 9, 357, 0, 62, 13, 499, 13, 245, 1, 2, 9, 233, 0, 3, 0, 8, 1, 6, 0, 475, 6, 110, 6, 6, 9, 4759, 9, 787719, 239];
var astralIdentifierStartCodes = [0, 11, 2, 25, 2, 18, 2, 1, 2, 14, 3, 13, 35, 122, 70, 52, 268, 28, 4, 48, 48, 31, 14, 29, 6, 37, 11, 29, 3, 35, 5, 7, 2, 4, 43, 157, 19, 35, 5, 35, 5, 39, 9, 51, 13, 10, 2, 14, 2, 6, 2, 1, 2, 10, 2, 14, 2, 6, 2, 1, 4, 51, 13, 310, 10, 21, 11, 7, 25, 5, 2, 41, 2, 8, 70, 5, 3, 0, 2, 43, 2, 1, 4, 0, 3, 22, 11, 22, 10, 30, 66, 18, 2, 1, 11, 21, 11, 25, 7, 25, 39, 55, 7, 1, 65, 0, 16, 3, 2, 2, 2, 28, 43, 28, 4, 28, 36, 7, 2, 27, 28, 53, 11, 21, 11, 18, 14, 17, 111, 72, 56, 50, 14, 50, 14, 35, 39, 27, 10, 22, 251, 41, 7, 1, 17, 5, 57, 28, 11, 0, 9, 21, 43, 17, 47, 20, 28, 22, 13, 52, 58, 1, 3, 0, 14, 44, 33, 24, 27, 35, 30, 0, 3, 0, 9, 34, 4, 0, 13, 47, 15, 3, 22, 0, 2, 0, 36, 17, 2, 24, 20, 1, 64, 6, 2, 0, 2, 3, 2, 14, 2, 9, 8, 46, 39, 7, 3, 1, 3, 21, 2, 6, 2, 1, 2, 4, 4, 0, 19, 0, 13, 4, 31, 9, 2, 0, 3, 0, 2, 37, 2, 0, 26, 0, 2, 0, 45, 52, 19, 3, 21, 2, 31, 47, 21, 1, 2, 0, 185, 46, 42, 3, 37, 47, 21, 0, 60, 42, 14, 0, 72, 26, 38, 6, 186, 43, 117, 63, 32, 7, 3, 0, 3, 7, 2, 1, 2, 23, 16, 0, 2, 0, 95, 7, 3, 38, 17, 0, 2, 0, 29, 0, 11, 39, 8, 0, 22, 0, 12, 45, 20, 0, 19, 72, 200, 32, 32, 8, 2, 36, 18, 0, 50, 29, 113, 6, 2, 1, 2, 37, 22, 0, 26, 5, 2, 1, 2, 31, 15, 0, 24, 43, 261, 18, 16, 0, 2, 12, 2, 33, 125, 0, 80, 921, 103, 110, 18, 195, 2637, 96, 16, 1071, 18, 5, 26, 3994, 6, 582, 6842, 29, 1763, 568, 8, 30, 18, 78, 18, 29, 19, 47, 17, 3, 32, 20, 6, 18, 433, 44, 212, 63, 33, 24, 3, 24, 45, 74, 6, 0, 67, 12, 65, 1, 2, 0, 15, 4, 10, 7381, 42, 31, 98, 114, 8702, 3, 2, 6, 2, 1, 2, 290, 16, 0, 30, 2, 3, 0, 15, 3, 9, 395, 2309, 106, 6, 12, 4, 8, 8, 9, 5991, 84, 2, 70, 2, 1, 3, 0, 3, 1, 3, 3, 2, 11, 2, 0, 2, 6, 2, 64, 2, 3, 3, 7, 2, 6, 2, 27, 2, 3, 2, 4, 2, 0, 4, 6, 2, 339, 3, 24, 2, 24, 2, 30, 2, 24, 2, 30, 2, 24, 2, 30, 2, 24, 2, 30, 2, 24, 2, 7, 1845, 30, 7, 5, 262, 61, 147, 44, 11, 6, 17, 0, 322, 29, 19, 43, 485, 27, 229, 29, 3, 0, 208, 30, 2, 2, 2, 1, 2, 6, 3, 4, 10, 1, 225, 6, 2, 3, 2, 1, 2, 14, 2, 196, 60, 67, 8, 0, 1205, 3, 2, 26, 2, 1, 2, 0, 3, 0, 2, 9, 2, 3, 2, 0, 2, 0, 7, 0, 5, 0, 2, 0, 2, 0, 2, 2, 2, 1, 2, 0, 3, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 1, 2, 0, 3, 3, 2, 6, 2, 3, 2, 3, 2, 0, 2, 9, 2, 16, 6, 2, 2, 4, 2, 16, 4421, 42719, 33, 4381, 3, 5773, 3, 7472, 16, 621, 2467, 541, 1507, 4938, 6, 8489];
var nonASCIIidentifierChars = "\u200C\u200D\xB7\u0300-\u036F\u0387\u0483-\u0487\u0591-\u05BD\u05BF\u05C1\u05C2\u05C4\u05C5\u05C7\u0610-\u061A\u064B-\u0669\u0670\u06D6-\u06DC\u06DF-\u06E4\u06E7\u06E8\u06EA-\u06ED\u06F0-\u06F9\u0711\u0730-\u074A\u07A6-\u07B0\u07C0-\u07C9\u07EB-\u07F3\u07FD\u0816-\u0819\u081B-\u0823\u0825-\u0827\u0829-\u082D\u0859-\u085B\u0897-\u089F\u08CA-\u08E1\u08E3-\u0903\u093A-\u093C\u093E-\u094F\u0951-\u0957\u0962\u0963\u0966-\u096F\u0981-\u0983\u09BC\u09BE-\u09C4\u09C7\u09C8\u09CB-\u09CD\u09D7\u09E2\u09E3\u09E6-\u09EF\u09FE\u0A01-\u0A03\u0A3C\u0A3E-\u0A42\u0A47\u0A48\u0A4B-\u0A4D\u0A51\u0A66-\u0A71\u0A75\u0A81-\u0A83\u0ABC\u0ABE-\u0AC5\u0AC7-\u0AC9\u0ACB-\u0ACD\u0AE2\u0AE3\u0AE6-\u0AEF\u0AFA-\u0AFF\u0B01-\u0B03\u0B3C\u0B3E-\u0B44\u0B47\u0B48\u0B4B-\u0B4D\u0B55-\u0B57\u0B62\u0B63\u0B66-\u0B6F\u0B82\u0BBE-\u0BC2\u0BC6-\u0BC8\u0BCA-\u0BCD\u0BD7\u0BE6-\u0BEF\u0C00-\u0C04\u0C3C\u0C3E-\u0C44\u0C46-\u0C48\u0C4A-\u0C4D\u0C55\u0C56\u0C62\u0C63\u0C66-\u0C6F\u0C81-\u0C83\u0CBC\u0CBE-\u0CC4\u0CC6-\u0CC8\u0CCA-\u0CCD\u0CD5\u0CD6\u0CE2\u0CE3\u0CE6-\u0CEF\u0CF3\u0D00-\u0D03\u0D3B\u0D3C\u0D3E-\u0D44\u0D46-\u0D48\u0D4A-\u0D4D\u0D57\u0D62\u0D63\u0D66-\u0D6F\u0D81-\u0D83\u0DCA\u0DCF-\u0DD4\u0DD6\u0DD8-\u0DDF\u0DE6-\u0DEF\u0DF2\u0DF3\u0E31\u0E34-\u0E3A\u0E47-\u0E4E\u0E50-\u0E59\u0EB1\u0EB4-\u0EBC\u0EC8-\u0ECE\u0ED0-\u0ED9\u0F18\u0F19\u0F20-\u0F29\u0F35\u0F37\u0F39\u0F3E\u0F3F\u0F71-\u0F84\u0F86\u0F87\u0F8D-\u0F97\u0F99-\u0FBC\u0FC6\u102B-\u103E\u1040-\u1049\u1056-\u1059\u105E-\u1060\u1062-\u1064\u1067-\u106D\u1071-\u1074\u1082-\u108D\u108F-\u109D\u135D-\u135F\u1369-\u1371\u1712-\u1715\u1732-\u1734\u1752\u1753\u1772\u1773\u17B4-\u17D3\u17DD\u17E0-\u17E9\u180B-\u180D\u180F-\u1819\u18A9\u1920-\u192B\u1930-\u193B\u1946-\u194F\u19D0-\u19DA\u1A17-\u1A1B\u1A55-\u1A5E\u1A60-\u1A7C\u1A7F-\u1A89\u1A90-\u1A99\u1AB0-\u1ABD\u1ABF-\u1ADD\u1AE0-\u1AEB\u1B00-\u1B04\u1B34-\u1B44\u1B50-\u1B59\u1B6B-\u1B73\u1B80-\u1B82\u1BA1-\u1BAD\u1BB0-\u1BB9\u1BE6-\u1BF3\u1C24-\u1C37\u1C40-\u1C49\u1C50-\u1C59\u1CD0-\u1CD2\u1CD4-\u1CE8\u1CED\u1CF4\u1CF7-\u1CF9\u1DC0-\u1DFF\u200C\u200D\u203F\u2040\u2054\u20D0-\u20DC\u20E1\u20E5-\u20F0\u2CEF-\u2CF1\u2D7F\u2DE0-\u2DFF\u302A-\u302F\u3099\u309A\u30FB\uA620-\uA629\uA66F\uA674-\uA67D\uA69E\uA69F\uA6F0\uA6F1\uA802\uA806\uA80B\uA823-\uA827\uA82C\uA880\uA881\uA8B4-\uA8C5\uA8D0-\uA8D9\uA8E0-\uA8F1\uA8FF-\uA909\uA926-\uA92D\uA947-\uA953\uA980-\uA983\uA9B3-\uA9C0\uA9D0-\uA9D9\uA9E5\uA9F0-\uA9F9\uAA29-\uAA36\uAA43\uAA4C\uAA4D\uAA50-\uAA59\uAA7B-\uAA7D\uAAB0\uAAB2-\uAAB4\uAAB7\uAAB8\uAABE\uAABF\uAAC1\uAAEB-\uAAEF\uAAF5\uAAF6\uABE3-\uABEA\uABEC\uABED\uABF0-\uABF9\uFB1E\uFE00-\uFE0F\uFE20-\uFE2F\uFE33\uFE34\uFE4D-\uFE4F\uFF10-\uFF19\uFF3F\uFF65";
var nonASCIIidentifierStartChars = "\xAA\xB5\xBA\xC0-\xD6\xD8-\xF6\xF8-\u02C1\u02C6-\u02D1\u02E0-\u02E4\u02EC\u02EE\u0370-\u0374\u0376\u0377\u037A-\u037D\u037F\u0386\u0388-\u038A\u038C\u038E-\u03A1\u03A3-\u03F5\u03F7-\u0481\u048A-\u052F\u0531-\u0556\u0559\u0560-\u0588\u05D0-\u05EA\u05EF-\u05F2\u0620-\u064A\u066E\u066F\u0671-\u06D3\u06D5\u06E5\u06E6\u06EE\u06EF\u06FA-\u06FC\u06FF\u0710\u0712-\u072F\u074D-\u07A5\u07B1\u07CA-\u07EA\u07F4\u07F5\u07FA\u0800-\u0815\u081A\u0824\u0828\u0840-\u0858\u0860-\u086A\u0870-\u0887\u0889-\u088F\u08A0-\u08C9\u0904-\u0939\u093D\u0950\u0958-\u0961\u0971-\u0980\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BD\u09CE\u09DC\u09DD\u09DF-\u09E1\u09F0\u09F1\u09FC\u0A05-\u0A0A\u0A0F\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38\u0A39\u0A59-\u0A5C\u0A5E\u0A72-\u0A74\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABD\u0AD0\u0AE0\u0AE1\u0AF9\u0B05-\u0B0C\u0B0F\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B35-\u0B39\u0B3D\u0B5C\u0B5D\u0B5F-\u0B61\u0B71\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99\u0B9A\u0B9C\u0B9E\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BD0\u0C05-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C39\u0C3D\u0C58-\u0C5A\u0C5C\u0C5D\u0C60\u0C61\u0C80\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBD\u0CDC-\u0CDE\u0CE0\u0CE1\u0CF1\u0CF2\u0D04-\u0D0C\u0D0E-\u0D10\u0D12-\u0D3A\u0D3D\u0D4E\u0D54-\u0D56\u0D5F-\u0D61\u0D7A-\u0D7F\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0E01-\u0E30\u0E32\u0E33\u0E40-\u0E46\u0E81\u0E82\u0E84\u0E86-\u0E8A\u0E8C-\u0EA3\u0EA5\u0EA7-\u0EB0\u0EB2\u0EB3\u0EBD\u0EC0-\u0EC4\u0EC6\u0EDC-\u0EDF\u0F00\u0F40-\u0F47\u0F49-\u0F6C\u0F88-\u0F8C\u1000-\u102A\u103F\u1050-\u1055\u105A-\u105D\u1061\u1065\u1066\u106E-\u1070\u1075-\u1081\u108E\u10A0-\u10C5\u10C7\u10CD\u10D0-\u10FA\u10FC-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u1380-\u138F\u13A0-\u13F5\u13F8-\u13FD\u1401-\u166C\u166F-\u167F\u1681-\u169A\u16A0-\u16EA\u16EE-\u16F8\u1700-\u1711\u171F-\u1731\u1740-\u1751\u1760-\u176C\u176E-\u1770\u1780-\u17B3\u17D7\u17DC\u1820-\u1878\u1880-\u18A8\u18AA\u18B0-\u18F5\u1900-\u191E\u1950-\u196D\u1970-\u1974\u1980-\u19AB\u19B0-\u19C9\u1A00-\u1A16\u1A20-\u1A54\u1AA7\u1B05-\u1B33\u1B45-\u1B4C\u1B83-\u1BA0\u1BAE\u1BAF\u1BBA-\u1BE5\u1C00-\u1C23\u1C4D-\u1C4F\u1C5A-\u1C7D\u1C80-\u1C8A\u1C90-\u1CBA\u1CBD-\u1CBF\u1CE9-\u1CEC\u1CEE-\u1CF3\u1CF5\u1CF6\u1CFA\u1D00-\u1DBF\u1E00-\u1F15\u1F18-\u1F1D\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D\u1F80-\u1FB4\u1FB6-\u1FBC\u1FBE\u1FC2-\u1FC4\u1FC6-\u1FCC\u1FD0-\u1FD3\u1FD6-\u1FDB\u1FE0-\u1FEC\u1FF2-\u1FF4\u1FF6-\u1FFC\u2071\u207F\u2090-\u209C\u2102\u2107\u210A-\u2113\u2115\u2118-\u211D\u2124\u2126\u2128\u212A-\u2139\u213C-\u213F\u2145-\u2149\u214E\u2160-\u2188\u2C00-\u2CE4\u2CEB-\u2CEE\u2CF2\u2CF3\u2D00-\u2D25\u2D27\u2D2D\u2D30-\u2D67\u2D6F\u2D80-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\u3005-\u3007\u3021-\u3029\u3031-\u3035\u3038-\u303C\u3041-\u3096\u309B-\u309F\u30A1-\u30FA\u30FC-\u30FF\u3105-\u312F\u3131-\u318E\u31A0-\u31BF\u31F0-\u31FF\u3400-\u4DBF\u4E00-\uA48C\uA4D0-\uA4FD\uA500-\uA60C\uA610-\uA61F\uA62A\uA62B\uA640-\uA66E\uA67F-\uA69D\uA6A0-\uA6EF\uA717-\uA71F\uA722-\uA788\uA78B-\uA7DC\uA7F1-\uA801\uA803-\uA805\uA807-\uA80A\uA80C-\uA822\uA840-\uA873\uA882-\uA8B3\uA8F2-\uA8F7\uA8FB\uA8FD\uA8FE\uA90A-\uA925\uA930-\uA946\uA960-\uA97C\uA984-\uA9B2\uA9CF\uA9E0-\uA9E4\uA9E6-\uA9EF\uA9FA-\uA9FE\uAA00-\uAA28\uAA40-\uAA42\uAA44-\uAA4B\uAA60-\uAA76\uAA7A\uAA7E-\uAAAF\uAAB1\uAAB5\uAAB6\uAAB9-\uAABD\uAAC0\uAAC2\uAADB-\uAADD\uAAE0-\uAAEA\uAAF2-\uAAF4\uAB01-\uAB06\uAB09-\uAB0E\uAB11-\uAB16\uAB20-\uAB26\uAB28-\uAB2E\uAB30-\uAB5A\uAB5C-\uAB69\uAB70-\uABE2\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uF900-\uFA6D\uFA70-\uFAD9\uFB00-\uFB06\uFB13-\uFB17\uFB1D\uFB1F-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE70-\uFE74\uFE76-\uFEFC\uFF21-\uFF3A\uFF41-\uFF5A\uFF66-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC";
var reservedWords = {
  3: "abstract boolean byte char class double enum export extends final float goto implements import int interface long native package private protected public short static super synchronized throws transient volatile",
  5: "class enum extends super const export import",
  6: "enum",
  strict: "implements interface let package private protected public static yield",
  strictBind: "eval arguments"
};
var ecma5AndLessKeywords = "break case catch continue debugger default do else finally for function if return switch throw try var while with null true false instanceof typeof void delete new in this";
var keywords$1 = {
  5: ecma5AndLessKeywords,
  "5module": ecma5AndLessKeywords + " export import",
  6: ecma5AndLessKeywords + " const class extends export import super"
};
var keywordRelationalOperator = /^in(stanceof)?$/;
var nonASCIIidentifierStart = new RegExp("[" + nonASCIIidentifierStartChars + "]");
var nonASCIIidentifier = new RegExp("[" + nonASCIIidentifierStartChars + nonASCIIidentifierChars + "]");
function isInAstralSet(code, set) {
  var pos = 65536;
  for (var i2 = 0; i2 < set.length; i2 += 2) {
    pos += set[i2];
    if (pos > code) {
      return false;
    }
    pos += set[i2 + 1];
    if (pos >= code) {
      return true;
    }
  }
  return false;
}
function isIdentifierStart(code, astral) {
  if (code < 65) {
    return code === 36;
  }
  if (code < 91) {
    return true;
  }
  if (code < 97) {
    return code === 95;
  }
  if (code < 123) {
    return true;
  }
  if (code <= 65535) {
    return code >= 170 && nonASCIIidentifierStart.test(String.fromCharCode(code));
  }
  if (astral === false) {
    return false;
  }
  return isInAstralSet(code, astralIdentifierStartCodes);
}
function isIdentifierChar(code, astral) {
  if (code < 48) {
    return code === 36;
  }
  if (code < 58) {
    return true;
  }
  if (code < 65) {
    return false;
  }
  if (code < 91) {
    return true;
  }
  if (code < 97) {
    return code === 95;
  }
  if (code < 123) {
    return true;
  }
  if (code <= 65535) {
    return code >= 170 && nonASCIIidentifier.test(String.fromCharCode(code));
  }
  if (astral === false) {
    return false;
  }
  return isInAstralSet(code, astralIdentifierStartCodes) || isInAstralSet(code, astralIdentifierCodes);
}
var TokenType = function TokenType2(label, conf) {
  if (conf === void 0) conf = {};
  this.label = label;
  this.keyword = conf.keyword;
  this.beforeExpr = !!conf.beforeExpr;
  this.startsExpr = !!conf.startsExpr;
  this.isLoop = !!conf.isLoop;
  this.isAssign = !!conf.isAssign;
  this.prefix = !!conf.prefix;
  this.postfix = !!conf.postfix;
  this.binop = conf.binop || null;
  this.updateContext = null;
};
function binop(name, prec) {
  return new TokenType(name, { beforeExpr: true, binop: prec });
}
var beforeExpr = { beforeExpr: true };
var startsExpr = { startsExpr: true };
var keywords = {};
function kw(name, options2) {
  if (options2 === void 0) options2 = {};
  options2.keyword = name;
  return keywords[name] = new TokenType(name, options2);
}
var types$1 = {
  num: new TokenType("num", startsExpr),
  regexp: new TokenType("regexp", startsExpr),
  string: new TokenType("string", startsExpr),
  name: new TokenType("name", startsExpr),
  privateId: new TokenType("privateId", startsExpr),
  eof: new TokenType("eof"),
  // Punctuation token types.
  bracketL: new TokenType("[", { beforeExpr: true, startsExpr: true }),
  bracketR: new TokenType("]"),
  braceL: new TokenType("{", { beforeExpr: true, startsExpr: true }),
  braceR: new TokenType("}"),
  parenL: new TokenType("(", { beforeExpr: true, startsExpr: true }),
  parenR: new TokenType(")"),
  comma: new TokenType(",", beforeExpr),
  semi: new TokenType(";", beforeExpr),
  colon: new TokenType(":", beforeExpr),
  dot: new TokenType("."),
  question: new TokenType("?", beforeExpr),
  questionDot: new TokenType("?."),
  arrow: new TokenType("=>", beforeExpr),
  template: new TokenType("template"),
  invalidTemplate: new TokenType("invalidTemplate"),
  ellipsis: new TokenType("...", beforeExpr),
  backQuote: new TokenType("`", startsExpr),
  dollarBraceL: new TokenType("${", { beforeExpr: true, startsExpr: true }),
  // Operators. These carry several kinds of properties to help the
  // parser use them properly (the presence of these properties is
  // what categorizes them as operators).
  //
  // `binop`, when present, specifies that this operator is a binary
  // operator, and will refer to its precedence.
  //
  // `prefix` and `postfix` mark the operator as a prefix or postfix
  // unary operator.
  //
  // `isAssign` marks all of `=`, `+=`, `-=` etcetera, which act as
  // binary operators with a very low precedence, that should result
  // in AssignmentExpression nodes.
  eq: new TokenType("=", { beforeExpr: true, isAssign: true }),
  assign: new TokenType("_=", { beforeExpr: true, isAssign: true }),
  incDec: new TokenType("++/--", { prefix: true, postfix: true, startsExpr: true }),
  prefix: new TokenType("!/~", { beforeExpr: true, prefix: true, startsExpr: true }),
  logicalOR: binop("||", 1),
  logicalAND: binop("&&", 2),
  bitwiseOR: binop("|", 3),
  bitwiseXOR: binop("^", 4),
  bitwiseAND: binop("&", 5),
  equality: binop("==/!=/===/!==", 6),
  relational: binop("</>/<=/>=", 7),
  bitShift: binop("<</>>/>>>", 8),
  plusMin: new TokenType("+/-", { beforeExpr: true, binop: 9, prefix: true, startsExpr: true }),
  modulo: binop("%", 10),
  star: binop("*", 10),
  slash: binop("/", 10),
  starstar: new TokenType("**", { beforeExpr: true }),
  coalesce: binop("??", 1),
  // Keyword token types.
  _break: kw("break"),
  _case: kw("case", beforeExpr),
  _catch: kw("catch"),
  _continue: kw("continue"),
  _debugger: kw("debugger"),
  _default: kw("default", beforeExpr),
  _do: kw("do", { isLoop: true, beforeExpr: true }),
  _else: kw("else", beforeExpr),
  _finally: kw("finally"),
  _for: kw("for", { isLoop: true }),
  _function: kw("function", startsExpr),
  _if: kw("if"),
  _return: kw("return", beforeExpr),
  _switch: kw("switch"),
  _throw: kw("throw", beforeExpr),
  _try: kw("try"),
  _var: kw("var"),
  _const: kw("const"),
  _while: kw("while", { isLoop: true }),
  _with: kw("with"),
  _new: kw("new", { beforeExpr: true, startsExpr: true }),
  _this: kw("this", startsExpr),
  _super: kw("super", startsExpr),
  _class: kw("class", startsExpr),
  _extends: kw("extends", beforeExpr),
  _export: kw("export"),
  _import: kw("import", startsExpr),
  _null: kw("null", startsExpr),
  _true: kw("true", startsExpr),
  _false: kw("false", startsExpr),
  _in: kw("in", { beforeExpr: true, binop: 7 }),
  _instanceof: kw("instanceof", { beforeExpr: true, binop: 7 }),
  _typeof: kw("typeof", { beforeExpr: true, prefix: true, startsExpr: true }),
  _void: kw("void", { beforeExpr: true, prefix: true, startsExpr: true }),
  _delete: kw("delete", { beforeExpr: true, prefix: true, startsExpr: true })
};
var lineBreak = /\r\n?|\n|\u2028|\u2029/;
var lineBreakG = new RegExp(lineBreak.source, "g");
function isNewLine(code) {
  return code === 10 || code === 13 || code === 8232 || code === 8233;
}
function nextLineBreak(code, from, end) {
  if (end === void 0) end = code.length;
  for (var i2 = from; i2 < end; i2++) {
    var next = code.charCodeAt(i2);
    if (isNewLine(next)) {
      return i2 < end - 1 && next === 13 && code.charCodeAt(i2 + 1) === 10 ? i2 + 2 : i2 + 1;
    }
  }
  return -1;
}
var nonASCIIwhitespace = /[\u1680\u2000-\u200a\u202f\u205f\u3000\ufeff]/;
var skipWhiteSpace = /(?:\s|\/\/.*|\/\*[^]*?\*\/)*/g;
var ref = Object.prototype;
var hasOwnProperty = ref.hasOwnProperty;
var toString = ref.toString;
var hasOwn = Object.hasOwn || (function(obj, propName) {
  return hasOwnProperty.call(obj, propName);
});
var isArray = Array.isArray || (function(obj) {
  return toString.call(obj) === "[object Array]";
});
var regexpCache = /* @__PURE__ */ Object.create(null);
function wordsRegexp(words) {
  return regexpCache[words] || (regexpCache[words] = new RegExp("^(?:" + words.replace(/ /g, "|") + ")$"));
}
function codePointToString(code) {
  if (code <= 65535) {
    return String.fromCharCode(code);
  }
  code -= 65536;
  return String.fromCharCode((code >> 10) + 55296, (code & 1023) + 56320);
}
var loneSurrogate = /(?:[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF])/;
var Position = function Position2(line, col) {
  this.line = line;
  this.column = col;
};
Position.prototype.offset = function offset(n) {
  return new Position(this.line, this.column + n);
};
var SourceLocation = function SourceLocation2(p, start, end) {
  this.start = start;
  this.end = end;
  if (p.sourceFile !== null) {
    this.source = p.sourceFile;
  }
};
function getLineInfo(input3, offset2) {
  for (var line = 1, cur = 0; ; ) {
    var nextBreak = nextLineBreak(input3, cur, offset2);
    if (nextBreak < 0) {
      return new Position(line, offset2 - cur);
    }
    ++line;
    cur = nextBreak;
  }
}
var defaultOptions = {
  // `ecmaVersion` indicates the ECMAScript version to parse. Must be
  // either 3, 5, 6 (or 2015), 7 (2016), 8 (2017), 9 (2018), 10
  // (2019), 11 (2020), 12 (2021), 13 (2022), 14 (2023), or `"latest"`
  // (the latest version the library supports). This influences
  // support for strict mode, the set of reserved words, and support
  // for new syntax features.
  ecmaVersion: null,
  // `sourceType` indicates the mode the code should be parsed in.
  // Can be either `"script"`, `"module"` or `"commonjs"`. This influences global
  // strict mode and parsing of `import` and `export` declarations.
  sourceType: "script",
  // When set to true, enable strict parsing mode even if `sourceType`
  // is `"script"`.
  strict: false,
  // `onInsertedSemicolon` can be a callback that will be called when
  // a semicolon is automatically inserted. It will be passed the
  // position of the inserted semicolon as an offset, and if
  // `locations` is enabled, it is given the location as a `{line,
  // column}` object as second argument.
  onInsertedSemicolon: null,
  // `onTrailingComma` is similar to `onInsertedSemicolon`, but for
  // trailing commas.
  onTrailingComma: null,
  // By default, reserved words are only enforced if ecmaVersion >= 5.
  // Set `allowReserved` to a boolean value to explicitly turn this on
  // an off. When this option has the value "never", reserved words
  // and keywords can also not be used as property names.
  allowReserved: null,
  // When enabled, a return at the top level is not considered an
  // error.
  allowReturnOutsideFunction: false,
  // When enabled, import/export statements are not constrained to
  // appearing at the top of the program, and an import.meta expression
  // in a script isn't considered an error.
  allowImportExportEverywhere: false,
  // By default, await identifiers are allowed to appear at the top-level scope only if ecmaVersion >= 2022.
  // When enabled, await identifiers are allowed to appear at the top-level scope,
  // but they are still not allowed in non-async functions.
  allowAwaitOutsideFunction: null,
  // When enabled, super identifiers are not constrained to
  // appearing in methods and do not raise an error when they appear elsewhere.
  allowSuperOutsideMethod: null,
  // When enabled, hashbang directive in the beginning of file is
  // allowed and treated as a line comment. Enabled by default when
  // `ecmaVersion` >= 2023.
  allowHashBang: false,
  // By default, the parser will verify that private properties are
  // only used in places where they are valid and have been declared.
  // Set this to false to turn such checks off.
  checkPrivateFields: true,
  // When `locations` is on, `loc` properties holding objects with
  // `start` and `end` properties in `{line, column}` form (with
  // line being 1-based and column 0-based) will be attached to the
  // nodes.
  locations: false,
  // Pass an optional `{line, column}` object to use for the start of
  // the parse. This is mostly useful when using `parseExpressionAt`
  // with `locations: true`, to prevent the parser from having to
  // determine the line position at the start position.
  startLocation: null,
  // A function can be passed as `onToken` option, which will
  // cause Acorn to call that function with object in the same
  // format as tokens returned from `tokenizer().getToken()`. Note
  // that you are not allowed to call the parser from the
  // callback—that will corrupt its internal state.
  onToken: null,
  // A function can be passed as `onComment` option, which will
  // cause Acorn to call that function with `(block, text, start,
  // end)` parameters whenever a comment is skipped. `block` is a
  // boolean indicating whether this is a block (`/* */`) comment,
  // `text` is the content of the comment, and `start` and `end` are
  // character offsets that denote the start and end of the comment.
  // When the `locations` option is on, two more parameters are
  // passed, the full `{line, column}` locations of the start and
  // end of the comments. Note that you are not allowed to call the
  // parser from the callback—that will corrupt its internal state.
  // When this option has an array as value, objects representing the
  // comments are pushed to it.
  onComment: null,
  // Nodes have their start and end characters offsets recorded in
  // `start` and `end` properties (directly on the node, rather than
  // the `loc` object, which holds line/column data. To also add a
  // [semi-standardized][range] `range` property holding a `[start,
  // end]` array with the same numbers, set the `ranges` option to
  // `true`.
  //
  // [range]: https://bugzilla.mozilla.org/show_bug.cgi?id=745678
  ranges: false,
  // It is possible to parse multiple files into a single AST by
  // passing the tree produced by parsing the first file as
  // `program` option in subsequent parses. This will add the
  // toplevel forms of the parsed file to the `Program` (top) node
  // of an existing parse tree.
  program: null,
  // When `locations` is on, you can pass this to record the source
  // file in every node's `loc` object.
  sourceFile: null,
  // This value, if given, is stored in every node, whether
  // `locations` is on or off.
  directSourceFile: null,
  // When enabled, parenthesized expressions are represented by
  // (non-standard) ParenthesizedExpression nodes
  preserveParens: false
};
var warnedAboutEcmaVersion = false;
function getOptions(opts) {
  var options2 = {};
  for (var opt in defaultOptions) {
    options2[opt] = opts && hasOwn(opts, opt) ? opts[opt] : defaultOptions[opt];
  }
  if (options2.ecmaVersion === "latest") {
    options2.ecmaVersion = 1e8;
  } else if (options2.ecmaVersion == null) {
    if (!warnedAboutEcmaVersion && typeof console === "object" && console.warn) {
      warnedAboutEcmaVersion = true;
      console.warn("Since Acorn 8.0.0, options.ecmaVersion is required.\nDefaulting to 2020, but this will stop working in the future.");
    }
    options2.ecmaVersion = 11;
  } else if (options2.ecmaVersion >= 2015) {
    options2.ecmaVersion -= 2009;
  }
  if (options2.allowReserved == null) {
    options2.allowReserved = options2.ecmaVersion < 5;
  }
  if (!opts || opts.allowHashBang == null) {
    options2.allowHashBang = options2.ecmaVersion >= 14;
  }
  if (isArray(options2.onToken)) {
    var tokens = options2.onToken;
    options2.onToken = function(token) {
      return tokens.push(token);
    };
  }
  if (isArray(options2.onComment)) {
    options2.onComment = pushComment(options2, options2.onComment);
  }
  if (options2.sourceType === "commonjs" && options2.allowAwaitOutsideFunction) {
    throw new Error("Cannot use allowAwaitOutsideFunction with sourceType: commonjs");
  }
  return options2;
}
function pushComment(options2, array) {
  return function(block, text5, start, end, startLoc, endLoc) {
    var comment = {
      type: block ? "Block" : "Line",
      value: text5,
      start,
      end
    };
    if (options2.locations) {
      comment.loc = new SourceLocation(this, startLoc, endLoc);
    }
    if (options2.ranges) {
      comment.range = [start, end];
    }
    array.push(comment);
  };
}
var SCOPE_TOP = 1;
var SCOPE_FUNCTION = 2;
var SCOPE_ASYNC = 4;
var SCOPE_GENERATOR = 8;
var SCOPE_ARROW = 16;
var SCOPE_SIMPLE_CATCH = 32;
var SCOPE_SUPER = 64;
var SCOPE_DIRECT_SUPER = 128;
var SCOPE_CLASS_STATIC_BLOCK = 256;
var SCOPE_CLASS_FIELD_INIT = 512;
var SCOPE_SWITCH = 1024;
var SCOPE_VAR = SCOPE_TOP | SCOPE_FUNCTION | SCOPE_CLASS_STATIC_BLOCK;
function functionFlags(async, generator) {
  return SCOPE_FUNCTION | (async ? SCOPE_ASYNC : 0) | (generator ? SCOPE_GENERATOR : 0);
}
var BIND_NONE = 0;
var BIND_VAR = 1;
var BIND_LEXICAL = 2;
var BIND_FUNCTION = 3;
var BIND_SIMPLE_CATCH = 4;
var BIND_OUTSIDE = 5;
var Parser = function Parser2(options2, input3, startPos) {
  this.options = options2 = getOptions(options2);
  this.sourceFile = options2.sourceFile;
  this.keywords = wordsRegexp(keywords$1[options2.ecmaVersion >= 6 ? 6 : options2.sourceType === "module" ? "5module" : 5]);
  var reserved = "";
  if (options2.allowReserved !== true) {
    reserved = reservedWords[options2.ecmaVersion >= 6 ? 6 : options2.ecmaVersion === 5 ? 5 : 3];
    if (options2.sourceType === "module") {
      reserved += " await";
    }
  }
  this.reservedWords = wordsRegexp(reserved);
  var reservedStrict = (reserved ? reserved + " " : "") + reservedWords.strict;
  this.reservedWordsStrict = wordsRegexp(reservedStrict);
  this.reservedWordsStrictBind = wordsRegexp(reservedStrict + " " + reservedWords.strictBind);
  this.input = String(input3);
  this.containsEsc = false;
  this.pos = startPos || 0;
  this.curLine = 1;
  if (options2.startLocation) {
    this.lineStart = this.pos - options2.startLocation.column;
    this.curLine = options2.startLocation.line;
  } else if (startPos) {
    this.lineStart = this.input.lastIndexOf("\n", startPos - 1) + 1;
    if (this.options.locations) {
      this.curLine = this.input.slice(0, this.lineStart).split(lineBreak).length;
    }
  } else {
    this.lineStart = 0;
  }
  this.type = types$1.eof;
  this.value = null;
  this.start = this.end = this.pos;
  this.startLoc = this.endLoc = this.curPosition();
  this.lastTokEndLoc = this.lastTokStartLoc = null;
  this.lastTokStart = this.lastTokEnd = this.pos;
  this.context = this.initialContext();
  this.exprAllowed = true;
  this.inModule = options2.sourceType === "module";
  this.strict = this.inModule || options2.strict === true || this.strictDirective(this.pos);
  this.potentialArrowAt = -1;
  this.potentialArrowInForAwait = false;
  this.yieldPos = this.awaitPos = this.awaitIdentPos = 0;
  this.labels = [];
  this.undefinedExports = /* @__PURE__ */ Object.create(null);
  if (this.pos === 0 && options2.allowHashBang && this.input.slice(0, 2) === "#!") {
    this.skipLineComment(2);
  }
  this.scopeStack = [];
  this.enterScope(
    this.options.sourceType === "commonjs" ? SCOPE_FUNCTION : SCOPE_TOP
  );
  this.regexpState = null;
  this.privateNameStack = [];
};
var prototypeAccessors = { inFunction: { configurable: true }, inGenerator: { configurable: true }, inAsync: { configurable: true }, canAwait: { configurable: true }, allowReturn: { configurable: true }, allowSuper: { configurable: true }, allowDirectSuper: { configurable: true }, treatFunctionsAsVar: { configurable: true }, allowNewDotTarget: { configurable: true }, allowUsing: { configurable: true }, inClassStaticBlock: { configurable: true } };
Parser.prototype.parse = function parse() {
  var this$1$1 = this;
  var node = this.options.program || this.startNode();
  this.nextToken();
  return this.catchStackOverflow(function() {
    return this$1$1.parseTopLevel(node);
  });
};
prototypeAccessors.inFunction.get = function() {
  return (this.currentVarScope().flags & SCOPE_FUNCTION) > 0;
};
prototypeAccessors.inGenerator.get = function() {
  return (this.currentVarScope().flags & SCOPE_GENERATOR) > 0;
};
prototypeAccessors.inAsync.get = function() {
  return (this.currentVarScope().flags & SCOPE_ASYNC) > 0;
};
prototypeAccessors.canAwait.get = function() {
  for (var i2 = this.scopeStack.length - 1; i2 >= 0; i2--) {
    var ref2 = this.scopeStack[i2];
    var flags = ref2.flags;
    if (flags & (SCOPE_CLASS_STATIC_BLOCK | SCOPE_CLASS_FIELD_INIT)) {
      return false;
    }
    if (flags & SCOPE_FUNCTION) {
      return (flags & SCOPE_ASYNC) > 0;
    }
  }
  return this.inModule && this.options.ecmaVersion >= 13 || this.options.allowAwaitOutsideFunction;
};
prototypeAccessors.allowReturn.get = function() {
  if (this.inFunction) {
    return true;
  }
  if (this.options.allowReturnOutsideFunction && this.currentVarScope().flags & SCOPE_TOP) {
    return true;
  }
  return false;
};
prototypeAccessors.allowSuper.get = function() {
  var ref2 = this.currentThisScope();
  var flags = ref2.flags;
  return (flags & SCOPE_SUPER) > 0 || this.options.allowSuperOutsideMethod;
};
prototypeAccessors.allowDirectSuper.get = function() {
  return (this.currentThisScope().flags & SCOPE_DIRECT_SUPER) > 0;
};
prototypeAccessors.treatFunctionsAsVar.get = function() {
  return this.treatFunctionsAsVarInScope(this.currentScope());
};
prototypeAccessors.allowNewDotTarget.get = function() {
  for (var i2 = this.scopeStack.length - 1; i2 >= 0; i2--) {
    var ref2 = this.scopeStack[i2];
    var flags = ref2.flags;
    if (flags & (SCOPE_CLASS_STATIC_BLOCK | SCOPE_CLASS_FIELD_INIT) || flags & SCOPE_FUNCTION && !(flags & SCOPE_ARROW)) {
      return true;
    }
  }
  return false;
};
prototypeAccessors.allowUsing.get = function() {
  var ref2 = this.currentScope();
  var flags = ref2.flags;
  if (flags & SCOPE_SWITCH) {
    return false;
  }
  if (!this.inModule && flags & SCOPE_TOP) {
    return false;
  }
  return true;
};
prototypeAccessors.inClassStaticBlock.get = function() {
  return (this.currentVarScope().flags & SCOPE_CLASS_STATIC_BLOCK) > 0;
};
Parser.extend = function extend() {
  var plugins = [], len = arguments.length;
  while (len--) plugins[len] = arguments[len];
  var cls = this;
  for (var i2 = 0; i2 < plugins.length; i2++) {
    cls = plugins[i2](cls);
  }
  return cls;
};
Parser.parse = function parse2(input3, options2) {
  return new this(options2, input3).parse();
};
Parser.parseExpressionAt = function parseExpressionAt(input3, pos, options2) {
  var parser = new this(options2, input3, pos);
  parser.nextToken();
  return parser.parseExpression();
};
Parser.tokenizer = function tokenizer(input3, options2) {
  return new this(options2, input3);
};
Object.defineProperties(Parser.prototype, prototypeAccessors);
var pp$9 = Parser.prototype;
var literal = /^(?:'((?:\\[^]|[^'\\])*?)'|"((?:\\[^]|[^"\\])*?)")/;
pp$9.strictDirective = function(start) {
  if (this.options.ecmaVersion < 5) {
    return false;
  }
  for (; ; ) {
    skipWhiteSpace.lastIndex = start;
    start += skipWhiteSpace.exec(this.input)[0].length;
    var match = literal.exec(this.input.slice(start));
    if (!match) {
      return false;
    }
    if ((match[1] || match[2]) === "use strict") {
      skipWhiteSpace.lastIndex = start + match[0].length;
      var spaceAfter = skipWhiteSpace.exec(this.input), end = spaceAfter.index + spaceAfter[0].length;
      var next = this.input.charAt(end);
      return next === ";" || next === "}" || lineBreak.test(spaceAfter[0]) && !(/[(`.[+\-/*%<>=,?^&]/.test(next) || next === "!" && this.input.charAt(end + 1) === "=");
    }
    start += match[0].length;
    skipWhiteSpace.lastIndex = start;
    start += skipWhiteSpace.exec(this.input)[0].length;
    if (this.input[start] === ";") {
      start++;
    }
  }
};
pp$9.eat = function(type) {
  if (this.type === type) {
    this.next();
    return true;
  } else {
    return false;
  }
};
pp$9.isContextual = function(name) {
  return this.type === types$1.name && this.value === name && !this.containsEsc;
};
pp$9.eatContextual = function(name) {
  if (!this.isContextual(name)) {
    return false;
  }
  this.next();
  return true;
};
pp$9.catchStackOverflow = function(f) {
  try {
    return f();
  } catch (e) {
    if (e instanceof Error && (/\bstack\b.*\b(exceeded|overflow)\b/i.test(e.message) || /\btoo much recursion\b/i.test(e.message))) {
      this.raise(this.start, "Not enough stack space to parse input");
    } else {
      throw e;
    }
  }
};
pp$9.expectContextual = function(name) {
  if (!this.eatContextual(name)) {
    this.unexpected();
  }
};
pp$9.canInsertSemicolon = function() {
  return this.type === types$1.eof || this.type === types$1.braceR || lineBreak.test(this.input.slice(this.lastTokEnd, this.start));
};
pp$9.insertSemicolon = function() {
  if (this.canInsertSemicolon()) {
    if (this.options.onInsertedSemicolon) {
      this.options.onInsertedSemicolon(this.lastTokEnd, this.lastTokEndLoc);
    }
    return true;
  }
};
pp$9.semicolon = function() {
  if (!this.eat(types$1.semi) && !this.insertSemicolon()) {
    this.unexpected();
  }
};
pp$9.afterTrailingComma = function(tokType, notNext) {
  if (this.type === tokType) {
    if (this.options.onTrailingComma) {
      this.options.onTrailingComma(this.lastTokStart, this.lastTokStartLoc);
    }
    if (!notNext) {
      this.next();
    }
    return true;
  }
};
pp$9.expect = function(type) {
  this.eat(type) || this.unexpected();
};
pp$9.unexpected = function(pos) {
  this.raise(pos != null ? pos : this.start, "Unexpected token");
};
var DestructuringErrors = function DestructuringErrors2() {
  this.shorthandAssign = this.trailingComma = this.parenthesizedAssign = this.parenthesizedBind = this.doubleProto = -1;
};
pp$9.checkPatternErrors = function(refDestructuringErrors, isAssign) {
  if (!refDestructuringErrors) {
    return;
  }
  if (refDestructuringErrors.trailingComma > -1) {
    this.raiseRecoverable(refDestructuringErrors.trailingComma, "Comma is not permitted after the rest element");
  }
  var parens = isAssign ? refDestructuringErrors.parenthesizedAssign : refDestructuringErrors.parenthesizedBind;
  if (parens > -1) {
    this.raiseRecoverable(parens, isAssign ? "Assigning to rvalue" : "Parenthesized pattern");
  }
};
pp$9.checkExpressionErrors = function(refDestructuringErrors, andThrow) {
  if (!refDestructuringErrors) {
    return false;
  }
  var shorthandAssign = refDestructuringErrors.shorthandAssign;
  var doubleProto = refDestructuringErrors.doubleProto;
  if (!andThrow) {
    return shorthandAssign >= 0 || doubleProto >= 0;
  }
  if (shorthandAssign >= 0) {
    this.raise(shorthandAssign, "Shorthand property assignments are valid only in destructuring patterns");
  }
  if (doubleProto >= 0) {
    this.raiseRecoverable(doubleProto, "Redefinition of __proto__ property");
  }
};
pp$9.checkYieldAwaitInDefaultParams = function() {
  if (this.yieldPos && (!this.awaitPos || this.yieldPos < this.awaitPos)) {
    this.raise(this.yieldPos, "Yield expression cannot be a default value");
  }
  if (this.awaitPos) {
    this.raise(this.awaitPos, "Await expression cannot be a default value");
  }
};
pp$9.isSimpleAssignTarget = function(expr) {
  if (expr.type === "ParenthesizedExpression") {
    return this.isSimpleAssignTarget(expr.expression);
  }
  return expr.type === "Identifier" || expr.type === "MemberExpression";
};
var pp$8 = Parser.prototype;
pp$8.parseTopLevel = function(node) {
  var exports$1 = /* @__PURE__ */ Object.create(null);
  if (!node.body) {
    node.body = [];
  }
  while (this.type !== types$1.eof) {
    var stmt = this.parseStatement(null, true, exports$1);
    node.body.push(stmt);
  }
  if (this.inModule) {
    for (var i2 = 0, list2 = Object.keys(this.undefinedExports); i2 < list2.length; i2 += 1) {
      var name = list2[i2];
      this.raiseRecoverable(this.undefinedExports[name].start, "Export '" + name + "' is not defined");
    }
  }
  this.adaptDirectivePrologue(node.body);
  this.next();
  node.sourceType = this.options.sourceType === "commonjs" ? "script" : this.options.sourceType;
  return this.finishNode(node, "Program");
};
var loopLabel = { kind: "loop" };
var switchLabel = { kind: "switch" };
pp$8.isLet = function(context) {
  if (this.options.ecmaVersion < 6 || !this.isContextual("let")) {
    return false;
  }
  skipWhiteSpace.lastIndex = this.pos;
  var skip2 = skipWhiteSpace.exec(this.input);
  var next = this.pos + skip2[0].length, nextCh = this.fullCharCodeAt(next);
  if (nextCh === 91 || nextCh === 92) {
    return true;
  }
  if (context) {
    return false;
  }
  if (nextCh === 123) {
    return true;
  }
  if (isIdentifierStart(nextCh)) {
    var start = next;
    do {
      next += nextCh <= 65535 ? 1 : 2;
    } while (isIdentifierChar(nextCh = this.fullCharCodeAt(next)));
    if (nextCh === 92) {
      return true;
    }
    var ident2 = this.input.slice(start, next);
    if (!keywordRelationalOperator.test(ident2)) {
      return true;
    }
  }
  return false;
};
pp$8.isAsyncFunction = function() {
  if (this.options.ecmaVersion < 8 || !this.isContextual("async")) {
    return false;
  }
  skipWhiteSpace.lastIndex = this.pos;
  var skip2 = skipWhiteSpace.exec(this.input);
  var next = this.pos + skip2[0].length, after;
  return !lineBreak.test(this.input.slice(this.pos, next)) && this.input.slice(next, next + 8) === "function" && (next + 8 === this.input.length || !(isIdentifierChar(after = this.fullCharCodeAt(next + 8)) || after === 92));
};
pp$8.isUsingKeyword = function(isAwaitUsing, isFor) {
  if (this.options.ecmaVersion < 17 || !this.isContextual(isAwaitUsing ? "await" : "using")) {
    return false;
  }
  skipWhiteSpace.lastIndex = this.pos;
  var skip2 = skipWhiteSpace.exec(this.input);
  var next = this.pos + skip2[0].length;
  if (lineBreak.test(this.input.slice(this.pos, next))) {
    return false;
  }
  if (isAwaitUsing) {
    var usingEndPos = next + 5, after;
    if (this.input.slice(next, usingEndPos) !== "using" || usingEndPos === this.input.length || isIdentifierChar(after = this.fullCharCodeAt(usingEndPos)) || after === 92) {
      return false;
    }
    skipWhiteSpace.lastIndex = usingEndPos;
    var skipAfterUsing = skipWhiteSpace.exec(this.input);
    next = usingEndPos + skipAfterUsing[0].length;
    if (skipAfterUsing && lineBreak.test(this.input.slice(usingEndPos, next))) {
      return false;
    }
  }
  var ch = this.fullCharCodeAt(next);
  if (!isIdentifierStart(ch) && ch !== 92) {
    return false;
  }
  var idStart = next;
  do {
    next += ch <= 65535 ? 1 : 2;
  } while (isIdentifierChar(ch = this.fullCharCodeAt(next)));
  if (ch === 92) {
    return true;
  }
  var id2 = this.input.slice(idStart, next);
  if (keywordRelationalOperator.test(id2)) {
    return false;
  }
  if (isFor && !isAwaitUsing && id2 === "of") {
    skipWhiteSpace.lastIndex = next;
    var skipAfterOf = skipWhiteSpace.exec(this.input);
    next = next + skipAfterOf[0].length;
    if (this.input.charCodeAt(next) !== 61 || // Check for ==, === and => operators
    (ch = this.input.charCodeAt(next + 1)) === 61 || ch === 62) {
      return false;
    }
  }
  return true;
};
pp$8.isAwaitUsing = function(isFor) {
  return this.isUsingKeyword(true, isFor);
};
pp$8.isUsing = function(isFor) {
  return this.isUsingKeyword(false, isFor);
};
pp$8.parseStatement = function(context, topLevel, exports$1) {
  var starttype = this.type, node = this.startNode(), kind;
  if (this.isLet(context)) {
    starttype = types$1._var;
    kind = "let";
  }
  switch (starttype) {
    case types$1._break:
    case types$1._continue:
      return this.parseBreakContinueStatement(node, starttype.keyword);
    case types$1._debugger:
      return this.parseDebuggerStatement(node);
    case types$1._do:
      return this.parseDoStatement(node);
    case types$1._for:
      return this.parseForStatement(node);
    case types$1._function:
      if (context && (this.strict || context !== "if" && context !== "label") && this.options.ecmaVersion >= 6) {
        this.unexpected();
      }
      return this.parseFunctionStatement(node, false, !context);
    case types$1._class:
      if (context) {
        this.unexpected();
      }
      return this.parseClass(node, true);
    case types$1._if:
      return this.parseIfStatement(node);
    case types$1._return:
      return this.parseReturnStatement(node);
    case types$1._switch:
      return this.parseSwitchStatement(node);
    case types$1._throw:
      return this.parseThrowStatement(node);
    case types$1._try:
      return this.parseTryStatement(node);
    case types$1._const:
    case types$1._var:
      kind = kind || this.value;
      if (context && kind !== "var") {
        this.unexpected();
      }
      return this.parseVarStatement(node, kind);
    case types$1._while:
      return this.parseWhileStatement(node);
    case types$1._with:
      return this.parseWithStatement(node);
    case types$1.braceL:
      return this.parseBlock(true, node);
    case types$1.semi:
      return this.parseEmptyStatement(node);
    case types$1._export:
    case types$1._import:
      if (this.options.ecmaVersion > 10 && starttype === types$1._import) {
        skipWhiteSpace.lastIndex = this.pos;
        var skip2 = skipWhiteSpace.exec(this.input);
        var next = this.pos + skip2[0].length, nextCh = this.input.charCodeAt(next);
        if (nextCh === 40 || nextCh === 46) {
          return this.parseExpressionStatement(node, this.parseExpression());
        }
      }
      if (!this.options.allowImportExportEverywhere) {
        if (!topLevel) {
          this.raise(this.start, "'import' and 'export' may only appear at the top level");
        }
        if (!this.inModule) {
          this.raise(this.start, "'import' and 'export' may appear only with 'sourceType: module'");
        }
      }
      return starttype === types$1._import ? this.parseImport(node) : this.parseExport(node, exports$1);
    // If the statement does not start with a statement keyword or a
    // brace, it's an ExpressionStatement or LabeledStatement. We
    // simply start parsing an expression, and afterwards, if the
    // next token is a colon and the expression was a simple
    // Identifier node, we switch to interpreting it as a label.
    default:
      if (this.isAsyncFunction()) {
        if (context) {
          this.unexpected();
        }
        this.next();
        return this.parseFunctionStatement(node, true, !context);
      }
      var usingKind = this.isAwaitUsing(false) ? "await using" : this.isUsing(false) ? "using" : null;
      if (usingKind) {
        if (!this.allowUsing) {
          this.raise(this.start, "Using declaration cannot appear in the top level when source type is `script` or in the bare case statement");
        }
        if (context) {
          this.raise(this.start, "Using declaration is not allowed in single-statement positions");
        }
        if (usingKind === "await using") {
          if (!this.canAwait) {
            this.raise(this.start, "Await using cannot appear outside of async function");
          }
          this.next();
        }
        this.next();
        this.parseVar(node, false, usingKind);
        this.semicolon();
        return this.finishNode(node, "VariableDeclaration");
      }
      var maybeName = this.value, expr = this.parseExpression();
      if (starttype === types$1.name && expr.type === "Identifier" && this.eat(types$1.colon)) {
        return this.parseLabeledStatement(node, maybeName, expr, context);
      } else {
        return this.parseExpressionStatement(node, expr);
      }
  }
};
pp$8.parseBreakContinueStatement = function(node, keyword) {
  var isBreak = keyword === "break";
  this.next();
  if (this.eat(types$1.semi) || this.insertSemicolon()) {
    node.label = null;
  } else if (this.type !== types$1.name) {
    this.unexpected();
  } else {
    node.label = this.parseIdent();
    this.semicolon();
  }
  var i2 = 0;
  for (; i2 < this.labels.length; ++i2) {
    var lab = this.labels[i2];
    if (node.label == null || lab.name === node.label.name) {
      if (lab.kind != null && (isBreak || lab.kind === "loop")) {
        break;
      }
      if (node.label && isBreak) {
        break;
      }
    }
  }
  if (i2 === this.labels.length) {
    this.raise(node.start, "Unsyntactic " + keyword);
  }
  return this.finishNode(node, isBreak ? "BreakStatement" : "ContinueStatement");
};
pp$8.parseDebuggerStatement = function(node) {
  this.next();
  this.semicolon();
  return this.finishNode(node, "DebuggerStatement");
};
pp$8.parseDoStatement = function(node) {
  this.next();
  this.labels.push(loopLabel);
  node.body = this.parseStatement("do");
  this.labels.pop();
  this.expect(types$1._while);
  node.test = this.parseParenExpression();
  if (this.options.ecmaVersion >= 6) {
    this.eat(types$1.semi);
  } else {
    this.semicolon();
  }
  return this.finishNode(node, "DoWhileStatement");
};
pp$8.parseForStatement = function(node) {
  this.next();
  var awaitAt = this.options.ecmaVersion >= 9 && this.canAwait && this.eatContextual("await") ? this.lastTokStart : -1;
  this.labels.push(loopLabel);
  this.enterScope(0);
  this.expect(types$1.parenL);
  if (this.type === types$1.semi) {
    if (awaitAt > -1) {
      this.unexpected(awaitAt);
    }
    return this.parseFor(node, null);
  }
  var isLet = this.isLet();
  if (this.type === types$1._var || this.type === types$1._const || isLet) {
    var init$1 = this.startNode(), kind = isLet ? "let" : this.value;
    this.next();
    this.parseVar(init$1, true, kind);
    this.finishNode(init$1, "VariableDeclaration");
    return this.parseForAfterInit(node, init$1, awaitAt);
  }
  var startsWithLet = this.isContextual("let"), isForOf = false;
  var usingKind = this.isUsing(true) ? "using" : this.isAwaitUsing(true) ? "await using" : null;
  if (usingKind) {
    var init$2 = this.startNode();
    this.next();
    if (usingKind === "await using") {
      if (!this.canAwait) {
        this.raise(this.start, "Await using cannot appear outside of async function");
      }
      this.next();
    }
    this.parseVar(init$2, true, usingKind);
    this.finishNode(init$2, "VariableDeclaration");
    return this.parseForAfterInit(node, init$2, awaitAt);
  }
  var containsEsc = this.containsEsc;
  var refDestructuringErrors = new DestructuringErrors();
  var initPos = this.start;
  var init = awaitAt > -1 ? this.parseExprSubscripts(refDestructuringErrors, "await") : this.parseExpression(true, refDestructuringErrors);
  if (this.type === types$1._in || (isForOf = this.options.ecmaVersion >= 6 && this.isContextual("of"))) {
    if (awaitAt > -1) {
      if (this.type === types$1._in) {
        this.unexpected(awaitAt);
      }
      node.await = true;
    } else if (isForOf && this.options.ecmaVersion >= 8) {
      if (init.start === initPos && !containsEsc && init.type === "Identifier" && init.name === "async") {
        this.unexpected();
      } else if (this.options.ecmaVersion >= 9) {
        node.await = false;
      }
    }
    if (startsWithLet && isForOf) {
      this.raise(init.start, "The left-hand side of a for-of loop may not start with 'let'.");
    }
    this.toAssignable(init, false, refDestructuringErrors);
    this.checkLValPattern(init);
    return this.parseForIn(node, init);
  } else {
    this.checkExpressionErrors(refDestructuringErrors, true);
  }
  if (awaitAt > -1) {
    this.unexpected(awaitAt);
  }
  return this.parseFor(node, init);
};
pp$8.parseForAfterInit = function(node, init, awaitAt) {
  if ((this.type === types$1._in || this.options.ecmaVersion >= 6 && this.isContextual("of")) && init.declarations.length === 1) {
    if (this.type === types$1._in) {
      if ((init.kind === "using" || init.kind === "await using") && !init.declarations[0].init) {
        this.raise(this.start, "Using declaration is not allowed in for-in loops");
      }
      if (this.options.ecmaVersion >= 9 && awaitAt > -1) {
        this.unexpected(awaitAt);
      }
    } else if (this.options.ecmaVersion >= 9) {
      node.await = awaitAt > -1;
    }
    return this.parseForIn(node, init);
  }
  if (awaitAt > -1) {
    this.unexpected(awaitAt);
  }
  return this.parseFor(node, init);
};
pp$8.parseFunctionStatement = function(node, isAsync, declarationPosition) {
  this.next();
  return this.parseFunction(node, FUNC_STATEMENT | (declarationPosition ? 0 : FUNC_HANGING_STATEMENT), false, isAsync);
};
pp$8.parseIfStatement = function(node) {
  this.next();
  node.test = this.parseParenExpression();
  node.consequent = this.parseStatement("if");
  node.alternate = this.eat(types$1._else) ? this.parseStatement("if") : null;
  return this.finishNode(node, "IfStatement");
};
pp$8.parseReturnStatement = function(node) {
  if (!this.allowReturn) {
    this.raise(this.start, "'return' outside of function");
  }
  this.next();
  if (this.eat(types$1.semi) || this.insertSemicolon()) {
    node.argument = null;
  } else {
    node.argument = this.parseExpression();
    this.semicolon();
  }
  return this.finishNode(node, "ReturnStatement");
};
pp$8.parseSwitchStatement = function(node) {
  this.next();
  node.discriminant = this.parseParenExpression();
  node.cases = [];
  this.expect(types$1.braceL);
  this.labels.push(switchLabel);
  this.enterScope(SCOPE_SWITCH);
  var cur;
  for (var sawDefault = false; this.type !== types$1.braceR; ) {
    if (this.type === types$1._case || this.type === types$1._default) {
      var isCase = this.type === types$1._case;
      if (cur) {
        this.finishNode(cur, "SwitchCase");
      }
      node.cases.push(cur = this.startNode());
      cur.consequent = [];
      this.next();
      if (isCase) {
        cur.test = this.parseExpression();
      } else {
        if (sawDefault) {
          this.raiseRecoverable(this.lastTokStart, "Multiple default clauses");
        }
        sawDefault = true;
        cur.test = null;
      }
      this.expect(types$1.colon);
    } else {
      if (!cur) {
        this.unexpected();
      }
      cur.consequent.push(this.parseStatement(null));
    }
  }
  this.exitScope();
  if (cur) {
    this.finishNode(cur, "SwitchCase");
  }
  this.next();
  this.labels.pop();
  return this.finishNode(node, "SwitchStatement");
};
pp$8.parseThrowStatement = function(node) {
  this.next();
  if (lineBreak.test(this.input.slice(this.lastTokEnd, this.start))) {
    this.raise(this.lastTokEnd, "Illegal newline after throw");
  }
  node.argument = this.parseExpression();
  this.semicolon();
  return this.finishNode(node, "ThrowStatement");
};
var empty$1 = [];
pp$8.parseCatchClauseParam = function() {
  var param = this.parseBindingAtom();
  var simple3 = param.type === "Identifier";
  this.enterScope(simple3 ? SCOPE_SIMPLE_CATCH : 0);
  this.checkLValPattern(param, simple3 ? BIND_SIMPLE_CATCH : BIND_LEXICAL);
  this.expect(types$1.parenR);
  return param;
};
pp$8.parseTryStatement = function(node) {
  this.next();
  node.block = this.parseBlock();
  node.handler = null;
  if (this.type === types$1._catch) {
    var clause = this.startNode();
    this.next();
    if (this.eat(types$1.parenL)) {
      clause.param = this.parseCatchClauseParam();
    } else {
      if (this.options.ecmaVersion < 10) {
        this.unexpected();
      }
      clause.param = null;
      this.enterScope(0);
    }
    clause.body = this.parseBlock(false);
    this.exitScope();
    node.handler = this.finishNode(clause, "CatchClause");
  }
  node.finalizer = this.eat(types$1._finally) ? this.parseBlock() : null;
  if (!node.handler && !node.finalizer) {
    this.raise(node.start, "Missing catch or finally clause");
  }
  return this.finishNode(node, "TryStatement");
};
pp$8.parseVarStatement = function(node, kind, allowMissingInitializer) {
  this.next();
  this.parseVar(node, false, kind, allowMissingInitializer);
  this.semicolon();
  return this.finishNode(node, "VariableDeclaration");
};
pp$8.parseWhileStatement = function(node) {
  this.next();
  node.test = this.parseParenExpression();
  this.labels.push(loopLabel);
  node.body = this.parseStatement("while");
  this.labels.pop();
  return this.finishNode(node, "WhileStatement");
};
pp$8.parseWithStatement = function(node) {
  if (this.strict) {
    this.raise(this.start, "'with' in strict mode");
  }
  this.next();
  node.object = this.parseParenExpression();
  node.body = this.parseStatement("with");
  return this.finishNode(node, "WithStatement");
};
pp$8.parseEmptyStatement = function(node) {
  this.next();
  return this.finishNode(node, "EmptyStatement");
};
pp$8.parseLabeledStatement = function(node, maybeName, expr, context) {
  for (var i$1 = 0, list2 = this.labels; i$1 < list2.length; i$1 += 1) {
    var label = list2[i$1];
    if (label.name === maybeName) {
      this.raise(expr.start, "Label '" + maybeName + "' is already declared");
    }
  }
  var kind = this.type.isLoop ? "loop" : this.type === types$1._switch ? "switch" : null;
  for (var i2 = this.labels.length - 1; i2 >= 0; i2--) {
    var label$1 = this.labels[i2];
    if (label$1.statementStart === node.start) {
      label$1.statementStart = this.start;
      label$1.kind = kind;
    } else {
      break;
    }
  }
  this.labels.push({ name: maybeName, kind, statementStart: this.start });
  node.body = this.parseStatement(context ? context.indexOf("label") === -1 ? context + "label" : context : "label");
  this.labels.pop();
  node.label = expr;
  return this.finishNode(node, "LabeledStatement");
};
pp$8.parseExpressionStatement = function(node, expr) {
  node.expression = expr;
  this.semicolon();
  return this.finishNode(node, "ExpressionStatement");
};
pp$8.parseBlock = function(createNewLexicalScope, node, exitStrict) {
  if (createNewLexicalScope === void 0) createNewLexicalScope = true;
  if (node === void 0) node = this.startNode();
  node.body = [];
  this.expect(types$1.braceL);
  if (createNewLexicalScope) {
    this.enterScope(0);
  }
  while (this.type !== types$1.braceR) {
    var stmt = this.parseStatement(null);
    node.body.push(stmt);
  }
  if (exitStrict) {
    this.strict = false;
  }
  this.next();
  if (createNewLexicalScope) {
    this.exitScope();
  }
  return this.finishNode(node, "BlockStatement");
};
pp$8.parseFor = function(node, init) {
  node.init = init;
  this.expect(types$1.semi);
  node.test = this.type === types$1.semi ? null : this.parseExpression();
  this.expect(types$1.semi);
  node.update = this.type === types$1.parenR ? null : this.parseExpression();
  this.expect(types$1.parenR);
  node.body = this.parseStatement("for");
  this.exitScope();
  this.labels.pop();
  return this.finishNode(node, "ForStatement");
};
pp$8.parseForIn = function(node, init) {
  var isForIn = this.type === types$1._in;
  this.next();
  if (init.type === "VariableDeclaration" && init.declarations[0].init != null && (!isForIn || this.options.ecmaVersion < 8 || this.strict || init.kind !== "var" || init.declarations[0].id.type !== "Identifier")) {
    this.raise(
      init.start,
      (isForIn ? "for-in" : "for-of") + " loop variable declaration may not have an initializer"
    );
  }
  node.left = init;
  node.right = isForIn ? this.parseExpression() : this.parseMaybeAssign();
  this.expect(types$1.parenR);
  node.body = this.parseStatement("for");
  this.exitScope();
  this.labels.pop();
  return this.finishNode(node, isForIn ? "ForInStatement" : "ForOfStatement");
};
pp$8.parseVar = function(node, isFor, kind, allowMissingInitializer) {
  node.declarations = [];
  node.kind = kind;
  for (; ; ) {
    var decl = this.startNode();
    this.parseVarId(decl, kind);
    if (this.eat(types$1.eq)) {
      decl.init = this.parseMaybeAssign(isFor);
    } else if (!allowMissingInitializer && kind === "const" && !(this.type === types$1._in || this.options.ecmaVersion >= 6 && this.isContextual("of"))) {
      this.unexpected();
    } else if (!allowMissingInitializer && (kind === "using" || kind === "await using") && this.options.ecmaVersion >= 17 && this.type !== types$1._in && !this.isContextual("of")) {
      this.raise(this.lastTokEnd, "Missing initializer in " + kind + " declaration");
    } else if (!allowMissingInitializer && decl.id.type !== "Identifier" && !(isFor && (this.type === types$1._in || this.isContextual("of")))) {
      this.raise(this.lastTokEnd, "Complex binding patterns require an initialization value");
    } else {
      decl.init = null;
    }
    node.declarations.push(this.finishNode(decl, "VariableDeclarator"));
    if (!this.eat(types$1.comma)) {
      break;
    }
  }
  return node;
};
pp$8.parseVarId = function(decl, kind) {
  decl.id = kind === "using" || kind === "await using" ? this.parseIdent() : this.parseBindingAtom();
  this.checkLValPattern(decl.id, kind === "var" ? BIND_VAR : BIND_LEXICAL, false);
};
var FUNC_STATEMENT = 1;
var FUNC_HANGING_STATEMENT = 2;
var FUNC_NULLABLE_ID = 4;
pp$8.parseFunction = function(node, statement, allowExpressionBody, isAsync, forInit) {
  this.initFunction(node);
  if (this.options.ecmaVersion >= 9 || this.options.ecmaVersion >= 6 && !isAsync) {
    if (this.type === types$1.star && statement & FUNC_HANGING_STATEMENT) {
      this.unexpected();
    }
    node.generator = this.eat(types$1.star);
  }
  if (this.options.ecmaVersion >= 8) {
    node.async = !!isAsync;
  }
  if (statement & FUNC_STATEMENT) {
    node.id = statement & FUNC_NULLABLE_ID && this.type !== types$1.name ? null : this.parseIdent();
    if (node.id && !(statement & FUNC_HANGING_STATEMENT)) {
      this.checkLValSimple(node.id, this.strict || node.generator || node.async ? this.treatFunctionsAsVar ? BIND_VAR : BIND_LEXICAL : BIND_FUNCTION);
    }
  }
  var oldYieldPos = this.yieldPos, oldAwaitPos = this.awaitPos, oldAwaitIdentPos = this.awaitIdentPos;
  this.yieldPos = 0;
  this.awaitPos = 0;
  this.awaitIdentPos = 0;
  this.enterScope(functionFlags(node.async, node.generator));
  if (!(statement & FUNC_STATEMENT)) {
    node.id = this.type === types$1.name ? this.parseIdent() : null;
  }
  this.parseFunctionParams(node);
  this.parseFunctionBody(node, allowExpressionBody, false, forInit);
  this.yieldPos = oldYieldPos;
  this.awaitPos = oldAwaitPos;
  this.awaitIdentPos = oldAwaitIdentPos;
  return this.finishNode(node, statement & FUNC_STATEMENT ? "FunctionDeclaration" : "FunctionExpression");
};
pp$8.parseFunctionParams = function(node) {
  this.expect(types$1.parenL);
  node.params = this.parseBindingList(types$1.parenR, false, this.options.ecmaVersion >= 8);
  this.checkYieldAwaitInDefaultParams();
};
pp$8.parseClass = function(node, isStatement) {
  this.next();
  var oldStrict = this.strict;
  this.strict = true;
  this.parseClassId(node, isStatement);
  this.parseClassSuper(node);
  var privateNameMap = this.enterClassBody();
  var classBody = this.startNode();
  var hadConstructor = false;
  classBody.body = [];
  this.expect(types$1.braceL);
  while (this.type !== types$1.braceR) {
    var element2 = this.parseClassElement(node.superClass !== null);
    if (element2) {
      classBody.body.push(element2);
      if (element2.type === "MethodDefinition" && element2.kind === "constructor") {
        if (hadConstructor) {
          this.raiseRecoverable(element2.start, "Duplicate constructor in the same class");
        }
        hadConstructor = true;
      } else if (element2.key && element2.key.type === "PrivateIdentifier" && isPrivateNameConflicted(privateNameMap, element2)) {
        this.raiseRecoverable(element2.key.start, "Identifier '#" + element2.key.name + "' has already been declared");
      }
    }
  }
  this.strict = oldStrict;
  this.next();
  node.body = this.finishNode(classBody, "ClassBody");
  this.exitClassBody();
  return this.finishNode(node, isStatement ? "ClassDeclaration" : "ClassExpression");
};
pp$8.parseClassElement = function(constructorAllowsSuper) {
  if (this.eat(types$1.semi)) {
    return null;
  }
  var ecmaVersion2 = this.options.ecmaVersion;
  var node = this.startNode();
  var keyName = "";
  var isGenerator = false;
  var isAsync = false;
  var kind = "method";
  var isStatic = false;
  if (this.eatContextual("static")) {
    if (ecmaVersion2 >= 13 && this.eat(types$1.braceL)) {
      this.parseClassStaticBlock(node);
      return node;
    }
    if (this.isClassElementNameStart() || this.type === types$1.star) {
      isStatic = true;
    } else {
      keyName = "static";
    }
  }
  node.static = isStatic;
  if (!keyName && ecmaVersion2 >= 8 && this.eatContextual("async")) {
    if ((this.isClassElementNameStart() || this.type === types$1.star) && !this.canInsertSemicolon()) {
      isAsync = true;
    } else {
      keyName = "async";
    }
  }
  if (!keyName && (ecmaVersion2 >= 9 || !isAsync) && this.eat(types$1.star)) {
    isGenerator = true;
  }
  if (!keyName && !isAsync && !isGenerator) {
    var lastValue = this.value;
    if (this.eatContextual("get") || this.eatContextual("set")) {
      if (this.isClassElementNameStart()) {
        kind = lastValue;
      } else {
        keyName = lastValue;
      }
    }
  }
  if (keyName) {
    node.computed = false;
    node.key = this.startNodeAt(this.lastTokStart, this.lastTokStartLoc);
    node.key.name = keyName;
    this.finishNode(node.key, "Identifier");
  } else {
    this.parseClassElementName(node);
  }
  if (ecmaVersion2 < 13 || this.type === types$1.parenL || kind !== "method" || isGenerator || isAsync) {
    var isConstructor = !node.static && checkKeyName(node, "constructor");
    var allowsDirectSuper = isConstructor && constructorAllowsSuper;
    if (isConstructor && kind !== "method") {
      this.raise(node.key.start, "Constructor can't have get/set modifier");
    }
    node.kind = isConstructor ? "constructor" : kind;
    this.parseClassMethod(node, isGenerator, isAsync, allowsDirectSuper);
  } else {
    this.parseClassField(node);
  }
  return node;
};
pp$8.isClassElementNameStart = function() {
  return this.type === types$1.name || this.type === types$1.privateId || this.type === types$1.num || this.type === types$1.string || this.type === types$1.bracketL || this.type.keyword;
};
pp$8.parseClassElementName = function(element2) {
  if (this.type === types$1.privateId) {
    if (this.value === "constructor") {
      this.raise(this.start, "Classes can't have an element named '#constructor'");
    }
    element2.computed = false;
    element2.key = this.parsePrivateIdent();
  } else {
    this.parsePropertyName(element2);
  }
};
pp$8.parseClassMethod = function(method, isGenerator, isAsync, allowsDirectSuper) {
  var key = method.key;
  if (method.kind === "constructor") {
    if (isGenerator) {
      this.raise(key.start, "Constructor can't be a generator");
    }
    if (isAsync) {
      this.raise(key.start, "Constructor can't be an async method");
    }
  } else if (method.static && checkKeyName(method, "prototype")) {
    this.raise(key.start, "Classes may not have a static property named prototype");
  }
  var value = method.value = this.parseMethod(isGenerator, isAsync, allowsDirectSuper);
  if (method.kind === "get" && value.params.length !== 0) {
    this.raiseRecoverable(value.start, "getter should have no params");
  }
  if (method.kind === "set" && value.params.length !== 1) {
    this.raiseRecoverable(value.start, "setter should have exactly one param");
  }
  if (method.kind === "set" && value.params[0].type === "RestElement") {
    this.raiseRecoverable(value.params[0].start, "Setter cannot use rest params");
  }
  return this.finishNode(method, "MethodDefinition");
};
pp$8.parseClassField = function(field) {
  if (checkKeyName(field, "constructor")) {
    this.raise(field.key.start, "Classes can't have a field named 'constructor'");
  } else if (field.static && checkKeyName(field, "prototype")) {
    this.raise(field.key.start, "Classes can't have a static field named 'prototype'");
  }
  if (this.eat(types$1.eq)) {
    this.enterScope(SCOPE_CLASS_FIELD_INIT | SCOPE_SUPER);
    field.value = this.parseMaybeAssign();
    this.exitScope();
  } else {
    field.value = null;
  }
  this.semicolon();
  return this.finishNode(field, "PropertyDefinition");
};
pp$8.parseClassStaticBlock = function(node) {
  node.body = [];
  var oldLabels = this.labels;
  this.labels = [];
  this.enterScope(SCOPE_CLASS_STATIC_BLOCK | SCOPE_SUPER);
  while (this.type !== types$1.braceR) {
    var stmt = this.parseStatement(null);
    node.body.push(stmt);
  }
  this.next();
  this.exitScope();
  this.labels = oldLabels;
  return this.finishNode(node, "StaticBlock");
};
pp$8.parseClassId = function(node, isStatement) {
  if (this.type === types$1.name) {
    node.id = this.parseIdent();
    if (isStatement) {
      this.checkLValSimple(node.id, BIND_LEXICAL, false);
    }
  } else {
    if (isStatement === true) {
      this.unexpected();
    }
    node.id = null;
  }
};
pp$8.parseClassSuper = function(node) {
  node.superClass = this.eat(types$1._extends) ? this.parseExprSubscripts(null, false) : null;
};
pp$8.enterClassBody = function() {
  var element2 = { declared: /* @__PURE__ */ Object.create(null), used: [] };
  this.privateNameStack.push(element2);
  return element2.declared;
};
pp$8.exitClassBody = function() {
  var ref2 = this.privateNameStack.pop();
  var declared = ref2.declared;
  var used = ref2.used;
  if (!this.options.checkPrivateFields) {
    return;
  }
  var len = this.privateNameStack.length;
  var parent2 = len === 0 ? null : this.privateNameStack[len - 1];
  for (var i2 = 0; i2 < used.length; ++i2) {
    var id2 = used[i2];
    if (!hasOwn(declared, id2.name)) {
      if (parent2) {
        parent2.used.push(id2);
      } else {
        this.raiseRecoverable(id2.start, "Private field '#" + id2.name + "' must be declared in an enclosing class");
      }
    }
  }
};
function isPrivateNameConflicted(privateNameMap, element2) {
  var name = element2.key.name;
  var curr = privateNameMap[name];
  var next = "true";
  if (element2.type === "MethodDefinition" && (element2.kind === "get" || element2.kind === "set")) {
    next = (element2.static ? "s" : "i") + element2.kind;
  }
  if (curr === "iget" && next === "iset" || curr === "iset" && next === "iget" || curr === "sget" && next === "sset" || curr === "sset" && next === "sget") {
    privateNameMap[name] = "true";
    return false;
  } else if (!curr) {
    privateNameMap[name] = next;
    return false;
  } else {
    return true;
  }
}
function checkKeyName(node, name) {
  var computed = node.computed;
  var key = node.key;
  return !computed && (key.type === "Identifier" && key.name === name || key.type === "Literal" && key.value === name);
}
pp$8.parseExportAllDeclaration = function(node, exports$1) {
  if (this.options.ecmaVersion >= 11) {
    if (this.eatContextual("as")) {
      node.exported = this.parseModuleExportName();
      this.checkExport(exports$1, node.exported, this.lastTokStart);
    } else {
      node.exported = null;
    }
  }
  this.expectContextual("from");
  if (this.type !== types$1.string) {
    this.unexpected();
  }
  node.source = this.parseExprAtom();
  if (this.options.ecmaVersion >= 16) {
    node.attributes = this.parseWithClause();
  }
  this.semicolon();
  return this.finishNode(node, "ExportAllDeclaration");
};
pp$8.parseExport = function(node, exports$1) {
  this.next();
  if (this.eat(types$1.star)) {
    return this.parseExportAllDeclaration(node, exports$1);
  }
  if (this.eat(types$1._default)) {
    this.checkExport(exports$1, "default", this.lastTokStart);
    node.declaration = this.parseExportDefaultDeclaration();
    return this.finishNode(node, "ExportDefaultDeclaration");
  }
  if (this.shouldParseExportStatement()) {
    node.declaration = this.parseExportDeclaration(node);
    if (node.declaration.type === "VariableDeclaration") {
      this.checkVariableExport(exports$1, node.declaration.declarations);
    } else {
      this.checkExport(exports$1, node.declaration.id, node.declaration.id.start);
    }
    node.specifiers = [];
    node.source = null;
    if (this.options.ecmaVersion >= 16) {
      node.attributes = [];
    }
  } else {
    node.declaration = null;
    node.specifiers = this.parseExportSpecifiers(exports$1);
    if (this.eatContextual("from")) {
      if (this.type !== types$1.string) {
        this.unexpected();
      }
      node.source = this.parseExprAtom();
      if (this.options.ecmaVersion >= 16) {
        node.attributes = this.parseWithClause();
      }
    } else {
      for (var i2 = 0, list2 = node.specifiers; i2 < list2.length; i2 += 1) {
        var spec = list2[i2];
        this.checkUnreserved(spec.local);
        this.checkLocalExport(spec.local);
        if (spec.local.type === "Literal") {
          this.raise(spec.local.start, "A string literal cannot be used as an exported binding without `from`.");
        }
      }
      node.source = null;
      if (this.options.ecmaVersion >= 16) {
        node.attributes = [];
      }
    }
    this.semicolon();
  }
  return this.finishNode(node, "ExportNamedDeclaration");
};
pp$8.parseExportDeclaration = function(node) {
  return this.parseStatement(null);
};
pp$8.parseExportDefaultDeclaration = function() {
  var isAsync;
  if (this.type === types$1._function || (isAsync = this.isAsyncFunction())) {
    var fNode = this.startNode();
    this.next();
    if (isAsync) {
      this.next();
    }
    return this.parseFunction(fNode, FUNC_STATEMENT | FUNC_NULLABLE_ID, false, isAsync);
  } else if (this.type === types$1._class) {
    var cNode = this.startNode();
    return this.parseClass(cNode, "nullableID");
  } else {
    var declaration = this.parseMaybeAssign();
    this.semicolon();
    return declaration;
  }
};
pp$8.checkExport = function(exports$1, name, pos) {
  if (!exports$1) {
    return;
  }
  if (typeof name !== "string") {
    name = name.type === "Identifier" ? name.name : name.value;
  }
  if (hasOwn(exports$1, name)) {
    this.raiseRecoverable(pos, "Duplicate export '" + name + "'");
  }
  exports$1[name] = true;
};
pp$8.checkPatternExport = function(exports$1, pat) {
  var type = pat.type;
  if (type === "Identifier") {
    this.checkExport(exports$1, pat, pat.start);
  } else if (type === "ObjectPattern") {
    for (var i2 = 0, list2 = pat.properties; i2 < list2.length; i2 += 1) {
      var prop = list2[i2];
      this.checkPatternExport(exports$1, prop);
    }
  } else if (type === "ArrayPattern") {
    for (var i$1 = 0, list$1 = pat.elements; i$1 < list$1.length; i$1 += 1) {
      var elt = list$1[i$1];
      if (elt) {
        this.checkPatternExport(exports$1, elt);
      }
    }
  } else if (type === "Property") {
    this.checkPatternExport(exports$1, pat.value);
  } else if (type === "AssignmentPattern") {
    this.checkPatternExport(exports$1, pat.left);
  } else if (type === "RestElement") {
    this.checkPatternExport(exports$1, pat.argument);
  }
};
pp$8.checkVariableExport = function(exports$1, decls) {
  if (!exports$1) {
    return;
  }
  for (var i2 = 0, list2 = decls; i2 < list2.length; i2 += 1) {
    var decl = list2[i2];
    this.checkPatternExport(exports$1, decl.id);
  }
};
pp$8.shouldParseExportStatement = function() {
  return this.type.keyword === "var" || this.type.keyword === "const" || this.type.keyword === "class" || this.type.keyword === "function" || this.isLet() || this.isAsyncFunction();
};
pp$8.parseExportSpecifier = function(exports$1) {
  var node = this.startNode();
  node.local = this.parseModuleExportName();
  node.exported = this.eatContextual("as") ? this.parseModuleExportName() : node.local;
  this.checkExport(
    exports$1,
    node.exported,
    node.exported.start
  );
  return this.finishNode(node, "ExportSpecifier");
};
pp$8.parseExportSpecifiers = function(exports$1) {
  var nodes = [], first = true;
  this.expect(types$1.braceL);
  while (!this.eat(types$1.braceR)) {
    if (!first) {
      this.expect(types$1.comma);
      if (this.afterTrailingComma(types$1.braceR)) {
        break;
      }
    } else {
      first = false;
    }
    nodes.push(this.parseExportSpecifier(exports$1));
  }
  return nodes;
};
pp$8.parseImport = function(node) {
  this.next();
  if (this.type === types$1.string) {
    node.specifiers = empty$1;
    node.source = this.parseExprAtom();
  } else {
    node.specifiers = this.parseImportSpecifiers();
    this.expectContextual("from");
    node.source = this.type === types$1.string ? this.parseExprAtom() : this.unexpected();
  }
  if (this.options.ecmaVersion >= 16) {
    node.attributes = this.parseWithClause();
  }
  this.semicolon();
  return this.finishNode(node, "ImportDeclaration");
};
pp$8.parseImportSpecifier = function() {
  var node = this.startNode();
  node.imported = this.parseModuleExportName();
  if (this.eatContextual("as")) {
    node.local = this.parseIdent();
  } else {
    this.checkUnreserved(node.imported);
    node.local = node.imported;
  }
  this.checkLValSimple(node.local, BIND_LEXICAL);
  return this.finishNode(node, "ImportSpecifier");
};
pp$8.parseImportDefaultSpecifier = function() {
  var node = this.startNode();
  node.local = this.parseIdent();
  this.checkLValSimple(node.local, BIND_LEXICAL);
  return this.finishNode(node, "ImportDefaultSpecifier");
};
pp$8.parseImportNamespaceSpecifier = function() {
  var node = this.startNode();
  this.next();
  this.expectContextual("as");
  node.local = this.parseIdent();
  this.checkLValSimple(node.local, BIND_LEXICAL);
  return this.finishNode(node, "ImportNamespaceSpecifier");
};
pp$8.parseImportSpecifiers = function() {
  var nodes = [], first = true;
  if (this.type === types$1.name) {
    nodes.push(this.parseImportDefaultSpecifier());
    if (!this.eat(types$1.comma)) {
      return nodes;
    }
  }
  if (this.type === types$1.star) {
    nodes.push(this.parseImportNamespaceSpecifier());
    return nodes;
  }
  this.expect(types$1.braceL);
  while (!this.eat(types$1.braceR)) {
    if (!first) {
      this.expect(types$1.comma);
      if (this.afterTrailingComma(types$1.braceR)) {
        break;
      }
    } else {
      first = false;
    }
    nodes.push(this.parseImportSpecifier());
  }
  return nodes;
};
pp$8.parseWithClause = function() {
  var nodes = [];
  if (!this.eat(types$1._with)) {
    return nodes;
  }
  this.expect(types$1.braceL);
  var attributeKeys = {};
  var first = true;
  while (!this.eat(types$1.braceR)) {
    if (!first) {
      this.expect(types$1.comma);
      if (this.afterTrailingComma(types$1.braceR)) {
        break;
      }
    } else {
      first = false;
    }
    var attr = this.parseImportAttribute();
    var keyName = attr.key.type === "Identifier" ? attr.key.name : attr.key.value;
    if (hasOwn(attributeKeys, keyName)) {
      this.raiseRecoverable(attr.key.start, "Duplicate attribute key '" + keyName + "'");
    }
    attributeKeys[keyName] = true;
    nodes.push(attr);
  }
  return nodes;
};
pp$8.parseImportAttribute = function() {
  var node = this.startNode();
  node.key = this.type === types$1.string ? this.parseExprAtom() : this.parseIdent(this.options.allowReserved !== "never");
  this.expect(types$1.colon);
  if (this.type !== types$1.string) {
    this.unexpected();
  }
  node.value = this.parseExprAtom();
  return this.finishNode(node, "ImportAttribute");
};
pp$8.parseModuleExportName = function() {
  if (this.options.ecmaVersion >= 13 && this.type === types$1.string) {
    var stringLiteral = this.parseLiteral(this.value);
    if (loneSurrogate.test(stringLiteral.value)) {
      this.raise(stringLiteral.start, "An export name cannot include a lone surrogate.");
    }
    return stringLiteral;
  }
  return this.parseIdent(true);
};
pp$8.adaptDirectivePrologue = function(statements) {
  for (var i2 = 0; i2 < statements.length && this.isDirectiveCandidate(statements[i2]); ++i2) {
    statements[i2].directive = statements[i2].expression.raw.slice(1, -1);
  }
};
pp$8.isDirectiveCandidate = function(statement) {
  return this.options.ecmaVersion >= 5 && statement.type === "ExpressionStatement" && statement.expression.type === "Literal" && typeof statement.expression.value === "string" && // Reject parenthesized strings.
  (this.input[statement.start] === '"' || this.input[statement.start] === "'");
};
var pp$7 = Parser.prototype;
pp$7.toAssignable = function(node, isBinding, refDestructuringErrors) {
  if (this.options.ecmaVersion >= 6 && node) {
    switch (node.type) {
      case "Identifier":
        if (this.inAsync && node.name === "await") {
          this.raise(node.start, "Cannot use 'await' as identifier inside an async function");
        }
        break;
      case "ObjectPattern":
      case "ArrayPattern":
      case "AssignmentPattern":
      case "RestElement":
        break;
      case "ObjectExpression":
        node.type = "ObjectPattern";
        if (refDestructuringErrors) {
          this.checkPatternErrors(refDestructuringErrors, true);
        }
        for (var i2 = 0, list2 = node.properties; i2 < list2.length; i2 += 1) {
          var prop = list2[i2];
          this.toAssignable(prop, isBinding);
          if (prop.type === "RestElement" && (prop.argument.type === "ArrayPattern" || prop.argument.type === "ObjectPattern")) {
            this.raise(prop.argument.start, "Unexpected token");
          }
        }
        break;
      case "Property":
        if (node.kind !== "init") {
          this.raise(node.key.start, "Object pattern can't contain getter or setter");
        }
        this.toAssignable(node.value, isBinding);
        break;
      case "ArrayExpression":
        node.type = "ArrayPattern";
        if (refDestructuringErrors) {
          this.checkPatternErrors(refDestructuringErrors, true);
        }
        this.toAssignableList(node.elements, isBinding);
        break;
      case "SpreadElement":
        node.type = "RestElement";
        this.toAssignable(node.argument, isBinding);
        if (node.argument.type === "AssignmentPattern") {
          this.raise(node.argument.start, "Rest elements cannot have a default value");
        }
        break;
      case "AssignmentExpression":
        if (node.operator !== "=") {
          this.raise(node.left.end, "Only '=' operator can be used for specifying default value.");
        }
        node.type = "AssignmentPattern";
        delete node.operator;
        this.toAssignable(node.left, isBinding);
        break;
      case "ParenthesizedExpression":
        this.toAssignable(node.expression, isBinding, refDestructuringErrors);
        break;
      case "ChainExpression":
        this.raiseRecoverable(node.start, "Optional chaining cannot appear in left-hand side");
        break;
      case "MemberExpression":
        if (!isBinding) {
          break;
        }
      default:
        this.raise(node.start, "Assigning to rvalue");
    }
  } else if (refDestructuringErrors) {
    this.checkPatternErrors(refDestructuringErrors, true);
  }
  return node;
};
pp$7.toAssignableList = function(exprList, isBinding) {
  var end = exprList.length;
  for (var i2 = 0; i2 < end; i2++) {
    var elt = exprList[i2];
    if (elt) {
      this.toAssignable(elt, isBinding);
    }
  }
  if (end) {
    var last = exprList[end - 1];
    if (this.options.ecmaVersion === 6 && isBinding && last && last.type === "RestElement" && last.argument.type !== "Identifier") {
      this.unexpected(last.argument.start);
    }
  }
  return exprList;
};
pp$7.parseSpread = function(refDestructuringErrors) {
  var node = this.startNode();
  this.next();
  node.argument = this.parseMaybeAssign(false, refDestructuringErrors);
  return this.finishNode(node, "SpreadElement");
};
pp$7.parseRestBinding = function() {
  var node = this.startNode();
  this.next();
  if (this.options.ecmaVersion === 6 && this.type !== types$1.name) {
    this.unexpected();
  }
  node.argument = this.parseBindingAtom();
  return this.finishNode(node, "RestElement");
};
pp$7.parseBindingAtom = function() {
  if (this.options.ecmaVersion >= 6) {
    switch (this.type) {
      case types$1.bracketL:
        var node = this.startNode();
        this.next();
        node.elements = this.parseBindingList(types$1.bracketR, true, true);
        return this.finishNode(node, "ArrayPattern");
      case types$1.braceL:
        return this.parseObj(true);
    }
  }
  return this.parseIdent();
};
pp$7.parseBindingList = function(close, allowEmpty, allowTrailingComma, allowModifiers) {
  var elts = [], first = true;
  while (!this.eat(close)) {
    if (first) {
      first = false;
    } else {
      this.expect(types$1.comma);
    }
    if (allowEmpty && this.type === types$1.comma) {
      elts.push(null);
    } else if (allowTrailingComma && this.afterTrailingComma(close)) {
      break;
    } else if (this.type === types$1.ellipsis) {
      var rest = this.parseRestBinding();
      this.parseBindingListItem(rest);
      elts.push(rest);
      if (this.type === types$1.comma) {
        this.raiseRecoverable(this.start, "Comma is not permitted after the rest element");
      }
      this.expect(close);
      break;
    } else {
      elts.push(this.parseAssignableListItem(allowModifiers));
    }
  }
  return elts;
};
pp$7.parseAssignableListItem = function(allowModifiers) {
  var elem = this.parseMaybeDefault(this.start, this.startLoc);
  this.parseBindingListItem(elem);
  return elem;
};
pp$7.parseBindingListItem = function(param) {
  return param;
};
pp$7.parseMaybeDefault = function(startPos, startLoc, left) {
  left = left || this.parseBindingAtom();
  if (this.options.ecmaVersion < 6 || !this.eat(types$1.eq)) {
    return left;
  }
  var node = this.startNodeAt(startPos, startLoc);
  node.left = left;
  node.right = this.parseMaybeAssign();
  return this.finishNode(node, "AssignmentPattern");
};
pp$7.checkLValSimple = function(expr, bindingType, checkClashes) {
  if (bindingType === void 0) bindingType = BIND_NONE;
  var isBind = bindingType !== BIND_NONE;
  switch (expr.type) {
    case "Identifier":
      if (this.strict && this.reservedWordsStrictBind.test(expr.name)) {
        this.raiseRecoverable(expr.start, (isBind ? "Binding " : "Assigning to ") + expr.name + " in strict mode");
      }
      if (isBind) {
        if (bindingType === BIND_LEXICAL && expr.name === "let") {
          this.raiseRecoverable(expr.start, "let is disallowed as a lexically bound name");
        }
        if (checkClashes) {
          if (hasOwn(checkClashes, expr.name)) {
            this.raiseRecoverable(expr.start, "Argument name clash");
          }
          checkClashes[expr.name] = true;
        }
        if (bindingType !== BIND_OUTSIDE) {
          this.declareName(expr.name, bindingType, expr.start);
        }
      }
      break;
    case "ChainExpression":
      this.raiseRecoverable(expr.start, "Optional chaining cannot appear in left-hand side");
      break;
    case "MemberExpression":
      if (isBind) {
        this.raiseRecoverable(expr.start, "Binding member expression");
      }
      break;
    case "ParenthesizedExpression":
      if (isBind) {
        this.raiseRecoverable(expr.start, "Binding parenthesized expression");
      }
      return this.checkLValSimple(expr.expression, bindingType, checkClashes);
    default:
      this.raise(expr.start, (isBind ? "Binding" : "Assigning to") + " rvalue");
  }
};
pp$7.checkLValPattern = function(expr, bindingType, checkClashes) {
  if (bindingType === void 0) bindingType = BIND_NONE;
  switch (expr.type) {
    case "ObjectPattern":
      for (var i2 = 0, list2 = expr.properties; i2 < list2.length; i2 += 1) {
        var prop = list2[i2];
        this.checkLValInnerPattern(prop, bindingType, checkClashes);
      }
      break;
    case "ArrayPattern":
      for (var i$1 = 0, list$1 = expr.elements; i$1 < list$1.length; i$1 += 1) {
        var elem = list$1[i$1];
        if (elem) {
          this.checkLValInnerPattern(elem, bindingType, checkClashes);
        }
      }
      break;
    default:
      this.checkLValSimple(expr, bindingType, checkClashes);
  }
};
pp$7.checkLValInnerPattern = function(expr, bindingType, checkClashes) {
  if (bindingType === void 0) bindingType = BIND_NONE;
  switch (expr.type) {
    case "Property":
      this.checkLValInnerPattern(expr.value, bindingType, checkClashes);
      break;
    case "AssignmentPattern":
      this.checkLValPattern(expr.left, bindingType, checkClashes);
      break;
    case "RestElement":
      this.checkLValPattern(expr.argument, bindingType, checkClashes);
      break;
    default:
      this.checkLValPattern(expr, bindingType, checkClashes);
  }
};
var TokContext = function TokContext2(token, isExpr, preserveSpace, override, generator) {
  this.token = token;
  this.isExpr = !!isExpr;
  this.preserveSpace = !!preserveSpace;
  this.override = override;
  this.generator = !!generator;
};
var types = {
  b_stat: new TokContext("{", false),
  b_expr: new TokContext("{", true),
  b_tmpl: new TokContext("${", false),
  p_stat: new TokContext("(", false),
  p_expr: new TokContext("(", true),
  q_tmpl: new TokContext("`", true, true, function(p) {
    return p.tryReadTemplateToken();
  }),
  f_stat: new TokContext("function", false),
  f_expr: new TokContext("function", true),
  f_expr_gen: new TokContext("function", true, false, null, true),
  f_gen: new TokContext("function", false, false, null, true)
};
var pp$6 = Parser.prototype;
pp$6.initialContext = function() {
  return [types.b_stat];
};
pp$6.curContext = function() {
  return this.context[this.context.length - 1];
};
pp$6.braceIsBlock = function(prevType) {
  var parent2 = this.curContext();
  if (parent2 === types.f_expr || parent2 === types.f_stat) {
    return true;
  }
  if (prevType === types$1.colon && (parent2 === types.b_stat || parent2 === types.b_expr)) {
    return !parent2.isExpr;
  }
  if (prevType === types$1._return || prevType === types$1.name && this.exprAllowed) {
    return lineBreak.test(this.input.slice(this.lastTokEnd, this.start));
  }
  if (prevType === types$1._else || prevType === types$1.semi || prevType === types$1.eof || prevType === types$1.parenR || prevType === types$1.arrow) {
    return true;
  }
  if (prevType === types$1.braceL) {
    return parent2 === types.b_stat;
  }
  if (prevType === types$1._var || prevType === types$1._const || prevType === types$1.name) {
    return false;
  }
  return !this.exprAllowed;
};
pp$6.inGeneratorContext = function() {
  for (var i2 = this.context.length - 1; i2 >= 1; i2--) {
    var context = this.context[i2];
    if (context.token === "function") {
      return context.generator;
    }
  }
  return false;
};
pp$6.updateContext = function(prevType) {
  var update, type = this.type;
  if (type.keyword && prevType === types$1.dot) {
    this.exprAllowed = false;
  } else if (update = type.updateContext) {
    update.call(this, prevType);
  } else {
    this.exprAllowed = type.beforeExpr;
  }
};
pp$6.overrideContext = function(tokenCtx) {
  if (this.curContext() !== tokenCtx) {
    this.context[this.context.length - 1] = tokenCtx;
  }
};
types$1.parenR.updateContext = types$1.braceR.updateContext = function() {
  if (this.context.length === 1) {
    this.exprAllowed = true;
    return;
  }
  var out = this.context.pop();
  if (out === types.b_stat && this.curContext().token === "function") {
    out = this.context.pop();
  }
  this.exprAllowed = !out.isExpr;
};
types$1.braceL.updateContext = function(prevType) {
  this.context.push(this.braceIsBlock(prevType) ? types.b_stat : types.b_expr);
  this.exprAllowed = true;
};
types$1.dollarBraceL.updateContext = function() {
  this.context.push(types.b_tmpl);
  this.exprAllowed = true;
};
types$1.parenL.updateContext = function(prevType) {
  var statementParens = prevType === types$1._if || prevType === types$1._for || prevType === types$1._with || prevType === types$1._while;
  this.context.push(statementParens ? types.p_stat : types.p_expr);
  this.exprAllowed = true;
};
types$1.incDec.updateContext = function() {
};
types$1._function.updateContext = types$1._class.updateContext = function(prevType) {
  if (prevType.beforeExpr && prevType !== types$1._else && !(prevType === types$1.semi && this.curContext() !== types.p_stat) && !(prevType === types$1._return && lineBreak.test(this.input.slice(this.lastTokEnd, this.start))) && !((prevType === types$1.colon || prevType === types$1.braceL) && this.curContext() === types.b_stat)) {
    this.context.push(types.f_expr);
  } else {
    this.context.push(types.f_stat);
  }
  this.exprAllowed = false;
};
types$1.colon.updateContext = function() {
  if (this.curContext().token === "function") {
    this.context.pop();
  }
  this.exprAllowed = true;
};
types$1.backQuote.updateContext = function() {
  if (this.curContext() === types.q_tmpl) {
    this.context.pop();
  } else {
    this.context.push(types.q_tmpl);
  }
  this.exprAllowed = false;
};
types$1.star.updateContext = function(prevType) {
  if (prevType === types$1._function) {
    var index = this.context.length - 1;
    if (this.context[index] === types.f_expr) {
      this.context[index] = types.f_expr_gen;
    } else {
      this.context[index] = types.f_gen;
    }
  }
  this.exprAllowed = true;
};
types$1.name.updateContext = function(prevType) {
  var allowed = false;
  if (this.options.ecmaVersion >= 6 && prevType !== types$1.dot) {
    if (this.value === "of" && !this.exprAllowed || this.value === "yield" && this.inGeneratorContext()) {
      allowed = true;
    }
  }
  this.exprAllowed = allowed;
};
var pp$5 = Parser.prototype;
pp$5.checkPropClash = function(prop, propHash, refDestructuringErrors) {
  if (this.options.ecmaVersion >= 9 && prop.type === "SpreadElement") {
    return;
  }
  if (this.options.ecmaVersion >= 6 && (prop.computed || prop.method || prop.shorthand)) {
    return;
  }
  var key = prop.key;
  var name;
  switch (key.type) {
    case "Identifier":
      name = key.name;
      break;
    case "Literal":
      name = String(key.value);
      break;
    default:
      return;
  }
  var kind = prop.kind;
  if (this.options.ecmaVersion >= 6) {
    if (name === "__proto__" && kind === "init") {
      if (propHash.proto) {
        if (refDestructuringErrors) {
          if (refDestructuringErrors.doubleProto < 0) {
            refDestructuringErrors.doubleProto = key.start;
          }
        } else {
          this.raiseRecoverable(key.start, "Redefinition of __proto__ property");
        }
      }
      propHash.proto = true;
    }
    return;
  }
  name = "$" + name;
  var other = propHash[name];
  if (other) {
    var redefinition;
    if (kind === "init") {
      redefinition = this.strict && other.init || other.get || other.set;
    } else {
      redefinition = other.init || other[kind];
    }
    if (redefinition) {
      this.raiseRecoverable(key.start, "Redefinition of property");
    }
  } else {
    other = propHash[name] = {
      init: false,
      get: false,
      set: false
    };
  }
  other[kind] = true;
};
pp$5.parseExpression = function(forInit, refDestructuringErrors) {
  var this$1$1 = this;
  return this.catchStackOverflow(function() {
    var startPos = this$1$1.start, startLoc = this$1$1.startLoc;
    var expr = this$1$1.parseMaybeAssign(forInit, refDestructuringErrors);
    if (this$1$1.type === types$1.comma) {
      var node = this$1$1.startNodeAt(startPos, startLoc);
      node.expressions = [expr];
      while (this$1$1.eat(types$1.comma)) {
        node.expressions.push(this$1$1.parseMaybeAssign(forInit, refDestructuringErrors));
      }
      return this$1$1.finishNode(node, "SequenceExpression");
    }
    return expr;
  });
};
pp$5.parseMaybeAssign = function(forInit, refDestructuringErrors, afterLeftParse) {
  if (this.isContextual("yield")) {
    if (this.inGenerator) {
      return this.parseYield(forInit);
    } else {
      this.exprAllowed = false;
    }
  }
  var ownDestructuringErrors = false, oldParenAssign = -1, oldTrailingComma = -1, oldDoubleProto = -1;
  if (refDestructuringErrors) {
    oldParenAssign = refDestructuringErrors.parenthesizedAssign;
    oldTrailingComma = refDestructuringErrors.trailingComma;
    oldDoubleProto = refDestructuringErrors.doubleProto;
    refDestructuringErrors.parenthesizedAssign = refDestructuringErrors.trailingComma = -1;
  } else {
    refDestructuringErrors = new DestructuringErrors();
    ownDestructuringErrors = true;
  }
  var startPos = this.start, startLoc = this.startLoc;
  if (this.type === types$1.parenL || this.type === types$1.name) {
    this.potentialArrowAt = this.start;
    this.potentialArrowInForAwait = forInit === "await";
  }
  var left = this.parseMaybeConditional(forInit, refDestructuringErrors);
  if (afterLeftParse) {
    left = afterLeftParse.call(this, left, startPos, startLoc);
  }
  if (this.type.isAssign) {
    var node = this.startNodeAt(startPos, startLoc);
    node.operator = this.value;
    if (this.type === types$1.eq) {
      left = this.toAssignable(left, false, refDestructuringErrors);
    }
    if (!ownDestructuringErrors) {
      refDestructuringErrors.parenthesizedAssign = refDestructuringErrors.trailingComma = refDestructuringErrors.doubleProto = -1;
    }
    if (refDestructuringErrors.shorthandAssign >= left.start) {
      refDestructuringErrors.shorthandAssign = -1;
    }
    if (this.type === types$1.eq) {
      this.checkLValPattern(left);
    } else {
      this.checkLValSimple(left);
    }
    node.left = left;
    this.next();
    node.right = this.parseMaybeAssign(forInit);
    if (oldDoubleProto > -1) {
      refDestructuringErrors.doubleProto = oldDoubleProto;
    }
    return this.finishNode(node, "AssignmentExpression");
  } else {
    if (ownDestructuringErrors) {
      this.checkExpressionErrors(refDestructuringErrors, true);
    }
  }
  if (oldParenAssign > -1) {
    refDestructuringErrors.parenthesizedAssign = oldParenAssign;
  }
  if (oldTrailingComma > -1) {
    refDestructuringErrors.trailingComma = oldTrailingComma;
  }
  return left;
};
pp$5.parseMaybeConditional = function(forInit, refDestructuringErrors) {
  var startPos = this.start, startLoc = this.startLoc;
  var expr = this.parseExprOps(forInit, refDestructuringErrors);
  if (this.checkExpressionErrors(refDestructuringErrors)) {
    return expr;
  }
  if (!(expr.type === "ArrowFunctionExpression" && expr.start === startPos) && this.eat(types$1.question)) {
    var node = this.startNodeAt(startPos, startLoc);
    node.test = expr;
    node.consequent = this.parseMaybeAssign();
    this.expect(types$1.colon);
    node.alternate = this.parseMaybeAssign(forInit);
    return this.finishNode(node, "ConditionalExpression");
  }
  return expr;
};
pp$5.parseExprOps = function(forInit, refDestructuringErrors) {
  var startPos = this.start, startLoc = this.startLoc;
  var expr = this.parseMaybeUnary(refDestructuringErrors, false, false, forInit);
  if (this.checkExpressionErrors(refDestructuringErrors)) {
    return expr;
  }
  return expr.start === startPos && expr.type === "ArrowFunctionExpression" ? expr : this.parseExprOp(expr, startPos, startLoc, -1, forInit);
};
pp$5.parseExprOp = function(left, leftStartPos, leftStartLoc, minPrec, forInit) {
  var prec = this.type.binop;
  if (prec != null && (!forInit || this.type !== types$1._in)) {
    if (prec > minPrec) {
      var logical = this.type === types$1.logicalOR || this.type === types$1.logicalAND;
      var coalesce = this.type === types$1.coalesce;
      if (coalesce) {
        prec = types$1.logicalAND.binop;
      }
      var op = this.value;
      this.next();
      var startPos = this.start, startLoc = this.startLoc;
      var right = this.parseExprOp(this.parseMaybeUnary(null, false, false, forInit), startPos, startLoc, prec, forInit);
      var node = this.buildBinary(leftStartPos, leftStartLoc, left, right, op, logical || coalesce);
      if (logical && this.type === types$1.coalesce || coalesce && (this.type === types$1.logicalOR || this.type === types$1.logicalAND)) {
        this.raiseRecoverable(this.start, "Logical expressions and coalesce expressions cannot be mixed. Wrap either by parentheses");
      }
      return this.parseExprOp(node, leftStartPos, leftStartLoc, minPrec, forInit);
    }
  }
  return left;
};
pp$5.buildBinary = function(startPos, startLoc, left, right, op, logical) {
  if (right.type === "PrivateIdentifier") {
    this.raise(right.start, "Private identifier can only be left side of binary expression");
  }
  var node = this.startNodeAt(startPos, startLoc);
  node.left = left;
  node.operator = op;
  node.right = right;
  return this.finishNode(node, logical ? "LogicalExpression" : "BinaryExpression");
};
pp$5.parseMaybeUnary = function(refDestructuringErrors, sawUnary, incDec, forInit) {
  var startPos = this.start, startLoc = this.startLoc, expr;
  if (this.isContextual("await") && this.canAwait) {
    expr = this.parseAwait(forInit);
    sawUnary = true;
  } else if (this.type.prefix) {
    var node = this.startNode(), update = this.type === types$1.incDec;
    node.operator = this.value;
    node.prefix = true;
    this.next();
    node.argument = this.parseMaybeUnary(null, true, update, forInit);
    this.checkExpressionErrors(refDestructuringErrors, true);
    if (update) {
      this.checkLValSimple(node.argument);
    } else if (this.strict && node.operator === "delete" && isLocalVariableAccess(node.argument)) {
      this.raiseRecoverable(node.start, "Deleting local variable in strict mode");
    } else if (node.operator === "delete" && isPrivateFieldAccess(node.argument)) {
      this.raiseRecoverable(node.start, "Private fields can not be deleted");
    } else {
      sawUnary = true;
    }
    expr = this.finishNode(node, update ? "UpdateExpression" : "UnaryExpression");
  } else if (!sawUnary && this.type === types$1.privateId) {
    if ((forInit || this.privateNameStack.length === 0) && this.options.checkPrivateFields) {
      this.unexpected();
    }
    expr = this.parsePrivateIdent();
    if (this.type !== types$1._in) {
      this.unexpected();
    }
  } else {
    expr = this.parseExprSubscripts(refDestructuringErrors, forInit);
    if (this.checkExpressionErrors(refDestructuringErrors)) {
      return expr;
    }
    while (this.type.postfix && !this.canInsertSemicolon()) {
      var node$1 = this.startNodeAt(startPos, startLoc);
      node$1.operator = this.value;
      node$1.prefix = false;
      node$1.argument = expr;
      this.checkLValSimple(expr);
      this.next();
      expr = this.finishNode(node$1, "UpdateExpression");
    }
  }
  if (!incDec && !(expr.type === "ArrowFunctionExpression" && expr.start === startPos) && this.eat(types$1.starstar)) {
    if (sawUnary) {
      this.unexpected(this.lastTokStart);
    } else {
      return this.buildBinary(startPos, startLoc, expr, this.parseMaybeUnary(null, false, false, forInit), "**", false);
    }
  } else {
    return expr;
  }
};
function isLocalVariableAccess(node) {
  return node.type === "Identifier" || node.type === "ParenthesizedExpression" && isLocalVariableAccess(node.expression);
}
function isPrivateFieldAccess(node) {
  return node.type === "MemberExpression" && node.property.type === "PrivateIdentifier" || node.type === "ChainExpression" && isPrivateFieldAccess(node.expression) || node.type === "ParenthesizedExpression" && isPrivateFieldAccess(node.expression);
}
pp$5.parseExprSubscripts = function(refDestructuringErrors, forInit) {
  var startPos = this.start, startLoc = this.startLoc;
  var expr = this.parseExprAtom(refDestructuringErrors, forInit);
  if (expr.type === "ArrowFunctionExpression" && this.input.slice(this.lastTokStart, this.lastTokEnd) !== ")") {
    return expr;
  }
  var result = this.parseSubscripts(expr, startPos, startLoc, false, forInit);
  if (refDestructuringErrors && result.type === "MemberExpression") {
    if (refDestructuringErrors.parenthesizedAssign >= result.start) {
      refDestructuringErrors.parenthesizedAssign = -1;
    }
    if (refDestructuringErrors.parenthesizedBind >= result.start) {
      refDestructuringErrors.parenthesizedBind = -1;
    }
    if (refDestructuringErrors.trailingComma >= result.start) {
      refDestructuringErrors.trailingComma = -1;
    }
  }
  return result;
};
pp$5.parseSubscripts = function(base2, startPos, startLoc, noCalls, forInit) {
  var maybeAsyncArrow = this.options.ecmaVersion >= 8 && base2.type === "Identifier" && base2.name === "async" && this.lastTokEnd === base2.end && !this.canInsertSemicolon() && base2.end - base2.start === 5 && this.potentialArrowAt === base2.start;
  var optionalChained = false;
  while (true) {
    var element2 = this.parseSubscript(base2, startPos, startLoc, noCalls, maybeAsyncArrow, optionalChained, forInit);
    if (element2.optional) {
      optionalChained = true;
    }
    if (element2 === base2 || element2.type === "ArrowFunctionExpression") {
      if (optionalChained) {
        var chainNode = this.startNodeAt(startPos, startLoc);
        chainNode.expression = element2;
        element2 = this.finishNode(chainNode, "ChainExpression");
      }
      return element2;
    }
    base2 = element2;
  }
};
pp$5.shouldParseAsyncArrow = function() {
  return !this.canInsertSemicolon() && this.eat(types$1.arrow);
};
pp$5.parseSubscriptAsyncArrow = function(startPos, startLoc, exprList, forInit) {
  return this.parseArrowExpression(this.startNodeAt(startPos, startLoc), exprList, true, forInit);
};
pp$5.parseSubscript = function(base2, startPos, startLoc, noCalls, maybeAsyncArrow, optionalChained, forInit) {
  var optionalSupported = this.options.ecmaVersion >= 11;
  var optional = optionalSupported && this.eat(types$1.questionDot);
  if (noCalls && optional) {
    this.raise(this.lastTokStart, "Optional chaining cannot appear in the callee of new expressions");
  }
  var computed = this.eat(types$1.bracketL);
  if (computed || optional && this.type !== types$1.parenL && this.type !== types$1.backQuote || this.eat(types$1.dot)) {
    var node = this.startNodeAt(startPos, startLoc);
    node.object = base2;
    if (computed) {
      node.property = this.parseExpression();
      this.expect(types$1.bracketR);
    } else if (this.type === types$1.privateId && base2.type !== "Super") {
      node.property = this.parsePrivateIdent();
    } else {
      node.property = this.parseIdent(this.options.allowReserved !== "never");
    }
    node.computed = !!computed;
    if (optionalSupported) {
      node.optional = optional;
    }
    base2 = this.finishNode(node, "MemberExpression");
  } else if (!noCalls && this.eat(types$1.parenL)) {
    var refDestructuringErrors = new DestructuringErrors(), oldYieldPos = this.yieldPos, oldAwaitPos = this.awaitPos, oldAwaitIdentPos = this.awaitIdentPos;
    this.yieldPos = 0;
    this.awaitPos = 0;
    this.awaitIdentPos = 0;
    var exprList = this.parseExprList(types$1.parenR, this.options.ecmaVersion >= 8, false, refDestructuringErrors);
    if (maybeAsyncArrow && !optional && this.shouldParseAsyncArrow()) {
      this.checkPatternErrors(refDestructuringErrors, false);
      this.checkYieldAwaitInDefaultParams();
      if (this.awaitIdentPos > 0) {
        this.raise(this.awaitIdentPos, "Cannot use 'await' as identifier inside an async function");
      }
      this.yieldPos = oldYieldPos;
      this.awaitPos = oldAwaitPos;
      this.awaitIdentPos = oldAwaitIdentPos;
      return this.parseSubscriptAsyncArrow(startPos, startLoc, exprList, forInit);
    }
    this.checkExpressionErrors(refDestructuringErrors, true);
    this.yieldPos = oldYieldPos || this.yieldPos;
    this.awaitPos = oldAwaitPos || this.awaitPos;
    this.awaitIdentPos = oldAwaitIdentPos || this.awaitIdentPos;
    var node$1 = this.startNodeAt(startPos, startLoc);
    node$1.callee = base2;
    node$1.arguments = exprList;
    if (optionalSupported) {
      node$1.optional = optional;
    }
    base2 = this.finishNode(node$1, "CallExpression");
  } else if (this.type === types$1.backQuote) {
    if (optional || optionalChained) {
      this.raise(this.start, "Optional chaining cannot appear in the tag of tagged template expressions");
    }
    var node$2 = this.startNodeAt(startPos, startLoc);
    node$2.tag = base2;
    node$2.quasi = this.parseTemplate({ isTagged: true });
    base2 = this.finishNode(node$2, "TaggedTemplateExpression");
  }
  return base2;
};
pp$5.parseExprAtom = function(refDestructuringErrors, forInit, forNew) {
  if (this.type === types$1.slash) {
    this.readRegexp();
  }
  var node, canBeArrow = this.potentialArrowAt === this.start;
  switch (this.type) {
    case types$1._super:
      if (!this.allowSuper) {
        this.raise(this.start, "'super' keyword outside a method");
      }
      node = this.startNode();
      this.next();
      if (this.type === types$1.parenL && !this.allowDirectSuper) {
        this.raise(node.start, "super() call outside constructor of a subclass");
      }
      if (this.type !== types$1.dot && this.type !== types$1.bracketL && this.type !== types$1.parenL) {
        this.unexpected();
      }
      return this.finishNode(node, "Super");
    case types$1._this:
      node = this.startNode();
      this.next();
      return this.finishNode(node, "ThisExpression");
    case types$1.name:
      var startPos = this.start, startLoc = this.startLoc, containsEsc = this.containsEsc;
      var id2 = this.parseIdent(false);
      if (this.options.ecmaVersion >= 8 && !containsEsc && id2.name === "async" && !this.canInsertSemicolon() && this.eat(types$1._function)) {
        this.overrideContext(types.f_expr);
        return this.parseFunction(this.startNodeAt(startPos, startLoc), 0, false, true, forInit);
      }
      if (canBeArrow && !this.canInsertSemicolon()) {
        if (this.eat(types$1.arrow)) {
          return this.parseArrowExpression(this.startNodeAt(startPos, startLoc), [id2], false, forInit);
        }
        if (this.options.ecmaVersion >= 8 && id2.name === "async" && this.type === types$1.name && !containsEsc && (!this.potentialArrowInForAwait || this.value !== "of" || this.containsEsc)) {
          id2 = this.parseIdent(false);
          if (this.canInsertSemicolon() || !this.eat(types$1.arrow)) {
            this.unexpected();
          }
          return this.parseArrowExpression(this.startNodeAt(startPos, startLoc), [id2], true, forInit);
        }
      }
      return id2;
    case types$1.regexp:
      var value = this.value;
      node = this.parseLiteral(value.value);
      node.regex = { pattern: value.pattern, flags: value.flags };
      return node;
    case types$1.num:
    case types$1.string:
      return this.parseLiteral(this.value);
    case types$1._null:
    case types$1._true:
    case types$1._false:
      node = this.startNode();
      node.value = this.type === types$1._null ? null : this.type === types$1._true;
      node.raw = this.type.keyword;
      this.next();
      return this.finishNode(node, "Literal");
    case types$1.parenL:
      var start = this.start, expr = this.parseParenAndDistinguishExpression(canBeArrow, forInit);
      if (refDestructuringErrors) {
        if (refDestructuringErrors.parenthesizedAssign < 0 && !this.isSimpleAssignTarget(expr)) {
          refDestructuringErrors.parenthesizedAssign = start;
        }
        if (refDestructuringErrors.parenthesizedBind < 0) {
          refDestructuringErrors.parenthesizedBind = start;
        }
      }
      return expr;
    case types$1.bracketL:
      node = this.startNode();
      this.next();
      node.elements = this.parseExprList(types$1.bracketR, true, true, refDestructuringErrors);
      return this.finishNode(node, "ArrayExpression");
    case types$1.braceL:
      this.overrideContext(types.b_expr);
      return this.parseObj(false, refDestructuringErrors);
    case types$1._function:
      node = this.startNode();
      this.next();
      return this.parseFunction(node, 0);
    case types$1._class:
      return this.parseClass(this.startNode(), false);
    case types$1._new:
      return this.parseNew();
    case types$1.backQuote:
      return this.parseTemplate();
    case types$1._import:
      if (this.options.ecmaVersion >= 11) {
        return this.parseExprImport(forNew);
      } else {
        return this.unexpected();
      }
    default:
      return this.parseExprAtomDefault();
  }
};
pp$5.parseExprAtomDefault = function() {
  this.unexpected();
};
pp$5.parseExprImport = function(forNew) {
  var node = this.startNode();
  if (this.containsEsc) {
    this.raiseRecoverable(this.start, "Escape sequence in keyword import");
  }
  this.next();
  if (this.type === types$1.parenL && !forNew) {
    return this.parseDynamicImport(node);
  } else if (this.type === types$1.dot) {
    var meta = this.startNodeAt(node.start, node.loc && node.loc.start);
    meta.name = "import";
    node.meta = this.finishNode(meta, "Identifier");
    return this.parseImportMeta(node);
  } else {
    this.unexpected();
  }
};
pp$5.parseDynamicImport = function(node) {
  this.next();
  node.source = this.parseMaybeAssign();
  if (this.options.ecmaVersion >= 16) {
    if (!this.eat(types$1.parenR)) {
      this.expect(types$1.comma);
      if (!this.afterTrailingComma(types$1.parenR)) {
        node.options = this.parseMaybeAssign();
        if (!this.eat(types$1.parenR)) {
          this.expect(types$1.comma);
          if (!this.afterTrailingComma(types$1.parenR)) {
            this.unexpected();
          }
        }
      } else {
        node.options = null;
      }
    } else {
      node.options = null;
    }
  } else {
    if (!this.eat(types$1.parenR)) {
      var errorPos = this.start;
      if (this.eat(types$1.comma) && this.eat(types$1.parenR)) {
        this.raiseRecoverable(errorPos, "Trailing comma is not allowed in import()");
      } else {
        this.unexpected(errorPos);
      }
    }
  }
  return this.finishNode(node, "ImportExpression");
};
pp$5.parseImportMeta = function(node) {
  this.next();
  var containsEsc = this.containsEsc;
  node.property = this.parseIdent(true);
  if (node.property.name !== "meta") {
    this.raiseRecoverable(node.property.start, "The only valid meta property for import is 'import.meta'");
  }
  if (containsEsc) {
    this.raiseRecoverable(node.start, "'import.meta' must not contain escaped characters");
  }
  if (this.options.sourceType !== "module" && !this.options.allowImportExportEverywhere) {
    this.raiseRecoverable(node.start, "Cannot use 'import.meta' outside a module");
  }
  return this.finishNode(node, "MetaProperty");
};
pp$5.parseLiteral = function(value) {
  var node = this.startNode();
  node.value = value;
  node.raw = this.input.slice(this.start, this.end);
  if (node.raw.charCodeAt(node.raw.length - 1) === 110) {
    node.bigint = node.value != null ? node.value.toString() : node.raw.slice(0, -1).replace(/_/g, "");
  }
  this.next();
  return this.finishNode(node, "Literal");
};
pp$5.parseParenExpression = function() {
  this.expect(types$1.parenL);
  var val = this.parseExpression();
  this.expect(types$1.parenR);
  return val;
};
pp$5.shouldParseArrow = function(exprList) {
  return !this.canInsertSemicolon();
};
pp$5.parseParenAndDistinguishExpression = function(canBeArrow, forInit) {
  var startPos = this.start, startLoc = this.startLoc, val, allowTrailingComma = this.options.ecmaVersion >= 8;
  if (this.options.ecmaVersion >= 6) {
    this.next();
    var innerStartPos = this.start, innerStartLoc = this.startLoc;
    var exprList = [], first = true, lastIsComma = false;
    var refDestructuringErrors = new DestructuringErrors(), oldYieldPos = this.yieldPos, oldAwaitPos = this.awaitPos, spreadStart;
    this.yieldPos = 0;
    this.awaitPos = 0;
    while (this.type !== types$1.parenR) {
      first ? first = false : this.expect(types$1.comma);
      if (allowTrailingComma && this.afterTrailingComma(types$1.parenR, true)) {
        lastIsComma = true;
        break;
      } else if (this.type === types$1.ellipsis) {
        spreadStart = this.start;
        exprList.push(this.parseParenItem(this.parseRestBinding()));
        if (this.type === types$1.comma) {
          this.raiseRecoverable(
            this.start,
            "Comma is not permitted after the rest element"
          );
        }
        break;
      } else {
        exprList.push(this.parseMaybeAssign(false, refDestructuringErrors, this.parseParenItem));
      }
    }
    var innerEndPos = this.lastTokEnd, innerEndLoc = this.lastTokEndLoc;
    this.expect(types$1.parenR);
    if (canBeArrow && this.shouldParseArrow(exprList) && this.eat(types$1.arrow)) {
      this.checkPatternErrors(refDestructuringErrors, false);
      this.checkYieldAwaitInDefaultParams();
      this.yieldPos = oldYieldPos;
      this.awaitPos = oldAwaitPos;
      return this.parseParenArrowList(startPos, startLoc, exprList, forInit);
    }
    if (!exprList.length || lastIsComma) {
      this.unexpected(this.lastTokStart);
    }
    if (spreadStart) {
      this.unexpected(spreadStart);
    }
    this.checkExpressionErrors(refDestructuringErrors, true);
    this.yieldPos = oldYieldPos || this.yieldPos;
    this.awaitPos = oldAwaitPos || this.awaitPos;
    if (exprList.length > 1) {
      val = this.startNodeAt(innerStartPos, innerStartLoc);
      val.expressions = exprList;
      this.finishNodeAt(val, "SequenceExpression", innerEndPos, innerEndLoc);
    } else {
      val = exprList[0];
    }
  } else {
    val = this.parseParenExpression();
  }
  if (this.options.preserveParens) {
    var par = this.startNodeAt(startPos, startLoc);
    par.expression = val;
    return this.finishNode(par, "ParenthesizedExpression");
  } else {
    return val;
  }
};
pp$5.parseParenItem = function(item) {
  return item;
};
pp$5.parseParenArrowList = function(startPos, startLoc, exprList, forInit) {
  return this.parseArrowExpression(this.startNodeAt(startPos, startLoc), exprList, false, forInit);
};
var empty = [];
pp$5.parseNew = function() {
  if (this.containsEsc) {
    this.raiseRecoverable(this.start, "Escape sequence in keyword new");
  }
  var node = this.startNode();
  this.next();
  if (this.options.ecmaVersion >= 6 && this.type === types$1.dot) {
    var meta = this.startNodeAt(node.start, node.loc && node.loc.start);
    meta.name = "new";
    node.meta = this.finishNode(meta, "Identifier");
    this.next();
    var containsEsc = this.containsEsc;
    node.property = this.parseIdent(true);
    if (node.property.name !== "target") {
      this.raiseRecoverable(node.property.start, "The only valid meta property for new is 'new.target'");
    }
    if (containsEsc) {
      this.raiseRecoverable(node.start, "'new.target' must not contain escaped characters");
    }
    if (!this.allowNewDotTarget) {
      this.raiseRecoverable(node.start, "'new.target' can only be used in functions and class static block");
    }
    return this.finishNode(node, "MetaProperty");
  }
  var startPos = this.start, startLoc = this.startLoc;
  node.callee = this.parseSubscripts(this.parseExprAtom(null, false, true), startPos, startLoc, true, false);
  if (node.callee.type === "Super") {
    this.raiseRecoverable(startPos, "Invalid use of 'super'");
  }
  if (this.eat(types$1.parenL)) {
    node.arguments = this.parseExprList(types$1.parenR, this.options.ecmaVersion >= 8, false);
  } else {
    node.arguments = empty;
  }
  return this.finishNode(node, "NewExpression");
};
pp$5.parseTemplateElement = function(ref2) {
  var isTagged = ref2.isTagged;
  var elem = this.startNode();
  if (this.type === types$1.invalidTemplate) {
    if (!isTagged) {
      this.raiseRecoverable(this.start, "Bad escape sequence in untagged template literal");
    }
    elem.value = {
      raw: this.value.replace(/\r\n?/g, "\n"),
      cooked: null
    };
  } else {
    elem.value = {
      raw: this.input.slice(this.start, this.end).replace(/\r\n?/g, "\n"),
      cooked: this.value
    };
  }
  this.next();
  elem.tail = this.type === types$1.backQuote;
  return this.finishNode(elem, "TemplateElement");
};
pp$5.parseTemplate = function(ref2) {
  if (ref2 === void 0) ref2 = {};
  var isTagged = ref2.isTagged;
  if (isTagged === void 0) isTagged = false;
  var node = this.startNode();
  this.next();
  node.expressions = [];
  var curElt = this.parseTemplateElement({ isTagged });
  node.quasis = [curElt];
  while (!curElt.tail) {
    if (this.type === types$1.eof) {
      this.raise(this.pos, "Unterminated template literal");
    }
    this.expect(types$1.dollarBraceL);
    node.expressions.push(this.parseExpression());
    this.expect(types$1.braceR);
    node.quasis.push(curElt = this.parseTemplateElement({ isTagged }));
  }
  this.next();
  return this.finishNode(node, "TemplateLiteral");
};
pp$5.isAsyncProp = function(prop) {
  return !prop.computed && prop.key.type === "Identifier" && prop.key.name === "async" && (this.type === types$1.name || this.type === types$1.num || this.type === types$1.string || this.type === types$1.bracketL || this.type.keyword || this.options.ecmaVersion >= 9 && this.type === types$1.star) && !lineBreak.test(this.input.slice(this.lastTokEnd, this.start));
};
pp$5.parseObj = function(isPattern, refDestructuringErrors) {
  var node = this.startNode(), first = true, propHash = {};
  node.properties = [];
  this.next();
  while (!this.eat(types$1.braceR)) {
    if (!first) {
      this.expect(types$1.comma);
      if (this.options.ecmaVersion >= 5 && this.afterTrailingComma(types$1.braceR)) {
        break;
      }
    } else {
      first = false;
    }
    var prop = this.parseProperty(isPattern, refDestructuringErrors);
    if (!isPattern) {
      this.checkPropClash(prop, propHash, refDestructuringErrors);
    }
    node.properties.push(prop);
  }
  return this.finishNode(node, isPattern ? "ObjectPattern" : "ObjectExpression");
};
pp$5.parseProperty = function(isPattern, refDestructuringErrors) {
  var prop = this.startNode(), isGenerator, isAsync, startPos, startLoc;
  if (this.options.ecmaVersion >= 9 && this.eat(types$1.ellipsis)) {
    if (isPattern) {
      prop.argument = this.parseIdent(false);
      if (this.type === types$1.comma) {
        this.raiseRecoverable(this.start, "Comma is not permitted after the rest element");
      }
      return this.finishNode(prop, "RestElement");
    }
    prop.argument = this.parseMaybeAssign(false, refDestructuringErrors);
    if (this.type === types$1.comma && refDestructuringErrors && refDestructuringErrors.trailingComma < 0) {
      refDestructuringErrors.trailingComma = this.start;
    }
    return this.finishNode(prop, "SpreadElement");
  }
  if (this.options.ecmaVersion >= 6) {
    prop.method = false;
    prop.shorthand = false;
    if (isPattern || refDestructuringErrors) {
      startPos = this.start;
      startLoc = this.startLoc;
    }
    if (!isPattern) {
      isGenerator = this.eat(types$1.star);
    }
  }
  var containsEsc = this.containsEsc;
  this.parsePropertyName(prop);
  if (!isPattern && !containsEsc && this.options.ecmaVersion >= 8 && !isGenerator && this.isAsyncProp(prop)) {
    isAsync = true;
    isGenerator = this.options.ecmaVersion >= 9 && this.eat(types$1.star);
    this.parsePropertyName(prop);
  } else {
    isAsync = false;
  }
  this.parsePropertyValue(prop, isPattern, isGenerator, isAsync, startPos, startLoc, refDestructuringErrors, containsEsc);
  return this.finishNode(prop, "Property");
};
pp$5.parseGetterSetter = function(prop) {
  var kind = prop.key.name;
  this.parsePropertyName(prop);
  prop.value = this.parseMethod(false);
  prop.kind = kind;
  var paramCount = prop.kind === "get" ? 0 : 1;
  if (prop.value.params.length !== paramCount) {
    var start = prop.value.start;
    if (prop.kind === "get") {
      this.raiseRecoverable(start, "getter should have no params");
    } else {
      this.raiseRecoverable(start, "setter should have exactly one param");
    }
  } else {
    if (prop.kind === "set" && prop.value.params[0].type === "RestElement") {
      this.raiseRecoverable(prop.value.params[0].start, "Setter cannot use rest params");
    }
  }
};
pp$5.parsePropertyValue = function(prop, isPattern, isGenerator, isAsync, startPos, startLoc, refDestructuringErrors, containsEsc) {
  if ((isGenerator || isAsync) && this.type === types$1.colon) {
    this.unexpected();
  }
  if (this.eat(types$1.colon)) {
    prop.value = isPattern ? this.parseMaybeDefault(this.start, this.startLoc) : this.parseMaybeAssign(false, refDestructuringErrors);
    prop.kind = "init";
  } else if (this.options.ecmaVersion >= 6 && this.type === types$1.parenL) {
    if (isPattern) {
      this.unexpected();
    }
    prop.method = true;
    prop.value = this.parseMethod(isGenerator, isAsync);
    prop.kind = "init";
  } else if (!isPattern && !containsEsc && this.options.ecmaVersion >= 5 && !prop.computed && prop.key.type === "Identifier" && (prop.key.name === "get" || prop.key.name === "set") && (this.type !== types$1.comma && this.type !== types$1.braceR && this.type !== types$1.eq)) {
    if (isGenerator || isAsync) {
      this.unexpected();
    }
    this.parseGetterSetter(prop);
  } else if (this.options.ecmaVersion >= 6 && !prop.computed && prop.key.type === "Identifier") {
    if (isGenerator || isAsync) {
      this.unexpected();
    }
    this.checkUnreserved(prop.key);
    if (prop.key.name === "await" && !this.awaitIdentPos) {
      this.awaitIdentPos = startPos;
    }
    if (isPattern) {
      prop.value = this.parseMaybeDefault(startPos, startLoc, this.copyNode(prop.key));
    } else if (this.type === types$1.eq && refDestructuringErrors) {
      if (refDestructuringErrors.shorthandAssign < 0) {
        refDestructuringErrors.shorthandAssign = this.start;
      }
      prop.value = this.parseMaybeDefault(startPos, startLoc, this.copyNode(prop.key));
    } else {
      prop.value = this.copyNode(prop.key);
    }
    prop.kind = "init";
    prop.shorthand = true;
  } else {
    this.unexpected();
  }
};
pp$5.parsePropertyName = function(prop) {
  if (this.options.ecmaVersion >= 6) {
    if (this.eat(types$1.bracketL)) {
      prop.computed = true;
      prop.key = this.parseMaybeAssign();
      this.expect(types$1.bracketR);
      return prop.key;
    } else {
      prop.computed = false;
    }
  }
  return prop.key = this.type === types$1.num || this.type === types$1.string ? this.parseExprAtom() : this.parseIdent(this.options.allowReserved !== "never");
};
pp$5.initFunction = function(node) {
  node.id = null;
  if (this.options.ecmaVersion >= 6) {
    node.generator = node.expression = false;
  }
  if (this.options.ecmaVersion >= 8) {
    node.async = false;
  }
};
pp$5.parseMethod = function(isGenerator, isAsync, allowDirectSuper) {
  var node = this.startNode(), oldYieldPos = this.yieldPos, oldAwaitPos = this.awaitPos, oldAwaitIdentPos = this.awaitIdentPos;
  this.initFunction(node);
  if (this.options.ecmaVersion >= 6) {
    node.generator = isGenerator;
  }
  if (this.options.ecmaVersion >= 8) {
    node.async = !!isAsync;
  }
  this.yieldPos = 0;
  this.awaitPos = 0;
  this.awaitIdentPos = 0;
  this.enterScope(functionFlags(isAsync, node.generator) | SCOPE_SUPER | (allowDirectSuper ? SCOPE_DIRECT_SUPER : 0));
  this.expect(types$1.parenL);
  node.params = this.parseBindingList(types$1.parenR, false, this.options.ecmaVersion >= 8);
  this.checkYieldAwaitInDefaultParams();
  this.parseFunctionBody(node, false, true, false);
  this.yieldPos = oldYieldPos;
  this.awaitPos = oldAwaitPos;
  this.awaitIdentPos = oldAwaitIdentPos;
  return this.finishNode(node, "FunctionExpression");
};
pp$5.parseArrowExpression = function(node, params, isAsync, forInit) {
  var oldYieldPos = this.yieldPos, oldAwaitPos = this.awaitPos, oldAwaitIdentPos = this.awaitIdentPos;
  this.enterScope(functionFlags(isAsync, false) | SCOPE_ARROW);
  this.initFunction(node);
  if (this.options.ecmaVersion >= 8) {
    node.async = !!isAsync;
  }
  this.yieldPos = 0;
  this.awaitPos = 0;
  this.awaitIdentPos = 0;
  node.params = this.toAssignableList(params, true);
  this.parseFunctionBody(node, true, false, forInit);
  this.yieldPos = oldYieldPos;
  this.awaitPos = oldAwaitPos;
  this.awaitIdentPos = oldAwaitIdentPos;
  return this.finishNode(node, "ArrowFunctionExpression");
};
pp$5.parseFunctionBody = function(node, isArrowFunction, isMethod, forInit) {
  var isExpression = isArrowFunction && this.type !== types$1.braceL;
  var oldStrict = this.strict, useStrict = false;
  if (isExpression) {
    node.body = this.parseMaybeAssign(forInit);
    node.expression = true;
    this.checkParams(node, false);
  } else {
    var nonSimple = this.options.ecmaVersion >= 7 && !this.isSimpleParamList(node.params);
    if (!oldStrict || nonSimple) {
      useStrict = this.strictDirective(this.end);
      if (useStrict && nonSimple) {
        this.raiseRecoverable(node.start, "Illegal 'use strict' directive in function with non-simple parameter list");
      }
    }
    var oldLabels = this.labels;
    this.labels = [];
    if (useStrict) {
      this.strict = true;
    }
    this.checkParams(node, !oldStrict && !useStrict && !isArrowFunction && !isMethod && this.isSimpleParamList(node.params));
    if (this.strict && node.id) {
      this.checkLValSimple(node.id, BIND_OUTSIDE);
    }
    node.body = this.parseBlock(false, void 0, useStrict && !oldStrict);
    node.expression = false;
    this.adaptDirectivePrologue(node.body.body);
    this.labels = oldLabels;
  }
  this.exitScope();
};
pp$5.isSimpleParamList = function(params) {
  for (var i2 = 0, list2 = params; i2 < list2.length; i2 += 1) {
    var param = list2[i2];
    if (param.type !== "Identifier") {
      return false;
    }
  }
  return true;
};
pp$5.checkParams = function(node, allowDuplicates) {
  var nameHash2 = /* @__PURE__ */ Object.create(null);
  for (var i2 = 0, list2 = node.params; i2 < list2.length; i2 += 1) {
    var param = list2[i2];
    this.checkLValInnerPattern(param, BIND_VAR, allowDuplicates ? null : nameHash2);
  }
};
pp$5.parseExprList = function(close, allowTrailingComma, allowEmpty, refDestructuringErrors) {
  var elts = [], first = true;
  while (!this.eat(close)) {
    if (!first) {
      this.expect(types$1.comma);
      if (allowTrailingComma && this.afterTrailingComma(close)) {
        break;
      }
    } else {
      first = false;
    }
    var elt = void 0;
    if (allowEmpty && this.type === types$1.comma) {
      elt = null;
    } else if (this.type === types$1.ellipsis) {
      elt = this.parseSpread(refDestructuringErrors);
      if (refDestructuringErrors && this.type === types$1.comma && refDestructuringErrors.trailingComma < 0) {
        refDestructuringErrors.trailingComma = this.start;
      }
    } else {
      elt = this.parseMaybeAssign(false, refDestructuringErrors);
    }
    elts.push(elt);
  }
  return elts;
};
pp$5.checkUnreserved = function(ref2) {
  var start = ref2.start;
  var end = ref2.end;
  var name = ref2.name;
  if (this.inGenerator && name === "yield") {
    this.raiseRecoverable(start, "Cannot use 'yield' as identifier inside a generator");
  }
  if (this.inAsync && name === "await") {
    this.raiseRecoverable(start, "Cannot use 'await' as identifier inside an async function");
  }
  if (!(this.currentThisScope().flags & SCOPE_VAR) && name === "arguments") {
    this.raiseRecoverable(start, "Cannot use 'arguments' in class field initializer");
  }
  if (this.inClassStaticBlock && (name === "arguments" || name === "await")) {
    this.raise(start, "Cannot use " + name + " in class static initialization block");
  }
  if (this.keywords.test(name)) {
    this.raise(start, "Unexpected keyword '" + name + "'");
  }
  if (this.options.ecmaVersion < 6 && this.input.slice(start, end).indexOf("\\") !== -1) {
    return;
  }
  var re = this.strict ? this.reservedWordsStrict : this.reservedWords;
  if (re.test(name)) {
    if (!this.inAsync && name === "await") {
      this.raiseRecoverable(start, "Cannot use keyword 'await' outside an async function");
    }
    this.raiseRecoverable(start, "The keyword '" + name + "' is reserved");
  }
};
pp$5.parseIdent = function(liberal) {
  var node = this.parseIdentNode();
  this.next(!!liberal);
  this.finishNode(node, "Identifier");
  if (!liberal) {
    this.checkUnreserved(node);
    if (node.name === "await" && !this.awaitIdentPos) {
      this.awaitIdentPos = node.start;
    }
  }
  return node;
};
pp$5.parseIdentNode = function() {
  var node = this.startNode();
  if (this.type === types$1.name) {
    node.name = this.value;
  } else if (this.type.keyword) {
    node.name = this.type.keyword;
    if ((node.name === "class" || node.name === "function") && (this.lastTokEnd !== this.lastTokStart + 1 || this.input.charCodeAt(this.lastTokStart) !== 46)) {
      this.context.pop();
    }
    this.type = types$1.name;
  } else {
    this.unexpected();
  }
  return node;
};
pp$5.parsePrivateIdent = function() {
  var node = this.startNode();
  if (this.type === types$1.privateId) {
    node.name = this.value;
  } else {
    this.unexpected();
  }
  this.next();
  this.finishNode(node, "PrivateIdentifier");
  if (this.options.checkPrivateFields) {
    if (this.privateNameStack.length === 0) {
      this.raise(node.start, "Private field '#" + node.name + "' must be declared in an enclosing class");
    } else {
      this.privateNameStack[this.privateNameStack.length - 1].used.push(node);
    }
  }
  return node;
};
pp$5.parseYield = function(forInit) {
  if (!this.yieldPos) {
    this.yieldPos = this.start;
  }
  var node = this.startNode();
  this.next();
  if (this.type === types$1.semi || this.canInsertSemicolon() || this.type !== types$1.star && !this.type.startsExpr) {
    node.delegate = false;
    node.argument = null;
  } else {
    node.delegate = this.eat(types$1.star);
    node.argument = this.parseMaybeAssign(forInit);
  }
  return this.finishNode(node, "YieldExpression");
};
pp$5.parseAwait = function(forInit) {
  if (!this.awaitPos) {
    this.awaitPos = this.start;
  }
  var node = this.startNode();
  this.next();
  node.argument = this.parseMaybeUnary(null, true, false, forInit);
  return this.finishNode(node, "AwaitExpression");
};
var pp$4 = Parser.prototype;
pp$4.raise = function(pos, message) {
  var loc = getLineInfo(this.input, pos);
  message += " (" + loc.line + ":" + loc.column + ")";
  if (this.sourceFile) {
    message += " in " + this.sourceFile;
  }
  var err = new SyntaxError(message);
  err.pos = pos;
  err.loc = loc;
  err.raisedAt = this.pos;
  throw err;
};
pp$4.raiseRecoverable = pp$4.raise;
pp$4.curPosition = function() {
  if (this.options.locations) {
    return new Position(this.curLine, this.pos - this.lineStart);
  }
};
var pp$3 = Parser.prototype;
var Scope = function Scope2(flags) {
  this.flags = flags;
  this.var = [];
  this.lexical = [];
  this.functions = [];
};
pp$3.enterScope = function(flags) {
  this.scopeStack.push(new Scope(flags));
};
pp$3.exitScope = function() {
  this.scopeStack.pop();
};
pp$3.treatFunctionsAsVarInScope = function(scope) {
  return scope.flags & SCOPE_FUNCTION || !this.inModule && scope.flags & SCOPE_TOP;
};
pp$3.declareName = function(name, bindingType, pos) {
  var redeclared = false;
  if (bindingType === BIND_LEXICAL) {
    var scope = this.currentScope();
    redeclared = scope.lexical.indexOf(name) > -1 || scope.functions.indexOf(name) > -1 || scope.var.indexOf(name) > -1;
    scope.lexical.push(name);
    if (this.inModule && scope.flags & SCOPE_TOP) {
      delete this.undefinedExports[name];
    }
  } else if (bindingType === BIND_SIMPLE_CATCH) {
    var scope$1 = this.currentScope();
    scope$1.lexical.push(name);
  } else if (bindingType === BIND_FUNCTION) {
    var scope$2 = this.currentScope();
    if (this.treatFunctionsAsVar) {
      redeclared = scope$2.lexical.indexOf(name) > -1;
    } else {
      redeclared = scope$2.lexical.indexOf(name) > -1 || scope$2.var.indexOf(name) > -1;
    }
    scope$2.functions.push(name);
  } else {
    for (var i2 = this.scopeStack.length - 1; i2 >= 0; --i2) {
      var scope$3 = this.scopeStack[i2];
      if (scope$3.lexical.indexOf(name) > -1 && !(scope$3.flags & SCOPE_SIMPLE_CATCH && scope$3.lexical[0] === name) || !this.treatFunctionsAsVarInScope(scope$3) && scope$3.functions.indexOf(name) > -1) {
        redeclared = true;
        break;
      }
      scope$3.var.push(name);
      if (this.inModule && scope$3.flags & SCOPE_TOP) {
        delete this.undefinedExports[name];
      }
      if (scope$3.flags & SCOPE_VAR) {
        break;
      }
    }
  }
  if (redeclared) {
    this.raiseRecoverable(pos, "Identifier '" + name + "' has already been declared");
  }
};
pp$3.checkLocalExport = function(id2) {
  if (this.scopeStack[0].lexical.indexOf(id2.name) === -1 && this.scopeStack[0].var.indexOf(id2.name) === -1) {
    this.undefinedExports[id2.name] = id2;
  }
};
pp$3.currentScope = function() {
  return this.scopeStack[this.scopeStack.length - 1];
};
pp$3.currentVarScope = function() {
  for (var i2 = this.scopeStack.length - 1; ; i2--) {
    var scope = this.scopeStack[i2];
    if (scope.flags & (SCOPE_VAR | SCOPE_CLASS_FIELD_INIT | SCOPE_CLASS_STATIC_BLOCK)) {
      return scope;
    }
  }
};
pp$3.currentThisScope = function() {
  for (var i2 = this.scopeStack.length - 1; ; i2--) {
    var scope = this.scopeStack[i2];
    if (scope.flags & (SCOPE_VAR | SCOPE_CLASS_FIELD_INIT | SCOPE_CLASS_STATIC_BLOCK) && !(scope.flags & SCOPE_ARROW)) {
      return scope;
    }
  }
};
var Node = function Node2(parser, pos, loc) {
  this.type = "";
  this.start = pos;
  this.end = 0;
  if (parser.options.locations) {
    this.loc = new SourceLocation(parser, loc);
  }
  if (parser.options.directSourceFile) {
    this.sourceFile = parser.options.directSourceFile;
  }
  if (parser.options.ranges) {
    this.range = [pos, 0];
  }
};
var pp$2 = Parser.prototype;
pp$2.startNode = function() {
  return new Node(this, this.start, this.startLoc);
};
pp$2.startNodeAt = function(pos, loc) {
  return new Node(this, pos, loc);
};
function finishNodeAt(node, type, pos, loc) {
  node.type = type;
  node.end = pos;
  if (this.options.locations) {
    node.loc.end = loc;
  }
  if (this.options.ranges) {
    node.range[1] = pos;
  }
  return node;
}
pp$2.finishNode = function(node, type) {
  return finishNodeAt.call(this, node, type, this.lastTokEnd, this.lastTokEndLoc);
};
pp$2.finishNodeAt = function(node, type, pos, loc) {
  return finishNodeAt.call(this, node, type, pos, loc);
};
pp$2.copyNode = function(node) {
  var newNode = new Node(this, node.start, this.startLoc);
  for (var prop in node) {
    newNode[prop] = node[prop];
  }
  return newNode;
};
var scriptValuesAddedInUnicode = "Berf Beria_Erfe Gara Garay Gukh Gurung_Khema Hrkt Katakana_Or_Hiragana Kawi Kirat_Rai Krai Nag_Mundari Nagm Ol_Onal Onao Sidetic Sidt Sunu Sunuwar Tai_Yo Tayo Todhri Todr Tolong_Siki Tols Tulu_Tigalari Tutg Unknown Zzzz";
var ecma9BinaryProperties = "ASCII ASCII_Hex_Digit AHex Alphabetic Alpha Any Assigned Bidi_Control Bidi_C Bidi_Mirrored Bidi_M Case_Ignorable CI Cased Changes_When_Casefolded CWCF Changes_When_Casemapped CWCM Changes_When_Lowercased CWL Changes_When_NFKC_Casefolded CWKCF Changes_When_Titlecased CWT Changes_When_Uppercased CWU Dash Default_Ignorable_Code_Point DI Deprecated Dep Diacritic Dia Emoji Emoji_Component Emoji_Modifier Emoji_Modifier_Base Emoji_Presentation Extender Ext Grapheme_Base Gr_Base Grapheme_Extend Gr_Ext Hex_Digit Hex IDS_Binary_Operator IDSB IDS_Trinary_Operator IDST ID_Continue IDC ID_Start IDS Ideographic Ideo Join_Control Join_C Logical_Order_Exception LOE Lowercase Lower Math Noncharacter_Code_Point NChar Pattern_Syntax Pat_Syn Pattern_White_Space Pat_WS Quotation_Mark QMark Radical Regional_Indicator RI Sentence_Terminal STerm Soft_Dotted SD Terminal_Punctuation Term Unified_Ideograph UIdeo Uppercase Upper Variation_Selector VS White_Space space XID_Continue XIDC XID_Start XIDS";
var ecma10BinaryProperties = ecma9BinaryProperties + " Extended_Pictographic";
var ecma11BinaryProperties = ecma10BinaryProperties;
var ecma12BinaryProperties = ecma11BinaryProperties + " EBase EComp EMod EPres ExtPict";
var ecma13BinaryProperties = ecma12BinaryProperties;
var ecma14BinaryProperties = ecma13BinaryProperties;
var unicodeBinaryProperties = {
  9: ecma9BinaryProperties,
  10: ecma10BinaryProperties,
  11: ecma11BinaryProperties,
  12: ecma12BinaryProperties,
  13: ecma13BinaryProperties,
  14: ecma14BinaryProperties
};
var ecma14BinaryPropertiesOfStrings = "Basic_Emoji Emoji_Keycap_Sequence RGI_Emoji_Modifier_Sequence RGI_Emoji_Flag_Sequence RGI_Emoji_Tag_Sequence RGI_Emoji_ZWJ_Sequence RGI_Emoji";
var unicodeBinaryPropertiesOfStrings = {
  9: "",
  10: "",
  11: "",
  12: "",
  13: "",
  14: ecma14BinaryPropertiesOfStrings
};
var unicodeGeneralCategoryValues = "Cased_Letter LC Close_Punctuation Pe Connector_Punctuation Pc Control Cc cntrl Currency_Symbol Sc Dash_Punctuation Pd Decimal_Number Nd digit Enclosing_Mark Me Final_Punctuation Pf Format Cf Initial_Punctuation Pi Letter L Letter_Number Nl Line_Separator Zl Lowercase_Letter Ll Mark M Combining_Mark Math_Symbol Sm Modifier_Letter Lm Modifier_Symbol Sk Nonspacing_Mark Mn Number N Open_Punctuation Ps Other C Other_Letter Lo Other_Number No Other_Punctuation Po Other_Symbol So Paragraph_Separator Zp Private_Use Co Punctuation P punct Separator Z Space_Separator Zs Spacing_Mark Mc Surrogate Cs Symbol S Titlecase_Letter Lt Unassigned Cn Uppercase_Letter Lu";
var ecma9ScriptValues = "Adlam Adlm Ahom Anatolian_Hieroglyphs Hluw Arabic Arab Armenian Armn Avestan Avst Balinese Bali Bamum Bamu Bassa_Vah Bass Batak Batk Bengali Beng Bhaiksuki Bhks Bopomofo Bopo Brahmi Brah Braille Brai Buginese Bugi Buhid Buhd Canadian_Aboriginal Cans Carian Cari Caucasian_Albanian Aghb Chakma Cakm Cham Cham Cherokee Cher Common Zyyy Coptic Copt Qaac Cuneiform Xsux Cypriot Cprt Cyrillic Cyrl Deseret Dsrt Devanagari Deva Duployan Dupl Egyptian_Hieroglyphs Egyp Elbasan Elba Ethiopic Ethi Georgian Geor Glagolitic Glag Gothic Goth Grantha Gran Greek Grek Gujarati Gujr Gurmukhi Guru Han Hani Hangul Hang Hanunoo Hano Hatran Hatr Hebrew Hebr Hiragana Hira Imperial_Aramaic Armi Inherited Zinh Qaai Inscriptional_Pahlavi Phli Inscriptional_Parthian Prti Javanese Java Kaithi Kthi Kannada Knda Katakana Kana Kayah_Li Kali Kharoshthi Khar Khmer Khmr Khojki Khoj Khudawadi Sind Lao Laoo Latin Latn Lepcha Lepc Limbu Limb Linear_A Lina Linear_B Linb Lisu Lisu Lycian Lyci Lydian Lydi Mahajani Mahj Malayalam Mlym Mandaic Mand Manichaean Mani Marchen Marc Masaram_Gondi Gonm Meetei_Mayek Mtei Mende_Kikakui Mend Meroitic_Cursive Merc Meroitic_Hieroglyphs Mero Miao Plrd Modi Mongolian Mong Mro Mroo Multani Mult Myanmar Mymr Nabataean Nbat New_Tai_Lue Talu Newa Newa Nko Nkoo Nushu Nshu Ogham Ogam Ol_Chiki Olck Old_Hungarian Hung Old_Italic Ital Old_North_Arabian Narb Old_Permic Perm Old_Persian Xpeo Old_South_Arabian Sarb Old_Turkic Orkh Oriya Orya Osage Osge Osmanya Osma Pahawh_Hmong Hmng Palmyrene Palm Pau_Cin_Hau Pauc Phags_Pa Phag Phoenician Phnx Psalter_Pahlavi Phlp Rejang Rjng Runic Runr Samaritan Samr Saurashtra Saur Sharada Shrd Shavian Shaw Siddham Sidd SignWriting Sgnw Sinhala Sinh Sora_Sompeng Sora Soyombo Soyo Sundanese Sund Syloti_Nagri Sylo Syriac Syrc Tagalog Tglg Tagbanwa Tagb Tai_Le Tale Tai_Tham Lana Tai_Viet Tavt Takri Takr Tamil Taml Tangut Tang Telugu Telu Thaana Thaa Thai Thai Tibetan Tibt Tifinagh Tfng Tirhuta Tirh Ugaritic Ugar Vai Vaii Warang_Citi Wara Yi Yiii Zanabazar_Square Zanb";
var ecma10ScriptValues = ecma9ScriptValues + " Dogra Dogr Gunjala_Gondi Gong Hanifi_Rohingya Rohg Makasar Maka Medefaidrin Medf Old_Sogdian Sogo Sogdian Sogd";
var ecma11ScriptValues = ecma10ScriptValues + " Elymaic Elym Nandinagari Nand Nyiakeng_Puachue_Hmong Hmnp Wancho Wcho";
var ecma12ScriptValues = ecma11ScriptValues + " Chorasmian Chrs Diak Dives_Akuru Khitan_Small_Script Kits Yezi Yezidi";
var ecma13ScriptValues = ecma12ScriptValues + " Cypro_Minoan Cpmn Old_Uyghur Ougr Tangsa Tnsa Toto Vithkuqi Vith";
var ecma14ScriptValues = ecma13ScriptValues + " " + scriptValuesAddedInUnicode;
var unicodeScriptValues = {
  9: ecma9ScriptValues,
  10: ecma10ScriptValues,
  11: ecma11ScriptValues,
  12: ecma12ScriptValues,
  13: ecma13ScriptValues,
  14: ecma14ScriptValues
};
var data = {};
function buildUnicodeData(ecmaVersion2) {
  var d = data[ecmaVersion2] = {
    binary: wordsRegexp(unicodeBinaryProperties[ecmaVersion2] + " " + unicodeGeneralCategoryValues),
    binaryOfStrings: wordsRegexp(unicodeBinaryPropertiesOfStrings[ecmaVersion2]),
    nonBinary: {
      General_Category: wordsRegexp(unicodeGeneralCategoryValues),
      Script: wordsRegexp(unicodeScriptValues[ecmaVersion2])
    }
  };
  d.nonBinary.Script_Extensions = d.nonBinary.Script;
  d.nonBinary.gc = d.nonBinary.General_Category;
  d.nonBinary.sc = d.nonBinary.Script;
  d.nonBinary.scx = d.nonBinary.Script_Extensions;
}
for (i = 0, list = [9, 10, 11, 12, 13, 14]; i < list.length; i += 1) {
  ecmaVersion = list[i];
  buildUnicodeData(ecmaVersion);
}
var ecmaVersion;
var i;
var list;
var pp$1 = Parser.prototype;
var BranchID = function BranchID2(parent2, base2) {
  this.parent = parent2;
  this.base = base2 || this;
};
BranchID.prototype.separatedFrom = function separatedFrom(alt) {
  for (var self = this; self; self = self.parent) {
    for (var other = alt; other; other = other.parent) {
      if (self.base === other.base && self !== other) {
        return true;
      }
    }
  }
  return false;
};
BranchID.prototype.sibling = function sibling() {
  return new BranchID(this.parent, this.base);
};
var RegExpValidationState = function RegExpValidationState2(parser) {
  this.parser = parser;
  this.validFlags = "gim" + (parser.options.ecmaVersion >= 6 ? "uy" : "") + (parser.options.ecmaVersion >= 9 ? "s" : "") + (parser.options.ecmaVersion >= 13 ? "d" : "") + (parser.options.ecmaVersion >= 15 ? "v" : "");
  this.unicodeProperties = data[parser.options.ecmaVersion >= 14 ? 14 : parser.options.ecmaVersion];
  this.source = "";
  this.flags = "";
  this.start = 0;
  this.switchU = false;
  this.switchV = false;
  this.switchN = false;
  this.pos = 0;
  this.lastIntValue = 0;
  this.lastStringValue = "";
  this.lastAssertionIsQuantifiable = false;
  this.numCapturingParens = 0;
  this.maxBackReference = 0;
  this.groupNames = /* @__PURE__ */ Object.create(null);
  this.backReferenceNames = [];
  this.branchID = null;
};
RegExpValidationState.prototype.reset = function reset(start, pattern, flags) {
  var unicodeSets = flags.indexOf("v") !== -1;
  var unicode = flags.indexOf("u") !== -1;
  this.start = start | 0;
  this.source = pattern + "";
  this.flags = flags;
  if (unicodeSets && this.parser.options.ecmaVersion >= 15) {
    this.switchU = true;
    this.switchV = true;
    this.switchN = true;
  } else {
    this.switchU = unicode && this.parser.options.ecmaVersion >= 6;
    this.switchV = false;
    this.switchN = unicode && this.parser.options.ecmaVersion >= 9;
  }
};
RegExpValidationState.prototype.raise = function raise(message) {
  this.parser.raiseRecoverable(this.start, "Invalid regular expression: /" + this.source + "/: " + message);
};
RegExpValidationState.prototype.at = function at(i2, forceU) {
  if (forceU === void 0) forceU = false;
  var s = this.source;
  var l = s.length;
  if (i2 >= l) {
    return -1;
  }
  var c = s.charCodeAt(i2);
  if (!(forceU || this.switchU) || c <= 55295 || c >= 57344 || i2 + 1 >= l) {
    return c;
  }
  var next = s.charCodeAt(i2 + 1);
  return next >= 56320 && next <= 57343 ? (c << 10) + next - 56613888 : c;
};
RegExpValidationState.prototype.nextIndex = function nextIndex(i2, forceU) {
  if (forceU === void 0) forceU = false;
  var s = this.source;
  var l = s.length;
  if (i2 >= l) {
    return l;
  }
  var c = s.charCodeAt(i2), next;
  if (!(forceU || this.switchU) || c <= 55295 || c >= 57344 || i2 + 1 >= l || (next = s.charCodeAt(i2 + 1)) < 56320 || next > 57343) {
    return i2 + 1;
  }
  return i2 + 2;
};
RegExpValidationState.prototype.current = function current(forceU) {
  if (forceU === void 0) forceU = false;
  return this.at(this.pos, forceU);
};
RegExpValidationState.prototype.lookahead = function lookahead(forceU) {
  if (forceU === void 0) forceU = false;
  return this.at(this.nextIndex(this.pos, forceU), forceU);
};
RegExpValidationState.prototype.advance = function advance(forceU) {
  if (forceU === void 0) forceU = false;
  this.pos = this.nextIndex(this.pos, forceU);
};
RegExpValidationState.prototype.eat = function eat(ch, forceU) {
  if (forceU === void 0) forceU = false;
  if (this.current(forceU) === ch) {
    this.advance(forceU);
    return true;
  }
  return false;
};
RegExpValidationState.prototype.eatChars = function eatChars(chs, forceU) {
  if (forceU === void 0) forceU = false;
  var pos = this.pos;
  for (var i2 = 0, list2 = chs; i2 < list2.length; i2 += 1) {
    var ch = list2[i2];
    var current2 = this.at(pos, forceU);
    if (current2 === -1 || current2 !== ch) {
      return false;
    }
    pos = this.nextIndex(pos, forceU);
  }
  this.pos = pos;
  return true;
};
pp$1.validateRegExpFlags = function(state) {
  var validFlags = state.validFlags;
  var flags = state.flags;
  var u = false;
  var v = false;
  for (var i2 = 0; i2 < flags.length; i2++) {
    var flag = flags.charAt(i2);
    if (validFlags.indexOf(flag) === -1) {
      this.raise(state.start, "Invalid regular expression flag");
    }
    if (flags.indexOf(flag, i2 + 1) > -1) {
      this.raise(state.start, "Duplicate regular expression flag");
    }
    if (flag === "u") {
      u = true;
    }
    if (flag === "v") {
      v = true;
    }
  }
  if (this.options.ecmaVersion >= 15 && u && v) {
    this.raise(state.start, "Invalid regular expression flag");
  }
};
function hasProp(obj) {
  for (var _2 in obj) {
    return true;
  }
  return false;
}
pp$1.validateRegExpPattern = function(state) {
  this.regexp_pattern(state);
  if (!state.switchN && this.options.ecmaVersion >= 9 && hasProp(state.groupNames)) {
    state.switchN = true;
    this.regexp_pattern(state);
  }
};
pp$1.regexp_pattern = function(state) {
  state.pos = 0;
  state.lastIntValue = 0;
  state.lastStringValue = "";
  state.lastAssertionIsQuantifiable = false;
  state.numCapturingParens = 0;
  state.maxBackReference = 0;
  state.groupNames = /* @__PURE__ */ Object.create(null);
  state.backReferenceNames.length = 0;
  state.branchID = null;
  this.regexp_disjunction(state);
  if (state.pos !== state.source.length) {
    if (state.eat(
      41
      /* ) */
    )) {
      state.raise("Unmatched ')'");
    }
    if (state.eat(
      93
      /* ] */
    ) || state.eat(
      125
      /* } */
    )) {
      state.raise("Lone quantifier brackets");
    }
  }
  if (state.maxBackReference > state.numCapturingParens) {
    state.raise("Invalid escape");
  }
  for (var i2 = 0, list2 = state.backReferenceNames; i2 < list2.length; i2 += 1) {
    var name = list2[i2];
    if (!state.groupNames[name]) {
      state.raise("Invalid named capture referenced");
    }
  }
};
pp$1.regexp_disjunction = function(state) {
  var trackDisjunction = this.options.ecmaVersion >= 16;
  if (trackDisjunction) {
    state.branchID = new BranchID(state.branchID, null);
  }
  this.regexp_alternative(state);
  while (state.eat(
    124
    /* | */
  )) {
    if (trackDisjunction) {
      state.branchID = state.branchID.sibling();
    }
    this.regexp_alternative(state);
  }
  if (trackDisjunction) {
    state.branchID = state.branchID.parent;
  }
  if (this.regexp_eatQuantifier(state, true)) {
    state.raise("Nothing to repeat");
  }
  if (state.eat(
    123
    /* { */
  )) {
    state.raise("Lone quantifier brackets");
  }
};
pp$1.regexp_alternative = function(state) {
  while (state.pos < state.source.length && this.regexp_eatTerm(state)) {
  }
};
pp$1.regexp_eatTerm = function(state) {
  if (this.regexp_eatAssertion(state)) {
    if (state.lastAssertionIsQuantifiable && this.regexp_eatQuantifier(state)) {
      if (state.switchU) {
        state.raise("Invalid quantifier");
      }
    }
    return true;
  }
  if (state.switchU ? this.regexp_eatAtom(state) : this.regexp_eatExtendedAtom(state)) {
    this.regexp_eatQuantifier(state);
    return true;
  }
  return false;
};
pp$1.regexp_eatAssertion = function(state) {
  var start = state.pos;
  state.lastAssertionIsQuantifiable = false;
  if (state.eat(
    94
    /* ^ */
  ) || state.eat(
    36
    /* $ */
  )) {
    return true;
  }
  if (state.eat(
    92
    /* \ */
  )) {
    if (state.eat(
      66
      /* B */
    ) || state.eat(
      98
      /* b */
    )) {
      return true;
    }
    state.pos = start;
  }
  if (state.eat(
    40
    /* ( */
  ) && state.eat(
    63
    /* ? */
  )) {
    var lookbehind = false;
    if (this.options.ecmaVersion >= 9) {
      lookbehind = state.eat(
        60
        /* < */
      );
    }
    if (state.eat(
      61
      /* = */
    ) || state.eat(
      33
      /* ! */
    )) {
      this.regexp_disjunction(state);
      if (!state.eat(
        41
        /* ) */
      )) {
        state.raise("Unterminated group");
      }
      state.lastAssertionIsQuantifiable = !lookbehind;
      return true;
    }
  }
  state.pos = start;
  return false;
};
pp$1.regexp_eatQuantifier = function(state, noError) {
  if (noError === void 0) noError = false;
  if (this.regexp_eatQuantifierPrefix(state, noError)) {
    state.eat(
      63
      /* ? */
    );
    return true;
  }
  return false;
};
pp$1.regexp_eatQuantifierPrefix = function(state, noError) {
  return state.eat(
    42
    /* * */
  ) || state.eat(
    43
    /* + */
  ) || state.eat(
    63
    /* ? */
  ) || this.regexp_eatBracedQuantifier(state, noError);
};
pp$1.regexp_eatBracedQuantifier = function(state, noError) {
  var start = state.pos;
  if (state.eat(
    123
    /* { */
  )) {
    var min = 0, max = -1;
    if (this.regexp_eatDecimalDigits(state)) {
      min = state.lastIntValue;
      if (state.eat(
        44
        /* , */
      ) && this.regexp_eatDecimalDigits(state)) {
        max = state.lastIntValue;
      }
      if (state.eat(
        125
        /* } */
      )) {
        if (max !== -1 && max < min && !noError) {
          state.raise("numbers out of order in {} quantifier");
        }
        return true;
      }
    }
    if (state.switchU && !noError) {
      state.raise("Incomplete quantifier");
    }
    state.pos = start;
  }
  return false;
};
pp$1.regexp_eatAtom = function(state) {
  return this.regexp_eatPatternCharacters(state) || state.eat(
    46
    /* . */
  ) || this.regexp_eatReverseSolidusAtomEscape(state) || this.regexp_eatCharacterClass(state) || this.regexp_eatUncapturingGroup(state) || this.regexp_eatCapturingGroup(state);
};
pp$1.regexp_eatReverseSolidusAtomEscape = function(state) {
  var start = state.pos;
  if (state.eat(
    92
    /* \ */
  )) {
    if (this.regexp_eatAtomEscape(state)) {
      return true;
    }
    state.pos = start;
  }
  return false;
};
pp$1.regexp_eatUncapturingGroup = function(state) {
  var start = state.pos;
  if (state.eat(
    40
    /* ( */
  )) {
    if (state.eat(
      63
      /* ? */
    )) {
      if (this.options.ecmaVersion >= 16) {
        var addModifiers = this.regexp_eatModifiers(state);
        var hasHyphen = state.eat(
          45
          /* - */
        );
        if (addModifiers || hasHyphen) {
          for (var i2 = 0; i2 < addModifiers.length; i2++) {
            var modifier = addModifiers.charAt(i2);
            if (addModifiers.indexOf(modifier, i2 + 1) > -1) {
              state.raise("Duplicate regular expression modifiers");
            }
          }
          if (hasHyphen) {
            var removeModifiers = this.regexp_eatModifiers(state);
            if (!addModifiers && !removeModifiers && state.current() === 58) {
              state.raise("Invalid regular expression modifiers");
            }
            for (var i$1 = 0; i$1 < removeModifiers.length; i$1++) {
              var modifier$1 = removeModifiers.charAt(i$1);
              if (removeModifiers.indexOf(modifier$1, i$1 + 1) > -1 || addModifiers.indexOf(modifier$1) > -1) {
                state.raise("Duplicate regular expression modifiers");
              }
            }
          }
        }
      }
      if (state.eat(
        58
        /* : */
      )) {
        this.regexp_disjunction(state);
        if (state.eat(
          41
          /* ) */
        )) {
          return true;
        }
        state.raise("Unterminated group");
      }
    }
    state.pos = start;
  }
  return false;
};
pp$1.regexp_eatCapturingGroup = function(state) {
  if (state.eat(
    40
    /* ( */
  )) {
    if (this.options.ecmaVersion >= 9) {
      this.regexp_groupSpecifier(state);
    } else if (state.current() === 63) {
      state.raise("Invalid group");
    }
    this.regexp_disjunction(state);
    if (state.eat(
      41
      /* ) */
    )) {
      state.numCapturingParens += 1;
      return true;
    }
    state.raise("Unterminated group");
  }
  return false;
};
pp$1.regexp_eatModifiers = function(state) {
  var modifiers = "";
  var ch = 0;
  while ((ch = state.current()) !== -1 && isRegularExpressionModifier(ch)) {
    modifiers += codePointToString(ch);
    state.advance();
  }
  return modifiers;
};
function isRegularExpressionModifier(ch) {
  return ch === 105 || ch === 109 || ch === 115;
}
pp$1.regexp_eatExtendedAtom = function(state) {
  return state.eat(
    46
    /* . */
  ) || this.regexp_eatReverseSolidusAtomEscape(state) || this.regexp_eatCharacterClass(state) || this.regexp_eatUncapturingGroup(state) || this.regexp_eatCapturingGroup(state) || this.regexp_eatInvalidBracedQuantifier(state) || this.regexp_eatExtendedPatternCharacter(state);
};
pp$1.regexp_eatInvalidBracedQuantifier = function(state) {
  if (this.regexp_eatBracedQuantifier(state, true)) {
    state.raise("Nothing to repeat");
  }
  return false;
};
pp$1.regexp_eatSyntaxCharacter = function(state) {
  var ch = state.current();
  if (isSyntaxCharacter(ch)) {
    state.lastIntValue = ch;
    state.advance();
    return true;
  }
  return false;
};
function isSyntaxCharacter(ch) {
  return ch === 36 || ch >= 40 && ch <= 43 || ch === 46 || ch === 63 || ch >= 91 && ch <= 94 || ch >= 123 && ch <= 125;
}
pp$1.regexp_eatPatternCharacters = function(state) {
  var start = state.pos;
  var ch = 0;
  while ((ch = state.current()) !== -1 && !isSyntaxCharacter(ch)) {
    state.advance();
  }
  return state.pos !== start;
};
pp$1.regexp_eatExtendedPatternCharacter = function(state) {
  var ch = state.current();
  if (ch !== -1 && ch !== 36 && !(ch >= 40 && ch <= 43) && ch !== 46 && ch !== 63 && ch !== 91 && ch !== 94 && ch !== 124) {
    state.advance();
    return true;
  }
  return false;
};
pp$1.regexp_groupSpecifier = function(state) {
  if (state.eat(
    63
    /* ? */
  )) {
    if (!this.regexp_eatGroupName(state)) {
      state.raise("Invalid group");
    }
    var trackDisjunction = this.options.ecmaVersion >= 16;
    var known = state.groupNames[state.lastStringValue];
    if (known) {
      if (trackDisjunction) {
        for (var i2 = 0, list2 = known; i2 < list2.length; i2 += 1) {
          var altID = list2[i2];
          if (!altID.separatedFrom(state.branchID)) {
            state.raise("Duplicate capture group name");
          }
        }
      } else {
        state.raise("Duplicate capture group name");
      }
    }
    if (trackDisjunction) {
      (known || (state.groupNames[state.lastStringValue] = [])).push(state.branchID);
    } else {
      state.groupNames[state.lastStringValue] = true;
    }
  }
};
pp$1.regexp_eatGroupName = function(state) {
  state.lastStringValue = "";
  if (state.eat(
    60
    /* < */
  )) {
    if (this.regexp_eatRegExpIdentifierName(state) && state.eat(
      62
      /* > */
    )) {
      return true;
    }
    state.raise("Invalid capture group name");
  }
  return false;
};
pp$1.regexp_eatRegExpIdentifierName = function(state) {
  state.lastStringValue = "";
  if (this.regexp_eatRegExpIdentifierStart(state)) {
    state.lastStringValue += codePointToString(state.lastIntValue);
    while (this.regexp_eatRegExpIdentifierPart(state)) {
      state.lastStringValue += codePointToString(state.lastIntValue);
    }
    return true;
  }
  return false;
};
pp$1.regexp_eatRegExpIdentifierStart = function(state) {
  var start = state.pos;
  var forceU = this.options.ecmaVersion >= 11;
  var ch = state.current(forceU);
  state.advance(forceU);
  if (ch === 92 && this.regexp_eatRegExpUnicodeEscapeSequence(state, forceU)) {
    ch = state.lastIntValue;
  }
  if (isRegExpIdentifierStart(ch)) {
    state.lastIntValue = ch;
    return true;
  }
  state.pos = start;
  return false;
};
function isRegExpIdentifierStart(ch) {
  return isIdentifierStart(ch, true) || ch === 36 || ch === 95;
}
pp$1.regexp_eatRegExpIdentifierPart = function(state) {
  var start = state.pos;
  var forceU = this.options.ecmaVersion >= 11;
  var ch = state.current(forceU);
  state.advance(forceU);
  if (ch === 92 && this.regexp_eatRegExpUnicodeEscapeSequence(state, forceU)) {
    ch = state.lastIntValue;
  }
  if (isRegExpIdentifierPart(ch)) {
    state.lastIntValue = ch;
    return true;
  }
  state.pos = start;
  return false;
};
function isRegExpIdentifierPart(ch) {
  return isIdentifierChar(ch, true) || ch === 36 || ch === 95 || ch === 8204 || ch === 8205;
}
pp$1.regexp_eatAtomEscape = function(state) {
  if (this.regexp_eatBackReference(state) || this.regexp_eatCharacterClassEscape(state) || this.regexp_eatCharacterEscape(state) || state.switchN && this.regexp_eatKGroupName(state)) {
    return true;
  }
  if (state.switchU) {
    if (state.current() === 99) {
      state.raise("Invalid unicode escape");
    }
    state.raise("Invalid escape");
  }
  return false;
};
pp$1.regexp_eatBackReference = function(state) {
  var start = state.pos;
  if (this.regexp_eatDecimalEscape(state)) {
    var n = state.lastIntValue;
    if (state.switchU) {
      if (n > state.maxBackReference) {
        state.maxBackReference = n;
      }
      return true;
    }
    if (n <= state.numCapturingParens) {
      return true;
    }
    state.pos = start;
  }
  return false;
};
pp$1.regexp_eatKGroupName = function(state) {
  if (state.eat(
    107
    /* k */
  )) {
    if (this.regexp_eatGroupName(state)) {
      state.backReferenceNames.push(state.lastStringValue);
      return true;
    }
    state.raise("Invalid named reference");
  }
  return false;
};
pp$1.regexp_eatCharacterEscape = function(state) {
  return this.regexp_eatControlEscape(state) || this.regexp_eatCControlLetter(state) || this.regexp_eatZero(state) || this.regexp_eatHexEscapeSequence(state) || this.regexp_eatRegExpUnicodeEscapeSequence(state, false) || !state.switchU && this.regexp_eatLegacyOctalEscapeSequence(state) || this.regexp_eatIdentityEscape(state);
};
pp$1.regexp_eatCControlLetter = function(state) {
  var start = state.pos;
  if (state.eat(
    99
    /* c */
  )) {
    if (this.regexp_eatControlLetter(state)) {
      return true;
    }
    state.pos = start;
  }
  return false;
};
pp$1.regexp_eatZero = function(state) {
  if (state.current() === 48 && !isDecimalDigit(state.lookahead())) {
    state.lastIntValue = 0;
    state.advance();
    return true;
  }
  return false;
};
pp$1.regexp_eatControlEscape = function(state) {
  var ch = state.current();
  if (ch === 116) {
    state.lastIntValue = 9;
    state.advance();
    return true;
  }
  if (ch === 110) {
    state.lastIntValue = 10;
    state.advance();
    return true;
  }
  if (ch === 118) {
    state.lastIntValue = 11;
    state.advance();
    return true;
  }
  if (ch === 102) {
    state.lastIntValue = 12;
    state.advance();
    return true;
  }
  if (ch === 114) {
    state.lastIntValue = 13;
    state.advance();
    return true;
  }
  return false;
};
pp$1.regexp_eatControlLetter = function(state) {
  var ch = state.current();
  if (isControlLetter(ch)) {
    state.lastIntValue = ch % 32;
    state.advance();
    return true;
  }
  return false;
};
function isControlLetter(ch) {
  return ch >= 65 && ch <= 90 || ch >= 97 && ch <= 122;
}
pp$1.regexp_eatRegExpUnicodeEscapeSequence = function(state, forceU) {
  if (forceU === void 0) forceU = false;
  var start = state.pos;
  var switchU = forceU || state.switchU;
  if (state.eat(
    117
    /* u */
  )) {
    if (this.regexp_eatFixedHexDigits(state, 4)) {
      var lead = state.lastIntValue;
      if (switchU && lead >= 55296 && lead <= 56319) {
        var leadSurrogateEnd = state.pos;
        if (state.eat(
          92
          /* \ */
        ) && state.eat(
          117
          /* u */
        ) && this.regexp_eatFixedHexDigits(state, 4)) {
          var trail = state.lastIntValue;
          if (trail >= 56320 && trail <= 57343) {
            state.lastIntValue = (lead - 55296) * 1024 + (trail - 56320) + 65536;
            return true;
          }
        }
        state.pos = leadSurrogateEnd;
        state.lastIntValue = lead;
      }
      return true;
    }
    if (switchU && state.eat(
      123
      /* { */
    ) && this.regexp_eatHexDigits(state) && state.eat(
      125
      /* } */
    ) && isValidUnicode(state.lastIntValue)) {
      return true;
    }
    if (switchU) {
      state.raise("Invalid unicode escape");
    }
    state.pos = start;
  }
  return false;
};
function isValidUnicode(ch) {
  return ch >= 0 && ch <= 1114111;
}
pp$1.regexp_eatIdentityEscape = function(state) {
  if (state.switchU) {
    if (this.regexp_eatSyntaxCharacter(state)) {
      return true;
    }
    if (state.eat(
      47
      /* / */
    )) {
      state.lastIntValue = 47;
      return true;
    }
    return false;
  }
  var ch = state.current();
  if (ch !== 99 && (!state.switchN || ch !== 107)) {
    state.lastIntValue = ch;
    state.advance();
    return true;
  }
  return false;
};
pp$1.regexp_eatDecimalEscape = function(state) {
  state.lastIntValue = 0;
  var ch = state.current();
  if (ch >= 49 && ch <= 57) {
    do {
      state.lastIntValue = 10 * state.lastIntValue + (ch - 48);
      state.advance();
    } while ((ch = state.current()) >= 48 && ch <= 57);
    return true;
  }
  return false;
};
var CharSetNone = 0;
var CharSetOk = 1;
var CharSetString = 2;
pp$1.regexp_eatCharacterClassEscape = function(state) {
  var ch = state.current();
  if (isCharacterClassEscape(ch)) {
    state.lastIntValue = -1;
    state.advance();
    return CharSetOk;
  }
  var negate = false;
  if (state.switchU && this.options.ecmaVersion >= 9 && ((negate = ch === 80) || ch === 112)) {
    state.lastIntValue = -1;
    state.advance();
    var result;
    if (state.eat(
      123
      /* { */
    ) && (result = this.regexp_eatUnicodePropertyValueExpression(state)) && state.eat(
      125
      /* } */
    )) {
      if (negate && result === CharSetString) {
        state.raise("Invalid property name");
      }
      return result;
    }
    state.raise("Invalid property name");
  }
  return CharSetNone;
};
function isCharacterClassEscape(ch) {
  return ch === 100 || ch === 68 || ch === 115 || ch === 83 || ch === 119 || ch === 87;
}
pp$1.regexp_eatUnicodePropertyValueExpression = function(state) {
  var start = state.pos;
  if (this.regexp_eatUnicodePropertyName(state) && state.eat(
    61
    /* = */
  )) {
    var name = state.lastStringValue;
    if (this.regexp_eatUnicodePropertyValue(state)) {
      var value = state.lastStringValue;
      this.regexp_validateUnicodePropertyNameAndValue(state, name, value);
      return CharSetOk;
    }
  }
  state.pos = start;
  if (this.regexp_eatLoneUnicodePropertyNameOrValue(state)) {
    var nameOrValue = state.lastStringValue;
    return this.regexp_validateUnicodePropertyNameOrValue(state, nameOrValue);
  }
  return CharSetNone;
};
pp$1.regexp_validateUnicodePropertyNameAndValue = function(state, name, value) {
  if (!hasOwn(state.unicodeProperties.nonBinary, name)) {
    state.raise("Invalid property name");
  }
  if (!state.unicodeProperties.nonBinary[name].test(value)) {
    state.raise("Invalid property value");
  }
};
pp$1.regexp_validateUnicodePropertyNameOrValue = function(state, nameOrValue) {
  if (state.unicodeProperties.binary.test(nameOrValue)) {
    return CharSetOk;
  }
  if (state.switchV && state.unicodeProperties.binaryOfStrings.test(nameOrValue)) {
    return CharSetString;
  }
  state.raise("Invalid property name");
};
pp$1.regexp_eatUnicodePropertyName = function(state) {
  var ch = 0;
  state.lastStringValue = "";
  while (isUnicodePropertyNameCharacter(ch = state.current())) {
    state.lastStringValue += codePointToString(ch);
    state.advance();
  }
  return state.lastStringValue !== "";
};
function isUnicodePropertyNameCharacter(ch) {
  return isControlLetter(ch) || ch === 95;
}
pp$1.regexp_eatUnicodePropertyValue = function(state) {
  var ch = 0;
  state.lastStringValue = "";
  while (isUnicodePropertyValueCharacter(ch = state.current())) {
    state.lastStringValue += codePointToString(ch);
    state.advance();
  }
  return state.lastStringValue !== "";
};
function isUnicodePropertyValueCharacter(ch) {
  return isUnicodePropertyNameCharacter(ch) || isDecimalDigit(ch);
}
pp$1.regexp_eatLoneUnicodePropertyNameOrValue = function(state) {
  return this.regexp_eatUnicodePropertyValue(state);
};
pp$1.regexp_eatCharacterClass = function(state) {
  if (state.eat(
    91
    /* [ */
  )) {
    var negate = state.eat(
      94
      /* ^ */
    );
    var result = this.regexp_classContents(state);
    if (!state.eat(
      93
      /* ] */
    )) {
      state.raise("Unterminated character class");
    }
    if (negate && result === CharSetString) {
      state.raise("Negated character class may contain strings");
    }
    return true;
  }
  return false;
};
pp$1.regexp_classContents = function(state) {
  if (state.current() === 93) {
    return CharSetOk;
  }
  if (state.switchV) {
    return this.regexp_classSetExpression(state);
  }
  this.regexp_nonEmptyClassRanges(state);
  return CharSetOk;
};
pp$1.regexp_nonEmptyClassRanges = function(state) {
  while (this.regexp_eatClassAtom(state)) {
    var left = state.lastIntValue;
    if (state.eat(
      45
      /* - */
    ) && this.regexp_eatClassAtom(state)) {
      var right = state.lastIntValue;
      if (state.switchU && (left === -1 || right === -1)) {
        state.raise("Invalid character class");
      }
      if (left !== -1 && right !== -1 && left > right) {
        state.raise("Range out of order in character class");
      }
    }
  }
};
pp$1.regexp_eatClassAtom = function(state) {
  var start = state.pos;
  if (state.eat(
    92
    /* \ */
  )) {
    if (this.regexp_eatClassEscape(state)) {
      return true;
    }
    if (state.switchU) {
      var ch$1 = state.current();
      if (ch$1 === 99 || isOctalDigit(ch$1)) {
        state.raise("Invalid class escape");
      }
      state.raise("Invalid escape");
    }
    state.pos = start;
  }
  var ch = state.current();
  if (ch !== 93) {
    state.lastIntValue = ch;
    state.advance();
    return true;
  }
  return false;
};
pp$1.regexp_eatClassEscape = function(state) {
  var start = state.pos;
  if (state.eat(
    98
    /* b */
  )) {
    state.lastIntValue = 8;
    return true;
  }
  if (state.switchU && state.eat(
    45
    /* - */
  )) {
    state.lastIntValue = 45;
    return true;
  }
  if (!state.switchU && state.eat(
    99
    /* c */
  )) {
    if (this.regexp_eatClassControlLetter(state)) {
      return true;
    }
    state.pos = start;
  }
  return this.regexp_eatCharacterClassEscape(state) || this.regexp_eatCharacterEscape(state);
};
pp$1.regexp_classSetExpression = function(state) {
  var result = CharSetOk, subResult;
  if (this.regexp_eatClassSetRange(state)) ;
  else if (subResult = this.regexp_eatClassSetOperand(state)) {
    if (subResult === CharSetString) {
      result = CharSetString;
    }
    var start = state.pos;
    while (state.eatChars(
      [38, 38]
      /* && */
    )) {
      if (state.current() !== 38 && (subResult = this.regexp_eatClassSetOperand(state))) {
        if (subResult !== CharSetString) {
          result = CharSetOk;
        }
        continue;
      }
      state.raise("Invalid character in character class");
    }
    if (start !== state.pos) {
      return result;
    }
    while (state.eatChars(
      [45, 45]
      /* -- */
    )) {
      if (this.regexp_eatClassSetOperand(state)) {
        continue;
      }
      state.raise("Invalid character in character class");
    }
    if (start !== state.pos) {
      return result;
    }
  } else {
    state.raise("Invalid character in character class");
  }
  for (; ; ) {
    if (this.regexp_eatClassSetRange(state)) {
      continue;
    }
    subResult = this.regexp_eatClassSetOperand(state);
    if (!subResult) {
      return result;
    }
    if (subResult === CharSetString) {
      result = CharSetString;
    }
  }
};
pp$1.regexp_eatClassSetRange = function(state) {
  var start = state.pos;
  if (this.regexp_eatClassSetCharacter(state)) {
    var left = state.lastIntValue;
    if (state.eat(
      45
      /* - */
    ) && this.regexp_eatClassSetCharacter(state)) {
      var right = state.lastIntValue;
      if (left !== -1 && right !== -1 && left > right) {
        state.raise("Range out of order in character class");
      }
      return true;
    }
    state.pos = start;
  }
  return false;
};
pp$1.regexp_eatClassSetOperand = function(state) {
  if (this.regexp_eatClassSetCharacter(state)) {
    return CharSetOk;
  }
  return this.regexp_eatClassStringDisjunction(state) || this.regexp_eatNestedClass(state);
};
pp$1.regexp_eatNestedClass = function(state) {
  var start = state.pos;
  if (state.eat(
    91
    /* [ */
  )) {
    var negate = state.eat(
      94
      /* ^ */
    );
    var result = this.regexp_classContents(state);
    if (state.eat(
      93
      /* ] */
    )) {
      if (negate && result === CharSetString) {
        state.raise("Negated character class may contain strings");
      }
      return result;
    }
    state.pos = start;
  }
  if (state.eat(
    92
    /* \ */
  )) {
    var result$1 = this.regexp_eatCharacterClassEscape(state);
    if (result$1) {
      return result$1;
    }
    state.pos = start;
  }
  return null;
};
pp$1.regexp_eatClassStringDisjunction = function(state) {
  var start = state.pos;
  if (state.eatChars(
    [92, 113]
    /* \q */
  )) {
    if (state.eat(
      123
      /* { */
    )) {
      var result = this.regexp_classStringDisjunctionContents(state);
      if (state.eat(
        125
        /* } */
      )) {
        return result;
      }
    } else {
      state.raise("Invalid escape");
    }
    state.pos = start;
  }
  return null;
};
pp$1.regexp_classStringDisjunctionContents = function(state) {
  var result = this.regexp_classString(state);
  while (state.eat(
    124
    /* | */
  )) {
    if (this.regexp_classString(state) === CharSetString) {
      result = CharSetString;
    }
  }
  return result;
};
pp$1.regexp_classString = function(state) {
  var count3 = 0;
  while (this.regexp_eatClassSetCharacter(state)) {
    count3++;
  }
  return count3 === 1 ? CharSetOk : CharSetString;
};
pp$1.regexp_eatClassSetCharacter = function(state) {
  var start = state.pos;
  if (state.eat(
    92
    /* \ */
  )) {
    if (this.regexp_eatCharacterEscape(state) || this.regexp_eatClassSetReservedPunctuator(state)) {
      return true;
    }
    if (state.eat(
      98
      /* b */
    )) {
      state.lastIntValue = 8;
      return true;
    }
    state.pos = start;
    return false;
  }
  var ch = state.current();
  if (ch < 0 || ch === state.lookahead() && isClassSetReservedDoublePunctuatorCharacter(ch)) {
    return false;
  }
  if (isClassSetSyntaxCharacter(ch)) {
    return false;
  }
  state.advance();
  state.lastIntValue = ch;
  return true;
};
function isClassSetReservedDoublePunctuatorCharacter(ch) {
  return ch === 33 || ch >= 35 && ch <= 38 || ch >= 42 && ch <= 44 || ch === 46 || ch >= 58 && ch <= 64 || ch === 94 || ch === 96 || ch === 126;
}
function isClassSetSyntaxCharacter(ch) {
  return ch === 40 || ch === 41 || ch === 45 || ch === 47 || ch >= 91 && ch <= 93 || ch >= 123 && ch <= 125;
}
pp$1.regexp_eatClassSetReservedPunctuator = function(state) {
  var ch = state.current();
  if (isClassSetReservedPunctuator(ch)) {
    state.lastIntValue = ch;
    state.advance();
    return true;
  }
  return false;
};
function isClassSetReservedPunctuator(ch) {
  return ch === 33 || ch === 35 || ch === 37 || ch === 38 || ch === 44 || ch === 45 || ch >= 58 && ch <= 62 || ch === 64 || ch === 96 || ch === 126;
}
pp$1.regexp_eatClassControlLetter = function(state) {
  var ch = state.current();
  if (isDecimalDigit(ch) || ch === 95) {
    state.lastIntValue = ch % 32;
    state.advance();
    return true;
  }
  return false;
};
pp$1.regexp_eatHexEscapeSequence = function(state) {
  var start = state.pos;
  if (state.eat(
    120
    /* x */
  )) {
    if (this.regexp_eatFixedHexDigits(state, 2)) {
      return true;
    }
    if (state.switchU) {
      state.raise("Invalid escape");
    }
    state.pos = start;
  }
  return false;
};
pp$1.regexp_eatDecimalDigits = function(state) {
  var start = state.pos;
  var ch = 0;
  state.lastIntValue = 0;
  while (isDecimalDigit(ch = state.current())) {
    state.lastIntValue = 10 * state.lastIntValue + (ch - 48);
    state.advance();
  }
  return state.pos !== start;
};
function isDecimalDigit(ch) {
  return ch >= 48 && ch <= 57;
}
pp$1.regexp_eatHexDigits = function(state) {
  var start = state.pos;
  var ch = 0;
  state.lastIntValue = 0;
  while (isHexDigit(ch = state.current())) {
    state.lastIntValue = 16 * state.lastIntValue + hexToInt(ch);
    state.advance();
  }
  return state.pos !== start;
};
function isHexDigit(ch) {
  return ch >= 48 && ch <= 57 || ch >= 65 && ch <= 70 || ch >= 97 && ch <= 102;
}
function hexToInt(ch) {
  if (ch >= 65 && ch <= 70) {
    return 10 + (ch - 65);
  }
  if (ch >= 97 && ch <= 102) {
    return 10 + (ch - 97);
  }
  return ch - 48;
}
pp$1.regexp_eatLegacyOctalEscapeSequence = function(state) {
  if (this.regexp_eatOctalDigit(state)) {
    var n1 = state.lastIntValue;
    if (this.regexp_eatOctalDigit(state)) {
      var n2 = state.lastIntValue;
      if (n1 <= 3 && this.regexp_eatOctalDigit(state)) {
        state.lastIntValue = n1 * 64 + n2 * 8 + state.lastIntValue;
      } else {
        state.lastIntValue = n1 * 8 + n2;
      }
    } else {
      state.lastIntValue = n1;
    }
    return true;
  }
  return false;
};
pp$1.regexp_eatOctalDigit = function(state) {
  var ch = state.current();
  if (isOctalDigit(ch)) {
    state.lastIntValue = ch - 48;
    state.advance();
    return true;
  }
  state.lastIntValue = 0;
  return false;
};
function isOctalDigit(ch) {
  return ch >= 48 && ch <= 55;
}
pp$1.regexp_eatFixedHexDigits = function(state, length) {
  var start = state.pos;
  state.lastIntValue = 0;
  for (var i2 = 0; i2 < length; ++i2) {
    var ch = state.current();
    if (!isHexDigit(ch)) {
      state.pos = start;
      return false;
    }
    state.lastIntValue = 16 * state.lastIntValue + hexToInt(ch);
    state.advance();
  }
  return true;
};
var Token = function Token2(p) {
  this.type = p.type;
  this.value = p.value;
  this.start = p.start;
  this.end = p.end;
  if (p.options.locations) {
    this.loc = new SourceLocation(p, p.startLoc, p.endLoc);
  }
  if (p.options.ranges) {
    this.range = [p.start, p.end];
  }
};
var pp = Parser.prototype;
pp.next = function(ignoreEscapeSequenceInKeyword) {
  if (!ignoreEscapeSequenceInKeyword && this.type.keyword && this.containsEsc) {
    this.raiseRecoverable(this.start, "Escape sequence in keyword " + this.type.keyword);
  }
  if (this.options.onToken) {
    this.options.onToken(new Token(this));
  }
  this.lastTokEnd = this.end;
  this.lastTokStart = this.start;
  this.lastTokEndLoc = this.endLoc;
  this.lastTokStartLoc = this.startLoc;
  this.nextToken();
};
pp.getToken = function() {
  this.next();
  return new Token(this);
};
if (typeof Symbol !== "undefined") {
  pp[Symbol.iterator] = function() {
    var this$1$1 = this;
    return {
      next: function() {
        var token = this$1$1.getToken();
        return {
          done: token.type === types$1.eof,
          value: token
        };
      }
    };
  };
}
pp.nextToken = function() {
  var curContext = this.curContext();
  if (!curContext || !curContext.preserveSpace) {
    this.skipSpace();
  }
  this.start = this.pos;
  if (this.options.locations) {
    this.startLoc = this.curPosition();
  }
  if (this.pos >= this.input.length) {
    return this.finishToken(types$1.eof);
  }
  if (curContext.override) {
    return curContext.override(this);
  } else {
    this.readToken(this.fullCharCodeAtPos());
  }
};
pp.readToken = function(code) {
  if (isIdentifierStart(code, this.options.ecmaVersion >= 6) || code === 92) {
    return this.readWord();
  }
  return this.getTokenFromCode(code);
};
pp.fullCharCodeAt = function(pos) {
  var code = this.input.charCodeAt(pos);
  if (code <= 55295 || code >= 56320) {
    return code;
  }
  var next = this.input.charCodeAt(pos + 1);
  return next <= 56319 || next >= 57344 ? code : (code << 10) + next - 56613888;
};
pp.fullCharCodeAtPos = function() {
  return this.fullCharCodeAt(this.pos);
};
pp.skipBlockComment = function() {
  var startLoc = this.options.onComment && this.curPosition();
  var start = this.pos, end = this.input.indexOf("*/", this.pos += 2);
  if (end === -1) {
    this.raise(this.pos - 2, "Unterminated comment");
  }
  this.pos = end + 2;
  if (this.options.locations) {
    for (var nextBreak = void 0, pos = start; (nextBreak = nextLineBreak(this.input, pos, this.pos)) > -1; ) {
      ++this.curLine;
      pos = this.lineStart = nextBreak;
    }
  }
  if (this.options.onComment) {
    this.options.onComment(
      true,
      this.input.slice(start + 2, end),
      start,
      this.pos,
      startLoc,
      this.curPosition()
    );
  }
};
pp.skipLineComment = function(startSkip) {
  var start = this.pos;
  var startLoc = this.options.onComment && this.curPosition();
  var ch = this.input.charCodeAt(this.pos += startSkip);
  while (this.pos < this.input.length && !isNewLine(ch)) {
    ch = this.input.charCodeAt(++this.pos);
  }
  if (this.options.onComment) {
    this.options.onComment(
      false,
      this.input.slice(start + startSkip, this.pos),
      start,
      this.pos,
      startLoc,
      this.curPosition()
    );
  }
};
pp.skipSpace = function() {
  loop: while (this.pos < this.input.length) {
    var ch = this.input.charCodeAt(this.pos);
    switch (ch) {
      case 32:
      case 160:
        ++this.pos;
        break;
      case 13:
        if (this.input.charCodeAt(this.pos + 1) === 10) {
          ++this.pos;
        }
      case 10:
      case 8232:
      case 8233:
        ++this.pos;
        if (this.options.locations) {
          ++this.curLine;
          this.lineStart = this.pos;
        }
        break;
      case 47:
        switch (this.input.charCodeAt(this.pos + 1)) {
          case 42:
            this.skipBlockComment();
            break;
          case 47:
            this.skipLineComment(2);
            break;
          default:
            break loop;
        }
        break;
      default:
        if (ch > 8 && ch < 14 || ch >= 5760 && nonASCIIwhitespace.test(String.fromCharCode(ch))) {
          ++this.pos;
        } else {
          break loop;
        }
    }
  }
};
pp.finishToken = function(type, val) {
  this.end = this.pos;
  if (this.options.locations) {
    this.endLoc = this.curPosition();
  }
  var prevType = this.type;
  this.type = type;
  this.value = val;
  this.updateContext(prevType);
};
pp.readToken_dot = function() {
  var next = this.input.charCodeAt(this.pos + 1);
  if (next >= 48 && next <= 57) {
    return this.readNumber(true);
  }
  var next2 = this.input.charCodeAt(this.pos + 2);
  if (this.options.ecmaVersion >= 6 && next === 46 && next2 === 46) {
    this.pos += 3;
    return this.finishToken(types$1.ellipsis);
  } else {
    ++this.pos;
    return this.finishToken(types$1.dot);
  }
};
pp.readToken_slash = function() {
  var next = this.input.charCodeAt(this.pos + 1);
  if (this.exprAllowed) {
    ++this.pos;
    return this.readRegexp();
  }
  if (next === 61) {
    return this.finishOp(types$1.assign, 2);
  }
  return this.finishOp(types$1.slash, 1);
};
pp.readToken_mult_modulo_exp = function(code) {
  var next = this.input.charCodeAt(this.pos + 1);
  var size = 1;
  var tokentype = code === 42 ? types$1.star : types$1.modulo;
  if (this.options.ecmaVersion >= 7 && code === 42 && next === 42) {
    ++size;
    tokentype = types$1.starstar;
    next = this.input.charCodeAt(this.pos + 2);
  }
  if (next === 61) {
    return this.finishOp(types$1.assign, size + 1);
  }
  return this.finishOp(tokentype, size);
};
pp.readToken_pipe_amp = function(code) {
  var next = this.input.charCodeAt(this.pos + 1);
  if (next === code) {
    if (this.options.ecmaVersion >= 12) {
      var next2 = this.input.charCodeAt(this.pos + 2);
      if (next2 === 61) {
        return this.finishOp(types$1.assign, 3);
      }
    }
    return this.finishOp(code === 124 ? types$1.logicalOR : types$1.logicalAND, 2);
  }
  if (next === 61) {
    return this.finishOp(types$1.assign, 2);
  }
  return this.finishOp(code === 124 ? types$1.bitwiseOR : types$1.bitwiseAND, 1);
};
pp.readToken_caret = function() {
  var next = this.input.charCodeAt(this.pos + 1);
  if (next === 61) {
    return this.finishOp(types$1.assign, 2);
  }
  return this.finishOp(types$1.bitwiseXOR, 1);
};
pp.readToken_plus_min = function(code) {
  var next = this.input.charCodeAt(this.pos + 1);
  if (next === code) {
    if (next === 45 && !this.inModule && this.input.charCodeAt(this.pos + 2) === 62 && (this.lastTokEnd === 0 || lineBreak.test(this.input.slice(this.lastTokEnd, this.pos)))) {
      this.skipLineComment(3);
      this.skipSpace();
      return this.nextToken();
    }
    return this.finishOp(types$1.incDec, 2);
  }
  if (next === 61) {
    return this.finishOp(types$1.assign, 2);
  }
  return this.finishOp(types$1.plusMin, 1);
};
pp.readToken_lt_gt = function(code) {
  var next = this.input.charCodeAt(this.pos + 1);
  var size = 1;
  if (next === code) {
    size = code === 62 && this.input.charCodeAt(this.pos + 2) === 62 ? 3 : 2;
    if (this.input.charCodeAt(this.pos + size) === 61) {
      return this.finishOp(types$1.assign, size + 1);
    }
    return this.finishOp(types$1.bitShift, size);
  }
  if (next === 33 && code === 60 && !this.inModule && this.input.charCodeAt(this.pos + 2) === 45 && this.input.charCodeAt(this.pos + 3) === 45) {
    this.skipLineComment(4);
    this.skipSpace();
    return this.nextToken();
  }
  if (next === 61) {
    size = 2;
  }
  return this.finishOp(types$1.relational, size);
};
pp.readToken_eq_excl = function(code) {
  var next = this.input.charCodeAt(this.pos + 1);
  if (next === 61) {
    return this.finishOp(types$1.equality, this.input.charCodeAt(this.pos + 2) === 61 ? 3 : 2);
  }
  if (code === 61 && next === 62 && this.options.ecmaVersion >= 6) {
    this.pos += 2;
    return this.finishToken(types$1.arrow);
  }
  return this.finishOp(code === 61 ? types$1.eq : types$1.prefix, 1);
};
pp.readToken_question = function() {
  var ecmaVersion2 = this.options.ecmaVersion;
  if (ecmaVersion2 >= 11) {
    var next = this.input.charCodeAt(this.pos + 1);
    if (next === 46) {
      var next2 = this.input.charCodeAt(this.pos + 2);
      if (next2 < 48 || next2 > 57) {
        return this.finishOp(types$1.questionDot, 2);
      }
    }
    if (next === 63) {
      if (ecmaVersion2 >= 12) {
        var next2$1 = this.input.charCodeAt(this.pos + 2);
        if (next2$1 === 61) {
          return this.finishOp(types$1.assign, 3);
        }
      }
      return this.finishOp(types$1.coalesce, 2);
    }
  }
  return this.finishOp(types$1.question, 1);
};
pp.readToken_numberSign = function() {
  var ecmaVersion2 = this.options.ecmaVersion;
  var code = 35;
  if (ecmaVersion2 >= 13) {
    ++this.pos;
    code = this.fullCharCodeAtPos();
    if (isIdentifierStart(code, true) || code === 92) {
      return this.finishToken(types$1.privateId, this.readWord1());
    }
  }
  this.raise(this.pos, "Unexpected character '" + codePointToString(code) + "'");
};
pp.getTokenFromCode = function(code) {
  switch (code) {
    // The interpretation of a dot depends on whether it is followed
    // by a digit or another two dots.
    case 46:
      return this.readToken_dot();
    // Punctuation tokens.
    case 40:
      ++this.pos;
      return this.finishToken(types$1.parenL);
    case 41:
      ++this.pos;
      return this.finishToken(types$1.parenR);
    case 59:
      ++this.pos;
      return this.finishToken(types$1.semi);
    case 44:
      ++this.pos;
      return this.finishToken(types$1.comma);
    case 91:
      ++this.pos;
      return this.finishToken(types$1.bracketL);
    case 93:
      ++this.pos;
      return this.finishToken(types$1.bracketR);
    case 123:
      ++this.pos;
      return this.finishToken(types$1.braceL);
    case 125:
      ++this.pos;
      return this.finishToken(types$1.braceR);
    case 58:
      ++this.pos;
      return this.finishToken(types$1.colon);
    case 96:
      if (this.options.ecmaVersion < 6) {
        break;
      }
      ++this.pos;
      return this.finishToken(types$1.backQuote);
    case 48:
      var next = this.input.charCodeAt(this.pos + 1);
      if (next === 120 || next === 88) {
        return this.readRadixNumber(16);
      }
      if (this.options.ecmaVersion >= 6) {
        if (next === 111 || next === 79) {
          return this.readRadixNumber(8);
        }
        if (next === 98 || next === 66) {
          return this.readRadixNumber(2);
        }
      }
    // Anything else beginning with a digit is an integer, octal
    // number, or float.
    case 49:
    case 50:
    case 51:
    case 52:
    case 53:
    case 54:
    case 55:
    case 56:
    case 57:
      return this.readNumber(false);
    // Quotes produce strings.
    case 34:
    case 39:
      return this.readString(code);
    // Operators are parsed inline in tiny state machines. '=' (61) is
    // often referred to. `finishOp` simply skips the amount of
    // characters it is given as second argument, and returns a token
    // of the type given by its first argument.
    case 47:
      return this.readToken_slash();
    case 37:
    case 42:
      return this.readToken_mult_modulo_exp(code);
    case 124:
    case 38:
      return this.readToken_pipe_amp(code);
    case 94:
      return this.readToken_caret();
    case 43:
    case 45:
      return this.readToken_plus_min(code);
    case 60:
    case 62:
      return this.readToken_lt_gt(code);
    case 61:
    case 33:
      return this.readToken_eq_excl(code);
    case 63:
      return this.readToken_question();
    case 126:
      return this.finishOp(types$1.prefix, 1);
    case 35:
      return this.readToken_numberSign();
  }
  this.raise(this.pos, "Unexpected character '" + codePointToString(code) + "'");
};
pp.finishOp = function(type, size) {
  var str = this.input.slice(this.pos, this.pos + size);
  this.pos += size;
  return this.finishToken(type, str);
};
pp.readRegexp = function() {
  var escaped, inClass, start = this.pos;
  for (; ; ) {
    if (this.pos >= this.input.length) {
      this.raise(start, "Unterminated regular expression");
    }
    var ch = this.input.charAt(this.pos);
    if (lineBreak.test(ch)) {
      this.raise(start, "Unterminated regular expression");
    }
    if (!escaped) {
      if (ch === "[") {
        inClass = true;
      } else if (ch === "]" && inClass) {
        inClass = false;
      } else if (ch === "/" && !inClass) {
        break;
      }
      escaped = ch === "\\";
    } else {
      escaped = false;
    }
    ++this.pos;
  }
  var pattern = this.input.slice(start, this.pos);
  ++this.pos;
  var flagsStart = this.pos;
  var flags = this.readWord1();
  if (this.containsEsc) {
    this.unexpected(flagsStart);
  }
  var state = this.regexpState || (this.regexpState = new RegExpValidationState(this));
  state.reset(start, pattern, flags);
  this.validateRegExpFlags(state);
  this.validateRegExpPattern(state);
  var value = null;
  try {
    value = new RegExp(pattern, flags);
  } catch (e) {
  }
  return this.finishToken(types$1.regexp, { pattern, flags, value });
};
pp.readInt = function(radix, len, maybeLegacyOctalNumericLiteral) {
  var allowSeparators = this.options.ecmaVersion >= 12 && len === void 0;
  var isLegacyOctalNumericLiteral = maybeLegacyOctalNumericLiteral && this.input.charCodeAt(this.pos) === 48;
  var start = this.pos, total = 0, lastCode = 0;
  for (var i2 = 0, e = len == null ? Infinity : len; i2 < e; ++i2, ++this.pos) {
    var code = this.input.charCodeAt(this.pos), val = void 0;
    if (allowSeparators && code === 95) {
      if (isLegacyOctalNumericLiteral) {
        this.raiseRecoverable(this.pos, "Numeric separator is not allowed in legacy octal numeric literals");
      }
      if (lastCode === 95) {
        this.raiseRecoverable(this.pos, "Numeric separator must be exactly one underscore");
      }
      if (i2 === 0) {
        this.raiseRecoverable(this.pos, "Numeric separator is not allowed at the first of digits");
      }
      lastCode = code;
      continue;
    }
    if (code >= 97) {
      val = code - 97 + 10;
    } else if (code >= 65) {
      val = code - 65 + 10;
    } else if (code >= 48 && code <= 57) {
      val = code - 48;
    } else {
      val = Infinity;
    }
    if (val >= radix) {
      break;
    }
    lastCode = code;
    total = total * radix + val;
  }
  if (allowSeparators && lastCode === 95) {
    this.raiseRecoverable(this.pos - 1, "Numeric separator is not allowed at the last of digits");
  }
  if (this.pos === start || len != null && this.pos - start !== len) {
    return null;
  }
  return total;
};
function stringToNumber(str, isLegacyOctalNumericLiteral) {
  if (isLegacyOctalNumericLiteral) {
    return parseInt(str, 8);
  }
  return parseFloat(str.replace(/_/g, ""));
}
function stringToBigInt(str) {
  if (typeof BigInt !== "function") {
    return null;
  }
  return BigInt(str.replace(/_/g, ""));
}
pp.readRadixNumber = function(radix) {
  var start = this.pos;
  this.pos += 2;
  var val = this.readInt(radix);
  if (val == null) {
    this.raise(this.start + 2, "Expected number in radix " + radix);
  }
  if (this.options.ecmaVersion >= 11 && this.input.charCodeAt(this.pos) === 110) {
    val = stringToBigInt(this.input.slice(start, this.pos));
    ++this.pos;
  } else if (isIdentifierStart(this.fullCharCodeAtPos())) {
    this.raise(this.pos, "Identifier directly after number");
  }
  return this.finishToken(types$1.num, val);
};
pp.readNumber = function(startsWithDot) {
  var start = this.pos;
  if (!startsWithDot && this.readInt(10, void 0, true) === null) {
    this.raise(start, "Invalid number");
  }
  var octal = this.pos - start >= 2 && this.input.charCodeAt(start) === 48;
  if (octal && this.strict) {
    this.raise(start, "Invalid number");
  }
  var next = this.input.charCodeAt(this.pos);
  if (!octal && !startsWithDot && this.options.ecmaVersion >= 11 && next === 110) {
    var val$1 = stringToBigInt(this.input.slice(start, this.pos));
    ++this.pos;
    if (isIdentifierStart(this.fullCharCodeAtPos())) {
      this.raise(this.pos, "Identifier directly after number");
    }
    return this.finishToken(types$1.num, val$1);
  }
  if (octal && /[89]/.test(this.input.slice(start, this.pos))) {
    octal = false;
  }
  if (next === 46 && !octal) {
    ++this.pos;
    this.readInt(10);
    next = this.input.charCodeAt(this.pos);
  }
  if ((next === 69 || next === 101) && !octal) {
    next = this.input.charCodeAt(++this.pos);
    if (next === 43 || next === 45) {
      ++this.pos;
    }
    if (this.readInt(10) === null) {
      this.raise(start, "Invalid number");
    }
  }
  if (isIdentifierStart(this.fullCharCodeAtPos())) {
    this.raise(this.pos, "Identifier directly after number");
  }
  var val = stringToNumber(this.input.slice(start, this.pos), octal);
  return this.finishToken(types$1.num, val);
};
pp.readCodePoint = function() {
  var ch = this.input.charCodeAt(this.pos), code;
  if (ch === 123) {
    if (this.options.ecmaVersion < 6) {
      this.unexpected();
    }
    var codePos = ++this.pos;
    code = this.readHexChar(this.input.indexOf("}", this.pos) - this.pos);
    ++this.pos;
    if (code > 1114111) {
      this.invalidStringToken(codePos, "Code point out of bounds");
    }
  } else {
    code = this.readHexChar(4);
  }
  return code;
};
pp.readString = function(quote) {
  var out = "", chunkStart = ++this.pos;
  for (; ; ) {
    if (this.pos >= this.input.length) {
      this.raise(this.start, "Unterminated string constant");
    }
    var ch = this.input.charCodeAt(this.pos);
    if (ch === quote) {
      break;
    }
    if (ch === 92) {
      out += this.input.slice(chunkStart, this.pos);
      out += this.readEscapedChar(false);
      chunkStart = this.pos;
    } else if (ch === 8232 || ch === 8233) {
      if (this.options.ecmaVersion < 10) {
        this.raise(this.start, "Unterminated string constant");
      }
      ++this.pos;
      if (this.options.locations) {
        this.curLine++;
        this.lineStart = this.pos;
      }
    } else {
      if (isNewLine(ch)) {
        this.raise(this.start, "Unterminated string constant");
      }
      ++this.pos;
    }
  }
  out += this.input.slice(chunkStart, this.pos++);
  return this.finishToken(types$1.string, out);
};
var INVALID_TEMPLATE_ESCAPE_ERROR = {};
pp.tryReadTemplateToken = function() {
  this.inTemplateElement = true;
  try {
    this.readTmplToken();
  } catch (err) {
    if (err === INVALID_TEMPLATE_ESCAPE_ERROR) {
      this.readInvalidTemplateToken();
    } else {
      throw err;
    }
  }
  this.inTemplateElement = false;
};
pp.invalidStringToken = function(position, message) {
  if (this.inTemplateElement && this.options.ecmaVersion >= 9) {
    throw INVALID_TEMPLATE_ESCAPE_ERROR;
  } else {
    this.raise(position, message);
  }
};
pp.readTmplToken = function() {
  var out = "", chunkStart = this.pos;
  for (; ; ) {
    if (this.pos >= this.input.length) {
      this.raise(this.start, "Unterminated template");
    }
    var ch = this.input.charCodeAt(this.pos);
    if (ch === 96 || ch === 36 && this.input.charCodeAt(this.pos + 1) === 123) {
      if (this.pos === this.start && (this.type === types$1.template || this.type === types$1.invalidTemplate)) {
        if (ch === 36) {
          this.pos += 2;
          return this.finishToken(types$1.dollarBraceL);
        } else {
          ++this.pos;
          return this.finishToken(types$1.backQuote);
        }
      }
      out += this.input.slice(chunkStart, this.pos);
      return this.finishToken(types$1.template, out);
    }
    if (ch === 92) {
      out += this.input.slice(chunkStart, this.pos);
      out += this.readEscapedChar(true);
      chunkStart = this.pos;
    } else if (isNewLine(ch)) {
      out += this.input.slice(chunkStart, this.pos);
      ++this.pos;
      switch (ch) {
        case 13:
          if (this.input.charCodeAt(this.pos) === 10) {
            ++this.pos;
          }
        case 10:
          out += "\n";
          break;
        default:
          out += String.fromCharCode(ch);
          break;
      }
      if (this.options.locations) {
        ++this.curLine;
        this.lineStart = this.pos;
      }
      chunkStart = this.pos;
    } else {
      ++this.pos;
    }
  }
};
pp.readInvalidTemplateToken = function() {
  for (; this.pos < this.input.length; this.pos++) {
    switch (this.input[this.pos]) {
      case "\\":
        ++this.pos;
        break;
      case "$":
        if (this.input[this.pos + 1] !== "{") {
          break;
        }
      // fall through
      case "`":
        return this.finishToken(types$1.invalidTemplate, this.input.slice(this.start, this.pos));
      case "\r":
        if (this.input[this.pos + 1] === "\n") {
          ++this.pos;
        }
      // fall through
      case "\n":
      case "\u2028":
      case "\u2029":
        ++this.curLine;
        this.lineStart = this.pos + 1;
        break;
    }
  }
  this.raise(this.start, "Unterminated template");
};
pp.readEscapedChar = function(inTemplate) {
  var ch = this.input.charCodeAt(++this.pos);
  ++this.pos;
  switch (ch) {
    case 110:
      return "\n";
    // 'n' -> '\n'
    case 114:
      return "\r";
    // 'r' -> '\r'
    case 120:
      return String.fromCharCode(this.readHexChar(2));
    // 'x'
    case 117:
      return codePointToString(this.readCodePoint());
    // 'u'
    case 116:
      return "	";
    // 't' -> '\t'
    case 98:
      return "\b";
    // 'b' -> '\b'
    case 118:
      return "\v";
    // 'v' -> '\u000b'
    case 102:
      return "\f";
    // 'f' -> '\f'
    case 13:
      if (this.input.charCodeAt(this.pos) === 10) {
        ++this.pos;
      }
    // '\r\n'
    case 10:
      if (this.options.locations) {
        this.lineStart = this.pos;
        ++this.curLine;
      }
      return "";
    case 56:
    case 57:
      if (this.strict) {
        this.invalidStringToken(
          this.pos - 1,
          "Invalid escape sequence"
        );
      }
      if (inTemplate) {
        var codePos = this.pos - 1;
        this.invalidStringToken(
          codePos,
          "Invalid escape sequence in template string"
        );
      }
    default:
      if (ch >= 48 && ch <= 55) {
        var octalStr = this.input.substr(this.pos - 1, 3).match(/^[0-7]+/)[0];
        var octal = parseInt(octalStr, 8);
        if (octal > 255) {
          octalStr = octalStr.slice(0, -1);
          octal = parseInt(octalStr, 8);
        }
        this.pos += octalStr.length - 1;
        ch = this.input.charCodeAt(this.pos);
        if ((octalStr !== "0" || ch === 56 || ch === 57) && (this.strict || inTemplate)) {
          this.invalidStringToken(
            this.pos - 1 - octalStr.length,
            inTemplate ? "Octal literal in template string" : "Octal literal in strict mode"
          );
        }
        return String.fromCharCode(octal);
      }
      if (isNewLine(ch)) {
        if (this.options.locations) {
          this.lineStart = this.pos;
          ++this.curLine;
        }
        return "";
      }
      return String.fromCharCode(ch);
  }
};
pp.readHexChar = function(len) {
  var codePos = this.pos;
  var n = this.readInt(16, len);
  if (n === null) {
    this.invalidStringToken(codePos, "Bad character escape sequence");
  }
  return n;
};
pp.readWord1 = function() {
  this.containsEsc = false;
  var word = "", first = true, chunkStart = this.pos;
  var astral = this.options.ecmaVersion >= 6;
  while (this.pos < this.input.length) {
    var ch = this.fullCharCodeAtPos();
    if (isIdentifierChar(ch, astral)) {
      this.pos += ch <= 65535 ? 1 : 2;
    } else if (ch === 92) {
      this.containsEsc = true;
      word += this.input.slice(chunkStart, this.pos);
      var escStart = this.pos;
      if (this.input.charCodeAt(++this.pos) !== 117) {
        this.invalidStringToken(this.pos, "Expecting Unicode escape sequence \\uXXXX");
      }
      ++this.pos;
      var esc = this.readCodePoint();
      if (!(first ? isIdentifierStart : isIdentifierChar)(esc, astral)) {
        this.invalidStringToken(escStart, "Invalid Unicode escape");
      }
      word += codePointToString(esc);
      chunkStart = this.pos;
    } else {
      break;
    }
    first = false;
  }
  return word + this.input.slice(chunkStart, this.pos);
};
pp.readWord = function() {
  var word = this.readWord1();
  var type = types$1.name;
  if (this.keywords.test(word)) {
    type = keywords[word];
  }
  return this.finishToken(type, word);
};
var version = "8.18.0";
Parser.acorn = {
  Parser,
  version,
  defaultOptions,
  Position,
  SourceLocation,
  getLineInfo,
  Node,
  TokenType,
  tokTypes: types$1,
  keywordTypes: keywords,
  TokContext,
  tokContexts: types,
  isIdentifierChar,
  isIdentifierStart,
  Token,
  isNewLine,
  lineBreak,
  lineBreakG,
  nonASCIIwhitespace
};
function parse3(input3, options2) {
  return Parser.parse(input3, options2);
}
function parseExpressionAt2(input3, pos, options2) {
  return Parser.parseExpressionAt(input3, pos, options2);
}
function tokenizer2(input3, options2) {
  return Parser.tokenizer(input3, options2);
}

// node_modules/@observablehq/notebook-kit/dist/src/javascript/syntaxError.js
function syntaxError(message, node, input3) {
  const { line, column } = getLineInfo(input3, node.start);
  return new SyntaxError(`${message} (${line}:${column})`);
}

// node_modules/acorn-walk/dist/walk.mjs
function simple(node, visitors2, baseVisitor, state, override) {
  if (!baseVisitor) {
    baseVisitor = base;
  }
  (function c(node2, st, override2) {
    var type = override2 || node2.type;
    visitNode(baseVisitor, type, node2, st, c);
    if (visitors2[type]) {
      visitors2[type](node2, st);
    }
  })(node, state, override);
}
function ancestor(node, visitors2, baseVisitor, state, override) {
  var ancestors = [];
  if (!baseVisitor) {
    baseVisitor = base;
  }
  (function c(node2, st, override2) {
    var type = override2 || node2.type;
    var isNew = node2 !== ancestors[ancestors.length - 1];
    if (isNew) {
      ancestors.push(node2);
    }
    visitNode(baseVisitor, type, node2, st, c);
    if (visitors2[type]) {
      visitors2[type](node2, st || ancestors, ancestors);
    }
    if (isNew) {
      ancestors.pop();
    }
  })(node, state, override);
}
function recursive(node, state, funcs, baseVisitor, override) {
  var visitor = funcs ? make(funcs, baseVisitor || void 0) : baseVisitor;
  (function c(node2, st, override2) {
    visitor[override2 || node2.type](node2, st, c);
  })(node, state, override);
}
function make(funcs, baseVisitor) {
  var visitor = Object.create(baseVisitor || base);
  for (var type in funcs) {
    visitor[type] = funcs[type];
  }
  return visitor;
}
function skipThrough(node, st, c) {
  c(node, st);
}
function ignore(_node, _st, _c) {
}
function visitNode(baseVisitor, type, node, st, c) {
  if (baseVisitor[type] == null) {
    throw new Error("No walker function defined for node type " + type);
  }
  baseVisitor[type](node, st, c);
}
var base = {};
base.Program = base.BlockStatement = base.StaticBlock = function(node, st, c) {
  for (var i2 = 0, list2 = node.body; i2 < list2.length; i2 += 1) {
    var stmt = list2[i2];
    c(stmt, st, "Statement");
  }
};
base.Statement = skipThrough;
base.EmptyStatement = ignore;
base.ExpressionStatement = base.ParenthesizedExpression = base.ChainExpression = function(node, st, c) {
  return c(node.expression, st, "Expression");
};
base.IfStatement = function(node, st, c) {
  c(node.test, st, "Expression");
  c(node.consequent, st, "Statement");
  if (node.alternate) {
    c(node.alternate, st, "Statement");
  }
};
base.LabeledStatement = function(node, st, c) {
  return c(node.body, st, "Statement");
};
base.BreakStatement = base.ContinueStatement = ignore;
base.WithStatement = function(node, st, c) {
  c(node.object, st, "Expression");
  c(node.body, st, "Statement");
};
base.SwitchStatement = function(node, st, c) {
  c(node.discriminant, st, "Expression");
  for (var i2 = 0, list2 = node.cases; i2 < list2.length; i2 += 1) {
    var cs = list2[i2];
    c(cs, st);
  }
};
base.SwitchCase = function(node, st, c) {
  if (node.test) {
    c(node.test, st, "Expression");
  }
  for (var i2 = 0, list2 = node.consequent; i2 < list2.length; i2 += 1) {
    var cons = list2[i2];
    c(cons, st, "Statement");
  }
};
base.ReturnStatement = base.YieldExpression = base.AwaitExpression = function(node, st, c) {
  if (node.argument) {
    c(node.argument, st, "Expression");
  }
};
base.ThrowStatement = base.SpreadElement = function(node, st, c) {
  return c(node.argument, st, "Expression");
};
base.TryStatement = function(node, st, c) {
  c(node.block, st, "Statement");
  if (node.handler) {
    c(node.handler, st);
  }
  if (node.finalizer) {
    c(node.finalizer, st, "Statement");
  }
};
base.CatchClause = function(node, st, c) {
  if (node.param) {
    c(node.param, st, "Pattern");
  }
  c(node.body, st, "Statement");
};
base.WhileStatement = base.DoWhileStatement = function(node, st, c) {
  c(node.test, st, "Expression");
  c(node.body, st, "Statement");
};
base.ForStatement = function(node, st, c) {
  if (node.init) {
    c(node.init, st, "ForInit");
  }
  if (node.test) {
    c(node.test, st, "Expression");
  }
  if (node.update) {
    c(node.update, st, "Expression");
  }
  c(node.body, st, "Statement");
};
base.ForInStatement = base.ForOfStatement = function(node, st, c) {
  c(node.left, st, "ForInit");
  c(node.right, st, "Expression");
  c(node.body, st, "Statement");
};
base.ForInit = function(node, st, c) {
  if (node.type === "VariableDeclaration") {
    c(node, st);
  } else {
    c(node, st, "Expression");
  }
};
base.DebuggerStatement = ignore;
base.FunctionDeclaration = function(node, st, c) {
  return c(node, st, "Function");
};
base.VariableDeclaration = function(node, st, c) {
  for (var i2 = 0, list2 = node.declarations; i2 < list2.length; i2 += 1) {
    var decl = list2[i2];
    c(decl, st);
  }
};
base.VariableDeclarator = function(node, st, c) {
  c(node.id, st, "Pattern");
  if (node.init) {
    c(node.init, st, "Expression");
  }
};
base.Function = function(node, st, c) {
  if (node.id) {
    c(node.id, st, "Pattern");
  }
  for (var i2 = 0, list2 = node.params; i2 < list2.length; i2 += 1) {
    var param = list2[i2];
    c(param, st, "Pattern");
  }
  c(node.body, st, node.expression ? "Expression" : "Statement");
};
base.Pattern = function(node, st, c) {
  if (node.type === "Identifier") {
    c(node, st, "VariablePattern");
  } else if (node.type === "MemberExpression") {
    c(node, st, "MemberPattern");
  } else {
    c(node, st);
  }
};
base.VariablePattern = ignore;
base.MemberPattern = skipThrough;
base.RestElement = function(node, st, c) {
  return c(node.argument, st, "Pattern");
};
base.ArrayPattern = function(node, st, c) {
  for (var i2 = 0, list2 = node.elements; i2 < list2.length; i2 += 1) {
    var elt = list2[i2];
    if (elt) {
      c(elt, st, "Pattern");
    }
  }
};
base.ObjectPattern = function(node, st, c) {
  for (var i2 = 0, list2 = node.properties; i2 < list2.length; i2 += 1) {
    var prop = list2[i2];
    if (prop.type === "Property") {
      if (prop.computed) {
        c(prop.key, st, "Expression");
      }
      c(prop.value, st, "Pattern");
    } else if (prop.type === "RestElement") {
      c(prop.argument, st, "Pattern");
    }
  }
};
base.Expression = skipThrough;
base.ThisExpression = base.Super = base.MetaProperty = ignore;
base.ArrayExpression = function(node, st, c) {
  for (var i2 = 0, list2 = node.elements; i2 < list2.length; i2 += 1) {
    var elt = list2[i2];
    if (elt) {
      c(elt, st, "Expression");
    }
  }
};
base.ObjectExpression = function(node, st, c) {
  for (var i2 = 0, list2 = node.properties; i2 < list2.length; i2 += 1) {
    var prop = list2[i2];
    c(prop, st);
  }
};
base.FunctionExpression = base.ArrowFunctionExpression = base.FunctionDeclaration;
base.SequenceExpression = function(node, st, c) {
  for (var i2 = 0, list2 = node.expressions; i2 < list2.length; i2 += 1) {
    var expr = list2[i2];
    c(expr, st, "Expression");
  }
};
base.TemplateLiteral = function(node, st, c) {
  for (var i2 = 0, list2 = node.quasis; i2 < list2.length; i2 += 1) {
    var quasi = list2[i2];
    c(quasi, st);
  }
  for (var i$1 = 0, list$1 = node.expressions; i$1 < list$1.length; i$1 += 1) {
    var expr = list$1[i$1];
    c(expr, st, "Expression");
  }
};
base.TemplateElement = ignore;
base.UnaryExpression = base.UpdateExpression = function(node, st, c) {
  c(node.argument, st, "Expression");
};
base.BinaryExpression = base.LogicalExpression = function(node, st, c) {
  c(node.left, st, "Expression");
  c(node.right, st, "Expression");
};
base.AssignmentExpression = base.AssignmentPattern = function(node, st, c) {
  c(node.left, st, "Pattern");
  c(node.right, st, "Expression");
};
base.ConditionalExpression = function(node, st, c) {
  c(node.test, st, "Expression");
  c(node.consequent, st, "Expression");
  c(node.alternate, st, "Expression");
};
base.NewExpression = base.CallExpression = function(node, st, c) {
  c(node.callee, st, "Expression");
  if (node.arguments) {
    for (var i2 = 0, list2 = node.arguments; i2 < list2.length; i2 += 1) {
      var arg = list2[i2];
      c(arg, st, "Expression");
    }
  }
};
base.MemberExpression = function(node, st, c) {
  c(node.object, st, "Expression");
  if (node.computed) {
    c(node.property, st, "Expression");
  }
};
base.ExportNamedDeclaration = base.ExportDefaultDeclaration = function(node, st, c) {
  if (node.declaration) {
    c(node.declaration, st, node.type === "ExportNamedDeclaration" || node.declaration.id ? "Statement" : "Expression");
  }
  if (node.source) {
    c(node.source, st, "Expression");
  }
  if (node.attributes) {
    for (var i2 = 0, list2 = node.attributes; i2 < list2.length; i2 += 1) {
      var attr = list2[i2];
      c(attr, st);
    }
  }
};
base.ExportAllDeclaration = function(node, st, c) {
  if (node.exported) {
    c(node.exported, st);
  }
  c(node.source, st, "Expression");
  if (node.attributes) {
    for (var i2 = 0, list2 = node.attributes; i2 < list2.length; i2 += 1) {
      var attr = list2[i2];
      c(attr, st);
    }
  }
};
base.ImportAttribute = function(node, st, c) {
  c(node.value, st, "Expression");
};
base.ImportDeclaration = function(node, st, c) {
  for (var i2 = 0, list2 = node.specifiers; i2 < list2.length; i2 += 1) {
    var spec = list2[i2];
    c(spec, st);
  }
  c(node.source, st, "Expression");
  if (node.attributes) {
    for (var i$1 = 0, list$1 = node.attributes; i$1 < list$1.length; i$1 += 1) {
      var attr = list$1[i$1];
      c(attr, st);
    }
  }
};
base.ImportExpression = function(node, st, c) {
  c(node.source, st, "Expression");
  if (node.options) {
    c(node.options, st, "Expression");
  }
};
base.ImportSpecifier = base.ImportDefaultSpecifier = base.ImportNamespaceSpecifier = base.Identifier = base.PrivateIdentifier = base.Literal = ignore;
base.TaggedTemplateExpression = function(node, st, c) {
  c(node.tag, st, "Expression");
  c(node.quasi, st, "Expression");
};
base.ClassDeclaration = base.ClassExpression = function(node, st, c) {
  return c(node, st, "Class");
};
base.Class = function(node, st, c) {
  if (node.id) {
    c(node.id, st, "Pattern");
  }
  if (node.superClass) {
    c(node.superClass, st, "Expression");
  }
  c(node.body, st);
};
base.ClassBody = function(node, st, c) {
  for (var i2 = 0, list2 = node.body; i2 < list2.length; i2 += 1) {
    var elt = list2[i2];
    c(elt, st);
  }
};
base.MethodDefinition = base.PropertyDefinition = base.Property = function(node, st, c) {
  if (node.computed) {
    c(node.key, st, "Expression");
  }
  if (node.value) {
    c(node.value, st, "Expression");
  }
};

// node_modules/@observablehq/notebook-kit/dist/src/javascript/walk.js
function callbackId(node, state, c) {
  c(node.id, state, "Identifier");
}
function callbackExpression(node, state, c) {
  c(node.expression, state, "Expression");
}
function callbackParameter(node, state, c) {
  c(node.parameter, state, "Pattern");
}
function skip() {
}
var visitors = {
  ViewExpression: callbackId,
  MutableExpression: callbackId,
  TSTypeAliasDeclaration: skip,
  TSInterfaceDeclaration: skip,
  TSDeclareFunction: skip,
  TSDeclareMethod: skip,
  TSIndexSignature: skip,
  TSNamespaceExportDeclaration: skip,
  TSEnumDeclaration: skip,
  TSModuleDeclaration: skip,
  TSImportEqualsDeclaration: skip,
  TSExportAssignment: skip,
  TSAsExpression: callbackExpression,
  TSSatisfiesExpression: callbackExpression,
  TSNonNullExpression: callbackExpression,
  TSTypeAssertion: callbackExpression,
  TSInstantiationExpression: callbackExpression,
  TSTypeCastExpression: callbackExpression,
  TSParameterProperty: callbackParameter
};
var walk = make(visitors);
function ancestor2(node, visitors2, state) {
  return ancestor(node, visitors2, walk, state);
}
function recursive2(node, state, functions) {
  return recursive(node, state, functions, walk);
}
function simple2(node, visitors2, state) {
  return simple(node, visitors2, walk, state);
}

// node_modules/@observablehq/notebook-kit/dist/src/javascript/imports.js
function checkExports(body2, { input: input3 }) {
  function checkExport(child) {
    throw syntaxError("Unexpected token 'export'", child, input3);
  }
  simple2(body2, {
    ExportAllDeclaration: checkExport,
    ExportNamedDeclaration: checkExport
  });
}
function hasImportDeclaration(body2) {
  let has = false;
  simple2(body2, {
    ImportDeclaration() {
      has = true;
    }
  });
  return has;
}
function isImportMetaResolve(node) {
  return node.callee.type === "MemberExpression" && node.callee.object.type === "MetaProperty" && node.callee.object.meta.name === "import" && node.callee.object.property.name === "meta" && node.callee.property.type === "Identifier" && node.callee.property.name === "resolve" && node.arguments.length > 0;
}
function isImportMetaUrl(node) {
  return node.object.type === "MetaProperty" && node.object.meta.name === "import" && node.object.property.name === "meta" && node.property.type === "Identifier" && node.property.name === "url";
}
function isTypeImport(node) {
  return node.importKind === "type";
}
function resolveImportDefault(specifier) {
  return resolveObservableImport(resolveJsrImport(resolveNpmImport(specifier)));
}
function rewriteImportExpressions(output, body2, { resolveImport = resolveImportDefault, resolveLocalImports } = {}) {
  function rewriteImportSource(source, node = source) {
    const value = getStringLiteralValue(source);
    const resolution = resolveImport(value);
    output.replaceLeft(node.start, node.end, resolveLocalImports && isLocalImport(resolution) ? `new URL(${JSON.stringify(resolution)}, document.baseURI).href` : JSON.stringify(resolution));
  }
  simple2(body2, {
    ImportExpression(node) {
      const source = node.source;
      if (isStringLiteral(source)) {
        rewriteImportSource(source);
      }
    },
    MemberExpression(node) {
      if (resolveLocalImports && isImportMetaUrl(node)) {
        output.replaceLeft(node.start, node.end, "document.baseURI");
      }
    },
    CallExpression(node) {
      const source = node.arguments[0];
      if (isImportMetaResolve(node) && isStringLiteral(source)) {
        rewriteImportSource(source, node);
      }
    }
  });
}
function rewriteImportDeclarations(output, body2, inputs, { resolveImport = resolveImportDefault, resolveLocalImports, renameObservableImport = dedollar } = {}) {
  const declarations = [];
  simple2(body2, {
    ImportDeclaration(node) {
      if (isTypeImport(node)) {
        output.delete(node.start, node.end);
      } else if (isStringLiteral(node.source)) {
        declarations.push([node, node.source]);
      }
    }
  });
  const specifiers = [];
  const imports = [];
  for (const [node, literal2] of declarations) {
    output.delete(node.start, node.end + +(output.input[node.end] === "\n"));
    specifiers.push(rewriteImportSpecifiers(node));
    const value = getStringLiteralValue(literal2);
    const resolution = resolveImport(value);
    const source = resolveLocalImports && isLocalImport(resolution) ? `new URL(${JSON.stringify(resolution)}, document.baseURI)` : JSON.stringify(resolution);
    imports.push(isObservableImport(node, value) ? renderObservableImport(source, node, inputs, renameObservableImport) : renderImport(source, node, output.input));
  }
  if (declarations.length > 1) {
    output.insertLeft(0, `const [${specifiers.join(", ")}] = await Promise.all([${imports.join(", ")}]);
`);
  } else if (declarations.length === 1) {
    output.insertLeft(0, `const ${specifiers[0]} = await ${imports[0]};
`);
  }
}
function renderImport(source, node, input3) {
  const names = node.specifiers.filter((node2) => !isTypeImport(node2)).filter(isNamedSpecifier).map(getImportedName);
  return `import(${source}${node.attributes?.length > 0 ? `, {with: {${input3.slice(node.attributes[0].start, node.attributes[node.attributes.length - 1].end)}}}` : ""})${names.length > 0 ? `.then((module) => {${names.map((name) => `
  if (!("${name}" in module)) throw new SyntaxError(\`export '${name}' not found\`);`).join("")}
  return module;
})` : ""}`;
}
function getLocalName(node) {
  return node.local.name;
}
function getImportedName(node) {
  return node.type === "ImportDefaultSpecifier" ? "default" : node.imported.type === "Identifier" ? node.imported.name : node.imported.raw;
}
function isLocalImport(source) {
  return ["./", "../", "/"].some((prefix) => source.startsWith(prefix));
}
function isNamespaceSpecifier(node) {
  return node.type === "ImportNamespaceSpecifier";
}
function isNamedSpecifier(node) {
  return node.type !== "ImportNamespaceSpecifier";
}
function rewriteImportSpecifiers(node) {
  return node.specifiers.some(isNamedSpecifier) ? `{${flatMapImportSpecifiers(node, rewriteImportSpecifier).join(", ")}}` : node.specifiers.find((node2) => isNamespaceSpecifier(node2) && !isTypeImport(node2))?.local.name ?? "{}";
}
function flatMapImportSpecifiers(node, f) {
  return node.specifiers.flatMap((node2) => {
    if (node2.type === "ImportNamespaceSpecifier")
      throw new SyntaxError("unexpected namespace specifier");
    return isViewImport(node2) ? [f(node2), f(toSpecialImportSpecifier(node2, "viewof"))] : isMutableImport(node2) ? [f(node2), f(toSpecialImportSpecifier(node2, "mutable"))] : isTypeImport(node2) ? [] : f(node2);
  });
}
function rewriteImportSpecifier(node) {
  return getImportedName(node) === getLocalName(node) ? getLocalName(node) : `${getImportedName(node)}: ${getLocalName(node)}`;
}

// node_modules/@sveltejs/acorn-typescript/index.js
var startsExpr2 = true;
var acornTypeScriptMap = /* @__PURE__ */ new WeakMap();
function generateAcornTypeScript(_acorn) {
  const acorn = _acorn.Parser.acorn || _acorn;
  let acornTypeScript = acornTypeScriptMap.get(acorn);
  if (!acornTypeScript) {
    let tokenIsLiteralPropertyName = function(token) {
      return token === tokTypes.name || token === tokTypes.string || token === tokTypes.num || keywordTypeValues.includes(token) || tsKwTokenTypeValues.includes(token);
    }, tokenIsKeywordOrIdentifier = function(token) {
      return token === tokTypes.name || keywordTypeValues.includes(token) || tsKwTokenTypeValues.includes(token);
    }, tokenIsIdentifier = function(token) {
      return token === tokTypes.name || tsKwTokenTypeValues.includes(token);
    }, tokenIsTSDeclarationStart = function(token) {
      return token === tsKwTokenType.abstract || token === tsKwTokenType.declare || token === tsKwTokenType.enum || token === tsKwTokenType.module || token === tsKwTokenType.namespace || token === tsKwTokenType.interface || token === tsKwTokenType.type;
    }, tokenIsTSTypeOperator = function(token) {
      return token === tsKwTokenType.keyof || token === tsKwTokenType.readonly || token === tsKwTokenType.unique;
    }, tokenIsTemplate = function(token) {
      return token === tokTypes.invalidTemplate;
    };
    const { tokTypes, keywordTypes } = acorn;
    const keywordTypeValues = Object.values(keywordTypes);
    const tsKwTokenType = generateTsKwTokenType();
    const tsKwTokenTypeValues = Object.values(tsKwTokenType);
    const tsTokenType = generateTsTokenType();
    const tsTokenContext = generateTsTokenContext();
    const tsKeywordsRegExp = new RegExp(`^(?:${Object.keys(tsKwTokenType).join("|")})$`);
    tsTokenType.jsxTagStart.updateContext = function() {
      this.context.push(tsTokenContext.tc_expr);
      this.context.push(tsTokenContext.tc_oTag);
      this.exprAllowed = false;
    };
    tsTokenType.jsxTagEnd.updateContext = function(prevType) {
      let out = this.context.pop();
      if (out === tsTokenContext.tc_oTag && prevType === tokTypes.slash || out === tsTokenContext.tc_cTag) {
        this.context.pop();
        this.exprAllowed = this.curContext() === tsTokenContext.tc_expr;
      } else {
        this.exprAllowed = true;
      }
    };
    acornTypeScript = {
      tokTypes: {
        ...tsKwTokenType,
        ...tsTokenType
      },
      tokContexts: {
        ...tsTokenContext
      },
      keywordsRegExp: tsKeywordsRegExp,
      tokenIsLiteralPropertyName,
      tokenIsKeywordOrIdentifier,
      tokenIsIdentifier,
      tokenIsTSDeclarationStart,
      tokenIsTSTypeOperator,
      tokenIsTemplate
    };
  }
  return acornTypeScript;
  function kwLike(_name, options2 = {}) {
    return new acorn.TokenType("name", options2);
  }
  function generateTsTokenContext() {
    return {
      tc_oTag: new acorn.TokContext("<tag", false, false),
      tc_cTag: new acorn.TokContext("</tag", false, false),
      tc_expr: new acorn.TokContext("<tag>...</tag>", true, true)
    };
  }
  function generateTsTokenType() {
    return {
      // @ts-expect-error
      at: new acorn.TokenType("@"),
      // @ts-expect-error
      jsxName: new acorn.TokenType("jsxName"),
      // @ts-expect-error
      jsxText: new acorn.TokenType("jsxText", { beforeExpr: true }),
      // @ts-expect-error
      jsxTagStart: new acorn.TokenType("jsxTagStart", { startsExpr: true }),
      // @ts-expect-error
      jsxTagEnd: new acorn.TokenType("jsxTagEnd")
    };
  }
  function generateTsKwTokenType() {
    return {
      assert: kwLike("assert", { startsExpr: startsExpr2 }),
      asserts: kwLike("asserts", { startsExpr: startsExpr2 }),
      global: kwLike("global", { startsExpr: startsExpr2 }),
      keyof: kwLike("keyof", { startsExpr: startsExpr2 }),
      readonly: kwLike("readonly", { startsExpr: startsExpr2 }),
      unique: kwLike("unique", { startsExpr: startsExpr2 }),
      abstract: kwLike("abstract", { startsExpr: startsExpr2 }),
      declare: kwLike("declare", { startsExpr: startsExpr2 }),
      enum: kwLike("enum", { startsExpr: startsExpr2 }),
      module: kwLike("module", { startsExpr: startsExpr2 }),
      namespace: kwLike("namespace", { startsExpr: startsExpr2 }),
      interface: kwLike("interface", { startsExpr: startsExpr2 }),
      type: kwLike("type", { startsExpr: startsExpr2 })
    };
  }
}
var TS_SCOPE_OTHER = 1 << 20;
var TS_SCOPE_TS_MODULE = 1 << 21;
var BIND_KIND_VALUE = 1;
var BIND_KIND_TYPE = 2;
var BIND_SCOPE_VAR = 4;
var BIND_SCOPE_LEXICAL = 8;
var BIND_SCOPE_FUNCTION = 16;
var BIND_FLAGS_NONE = 64;
var BIND_FLAGS_CLASS = 128;
var BIND_FLAGS_TS_ENUM = 256;
var BIND_FLAGS_TS_CONST_ENUM = 512;
var BIND_FLAGS_TS_EXPORT_ONLY = 1024;
var BIND_CLASS = BIND_KIND_VALUE | BIND_KIND_TYPE | BIND_SCOPE_LEXICAL | BIND_FLAGS_CLASS;
var BIND_LEXICAL2 = BIND_KIND_VALUE | 0 | BIND_SCOPE_LEXICAL | 0;
var BIND_VAR2 = BIND_KIND_VALUE | 0 | BIND_SCOPE_VAR | 0;
var BIND_FUNCTION2 = BIND_KIND_VALUE | 0 | BIND_SCOPE_FUNCTION | 0;
var BIND_TS_INTERFACE = 0 | BIND_KIND_TYPE | 0 | BIND_FLAGS_CLASS;
var BIND_TS_TYPE = 0 | BIND_KIND_TYPE | 0 | 0;
var BIND_TS_ENUM = BIND_KIND_VALUE | BIND_KIND_TYPE | BIND_SCOPE_LEXICAL | BIND_FLAGS_TS_ENUM;
var BIND_TS_AMBIENT = 0 | 0 | 0 | BIND_FLAGS_TS_EXPORT_ONLY;
var BIND_NONE2 = 0 | 0 | 0 | BIND_FLAGS_NONE;
var BIND_OUTSIDE2 = BIND_KIND_VALUE | 0 | 0 | BIND_FLAGS_NONE;
var BIND_TS_CONST_ENUM = BIND_TS_ENUM | BIND_FLAGS_TS_CONST_ENUM;
var BIND_TS_NAMESPACE = 0 | 0 | 0 | BIND_FLAGS_TS_EXPORT_ONLY;
var CLASS_ELEMENT_FLAG_STATIC = 4;
var CLASS_ELEMENT_KIND_GETTER = 2;
var CLASS_ELEMENT_KIND_SETTER = 1;
var CLASS_ELEMENT_KIND_ACCESSOR = CLASS_ELEMENT_KIND_GETTER | CLASS_ELEMENT_KIND_SETTER;
var CLASS_ELEMENT_STATIC_GETTER = CLASS_ELEMENT_KIND_GETTER | CLASS_ELEMENT_FLAG_STATIC;
var CLASS_ELEMENT_STATIC_SETTER = CLASS_ELEMENT_KIND_SETTER | CLASS_ELEMENT_FLAG_STATIC;
var skipWhiteSpaceInLine = /(?:[^\S\n\r\u2028\u2029]|\/\/.*|\/\*.*?\*\/)*/y;
var skipWhiteSpaceToLineBreak = new RegExp(
  // Unfortunately JS doesn't support Perl's atomic /(?>pattern)/ or
  // possessive quantifiers, so we use a trick to prevent backtracking
  // when the look-ahead for line terminator fails.
  "(?=(" + // Capture the whitespace and comments that should be skipped inside
  // a look-ahead assertion, and then re-match the group as a unit.
  skipWhiteSpaceInLine.source + "))\\1" + // Look-ahead for either line terminator, start of multi-line comment,
  // or end of string.
  /(?=[\n\r\u2028\u2029]|\/\*(?!.*?\*\/)|$)/.source,
  "y"
  // sticky
);
var DestructuringErrors3 = class {
  constructor() {
    this.shorthandAssign = this.trailingComma = this.parenthesizedAssign = this.parenthesizedBind = this.doubleProto = -1;
  }
};
function resolvePrivateNameConflict(current2, element2) {
  let next = "true";
  if (element2.type === "MethodDefinition" && (element2.kind === "get" || element2.kind === "set")) {
    next = (element2.static ? "s" : "i") + element2.kind;
  }
  if (current2 === "iget" && next === "iset" || current2 === "iset" && next === "iget" || current2 === "sget" && next === "sset" || current2 === "sset" && next === "sget") {
    return [false, "true"];
  }
  if (!current2) return [false, next];
  return [true, current2];
}
function checkKeyName2(node, name) {
  const { computed, key } = node;
  return !computed && (key.type === "Identifier" && key.name === name || key.type === "Literal" && key.value === name);
}
var TypeScriptError = {
  AbstractMethodHasImplementation: ({ methodName }) => `Method '${methodName}' cannot have an implementation because it is marked abstract.`,
  AbstractPropertyHasInitializer: ({ propertyName }) => `Property '${propertyName}' cannot have an initializer because it is marked abstract.`,
  AccesorCannotDeclareThisParameter: "'get' and 'set' accessors cannot declare 'this' parameters.",
  AccesorCannotHaveTypeParameters: "An accessor cannot have type parameters.",
  CannotFindName: ({ name }) => `Cannot find name '${name}'.`,
  ClassMethodHasDeclare: "Class methods cannot have the 'declare' modifier.",
  ClassMethodHasReadonly: "Class methods cannot have the 'readonly' modifier.",
  ConstInitiailizerMustBeStringOrNumericLiteralOrLiteralEnumReference: "A 'const' initializer in an ambient context must be a string or numeric literal or literal enum reference.",
  ConstructorHasTypeParameters: "Type parameters cannot appear on a constructor declaration.",
  DeclareAccessor: ({ kind }) => `'declare' is not allowed in ${kind}ters.`,
  DeclareClassFieldHasInitializer: "Initializers are not allowed in ambient contexts.",
  DeclareFunctionHasImplementation: "An implementation cannot be declared in ambient contexts.",
  DuplicateAccessibilityModifier: (
    // `Accessibility modifier already seen: ${modifier}` would be more helpful.
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    (() => `Accessibility modifier already seen.`)
  ),
  DuplicateModifier: ({ modifier }) => `Duplicate modifier: '${modifier}'.`,
  // `token` matches the terminology used by typescript:
  // https://github.com/microsoft/TypeScript/blob/main/src/compiler/types.ts#L2915
  EmptyHeritageClauseType: ({ token }) => `'${token}' list cannot be empty.`,
  EmptyTypeArguments: "Type argument list cannot be empty.",
  EmptyTypeParameters: "Type parameter list cannot be empty.",
  ExpectedAmbientAfterExportDeclare: "'export declare' must be followed by an ambient declaration.",
  ImportAliasHasImportType: "An import alias can not use 'import type'.",
  IncompatibleModifiers: ({ modifiers }) => `'${modifiers[0]}' modifier cannot be used with '${modifiers[1]}' modifier.`,
  IndexSignatureHasAbstract: "Index signatures cannot have the 'abstract' modifier.",
  IndexSignatureHasAccessibility: ({ modifier }) => `Index signatures cannot have an accessibility modifier ('${modifier}').`,
  IndexSignatureHasDeclare: "Index signatures cannot have the 'declare' modifier.",
  IndexSignatureHasOverride: "'override' modifier cannot appear on an index signature.",
  IndexSignatureHasStatic: "Index signatures cannot have the 'static' modifier.",
  InitializerNotAllowedInAmbientContext: "Initializers are not allowed in ambient contexts.",
  InvalidModifierOnTypeMember: ({ modifier }) => `'${modifier}' modifier cannot appear on a type member.`,
  InvalidModifierOnTypeParameter: ({ modifier }) => `'${modifier}' modifier cannot appear on a type parameter.`,
  InvalidModifierOnTypeParameterPositions: ({ modifier }) => `'${modifier}' modifier can only appear on a type parameter of a class, interface or type alias.`,
  InvalidModifiersOrder: ({ orderedModifiers }) => `'${orderedModifiers[0]}' modifier must precede '${orderedModifiers[1]}' modifier.`,
  InvalidPropertyAccessAfterInstantiationExpression: "Invalid property access after an instantiation expression. You can either wrap the instantiation expression in parentheses, or delete the type arguments.",
  InvalidTupleMemberLabel: "Tuple members must be labeled with a simple identifier.",
  MissingInterfaceName: "'interface' declarations must be followed by an identifier.",
  NonAbstractClassHasAbstractMethod: "Abstract methods can only appear within an abstract class.",
  NonClassMethodPropertyHasAbstractModifer: "'abstract' modifier can only appear on a class, method, or property declaration.",
  OptionalTypeBeforeRequired: "A required element cannot follow an optional element.",
  OverrideNotInSubClass: "This member cannot have an 'override' modifier because its containing class does not extend another class.",
  PatternIsOptional: "A binding pattern parameter cannot be optional in an implementation signature.",
  PrivateElementHasAbstract: "Private elements cannot have the 'abstract' modifier.",
  PrivateElementHasAccessibility: ({ modifier }) => `Private elements cannot have an accessibility modifier ('${modifier}').`,
  PrivateMethodsHasAccessibility: ({ modifier }) => `Private methods cannot have an accessibility modifier ('${modifier}').`,
  ReadonlyForMethodSignature: "'readonly' modifier can only appear on a property declaration or index signature.",
  ReservedArrowTypeParam: "This syntax is reserved in files with the .mts or .cts extension. Add a trailing comma, as in `<T,>() => ...`.",
  ReservedTypeAssertion: "This syntax is reserved in files with the .mts or .cts extension. Use an `as` expression instead.",
  SetAccesorCannotHaveOptionalParameter: "A 'set' accessor cannot have an optional parameter.",
  SetAccesorCannotHaveRestParameter: "A 'set' accessor cannot have rest parameter.",
  SetAccesorCannotHaveReturnType: "A 'set' accessor cannot have a return type annotation.",
  SingleTypeParameterWithoutTrailingComma: ({ typeParameterName }) => `Single type parameter ${typeParameterName} should have a trailing comma. Example usage: <${typeParameterName},>.`,
  StaticBlockCannotHaveModifier: "Static class blocks cannot have any modifier.",
  TypeAnnotationAfterAssign: "Type annotations must come before default assignments, e.g. instead of `age = 25: number` use `age: number = 25`.",
  TypeImportCannotSpecifyDefaultAndNamed: "A type-only import can specify a default import or named bindings, but not both.",
  TypeModifierIsUsedInTypeExports: "The 'type' modifier cannot be used on a named export when 'export type' is used on its export statement.",
  TypeModifierIsUsedInTypeImports: "The 'type' modifier cannot be used on a named import when 'import type' is used on its import statement.",
  UnexpectedParameterModifier: "A parameter property is only allowed in a constructor implementation.",
  UnexpectedReadonly: "'readonly' type modifier is only permitted on array and tuple literal types.",
  GenericsEndWithComma: `Trailing comma is not allowed at the end of generics.`,
  UnexpectedTypeAnnotation: "Did not expect a type annotation here.",
  UnexpectedTypeCastInParameter: "Unexpected type cast in parameter position.",
  UnsupportedImportTypeArgument: "Argument in a type import must be a string literal.",
  UnsupportedParameterPropertyKind: "A parameter property may not be declared using a binding pattern.",
  UnsupportedSignatureParameterKind: ({ type }) => `Name in a signature must be an Identifier, ObjectPattern or ArrayPattern, instead got ${type}.`,
  LetInLexicalBinding: "'let' is not allowed to be used as a name in 'let' or 'const' declarations."
};
var DecoratorsError = {
  UnexpectedLeadingDecorator: "Leading decorators must be attached to a class declaration.",
  DecoratorConstructor: "Decorators can't be used with a constructor. Did you mean '@dec class { ... }'?",
  TrailingDecorator: "Decorators must be attached to a class element.",
  SpreadElementDecorator: `Decorators can't be used with SpreadElement`
};
function generateParseDecorators(Parse, acornTypeScript, acorn) {
  const { tokTypes: tt } = acorn;
  const { tokTypes } = acornTypeScript;
  return class ParseDecorators extends Parse {
    takeDecorators(node) {
      const decorators = this.decoratorStack[this.decoratorStack.length - 1];
      if (decorators.length) {
        node.decorators = decorators;
        this.resetStartLocationFromNode(node, decorators[0]);
        this.decoratorStack[this.decoratorStack.length - 1] = [];
      }
    }
    parseDecorators(allowExport) {
      const currentContextDecorators = this.decoratorStack[this.decoratorStack.length - 1];
      while (this.match(tokTypes.at)) {
        const decorator = this.parseDecorator();
        currentContextDecorators.push(decorator);
      }
      if (this.match(tt._export)) {
        if (!allowExport) {
          this.unexpected();
        }
      } else if (!this.canHaveLeadingDecorator()) {
        this.raise(this.start, DecoratorsError.UnexpectedLeadingDecorator);
      }
    }
    parseDecorator() {
      const node = this.startNode();
      this.next();
      this.decoratorStack.push([]);
      const startPos = this.start;
      const startLoc = this.startLoc;
      let expr;
      if (this.match(tt.parenL)) {
        const startPos2 = this.start;
        const startLoc2 = this.startLoc;
        this.next();
        expr = this.parseExpression();
        this.expect(tt.parenR);
        if (this.options.preserveParens) {
          let par = this.startNodeAt(startPos2, startLoc2);
          par.expression = expr;
          expr = this.finishNode(par, "ParenthesizedExpression");
        }
      } else {
        expr = this.parseIdent(false);
        while (this.eat(tt.dot)) {
          const node2 = this.startNodeAt(startPos, startLoc);
          node2.object = expr;
          node2.property = this.parseIdent(true);
          node2.computed = false;
          expr = this.finishNode(node2, "MemberExpression");
        }
      }
      node.expression = this.parseMaybeDecoratorArguments(expr);
      this.decoratorStack.pop();
      return this.finishNode(node, "Decorator");
    }
    parseMaybeDecoratorArguments(expr) {
      if (this.eat(tt.parenL)) {
        const node = this.startNodeAtNode(expr);
        node.callee = expr;
        node.arguments = this.parseExprList(tt.parenR, false);
        return this.finishNode(node, "CallExpression");
      }
      return expr;
    }
  };
}
var xhtml_default = {
  quot: '"',
  amp: "&",
  apos: "'",
  lt: "<",
  gt: ">",
  nbsp: "\xA0",
  iexcl: "\xA1",
  cent: "\xA2",
  pound: "\xA3",
  curren: "\xA4",
  yen: "\xA5",
  brvbar: "\xA6",
  sect: "\xA7",
  uml: "\xA8",
  copy: "\xA9",
  ordf: "\xAA",
  laquo: "\xAB",
  not: "\xAC",
  shy: "\xAD",
  reg: "\xAE",
  macr: "\xAF",
  deg: "\xB0",
  plusmn: "\xB1",
  sup2: "\xB2",
  sup3: "\xB3",
  acute: "\xB4",
  micro: "\xB5",
  para: "\xB6",
  middot: "\xB7",
  cedil: "\xB8",
  sup1: "\xB9",
  ordm: "\xBA",
  raquo: "\xBB",
  frac14: "\xBC",
  frac12: "\xBD",
  frac34: "\xBE",
  iquest: "\xBF",
  Agrave: "\xC0",
  Aacute: "\xC1",
  Acirc: "\xC2",
  Atilde: "\xC3",
  Auml: "\xC4",
  Aring: "\xC5",
  AElig: "\xC6",
  Ccedil: "\xC7",
  Egrave: "\xC8",
  Eacute: "\xC9",
  Ecirc: "\xCA",
  Euml: "\xCB",
  Igrave: "\xCC",
  Iacute: "\xCD",
  Icirc: "\xCE",
  Iuml: "\xCF",
  ETH: "\xD0",
  Ntilde: "\xD1",
  Ograve: "\xD2",
  Oacute: "\xD3",
  Ocirc: "\xD4",
  Otilde: "\xD5",
  Ouml: "\xD6",
  times: "\xD7",
  Oslash: "\xD8",
  Ugrave: "\xD9",
  Uacute: "\xDA",
  Ucirc: "\xDB",
  Uuml: "\xDC",
  Yacute: "\xDD",
  THORN: "\xDE",
  szlig: "\xDF",
  agrave: "\xE0",
  aacute: "\xE1",
  acirc: "\xE2",
  atilde: "\xE3",
  auml: "\xE4",
  aring: "\xE5",
  aelig: "\xE6",
  ccedil: "\xE7",
  egrave: "\xE8",
  eacute: "\xE9",
  ecirc: "\xEA",
  euml: "\xEB",
  igrave: "\xEC",
  iacute: "\xED",
  icirc: "\xEE",
  iuml: "\xEF",
  eth: "\xF0",
  ntilde: "\xF1",
  ograve: "\xF2",
  oacute: "\xF3",
  ocirc: "\xF4",
  otilde: "\xF5",
  ouml: "\xF6",
  divide: "\xF7",
  oslash: "\xF8",
  ugrave: "\xF9",
  uacute: "\xFA",
  ucirc: "\xFB",
  uuml: "\xFC",
  yacute: "\xFD",
  thorn: "\xFE",
  yuml: "\xFF",
  OElig: "\u0152",
  oelig: "\u0153",
  Scaron: "\u0160",
  scaron: "\u0161",
  Yuml: "\u0178",
  fnof: "\u0192",
  circ: "\u02C6",
  tilde: "\u02DC",
  Alpha: "\u0391",
  Beta: "\u0392",
  Gamma: "\u0393",
  Delta: "\u0394",
  Epsilon: "\u0395",
  Zeta: "\u0396",
  Eta: "\u0397",
  Theta: "\u0398",
  Iota: "\u0399",
  Kappa: "\u039A",
  Lambda: "\u039B",
  Mu: "\u039C",
  Nu: "\u039D",
  Xi: "\u039E",
  Omicron: "\u039F",
  Pi: "\u03A0",
  Rho: "\u03A1",
  Sigma: "\u03A3",
  Tau: "\u03A4",
  Upsilon: "\u03A5",
  Phi: "\u03A6",
  Chi: "\u03A7",
  Psi: "\u03A8",
  Omega: "\u03A9",
  alpha: "\u03B1",
  beta: "\u03B2",
  gamma: "\u03B3",
  delta: "\u03B4",
  epsilon: "\u03B5",
  zeta: "\u03B6",
  eta: "\u03B7",
  theta: "\u03B8",
  iota: "\u03B9",
  kappa: "\u03BA",
  lambda: "\u03BB",
  mu: "\u03BC",
  nu: "\u03BD",
  xi: "\u03BE",
  omicron: "\u03BF",
  pi: "\u03C0",
  rho: "\u03C1",
  sigmaf: "\u03C2",
  sigma: "\u03C3",
  tau: "\u03C4",
  upsilon: "\u03C5",
  phi: "\u03C6",
  chi: "\u03C7",
  psi: "\u03C8",
  omega: "\u03C9",
  thetasym: "\u03D1",
  upsih: "\u03D2",
  piv: "\u03D6",
  ensp: "\u2002",
  emsp: "\u2003",
  thinsp: "\u2009",
  zwnj: "\u200C",
  zwj: "\u200D",
  lrm: "\u200E",
  rlm: "\u200F",
  ndash: "\u2013",
  mdash: "\u2014",
  lsquo: "\u2018",
  rsquo: "\u2019",
  sbquo: "\u201A",
  ldquo: "\u201C",
  rdquo: "\u201D",
  bdquo: "\u201E",
  dagger: "\u2020",
  Dagger: "\u2021",
  bull: "\u2022",
  hellip: "\u2026",
  permil: "\u2030",
  prime: "\u2032",
  Prime: "\u2033",
  lsaquo: "\u2039",
  rsaquo: "\u203A",
  oline: "\u203E",
  frasl: "\u2044",
  euro: "\u20AC",
  image: "\u2111",
  weierp: "\u2118",
  real: "\u211C",
  trade: "\u2122",
  alefsym: "\u2135",
  larr: "\u2190",
  uarr: "\u2191",
  rarr: "\u2192",
  darr: "\u2193",
  harr: "\u2194",
  crarr: "\u21B5",
  lArr: "\u21D0",
  uArr: "\u21D1",
  rArr: "\u21D2",
  dArr: "\u21D3",
  hArr: "\u21D4",
  forall: "\u2200",
  part: "\u2202",
  exist: "\u2203",
  empty: "\u2205",
  nabla: "\u2207",
  isin: "\u2208",
  notin: "\u2209",
  ni: "\u220B",
  prod: "\u220F",
  sum: "\u2211",
  minus: "\u2212",
  lowast: "\u2217",
  radic: "\u221A",
  prop: "\u221D",
  infin: "\u221E",
  ang: "\u2220",
  and: "\u2227",
  or: "\u2228",
  cap: "\u2229",
  cup: "\u222A",
  int: "\u222B",
  there4: "\u2234",
  sim: "\u223C",
  cong: "\u2245",
  asymp: "\u2248",
  ne: "\u2260",
  equiv: "\u2261",
  le: "\u2264",
  ge: "\u2265",
  sub: "\u2282",
  sup: "\u2283",
  nsub: "\u2284",
  sube: "\u2286",
  supe: "\u2287",
  oplus: "\u2295",
  otimes: "\u2297",
  perp: "\u22A5",
  sdot: "\u22C5",
  lceil: "\u2308",
  rceil: "\u2309",
  lfloor: "\u230A",
  rfloor: "\u230B",
  lang: "\u2329",
  rang: "\u232A",
  loz: "\u25CA",
  spades: "\u2660",
  clubs: "\u2663",
  hearts: "\u2665",
  diams: "\u2666"
};
var hexNumber = /^[\da-fA-F]+$/;
var decimalNumber = /^\d+$/;
function getQualifiedJSXName(object) {
  if (!object) return object;
  if (object.type === "JSXIdentifier") return object.name;
  if (object.type === "JSXNamespacedName") return object.namespace.name + ":" + object.name.name;
  if (object.type === "JSXMemberExpression")
    return getQualifiedJSXName(object.object) + "." + getQualifiedJSXName(object.property);
}
function generateJsxParser(acorn, acornTypeScript, Parser3, jsxOptions) {
  const tt = acorn.tokTypes;
  const tok = acornTypeScript.tokTypes;
  const isNewLine2 = acorn.isNewLine;
  const isIdentifierChar2 = acorn.isIdentifierChar;
  const options2 = Object.assign(
    {
      allowNamespaces: true,
      allowNamespacedObjects: true
    },
    jsxOptions || {}
  );
  return class JsxParser extends Parser3 {
    // Reads inline JSX contents token.
    jsx_readToken() {
      let out = "", chunkStart = this.pos;
      for (; ; ) {
        if (this.pos >= this.input.length) this.raise(this.start, "Unterminated JSX contents");
        let ch = this.input.charCodeAt(this.pos);
        switch (ch) {
          case 60:
          // '<'
          case 123:
            if (this.pos === this.start) {
              if (ch === 60 && this.exprAllowed) {
                ++this.pos;
                return this.finishToken(tok.jsxTagStart);
              }
              return this.getTokenFromCode(ch);
            }
            out += this.input.slice(chunkStart, this.pos);
            return this.finishToken(tok.jsxText, out);
          case 38:
            out += this.input.slice(chunkStart, this.pos);
            out += this.jsx_readEntity();
            chunkStart = this.pos;
            break;
          case 62:
          // '>'
          case 125:
            this.raise(
              this.pos,
              "Unexpected token `" + this.input[this.pos] + "`. Did you mean `" + (ch === 62 ? "&gt;" : "&rbrace;") + '` or `{"' + this.input[this.pos] + '"}`?'
            );
          default:
            if (isNewLine2(ch)) {
              out += this.input.slice(chunkStart, this.pos);
              out += this.jsx_readNewLine(true);
              chunkStart = this.pos;
            } else {
              ++this.pos;
            }
        }
      }
    }
    jsx_readNewLine(normalizeCRLF) {
      let ch = this.input.charCodeAt(this.pos);
      let out;
      ++this.pos;
      if (ch === 13 && this.input.charCodeAt(this.pos) === 10) {
        ++this.pos;
        out = normalizeCRLF ? "\n" : "\r\n";
      } else {
        out = String.fromCharCode(ch);
      }
      if (this.options.locations) {
        ++this.curLine;
        this.lineStart = this.pos;
      }
      return out;
    }
    jsx_readString(quote) {
      let out = "", chunkStart = ++this.pos;
      for (; ; ) {
        if (this.pos >= this.input.length) this.raise(this.start, "Unterminated string constant");
        let ch = this.input.charCodeAt(this.pos);
        if (ch === quote) break;
        if (ch === 38) {
          out += this.input.slice(chunkStart, this.pos);
          out += this.jsx_readEntity();
          chunkStart = this.pos;
        } else if (isNewLine2(ch)) {
          out += this.input.slice(chunkStart, this.pos);
          out += this.jsx_readNewLine(false);
          chunkStart = this.pos;
        } else {
          ++this.pos;
        }
      }
      out += this.input.slice(chunkStart, this.pos++);
      return this.finishToken(tt.string, out);
    }
    jsx_readEntity() {
      let str = "", count3 = 0, entity;
      let ch = this.input[this.pos];
      if (ch !== "&") this.raise(this.pos, "Entity must start with an ampersand");
      let startPos = ++this.pos;
      while (this.pos < this.input.length && count3++ < 10) {
        ch = this.input[this.pos++];
        if (ch === ";") {
          if (str[0] === "#") {
            let value;
            if (str[1] === "x" || str[1] === "X") {
              str = str.substr(2);
              if (hexNumber.test(str)) value = parseInt(str, 16);
            } else {
              str = str.substr(1);
              if (decimalNumber.test(str)) value = parseInt(str, 10);
            }
            if (value !== void 0 && value <= 1114111) {
              entity = String.fromCodePoint(value);
            }
          } else if (Object.prototype.hasOwnProperty.call(xhtml_default, str)) {
            entity = xhtml_default[str];
          }
          break;
        }
        str += ch;
      }
      if (entity === void 0) {
        this.pos = startPos;
        return "&";
      }
      return entity;
    }
    // Read a JSX identifier (valid tag or attribute name).
    //
    // Optimized version since JSX identifiers can't contain
    // escape characters and so can be read as single slice.
    // Also assumes that first character was already checked
    // by isIdentifierStart in readToken.
    jsx_readWord() {
      let ch, start = this.pos;
      do {
        ch = this.input.charCodeAt(++this.pos);
      } while (isIdentifierChar2(ch) || ch === 45);
      return this.finishToken(tok.jsxName, this.input.slice(start, this.pos));
    }
    // Parse next token as JSX identifier
    jsx_parseIdentifier() {
      let node = this.startNode();
      if (this.type === tok.jsxName) node.name = this.value;
      else if (this.type.keyword) node.name = this.type.keyword;
      else this.unexpected();
      this.next();
      return this.finishNode(node, "JSXIdentifier");
    }
    // Parse namespaced identifier.
    jsx_parseNamespacedName() {
      let startPos = this.start, startLoc = this.startLoc;
      let name = this.jsx_parseIdentifier();
      if (!options2.allowNamespaces || !this.eat(tt.colon)) return name;
      var node = this.startNodeAt(startPos, startLoc);
      node.namespace = name;
      node.name = this.jsx_parseIdentifier();
      return this.finishNode(node, "JSXNamespacedName");
    }
    // Parses element name in any form - namespaced, member
    // or single identifier.
    jsx_parseElementName() {
      if (this.type === tok.jsxTagEnd) return "";
      let startPos = this.start, startLoc = this.startLoc;
      let node = this.jsx_parseNamespacedName();
      if (this.type === tt.dot && node.type === "JSXNamespacedName" && !options2.allowNamespacedObjects) {
        this.unexpected();
      }
      while (this.eat(tt.dot)) {
        let newNode = this.startNodeAt(startPos, startLoc);
        newNode.object = node;
        newNode.property = this.jsx_parseIdentifier();
        node = this.finishNode(newNode, "JSXMemberExpression");
      }
      return node;
    }
    // Parses any type of JSX attribute value.
    jsx_parseAttributeValue() {
      switch (this.type) {
        case tt.braceL:
          let node = this.jsx_parseExpressionContainer();
          if (node.expression.type === "JSXEmptyExpression")
            this.raise(node.start, "JSX attributes must only be assigned a non-empty expression");
          return node;
        case tok.jsxTagStart:
        case tt.string:
          return this.parseExprAtom();
        default:
          this.raise(this.start, "JSX value should be either an expression or a quoted JSX text");
      }
    }
    // JSXEmptyExpression is unique type since it doesn't actually parse anything,
    // and so it should start at the end of last read token (left brace) and finish
    // at the beginning of the next one (right brace).
    jsx_parseEmptyExpression() {
      let node = this.startNodeAt(this.lastTokEnd, this.lastTokEndLoc);
      return this.finishNodeAt(node, "JSXEmptyExpression", this.start, this.startLoc);
    }
    // Parses JSX expression enclosed into curly brackets.
    jsx_parseExpressionContainer() {
      let node = this.startNode();
      this.next();
      if (this.eat(tt.ellipsis)) {
        node.expression = this.parseExpression();
        this.expect(tt.braceR);
        return this.finishNode(node, "JSXSpreadChild");
      }
      node.expression = this.type === tt.braceR ? this.jsx_parseEmptyExpression() : this.parseExpression();
      this.expect(tt.braceR);
      return this.finishNode(node, "JSXExpressionContainer");
    }
    // Parses following JSX attribute name-value pair.
    jsx_parseAttribute() {
      let node = this.startNode();
      if (this.eat(tt.braceL)) {
        this.expect(tt.ellipsis);
        node.argument = this.parseMaybeAssign();
        this.expect(tt.braceR);
        return this.finishNode(node, "JSXSpreadAttribute");
      }
      node.name = this.jsx_parseNamespacedName();
      node.value = this.eat(tt.eq) ? this.jsx_parseAttributeValue() : null;
      return this.finishNode(node, "JSXAttribute");
    }
    // Parses JSX opening tag starting after '<'.
    jsx_parseOpeningElementAt(startPos, startLoc) {
      let node = this.startNodeAt(startPos, startLoc);
      node.attributes = [];
      let nodeName = this.jsx_parseElementName();
      if (nodeName) node.name = nodeName;
      while (this.type !== tt.slash && this.type !== tok.jsxTagEnd)
        node.attributes.push(this.jsx_parseAttribute());
      node.selfClosing = this.eat(tt.slash);
      this.expect(tok.jsxTagEnd);
      return this.finishNode(node, nodeName ? "JSXOpeningElement" : "JSXOpeningFragment");
    }
    // Parses JSX closing tag starting after '</'.
    jsx_parseClosingElementAt(startPos, startLoc) {
      let node = this.startNodeAt(startPos, startLoc);
      let nodeName = this.jsx_parseElementName();
      if (nodeName) node.name = nodeName;
      this.expect(tok.jsxTagEnd);
      return this.finishNode(node, nodeName ? "JSXClosingElement" : "JSXClosingFragment");
    }
    // Parses entire JSX element, including it's opening tag
    // (starting after '<'), attributes, contents and closing tag.
    jsx_parseElementAt(startPos, startLoc) {
      let node = this.startNodeAt(startPos, startLoc);
      let children = [];
      let openingElement = this.jsx_parseOpeningElementAt(startPos, startLoc);
      let closingElement = null;
      if (!openingElement.selfClosing) {
        contents: for (; ; ) {
          switch (this.type) {
            case tok.jsxTagStart:
              startPos = this.start;
              startLoc = this.startLoc;
              this.next();
              if (this.eat(tt.slash)) {
                closingElement = this.jsx_parseClosingElementAt(startPos, startLoc);
                break contents;
              }
              children.push(this.jsx_parseElementAt(startPos, startLoc));
              break;
            case tok.jsxText:
              children.push(this.parseExprAtom());
              break;
            case tt.braceL:
              children.push(this.jsx_parseExpressionContainer());
              break;
            default:
              this.unexpected();
          }
        }
        if (getQualifiedJSXName(closingElement.name) !== getQualifiedJSXName(openingElement.name)) {
          this.raise(
            closingElement.start,
            "Expected corresponding JSX closing tag for <" + getQualifiedJSXName(openingElement.name) + ">"
          );
        }
      }
      let fragmentOrElement = openingElement.name ? "Element" : "Fragment";
      node["opening" + fragmentOrElement] = openingElement;
      node["closing" + fragmentOrElement] = closingElement;
      node.children = children;
      if (this.type === tt.relational && this.value === "<") {
        this.raise(this.start, "Adjacent JSX elements must be wrapped in an enclosing tag");
      }
      return this.finishNode(node, "JSX" + fragmentOrElement);
    }
    // Parse JSX text
    jsx_parseText() {
      let node = this.parseLiteral(this.value);
      node.type = "JSXText";
      return node;
    }
    // Parses entire JSX element from current position.
    jsx_parseElement() {
      let startPos = this.start, startLoc = this.startLoc;
      this.next();
      return this.jsx_parseElementAt(startPos, startLoc);
    }
  };
}
function generateParseImportAssertions(Parse, acornTypeScript, acorn) {
  const { tokTypes } = acornTypeScript;
  const { tokTypes: tt } = acorn;
  return class ImportAttributes extends Parse {
    parseMaybeImportAttributes(node) {
      if (this.type === tt._with || this.type === tokTypes.assert) {
        this.next();
        const attributes = this.parseImportAttributes();
        if (attributes) {
          node.attributes = attributes;
        }
      }
    }
    parseImportAttributes() {
      this.expect(tt.braceL);
      const attrs = this.parseWithEntries();
      this.expect(tt.braceR);
      return attrs;
    }
    parseWithEntries() {
      const attrs = [];
      const attrNames = /* @__PURE__ */ new Set();
      do {
        if (this.type === tt.braceR) {
          break;
        }
        const node = this.startNode();
        let withionKeyNode;
        if (this.type === tt.string) {
          withionKeyNode = this.parseLiteral(this.value);
        } else {
          withionKeyNode = this.parseIdent(true);
        }
        this.next();
        node.key = withionKeyNode;
        if (attrNames.has(node.key.name)) {
          this.raise(this.pos, "Duplicated key in attributes");
        }
        attrNames.add(node.key.name);
        if (this.type !== tt.string) {
          this.raise(this.pos, "Only string is supported as an attribute value");
        }
        node.value = this.parseLiteral(this.value);
        attrs.push(this.finishNode(node, "ImportAttribute"));
      } while (this.eat(tt.comma));
      return attrs;
    }
  };
}
var parserCallbackNames = [
  "onToken",
  "onComment",
  "onInsertedSemicolon",
  "onTrailingComma"
];
function makeOutputBuffer() {
  return {
    _tag: "BufferedParserEvents",
    segments: []
  };
}
var emptyOutputBuffer = makeOutputBuffer();
function hasEvents(output) {
  return output.segments.length > 0;
}
var ParseEffects = class {
  constructor(options2, state) {
    this.options = options2;
    this.state = state;
    this.callbacks = {};
    this.callbackWrappers = {};
    this.frames = [];
    this.undoLog = [];
    this.hasCallbacks = this.captureCallbacks();
  }
  get active() {
    return this.frames.length > 0;
  }
  begin() {
    const frame2 = {
      _tag: "ParseEffectFrame",
      depth: this.frames.length,
      undoMark: this.undoLog.length,
      checkpoint: this.state?.capture()
    };
    this.frames.push(frame2);
    if (frame2.depth === 0 && this.hasCallbacks) {
      this.activateCallbacks();
    }
    return frame2;
  }
  commit(frame2) {
    this.close(frame2);
    const parent2 = this.currentFrame();
    if (parent2) {
      if (frame2.output) {
        this.appendOutput(this.outputFor(parent2), frame2.output);
      }
      return;
    }
    this.undoLog.length = frame2.undoMark;
    if (frame2.output) {
      this.flush(frame2.output);
    }
  }
  rollback(frame2) {
    this.close(frame2);
    this.unwind(frame2.undoMark);
    this.restore(frame2);
  }
  rollbackWithEvents(frame2) {
    this.close(frame2);
    this.unwind(frame2.undoMark);
    this.restore(frame2);
    return frame2.output ?? emptyOutputBuffer;
  }
  replay(events) {
    if (!hasEvents(events)) return;
    const frame2 = this.currentFrame();
    if (frame2) {
      this.appendOutput(this.outputFor(frame2), events);
      return;
    }
    this.flush(events);
  }
  set(target, key, value) {
    this.willSet(target, key);
    target[key] = value;
  }
  remove(target, key) {
    this.willSet(target, key);
    delete target[key];
  }
  append(target, value) {
    this.willAppend(target);
    target.push(value);
  }
  pop(target) {
    this.willMutateTail(target, 1);
    return target.pop();
  }
  truncate(target, length) {
    if (length < target.length) {
      this.willMutateTail(target, target.length - length);
    } else {
      this.willAppend(target);
    }
    target.length = length;
  }
  modify(target, key, f) {
    const [result, next] = f(target[key]);
    this.set(target, key, next);
    return result;
  }
  /**
   * Compatibility write barriers for mutations performed by inherited Acorn
   * methods. New plugin-owned mutations should prefer the active operations
   * above.
   */
  willAppend(target) {
    if (!this.active) return;
    this.undoLog.push({
      _tag: "ArrayLength",
      target,
      length: target.length
    });
  }
  willMutateTail(target, count3) {
    if (!this.active) return;
    const start = Math.max(0, target.length - count3);
    this.undoLog.push({
      _tag: "ArrayTail",
      target,
      start,
      values: target.slice(start)
    });
  }
  willSet(target, key) {
    if (!this.active) return;
    const record = target;
    this.undoLog.push({
      _tag: "Property",
      target: record,
      key,
      had: Object.prototype.hasOwnProperty.call(record, key),
      value: record[key]
    });
  }
  captureCallbacks() {
    let captured = false;
    for (const name of parserCallbackNames) {
      const callback = this.options[name];
      if (!callback) continue;
      captured = true;
      this.callbacks[name] = callback;
      this.callbackWrappers[name] = (...args) => {
        this.emit({
          name,
          args
        });
      };
    }
    return captured;
  }
  activateCallbacks() {
    for (const name of parserCallbackNames) {
      const callback = this.callbackWrappers[name];
      if (callback) {
        this.options[name] = callback;
      }
    }
  }
  deactivateCallbacks() {
    for (const name of parserCallbackNames) {
      const callback = this.callbacks[name];
      if (callback) {
        this.options[name] = callback;
      }
    }
  }
  emit(event) {
    const frame2 = this.currentFrame();
    if (!frame2) {
      this.invoke(event);
      return;
    }
    const segments = this.outputFor(frame2).segments;
    const tail = segments[segments.length - 1];
    if (Array.isArray(tail)) {
      tail.push(event);
    } else {
      segments.push([event]);
    }
  }
  appendOutput(target, output) {
    if (hasEvents(output)) {
      target.segments.push(output);
    }
  }
  outputFor(frame2) {
    return frame2.output ??= makeOutputBuffer();
  }
  flush(output) {
    const work = [];
    for (let i2 = output.segments.length - 1; i2 >= 0; i2--) {
      work.push(output.segments[i2]);
    }
    while (work.length > 0) {
      const segment = work.pop();
      if (Array.isArray(segment)) {
        for (const event of segment) {
          this.invoke(event);
        }
        continue;
      }
      for (let i2 = segment.segments.length - 1; i2 >= 0; i2--) {
        work.push(segment.segments[i2]);
      }
    }
  }
  invoke(event) {
    const callback = this.callbacks[event.name];
    callback?.apply(this.options, event.args);
  }
  currentFrame() {
    return this.frames[this.frames.length - 1];
  }
  close(frame2) {
    if (this.currentFrame() !== frame2 || frame2.depth !== this.frames.length - 1) {
      throw new Error("Parse effect scopes must be closed in order");
    }
    this.frames.pop();
    if (this.frames.length === 0 && this.hasCallbacks) {
      this.deactivateCallbacks();
    }
  }
  restore(frame2) {
    if (this.state) {
      this.state.restore(frame2.checkpoint);
    }
  }
  unwind(mark) {
    for (let i2 = this.undoLog.length - 1; i2 >= mark; i2--) {
      const entry = this.undoLog[i2];
      switch (entry._tag) {
        case "ArrayLength":
          if (entry.target.length < entry.length) {
            throw new Error("A parse effect shortened an append-only array");
          }
          entry.target.length = entry.length;
          break;
        case "ArrayTail":
          entry.target.length = entry.start;
          for (const value of entry.values) {
            entry.target.push(value);
          }
          break;
        case "Property":
          if (entry.had) {
            entry.target[entry.key] = entry.value;
          } else {
            delete entry.target[entry.key];
          }
          break;
      }
    }
    this.undoLog.length = mark;
  }
};
function restoreArrayMark(value, length, description) {
  if (value.length === length) {
    return value;
  }
  if (value.length < length) {
    throw new Error(`A parse branch shortened the ${description} below its checkpoint`);
  }
  value.length = length;
  return value;
}
function captureParserCheckpoint(parser) {
  return {
    lookahead: parser.getCurLookaheadState(),
    context: parser.context,
    contextLength: parser.context.length,
    scopeStack: parser.scopeStack,
    scopeStackLength: parser.scopeStack.length,
    importsStack: parser.importsStack,
    importsStackLength: parser.importsStack.length,
    labels: parser.labels,
    labelsLength: parser.labels.length,
    privateNameStack: parser.privateNameStack,
    privateNameStackLength: parser.privateNameStack.length,
    decoratorStack: parser.decoratorStack,
    decoratorStackLength: parser.decoratorStack.length,
    strict: parser.strict,
    potentialArrowAt: parser.potentialArrowAt,
    potentialArrowInForAwait: parser.potentialArrowInForAwait,
    yieldPos: parser.yieldPos,
    awaitPos: parser.awaitPos,
    awaitIdentPos: parser.awaitIdentPos,
    preValue: parser.preValue,
    preToken: parser.preToken,
    isLookahead: parser.isLookahead,
    isAmbientContext: parser.isAmbientContext,
    inAbstractClass: parser.inAbstractClass,
    inType: parser.inType,
    inDisallowConditionalTypesContext: parser.inDisallowConditionalTypesContext,
    maybeInArrowParameters: parser.maybeInArrowParameters,
    shouldParseArrowReturnType: parser.shouldParseArrowReturnType,
    shouldParseAsyncArrowReturnType: parser.shouldParseAsyncArrowReturnType,
    importOrExportOuterKind: parser.importOrExportOuterKind
  };
}
function restoreParserCheckpoint(parser, state) {
  parser.setLookaheadTokenState(state.lookahead);
  parser.context = restoreArrayMark(state.context, state.contextLength, "token context stack");
  parser.scopeStack = restoreArrayMark(state.scopeStack, state.scopeStackLength, "scope stack");
  parser.importsStack = restoreArrayMark(
    state.importsStack,
    state.importsStackLength,
    "import stack"
  );
  parser.labels = restoreArrayMark(state.labels, state.labelsLength, "label stack");
  parser.privateNameStack = restoreArrayMark(
    state.privateNameStack,
    state.privateNameStackLength,
    "private-name stack"
  );
  parser.decoratorStack = restoreArrayMark(
    state.decoratorStack,
    state.decoratorStackLength,
    "decorator stack"
  );
  parser.strict = state.strict;
  parser.potentialArrowAt = state.potentialArrowAt;
  parser.potentialArrowInForAwait = state.potentialArrowInForAwait;
  parser.yieldPos = state.yieldPos;
  parser.awaitPos = state.awaitPos;
  parser.awaitIdentPos = state.awaitIdentPos;
  parser.regexpState = null;
  parser.preValue = state.preValue;
  parser.preToken = state.preToken;
  parser.isLookahead = state.isLookahead;
  parser.isAmbientContext = state.isAmbientContext;
  parser.inAbstractClass = state.inAbstractClass;
  parser.inType = state.inType;
  parser.inDisallowConditionalTypesContext = state.inDisallowConditionalTypesContext;
  parser.maybeInArrowParameters = state.maybeInArrowParameters;
  parser.shouldParseArrowReturnType = state.shouldParseArrowReturnType;
  parser.shouldParseAsyncArrowReturnType = state.shouldParseAsyncArrowReturnType;
  parser.importOrExportOuterKind = state.importOrExportOuterKind;
}
function createParserStateAdapter(parser) {
  return {
    capture: () => captureParserCheckpoint(parser),
    restore: (state) => restoreParserCheckpoint(parser, state)
  };
}
function adaptParser(Parser3, config) {
  const tt = config.acornTokenTypes;
  const tsTokTypes = config.typeScriptTokenTypes;
  const scopeFlags = config.scope;
  const varScopeFlags = scopeFlags.SCOPE_TOP | scopeFlags.SCOPE_FUNCTION | scopeFlags.SCOPE_CLASS_STATIC_BLOCK;
  return class EffectAdapter extends Parser3 {
    constructor(options2, input3, startPos) {
      super(options2, input3, startPos);
      this.parseEffects = new ParseEffects(this.options, createParserStateAdapter(this));
    }
    overrideContext(context) {
      if (this.curContext() !== context) {
        this.parseEffects?.willMutateTail(this.context, 1);
      }
      return super.overrideContext(context);
    }
    takeDecorators(node) {
      const index = this.decoratorStack.length - 1;
      if (this.decoratorStack[index].length > 0) {
        this.parseEffects?.willSet(this.decoratorStack, String(index));
      }
      return super.takeDecorators(node);
    }
    parseDecorators(allowExport) {
      const decorators = this.decoratorStack[this.decoratorStack.length - 1];
      this.parseEffects?.willAppend(decorators);
      return super.parseDecorators(allowExport);
    }
    parseDecorator() {
      this.parseEffects?.willAppend(this.decoratorStack);
      return super.parseDecorator();
    }
    parseIdentNode() {
      const consumesKeywordContext = (this.type.keyword === "class" || this.type.keyword === "function") && (this.lastTokEnd !== this.lastTokStart + 1 || this.input.charCodeAt(this.lastTokStart) !== 46);
      if (consumesKeywordContext) {
        this.parseEffects?.willMutateTail(this.context, 1);
      }
      return super.parseIdentNode();
    }
    parseLabeledStatement(node, maybeName, expr, context) {
      for (let i2 = this.labels.length - 1; i2 >= 0; i2--) {
        const label = this.labels[i2];
        if (label.statementStart !== node.start) break;
        this.parseEffects?.willSet(label, "statementStart");
        this.parseEffects?.willSet(label, "kind");
      }
      this.parseEffects?.willAppend(this.labels);
      return super.parseLabeledStatement(node, maybeName, expr, context);
    }
    enterClassBody() {
      this.parseEffects?.willAppend(this.privateNameStack);
      return super.enterClassBody();
    }
    exitClassBody() {
      const parent2 = this.privateNameStack[this.privateNameStack.length - 2];
      if (parent2) {
        this.parseEffects?.willAppend(parent2.used);
      }
      this.parseEffects?.willMutateTail(this.privateNameStack, 1);
      return super.exitClassBody();
    }
    parsePrivateIdent() {
      if (this.options.checkPrivateFields && this.privateNameStack.length > 0) {
        const privateNames = this.privateNameStack[this.privateNameStack.length - 1];
        this.parseEffects?.willAppend(privateNames.used);
      }
      return super.parsePrivateIdent();
    }
    parseClassField(field) {
      this.parseEffects?.willSet(this.currentThisScope(), "inClassFieldInit");
      return super.parseClassField(field);
    }
    updateContext(prevType) {
      const { type } = this;
      const mutatesContext = type === tt.parenR || type === tt.braceR || type === tt.braceL || type === tt.dollarBraceL || type === tt.parenL || type === tt._function || type === tt._class || type === tt.colon || type === tt.backQuote || type === tt.star || type === tsTokTypes.jsxTagStart || type === tsTokTypes.jsxTagEnd || type === tt.slash && prevType === tsTokTypes.jsxTagStart;
      if (mutatesContext) {
        this.parseEffects?.willMutateTail(this.context, 2);
      }
      return super.updateContext(prevType);
    }
    enterScope(flags) {
      this.parseEffects?.willAppend(this.scopeStack);
      return super.enterScope(flags);
    }
    exitScope() {
      this.parseEffects?.willMutateTail(this.scopeStack, 1);
      return super.exitScope();
    }
    declareName(name, bindingType, pos) {
      const effects = this.parseEffects;
      if (effects?.active) {
        if (bindingType === scopeFlags.BIND_LEXICAL) {
          const scope = this.currentScope();
          effects.willAppend(scope.lexical);
          if (this.inModule && scope.flags & scopeFlags.SCOPE_TOP) {
            effects.willSet(this.undefinedExports, name);
          }
        } else if (bindingType === scopeFlags.BIND_SIMPLE_CATCH) {
          effects.willAppend(this.currentScope().lexical);
        } else if (bindingType === scopeFlags.BIND_FUNCTION) {
          effects.willAppend(this.currentScope().functions);
        } else {
          for (let i2 = this.scopeStack.length - 1; i2 >= 0; i2--) {
            const scope = this.scopeStack[i2];
            effects.willAppend(scope.var);
            if (this.inModule && scope.flags & scopeFlags.SCOPE_TOP) {
              effects.willSet(this.undefinedExports, name);
            }
            if (scope.flags & varScopeFlags) break;
          }
        }
      }
      return super.declareName(name, bindingType, pos);
    }
    checkLocalExport(id2) {
      this.parseEffects?.willSet(this.undefinedExports, id2.name);
      return super.checkLocalExport(id2);
    }
  };
}
var skipWhiteSpace2 = /(?:\s|\/\/.*|\/\*[^]*?\*\/)*/g;
function assert(x) {
  if (!x) {
    throw new Error("Assert fail");
  }
}
function tsIsClassAccessor(modifier) {
  return modifier === "accessor";
}
function tsIsVarianceAnnotations(modifier) {
  return modifier === "in" || modifier === "out";
}
var FUNC_STATEMENT2 = 1;
var FUNC_HANGING_STATEMENT2 = 2;
var FUNC_NULLABLE_ID2 = 4;
var acornScope = {
  SCOPE_TOP: 1,
  SCOPE_FUNCTION: 2,
  SCOPE_ASYNC: 4,
  SCOPE_GENERATOR: 8,
  SCOPE_ARROW: 16,
  SCOPE_SIMPLE_CATCH: 32,
  SCOPE_SUPER: 64,
  SCOPE_DIRECT_SUPER: 128,
  SCOPE_CLASS_STATIC_BLOCK: 256,
  SCOPE_VAR: 256,
  BIND_NONE: 0,
  // Not a binding
  BIND_VAR: 1,
  // Var-style binding
  BIND_LEXICAL: 2,
  // Let- or const-style binding
  BIND_FUNCTION: 3,
  // Function declaration
  BIND_SIMPLE_CATCH: 4,
  // Simple (identifier pattern) catch binding
  BIND_OUTSIDE: 5,
  // Special case for function names as bound inside the
  BIND_TS_TYPE: 6,
  BIND_TS_INTERFACE: 7,
  BIND_TS_NAMESPACE: 8 | 1024,
  // includes BIND_FLAGS_TS_EXPORT_ONLY for declaration merging
  BIND_FLAGS_TS_EXPORT_ONLY: 1024,
  BIND_FLAGS_TS_IMPORT: 4096,
  BIND_FLAGS_TS_ENUM: 256,
  BIND_FLAGS_TS_CONST_ENUM: 512,
  BIND_TS_ENUM: 2 | 256,
  BIND_TS_CONST_ENUM: 2 | 256 | 512,
  BIND_FLAGS_CLASS: 128
  // function
};
function functionFlags2(async, generator) {
  return acornScope.SCOPE_FUNCTION | (async ? acornScope.SCOPE_ASYNC : 0) | (generator ? acornScope.SCOPE_GENERATOR : 0);
}
function isPossiblyLiteralEnum(expression) {
  if (expression.type !== "MemberExpression") return false;
  const { computed, property } = expression;
  if (computed && (property.type !== "TemplateLiteral" || property.expressions.length > 0)) {
    return false;
  }
  return isUncomputedMemberExpressionChain(expression.object);
}
function isAmbientNumericUnaryExpression(expression) {
  return expression.type === "UnaryExpression" && (expression.operator === "-" || expression.operator === "+") && expression.argument.type === "Literal" && (typeof expression.argument.value === "number" || typeof expression.argument.value === "bigint");
}
function isUncomputedMemberExpressionChain(expression) {
  if (expression.type === "Identifier") return true;
  if (expression.type !== "MemberExpression") return false;
  if (expression.computed) return false;
  return isUncomputedMemberExpressionChain(expression.object);
}
function tsIsAccessModifier(modifier) {
  return modifier === "private" || modifier === "public" || modifier === "protected";
}
function tokenCanStartExpression(token) {
  return Boolean(token.startsExpr);
}
function nonNull(x) {
  if (x == null) {
    throw new Error(`Unexpected ${x} value.`);
  }
  return x;
}
function keywordTypeFromName(value) {
  switch (value) {
    case "any":
      return "TSAnyKeyword";
    case "boolean":
      return "TSBooleanKeyword";
    case "bigint":
      return "TSBigIntKeyword";
    case "never":
      return "TSNeverKeyword";
    case "number":
      return "TSNumberKeyword";
    case "object":
      return "TSObjectKeyword";
    case "string":
      return "TSStringKeyword";
    case "symbol":
      return "TSSymbolKeyword";
    case "undefined":
      return "TSUndefinedKeyword";
    case "unknown":
      return "TSUnknownKeyword";
    default:
      return void 0;
  }
}
function tsPlugin(options2) {
  const { dts = false } = options2 || {};
  const disallowAmbiguousJSXLike = !!options2?.jsx;
  return function(Parser3) {
    const _acorn = Parser3.acorn || acorn_exports;
    const acornTypeScript = generateAcornTypeScript(_acorn);
    const tt = _acorn.tokTypes;
    const keywordTypes = _acorn.keywordTypes;
    const isIdentifierStart2 = _acorn.isIdentifierStart;
    const lineBreak2 = _acorn.lineBreak;
    const isNewLine2 = _acorn.isNewLine;
    const tokContexts = _acorn.tokContexts;
    const isIdentifierChar2 = _acorn.isIdentifierChar;
    const {
      tokTypes,
      tokContexts: tsTokContexts,
      keywordsRegExp,
      tokenIsLiteralPropertyName,
      tokenIsTemplate,
      tokenIsTSDeclarationStart,
      tokenIsIdentifier,
      tokenIsKeywordOrIdentifier,
      tokenIsTSTypeOperator
    } = acornTypeScript;
    function nextLineBreak2(code, from, end = code.length) {
      for (let i2 = from; i2 < end; i2++) {
        let next = code.charCodeAt(i2);
        if (isNewLine2(next))
          return i2 < end - 1 && next === 13 && code.charCodeAt(i2 + 1) === 10 ? i2 + 2 : i2 + 1;
      }
      return -1;
    }
    Parser3 = generateParseDecorators(Parser3, acornTypeScript, _acorn);
    if (options2?.jsx) {
      Parser3 = generateJsxParser(
        _acorn,
        acornTypeScript,
        Parser3,
        typeof options2.jsx === "boolean" ? {} : options2.jsx
      );
    }
    Parser3 = generateParseImportAssertions(Parser3, acornTypeScript, _acorn);
    const EffectParser = adaptParser(Parser3, {
      acornTokenTypes: tt,
      typeScriptTokenTypes: tokTypes,
      scope: acornScope
    });
    class TypeScriptParser extends EffectParser {
      constructor(options22, input3, startPos) {
        super(options22, input3, startPos);
        this.preValue = null;
        this.preToken = null;
        this.isLookahead = false;
        this.isAmbientContext = false;
        this.inAbstractClass = false;
        this.inType = false;
        this.inDisallowConditionalTypesContext = false;
        this.maybeInArrowParameters = false;
        this.shouldParseArrowReturnType = void 0;
        this.shouldParseAsyncArrowReturnType = void 0;
        this.decoratorStack = [[]];
        this.importsStack = [[]];
        this.importOrExportOuterKind = void 0;
        this.tsParseConstModifier = (node) => {
          this.tsParseModifiers({
            modified: node,
            allowedModifiers: ["const"],
            // for better error recovery
            disallowedModifiers: ["in", "out"],
            errorTemplate: TypeScriptError.InvalidModifierOnTypeParameterPositions
          });
        };
        this.ecmaVersion = this.options.ecmaVersion;
      }
      // support in Class static
      static get acornTypeScript() {
        return acornTypeScript;
      }
      // support in runtime, get acornTypeScript be this
      get acornTypeScript() {
        return acornTypeScript;
      }
      getTokenFromCodeInType(code) {
        if (code === 62) {
          return this.finishOp(tt.relational, 1);
        }
        if (code === 60) {
          return this.finishOp(tt.relational, 1);
        }
        return super.getTokenFromCode(code);
      }
      readToken(code) {
        if (!this.inType) {
          let context = this.curContext();
          if (context === tsTokContexts.tc_expr) return this.jsx_readToken();
          if (context === tsTokContexts.tc_oTag || context === tsTokContexts.tc_cTag) {
            if (isIdentifierStart2(code)) return this.jsx_readWord();
            if (code == 62) {
              ++this.pos;
              return this.finishToken(tokTypes.jsxTagEnd);
            }
            if ((code === 34 || code === 39) && context == tsTokContexts.tc_oTag)
              return this.jsx_readString(code);
          }
          if (code === 60 && this.exprAllowed && this.input.charCodeAt(this.pos + 1) !== 33) {
            ++this.pos;
            if (options2?.jsx) {
              return this.finishToken(tokTypes.jsxTagStart);
            } else {
              return this.finishToken(tt.relational, "<");
            }
          }
        }
        return super.readToken(code);
      }
      getTokenFromCode(code) {
        if (this.inType) {
          return this.getTokenFromCodeInType(code);
        }
        if (code === 64) {
          ++this.pos;
          return this.finishToken(tokTypes.at);
        }
        return super.getTokenFromCode(code);
      }
      isAbstractClass() {
        return this.ts_isContextual(tokTypes.abstract) && this.lookahead().type === tt._class;
      }
      isDeclareClass() {
        if (!this.ts_isContextual(tokTypes.declare)) return false;
        const afterDeclare = this.nextTokenStart();
        if (this.isUnparsedContextual(afterDeclare, "class")) return true;
        if (!this.isUnparsedContextual(afterDeclare, "abstract")) return false;
        const afterAbstract = this.nextTokenStartSince(afterDeclare + "abstract".length);
        return this.isUnparsedContextual(afterAbstract, "class");
      }
      finishNode(node, type) {
        if (node.type !== "" && node.end !== 0) {
          return node;
        }
        return super.finishNode(node, type);
      }
      tryParse(fn) {
        const abortSignal = {};
        const frame2 = this.beginParseEffectScope();
        let node;
        try {
          node = fn(() => {
            throw abortSignal;
          });
        } catch (error) {
          const aborted = error === abortSignal;
          if (!aborted && !(error instanceof SyntaxError)) {
            this.parseEffects.rollback(frame2);
            throw error;
          }
          const failState = {
            events: this.parseEffects.rollbackWithEvents(frame2),
            selected: false
          };
          return aborted ? { node: null, error: null, thrown: false, aborted: true, failState } : {
            node: null,
            error,
            thrown: true,
            aborted: false,
            failState
          };
        }
        this.parseEffects.commit(frame2);
        return {
          node,
          error: null,
          thrown: false,
          aborted: false,
          failState: null
        };
      }
      setOptionalParametersError(refExpressionErrors, resultError) {
        refExpressionErrors.optionalParametersLoc = resultError?.loc ?? this.startLoc;
      }
      // used after we have finished parsing types
      reScan_lt_gt() {
        if (this.type === tt.relational) {
          this.pos -= 1;
          this.readToken_lt_gt(this.fullCharCodeAtPos());
        }
      }
      reScan_lt() {
        const { type } = this;
        if (type === tt.bitShift) {
          this.pos -= 2;
          this.finishOp(tt.relational, 1);
          return tt.relational;
        }
        return type;
      }
      resetEndLocation(node, endPos = this.lastTokEnd, endLoc = this.lastTokEndLoc) {
        node.end = endPos;
        node.loc.end = endLoc;
        if (this.options.ranges) node.range[1] = endPos;
      }
      startNodeAtNode(type) {
        return super.startNodeAt(type.start, type.loc.start);
      }
      nextTokenStart() {
        return this.nextTokenStartSince(this.pos);
      }
      tsHasSomeModifiers(member, modifiers) {
        return modifiers.some((modifier) => {
          if (tsIsAccessModifier(modifier)) {
            return member.accessibility === modifier;
          }
          return !!member[modifier];
        });
      }
      tsIsStartOfStaticBlocks() {
        return this.isContextual("static") && this.lookaheadCharCode() === 123;
      }
      tsCheckForInvalidTypeCasts(items) {
        items.forEach((node) => {
          if (node?.type === "TSTypeCastExpression") {
            this.raise(node.typeAnnotation.start, TypeScriptError.UnexpectedTypeAnnotation);
          }
        });
      }
      atPossibleAsyncArrow(base2) {
        return base2.type === "Identifier" && base2.name === "async" && this.lastTokEnd === base2.end && !this.canInsertSemicolon() && base2.end - base2.start === 5 && base2.start === this.potentialArrowAt;
      }
      tsIsIdentifier() {
        return tokenIsIdentifier(this.type);
      }
      tsTryParseTypeOrTypePredicateAnnotation() {
        return this.match(tt.colon) ? this.tsParseTypeOrTypePredicateAnnotation(tt.colon) : void 0;
      }
      tsTryParseGenericAsyncArrowFunction(startPos, startLoc, forInit) {
        if (!this.tsMatchLeftRelational()) {
          return void 0;
        }
        const oldMaybeInArrowParameters = this.maybeInArrowParameters;
        this.maybeInArrowParameters = true;
        const res = this.tsTryParseAndCatch(() => {
          const node = this.startNodeAt(startPos, startLoc);
          node.typeParameters = this.tsParseTypeParameters(this.tsParseConstModifier);
          super.parseFunctionParams(node);
          node.returnType = this.tsTryParseTypeOrTypePredicateAnnotation();
          this.expect(tt.arrow);
          return node;
        });
        this.maybeInArrowParameters = oldMaybeInArrowParameters;
        if (!res) {
          return void 0;
        }
        return this.parseArrowExpression(
          res,
          res.params,
          /* async */
          true,
          /* forInit */
          forInit
        );
      }
      // Used when parsing type arguments from ES productions, where the first token
      // has been created without state.inType. Thus we need to rescan the lt token.
      tsParseTypeArgumentsInExpression() {
        if (this.reScan_lt() !== tt.relational) {
          return void 0;
        }
        return this.tsParseTypeArguments(true);
      }
      tsInNoContext(cb) {
        const oldContext = this.context;
        this.context = [oldContext[0]];
        try {
          return cb();
        } finally {
          this.context = oldContext;
        }
      }
      tsTryParseTypeAnnotation() {
        return this.match(tt.colon) ? this.tsParseTypeAnnotation() : void 0;
      }
      isUnparsedContextual(nameStart, name) {
        const nameEnd = nameStart + name.length;
        if (this.input.slice(nameStart, nameEnd) === name) {
          const nextCh = this.input.charCodeAt(nameEnd);
          return !(isIdentifierChar2(nextCh) || // check if `nextCh is between 0xd800 - 0xdbff,
          // if `nextCh` is NaN, `NaN & 0xfc00` is 0, the function
          // returns true
          (nextCh & 64512) === 55296);
        }
        return false;
      }
      isAbstractConstructorSignature() {
        return this.ts_isContextual(tokTypes.abstract) && this.lookahead().type === tt._new;
      }
      nextTokenStartSince(pos) {
        skipWhiteSpace2.lastIndex = pos;
        return skipWhiteSpace2.test(this.input) ? skipWhiteSpace2.lastIndex : pos;
      }
      lookaheadCharCode() {
        return this.input.charCodeAt(this.nextTokenStart());
      }
      createLookaheadState() {
        this.value = null;
        this.context = [this.curContext()];
      }
      getCurLookaheadState() {
        return {
          endLoc: this.endLoc,
          lastTokEnd: this.lastTokEnd,
          lastTokStart: this.lastTokStart,
          lastTokStartLoc: this.lastTokStartLoc,
          pos: this.pos,
          value: this.value,
          type: this.type,
          exprAllowed: this.exprAllowed,
          start: this.start,
          end: this.end,
          context: this.context,
          startLoc: this.startLoc,
          lastTokEndLoc: this.lastTokEndLoc,
          curLine: this.curLine,
          lineStart: this.lineStart,
          containsEsc: this.containsEsc
        };
      }
      // Token-only restore. Callers handle `context` separately according to
      // whether they need checkpoint identity restoration or a detached copy.
      setLookaheadTokenState(state) {
        this.pos = state.pos;
        this.value = state.value;
        this.exprAllowed = state.exprAllowed;
        this.endLoc = state.endLoc;
        this.lastTokEnd = state.lastTokEnd;
        this.lastTokStart = state.lastTokStart;
        this.lastTokStartLoc = state.lastTokStartLoc;
        this.type = state.type;
        this.start = state.start;
        this.end = state.end;
        this.startLoc = state.startLoc;
        this.lastTokEndLoc = state.lastTokEndLoc;
        this.curLine = state.curLine;
        this.lineStart = state.lineStart;
        this.containsEsc = state.containsEsc;
      }
      setLookaheadState(state) {
        this.setLookaheadTokenState(state);
        this.context = state.context && state.context.slice();
      }
      beginParseEffectScope() {
        return this.parseEffects.begin();
      }
      selectTryParseResult(result) {
        const failedBranch = result.failState;
        if (!failedBranch) return;
        if (failedBranch.selected) {
          throw new Error("A parse branch result can only be selected once");
        }
        failedBranch.selected = true;
        this.parseEffects.replay(failedBranch.events);
      }
      // Utilities
      tsLookAhead(f) {
        const frame2 = this.beginParseEffectScope();
        try {
          return f();
        } finally {
          this.parseEffects.rollback(frame2);
        }
      }
      lookahead(number) {
        const oldState = this.getCurLookaheadState();
        const oldContext = this.context;
        const oldPreValue = this.preValue;
        const oldPreToken = this.preToken;
        const oldIsLookahead = this.isLookahead;
        try {
          this.createLookaheadState();
          this.isLookahead = true;
          if (number !== void 0) {
            for (let i2 = 0; i2 < number; i2++) {
              this.nextToken();
            }
          } else {
            this.nextToken();
          }
          return this.getCurLookaheadState();
        } finally {
          this.setLookaheadTokenState(oldState);
          this.context = oldContext;
          this.preValue = oldPreValue;
          this.preToken = oldPreToken;
          this.isLookahead = oldIsLookahead;
        }
      }
      readWord() {
        let word = this.readWord1();
        let type = tt.name;
        if (this.keywords.test(word)) {
          type = keywordTypes[word];
        } else if (new RegExp(keywordsRegExp).test(word)) {
          type = tokTypes[word];
        }
        return this.finishToken(type, word);
      }
      skipBlockComment() {
        let startLoc;
        if (!this.isLookahead) startLoc = this.options.onComment && this.curPosition();
        let start = this.pos, end = this.input.indexOf("*/", this.pos += 2);
        if (end === -1) this.raise(this.pos - 2, "Unterminated comment");
        this.pos = end + 2;
        if (this.options.locations) {
          for (let nextBreak, pos = start; (nextBreak = nextLineBreak2(this.input, pos, this.pos)) > -1; ) {
            ++this.curLine;
            pos = this.lineStart = nextBreak;
          }
        }
        if (this.isLookahead) return;
        if (this.options.onComment) {
          this.options.onComment(
            true,
            this.input.slice(start + 2, end),
            start,
            this.pos,
            startLoc,
            this.curPosition()
          );
        }
      }
      skipLineComment(startSkip) {
        let start = this.pos;
        let startLoc;
        if (!this.isLookahead) startLoc = this.options.onComment && this.curPosition();
        let ch = this.input.charCodeAt(this.pos += startSkip);
        while (this.pos < this.input.length && !isNewLine2(ch)) {
          ch = this.input.charCodeAt(++this.pos);
        }
        if (this.isLookahead) return;
        if (this.options.onComment) {
          this.options.onComment(
            false,
            this.input.slice(start + startSkip, this.pos),
            start,
            this.pos,
            startLoc,
            this.curPosition()
          );
        }
      }
      finishToken(type, val) {
        this.preValue = this.value;
        this.preToken = this.type;
        this.end = this.pos;
        if (this.options.locations) this.endLoc = this.curPosition();
        let prevType = this.type;
        this.type = type;
        this.value = val;
        if (!this.isLookahead) {
          this.updateContext(prevType);
        }
      }
      resetStartLocation(node, start, startLoc) {
        node.start = start;
        node.loc.start = startLoc;
        if (this.options.ranges) node.range[0] = start;
      }
      isLineTerminator() {
        return this.eat(tt.semi) || super.canInsertSemicolon();
      }
      hasFollowingLineBreak() {
        skipWhiteSpaceToLineBreak.lastIndex = this.end;
        return skipWhiteSpaceToLineBreak.test(this.input);
      }
      addExtra(node, key, value, enumerable = true) {
        if (!node) return;
        const extra = node.extra = node.extra || {};
        if (enumerable) {
          extra[key] = value;
        } else {
          Object.defineProperty(extra, key, { enumerable, value });
        }
      }
      /**
       * Test if current token is a literal property name
       * https://tc39.es/ecma262/#prod-LiteralPropertyName
       * LiteralPropertyName:
       *   IdentifierName
       *   StringLiteral
       *   NumericLiteral
       *   BigIntLiteral
       */
      isLiteralPropertyName() {
        return tokenIsLiteralPropertyName(this.type);
      }
      hasPrecedingLineBreak() {
        return lineBreak2.test(this.input.slice(this.lastTokEnd, this.start));
      }
      createIdentifier(node, name) {
        node.name = name;
        return this.finishNode(node, "Identifier");
      }
      /**
       * Reset the start location of node to the start location of locationNode
       */
      resetStartLocationFromNode(node, locationNode) {
        this.resetStartLocation(node, locationNode.start, locationNode.loc.start);
      }
      // This is used in flow and typescript plugin
      // Determine whether a parameter is a this param
      isThisParam(param) {
        return param.type === "Identifier" && param.name === "this";
      }
      isLookaheadContextual(name) {
        const next = this.nextTokenStart();
        return this.isUnparsedContextual(next, name);
      }
      /**
       * ts type isContextual
       * @param {TokenType} type
       * @param {TokenType} token
       * @returns {boolean}
       * */
      ts_type_isContextual(type, token) {
        return type === token && !this.containsEsc;
      }
      /**
       * ts isContextual
       * @param {TokenType} token
       * @returns {boolean}
       * */
      ts_isContextual(token) {
        return this.type === token && !this.containsEsc;
      }
      ts_isContextualWithState(state, token) {
        return state.type === token && !state.containsEsc;
      }
      isContextualWithState(keyword, state) {
        return state.type === tt.name && state.value === keyword && !state.containsEsc;
      }
      tsIsStartOfMappedType() {
        this.next();
        if (this.eat(tt.plusMin)) {
          return this.ts_isContextual(tokTypes.readonly);
        }
        if (this.ts_isContextual(tokTypes.readonly)) {
          this.next();
        }
        if (!this.match(tt.bracketL)) {
          return false;
        }
        this.next();
        if (!this.tsIsIdentifier()) {
          return false;
        }
        this.next();
        return this.match(tt._in);
      }
      tsInDisallowConditionalTypesContext(cb) {
        const oldInDisallowConditionalTypesContext = this.inDisallowConditionalTypesContext;
        this.inDisallowConditionalTypesContext = true;
        try {
          return cb();
        } finally {
          this.inDisallowConditionalTypesContext = oldInDisallowConditionalTypesContext;
        }
      }
      tsTryParseType() {
        return this.tsEatThenParseType(tt.colon);
      }
      /**
       * Whether current token matches given type
       *
       * @param {TokenType} type
       * @returns {boolean}
       * @memberof Tokenizer
       */
      match(type) {
        return this.type === type;
      }
      matchJsx(type) {
        return this.type === acornTypeScript.tokTypes[type];
      }
      ts_eatWithState(type, nextCount, state) {
        const targetType = state.type;
        if (type === targetType) {
          for (let i2 = 0; i2 < nextCount; i2++) {
            this.next();
          }
          return true;
        } else {
          return false;
        }
      }
      ts_eatContextualWithState(name, nextCount, state) {
        if (keywordsRegExp.test(name)) {
          if (this.ts_isContextualWithState(state, tokTypes[name])) {
            for (let i2 = 0; i2 < nextCount; i2++) {
              this.next();
            }
            return true;
          }
          return false;
        } else {
          if (!this.isContextualWithState(name, state)) return false;
          for (let i2 = 0; i2 < nextCount; i2++) {
            this.next();
          }
          return true;
        }
      }
      canHaveLeadingDecorator() {
        return this.match(tt._class) || this.isAbstractClass() || this.isDeclareClass();
      }
      eatContextual(name) {
        if (keywordsRegExp.test(name)) {
          if (this.ts_isContextual(tokTypes[name])) {
            this.next();
            return true;
          }
          return false;
        } else {
          return super.eatContextual(name);
        }
      }
      tsIsExternalModuleReference() {
        return this.isContextual("require") && this.lookaheadCharCode() === 40;
      }
      tsParseExternalModuleReference() {
        const node = this.startNode();
        this.expectContextual("require");
        this.expect(tt.parenL);
        if (!this.match(tt.string)) {
          this.unexpected();
        }
        node.expression = this.parseExprAtom();
        this.expect(tt.parenR);
        return this.finishNode(node, "TSExternalModuleReference");
      }
      tsParseEntityName(allowReservedWords = true) {
        let entity = this.parseIdent(allowReservedWords);
        while (this.eat(tt.dot)) {
          const node = this.startNodeAtNode(entity);
          node.left = entity;
          node.right = this.parseIdent(allowReservedWords);
          entity = this.finishNode(node, "TSQualifiedName");
        }
        return entity;
      }
      tsParseEnumMember() {
        const node = this.startNode();
        node.id = this.match(tt.string) ? this.parseLiteral(this.value) : this.parseIdent(
          /* liberal */
          true
        );
        if (this.eat(tt.eq)) {
          node.initializer = this.parseMaybeAssign();
        }
        return this.finishNode(node, "TSEnumMember");
      }
      tsParseEnumDeclaration(node, properties = {}) {
        if (properties.const) node.const = true;
        if (properties.declare) node.declare = true;
        this.expectContextual("enum");
        node.id = this.parseIdent();
        const bindingType = properties.const ? acornScope.BIND_TS_CONST_ENUM : acornScope.BIND_TS_ENUM;
        this.checkLValSimple(node.id, bindingType);
        this.expect(tt.braceL);
        node.members = this.tsParseDelimitedList("EnumMembers", this.tsParseEnumMember.bind(this));
        this.expect(tt.braceR);
        return this.finishNode(node, "TSEnumDeclaration");
      }
      tsParseModuleBlock() {
        const node = this.startNode();
        this.enterScope(TS_SCOPE_OTHER);
        this.expect(tt.braceL);
        node.body = [];
        while (this.type !== tt.braceR) {
          let stmt = this.parseStatement(null, true);
          node.body.push(stmt);
        }
        this.next();
        super.exitScope();
        return this.finishNode(node, "TSModuleBlock");
      }
      tsParseAmbientExternalModuleDeclaration(node) {
        if (this.ts_isContextual(tokTypes.global)) {
          node.global = true;
          node.id = this.parseIdent();
        } else if (this.match(tt.string)) {
          node.id = this.parseLiteral(this.value);
        } else {
          this.unexpected();
        }
        if (this.match(tt.braceL)) {
          this.enterScope(TS_SCOPE_TS_MODULE);
          node.body = this.tsParseModuleBlock();
          super.exitScope();
        } else {
          super.semicolon();
        }
        return this.finishNode(node, "TSModuleDeclaration");
      }
      tsTryParseDeclare(nany) {
        if (this.isLineTerminator()) {
          return;
        }
        let starttype = this.type;
        let kind;
        if (this.isContextual("let")) {
          starttype = tt._var;
          kind = "let";
        }
        return this.tsInAmbientContext(() => {
          if (starttype === tt._function) {
            nany.declare = true;
            return this.parseFunctionStatement(
              nany,
              /* async */
              false,
              /* declarationPosition */
              true
            );
          }
          if (starttype === tt._class) {
            nany.declare = true;
            return this.parseClass(nany, true);
          }
          if (starttype === tokTypes.enum) {
            return this.tsParseEnumDeclaration(nany, { declare: true });
          }
          if (starttype === tokTypes.global) {
            return this.tsParseAmbientExternalModuleDeclaration(nany);
          }
          if (starttype === tt._const || starttype === tt._var) {
            if (!this.match(tt._const) || !this.isLookaheadContextual("enum")) {
              nany.declare = true;
              return this.parseVarStatement(nany, kind || this.value, true);
            }
            this.expect(tt._const);
            return this.tsParseEnumDeclaration(nany, {
              const: true,
              declare: true
            });
          }
          if (starttype === tokTypes.interface) {
            const result = this.tsParseInterfaceDeclaration(nany, {
              declare: true
            });
            if (result) return result;
          }
          if (tokenIsIdentifier(starttype)) {
            return this.tsParseDeclaration(
              nany,
              this.value,
              /* next */
              true
            );
          }
        });
      }
      tsIsListTerminator(kind) {
        switch (kind) {
          case "EnumMembers":
          case "TypeMembers":
            return this.match(tt.braceR);
          case "HeritageClauseElement":
            return this.match(tt.braceL);
          case "TupleElementTypes":
            return this.match(tt.bracketR);
          case "TypeParametersOrArguments":
            return this.tsMatchRightRelational();
        }
      }
      /**
       * If !expectSuccess, returns undefined instead of failing to parse.
       * If expectSuccess, parseElement should always return a defined value.
       */
      tsParseDelimitedListWorker(kind, parseElement, expectSuccess, refTrailingCommaPos) {
        const result = [];
        let trailingCommaPos = -1;
        for (; ; ) {
          if (this.tsIsListTerminator(kind)) {
            break;
          }
          trailingCommaPos = -1;
          const element2 = parseElement();
          if (element2 == null) {
            return void 0;
          }
          result.push(element2);
          if (this.eat(tt.comma)) {
            trailingCommaPos = this.lastTokStart;
            continue;
          }
          if (this.tsIsListTerminator(kind)) {
            break;
          }
          if (expectSuccess) {
            this.expect(tt.comma);
          }
          return void 0;
        }
        if (refTrailingCommaPos) {
          refTrailingCommaPos.value = trailingCommaPos;
        }
        return result;
      }
      tsParseDelimitedList(kind, parseElement, refTrailingCommaPos) {
        return nonNull(
          this.tsParseDelimitedListWorker(
            kind,
            parseElement,
            /* expectSuccess */
            true,
            refTrailingCommaPos
          )
        );
      }
      tsParseBracketedList(kind, parseElement, bracket, skipFirstToken, refTrailingCommaPos) {
        if (!skipFirstToken) {
          if (bracket) {
            this.expect(tt.bracketL);
          } else {
            this.expect(tt.relational);
          }
        }
        const result = this.tsParseDelimitedList(kind, parseElement, refTrailingCommaPos);
        if (bracket) {
          this.expect(tt.bracketR);
        } else {
          this.expect(tt.relational);
        }
        return result;
      }
      tsParseTypeParameterName() {
        const typeName = this.parseIdent();
        return typeName.name;
      }
      tsEatThenParseType(token) {
        return !this.match(token) ? void 0 : this.tsNextThenParseType();
      }
      tsExpectThenParseType(token) {
        return this.tsDoThenParseType(() => this.expect(token));
      }
      tsNextThenParseType() {
        return this.tsDoThenParseType(() => this.next());
      }
      tsDoThenParseType(cb) {
        return this.tsInType(() => {
          cb();
          return this.tsParseType();
        });
      }
      tsSkipParameterStart() {
        if (tokenIsIdentifier(this.type) || this.match(tt._this)) {
          this.next();
          return true;
        }
        if (this.match(tt.braceL)) {
          try {
            this.parseObj(true);
            return true;
          } catch {
            return false;
          }
        }
        if (this.match(tt.bracketL)) {
          this.next();
          try {
            this.parseBindingList(tt.bracketR, true, true);
            return true;
          } catch {
            return false;
          }
        }
        return false;
      }
      tsIsUnambiguouslyStartOfFunctionType() {
        this.next();
        if (this.match(tt.parenR) || this.match(tt.ellipsis)) {
          return true;
        }
        if (this.tsSkipParameterStart()) {
          if (this.match(tt.colon) || this.match(tt.comma) || this.match(tt.question) || this.match(tt.eq)) {
            return true;
          }
          if (this.match(tt.parenR)) {
            this.next();
            if (this.match(tt.arrow)) {
              return true;
            }
          }
        }
        return false;
      }
      tsIsStartOfFunctionType() {
        if (this.tsMatchLeftRelational()) {
          return true;
        }
        return this.match(tt.parenL) && this.tsLookAhead(this.tsIsUnambiguouslyStartOfFunctionType.bind(this));
      }
      tsInAllowConditionalTypesContext(cb) {
        const oldInDisallowConditionalTypesContext = this.inDisallowConditionalTypesContext;
        this.inDisallowConditionalTypesContext = false;
        try {
          return cb();
        } finally {
          this.inDisallowConditionalTypesContext = oldInDisallowConditionalTypesContext;
        }
      }
      tsParseBindingListForSignature() {
        return super.parseBindingList(tt.parenR, true, true).map((pattern) => {
          if (pattern.type !== "Identifier" && pattern.type !== "RestElement" && pattern.type !== "ObjectPattern" && pattern.type !== "ArrayPattern") {
            this.raise(
              pattern.start,
              TypeScriptError.UnsupportedSignatureParameterKind({ type: pattern.type })
            );
          }
          return pattern;
        });
      }
      tsParseTypePredicateAsserts() {
        if (this.type !== tokTypes.asserts) {
          return false;
        }
        const containsEsc = this.containsEsc;
        this.next();
        if (!tokenIsIdentifier(this.type) && !this.match(tt._this)) {
          return false;
        }
        if (containsEsc) {
          this.raise(this.lastTokStart, "Escape sequence in keyword asserts");
        }
        return true;
      }
      tsParseThisTypeNode() {
        const node = this.startNode();
        this.next();
        return this.finishNode(node, "TSThisType");
      }
      tsParseTypeAnnotation(eatColon = true, t = this.startNode()) {
        this.tsInType(() => {
          if (eatColon) this.expect(tt.colon);
          t.typeAnnotation = this.tsParseType();
        });
        return this.finishNode(t, "TSTypeAnnotation");
      }
      tsParseThisTypePredicate(lhs) {
        this.next();
        const node = this.startNodeAtNode(lhs);
        node.parameterName = lhs;
        node.typeAnnotation = this.tsParseTypeAnnotation(
          /* eatColon */
          false
        );
        node.asserts = false;
        return this.finishNode(node, "TSTypePredicate");
      }
      tsParseThisTypeOrThisTypePredicate() {
        const thisKeyword = this.tsParseThisTypeNode();
        if (this.isContextual("is") && !this.hasPrecedingLineBreak()) {
          return this.tsParseThisTypePredicate(thisKeyword);
        } else {
          return thisKeyword;
        }
      }
      tsParseTypePredicatePrefix() {
        const id2 = this.parseIdent();
        if (this.isContextual("is") && !this.hasPrecedingLineBreak()) {
          this.next();
          return id2;
        }
      }
      tsParseTypeOrTypePredicateAnnotation(returnToken) {
        return this.tsInType(() => {
          const t = this.startNode();
          this.expect(returnToken);
          const node = this.startNode();
          const typePredicateVariable = this.tsIsIdentifier() && this.tsTryParse(this.tsParseTypePredicatePrefix.bind(this));
          if (typePredicateVariable) {
            const type2 = this.tsParseTypeAnnotation(
              /* eatColon */
              false
            );
            node.parameterName = typePredicateVariable;
            node.typeAnnotation = type2;
            node.asserts = false;
            t.typeAnnotation = this.finishNode(node, "TSTypePredicate");
            return this.finishNode(t, "TSTypeAnnotation");
          }
          const asserts = !!this.tsTryParse(this.tsParseTypePredicateAsserts.bind(this));
          if (asserts && this.match(tt._this)) {
            let thisTypePredicate = this.tsParseThisTypeOrThisTypePredicate();
            if (thisTypePredicate.type === "TSThisType") {
              node.parameterName = thisTypePredicate;
              node.asserts = true;
              node.typeAnnotation = null;
              thisTypePredicate = this.finishNode(node, "TSTypePredicate");
            } else {
              this.resetStartLocationFromNode(thisTypePredicate, node);
              thisTypePredicate.asserts = true;
            }
            t.typeAnnotation = thisTypePredicate;
            return this.finishNode(t, "TSTypeAnnotation");
          }
          const assertedTypePredicateVariable = asserts && this.tsIsIdentifier() && this.tsTryParse(this.tsParseTypePredicatePrefix.bind(this));
          if (!assertedTypePredicateVariable) {
            if (!asserts) {
              return this.tsParseTypeAnnotation(
                /* eatColon */
                false,
                t
              );
            }
            node.parameterName = this.parseIdent();
            node.asserts = asserts;
            node.typeAnnotation = null;
            t.typeAnnotation = this.finishNode(node, "TSTypePredicate");
            return this.finishNode(t, "TSTypeAnnotation");
          }
          const type = this.tsParseTypeAnnotation(
            /* eatColon */
            false
          );
          node.parameterName = assertedTypePredicateVariable;
          node.typeAnnotation = type;
          node.asserts = asserts;
          t.typeAnnotation = this.finishNode(node, "TSTypePredicate");
          return this.finishNode(t, "TSTypeAnnotation");
        });
      }
      // Note: In TypeScript implementation we must provide `yieldContext` and `awaitContext`,
      // but here it's always false, because this is only used for types.
      tsFillSignature(returnToken, signature) {
        const returnTokenRequired = returnToken === tt.arrow;
        const paramsKey = "parameters";
        const returnTypeKey = "typeAnnotation";
        signature.typeParameters = this.tsTryParseTypeParameters();
        this.expect(tt.parenL);
        signature[paramsKey] = this.tsParseBindingListForSignature();
        if (returnTokenRequired) {
          signature[returnTypeKey] = this.tsParseTypeOrTypePredicateAnnotation(returnToken);
        } else if (this.match(returnToken)) {
          signature[returnTypeKey] = this.tsParseTypeOrTypePredicateAnnotation(returnToken);
        }
      }
      tsTryNextParseConstantContext() {
        if (this.lookahead().type !== tt._const) return null;
        this.next();
        const typeReference = this.tsParseTypeReference();
        if (typeReference.typeParameters || typeReference.typeArguments) {
          this.raise(
            typeReference.typeName.start,
            TypeScriptError.CannotFindName({
              name: "const"
            })
          );
        }
        return typeReference;
      }
      tsParseFunctionOrConstructorType(type, abstract) {
        const node = this.startNode();
        if (type === "TSConstructorType") {
          node.abstract = !!abstract;
          if (abstract) this.next();
          this.next();
        }
        this.tsInAllowConditionalTypesContext(() => this.tsFillSignature(tt.arrow, node));
        return this.finishNode(node, type);
      }
      tsParseUnionOrIntersectionType(kind, parseConstituentType, operator) {
        const node = this.startNode();
        const hasLeadingOperator = this.eat(operator);
        const types2 = [];
        do {
          types2.push(parseConstituentType());
        } while (this.eat(operator));
        if (types2.length === 1 && !hasLeadingOperator) {
          return types2[0];
        }
        node.types = types2;
        return this.finishNode(node, kind);
      }
      tsCheckTypeAnnotationForReadOnly(node) {
        switch (node.typeAnnotation.type) {
          case "TSTupleType":
          case "TSArrayType":
            return;
          default:
            this.raise(node.start, TypeScriptError.UnexpectedReadonly);
        }
      }
      tsParseTypeOperator() {
        const node = this.startNode();
        const operator = this.value;
        this.next();
        node.operator = operator;
        node.typeAnnotation = this.tsParseTypeOperatorOrHigher();
        if (operator === "readonly") {
          this.tsCheckTypeAnnotationForReadOnly(node);
        }
        return this.finishNode(node, "TSTypeOperator");
      }
      tsParseConstraintForInferType() {
        if (this.eat(tt._extends)) {
          const constraint = this.tsInDisallowConditionalTypesContext(() => this.tsParseType());
          if (this.inDisallowConditionalTypesContext || !this.match(tt.question)) {
            return constraint;
          }
        }
      }
      tsParseInferType() {
        const node = this.startNode();
        this.expectContextual("infer");
        const typeParameter = this.startNode();
        typeParameter.name = this.tsParseTypeParameterName();
        typeParameter.constraint = this.tsTryParse(() => this.tsParseConstraintForInferType());
        node.typeParameter = this.finishNode(typeParameter, "TSTypeParameter");
        return this.finishNode(node, "TSInferType");
      }
      tsParseLiteralTypeNode() {
        const node = this.startNode();
        node.literal = (() => {
          switch (this.type) {
            case tt.num:
            // we don't need bigint type here
            // case tt.bigint:
            case tt.string:
            case tt._true:
            case tt._false:
              return this.parseExprAtom();
            default:
              this.unexpected();
          }
        })();
        return this.finishNode(node, "TSLiteralType");
      }
      tsParseImportType() {
        const node = this.startNode();
        this.expect(tt._import);
        this.expect(tt.parenL);
        if (!this.match(tt.string)) {
          this.raise(this.start, TypeScriptError.UnsupportedImportTypeArgument);
        }
        node.argument = this.parseExprAtom();
        this.expect(tt.parenR);
        if (this.eat(tt.dot)) {
          node.qualifier = this.tsParseEntityName();
        }
        if (this.tsMatchLeftRelational()) {
          node.typeArguments = this.tsParseTypeArguments();
        }
        return this.finishNode(node, "TSImportType");
      }
      tsParseTypeQuery() {
        const node = this.startNode();
        this.expect(tt._typeof);
        if (this.match(tt._import)) {
          node.exprName = this.tsParseImportType();
        } else {
          node.exprName = this.tsParseEntityName();
        }
        if (!this.hasPrecedingLineBreak() && this.tsMatchLeftRelational()) {
          node.typeArguments = this.tsParseTypeArguments();
        }
        return this.finishNode(node, "TSTypeQuery");
      }
      tsParseMappedTypeParameter() {
        const node = this.startNode();
        node.name = this.tsParseTypeParameterName();
        node.constraint = this.tsExpectThenParseType(tt._in);
        return this.finishNode(node, "TSTypeParameter");
      }
      tsParseMappedType() {
        const node = this.startNode();
        this.expect(tt.braceL);
        if (this.match(tt.plusMin)) {
          node.readonly = this.value;
          this.next();
          this.expectContextual("readonly");
        } else if (this.eatContextual("readonly")) {
          node.readonly = true;
        }
        this.expect(tt.bracketL);
        node.typeParameter = this.tsParseMappedTypeParameter();
        node.nameType = this.eatContextual("as") ? this.tsParseType() : null;
        this.expect(tt.bracketR);
        if (this.match(tt.plusMin)) {
          node.optional = this.value;
          this.next();
          this.expect(tt.question);
        } else if (this.eat(tt.question)) {
          node.optional = true;
        }
        node.typeAnnotation = this.tsTryParseType();
        this.semicolon();
        this.expect(tt.braceR);
        return this.finishNode(node, "TSMappedType");
      }
      tsParseTypeLiteral() {
        const node = this.startNode();
        node.members = this.tsParseObjectTypeMembers();
        return this.finishNode(node, "TSTypeLiteral");
      }
      tsIsTupleElementLabel() {
        if (!tokenIsKeywordOrIdentifier(this.type)) return false;
        const nextToken = this.lookahead();
        if (nextToken.type === tt.colon) return true;
        if (nextToken.type !== tt.question) return false;
        return this.lookahead(2).type === tt.colon;
      }
      tsParseTupleElementType() {
        const startLoc = this.startLoc;
        const startPos = this["start"];
        const rest = this.eat(tt.ellipsis);
        let type;
        if (this.tsIsTupleElementLabel()) {
          const labeledNode = this.startNode();
          labeledNode.label = this.parseIdent(true);
          labeledNode.optional = this.eat(tt.question);
          this.expect(tt.colon);
          labeledNode.elementType = this.tsParseType();
          type = this.finishNode(labeledNode, "TSNamedTupleMember");
        } else {
          type = this.tsParseType();
          const optional = this.eat(tt.question);
          if (this.eat(tt.colon)) {
            this.raise(type.start, TypeScriptError.InvalidTupleMemberLabel);
          }
          if (optional) {
            const optionalTypeNode = this.startNodeAtNode(type);
            optionalTypeNode.typeAnnotation = type;
            type = this.finishNode(optionalTypeNode, "TSOptionalType");
          }
        }
        if (rest) {
          const restNode = this.startNodeAt(startPos, startLoc);
          restNode.typeAnnotation = type;
          type = this.finishNode(restNode, "TSRestType");
        }
        return type;
      }
      tsParseTupleType() {
        const node = this.startNode();
        node.elementTypes = this.tsParseBracketedList(
          "TupleElementTypes",
          this.tsParseTupleElementType.bind(this),
          /* bracket */
          true,
          /* skipFirstToken */
          false
        );
        let seenOptionalElement = false;
        node.elementTypes.forEach((elementNode) => {
          const { type } = elementNode;
          if (seenOptionalElement && type !== "TSRestType" && type !== "TSOptionalType" && !(type === "TSNamedTupleMember" && elementNode.optional)) {
            this.raise(elementNode.start, TypeScriptError.OptionalTypeBeforeRequired);
          }
          seenOptionalElement ||= type === "TSNamedTupleMember" && elementNode.optional || type === "TSOptionalType";
          if (type === "TSRestType") {
            elementNode = elementNode.typeAnnotation;
          }
        });
        return this.finishNode(node, "TSTupleType");
      }
      tsParseTemplateLiteralType() {
        const node = this.startNode();
        node.literal = this.parseTemplate({ isTagged: false });
        return this.finishNode(node, "TSLiteralType");
      }
      tsParseTypeReference() {
        const node = this.startNode();
        node.typeName = this.tsParseEntityName();
        if (!this.hasPrecedingLineBreak() && this.tsMatchLeftRelational()) {
          node.typeArguments = this.tsParseTypeArguments();
        }
        return this.finishNode(node, "TSTypeReference");
      }
      tsMatchLeftRelational() {
        return this.match(tt.relational) && this.value === "<";
      }
      tsMatchRightRelational() {
        return this.match(tt.relational) && this.value === ">";
      }
      tsParseParenthesizedType() {
        const node = this.startNode();
        this.expect(tt.parenL);
        node.typeAnnotation = this.tsParseType();
        this.expect(tt.parenR);
        return this.finishNode(node, "TSParenthesizedType");
      }
      tsParseNonArrayType() {
        switch (this.type) {
          case tt.string:
          case tt.num:
          // we don't need bigint type here
          // case tt.bigint:
          case tt._true:
          case tt._false:
            return this.tsParseLiteralTypeNode();
          case tt.plusMin:
            if (this.value === "-") {
              const node = this.startNode();
              const nextToken = this.lookahead();
              if (nextToken.type !== tt.num) {
                this.unexpected();
              }
              node.literal = this.parseMaybeUnary();
              return this.finishNode(node, "TSLiteralType");
            }
            break;
          case tt._this:
            return this.tsParseThisTypeOrThisTypePredicate();
          case tt._typeof:
            return this.tsParseTypeQuery();
          case tt._import:
            return this.tsParseImportType();
          case tt.braceL:
            return this.tsLookAhead(this.tsIsStartOfMappedType.bind(this)) ? this.tsParseMappedType() : this.tsParseTypeLiteral();
          case tt.bracketL:
            return this.tsParseTupleType();
          case tt.parenL:
            return this.tsParseParenthesizedType();
          // parse template string here
          case tt.backQuote:
          case tt.dollarBraceL:
            return this.tsParseTemplateLiteralType();
          default: {
            const { type } = this;
            if (tokenIsKeywordOrIdentifier(type) || type === tt._void || type === tt._null) {
              const nodeType = type === tt._void ? "TSVoidKeyword" : type === tt._null ? "TSNullKeyword" : keywordTypeFromName(this.value);
              if (nodeType !== void 0 && this.lookaheadCharCode() !== 46) {
                const node = this.startNode();
                this.next();
                return this.finishNode(node, nodeType);
              }
              return this.tsParseTypeReference();
            }
          }
        }
        this.unexpected();
      }
      tsParseArrayTypeOrHigher() {
        let type = this.tsParseNonArrayType();
        while (!this.hasPrecedingLineBreak() && this.eat(tt.bracketL)) {
          if (this.match(tt.bracketR)) {
            const node = this.startNodeAtNode(type);
            node.elementType = type;
            this.expect(tt.bracketR);
            type = this.finishNode(node, "TSArrayType");
          } else {
            const node = this.startNodeAtNode(type);
            node.objectType = type;
            node.indexType = this.tsParseType();
            this.expect(tt.bracketR);
            type = this.finishNode(node, "TSIndexedAccessType");
          }
        }
        return type;
      }
      tsParseTypeOperatorOrHigher() {
        const isTypeOperator = tokenIsTSTypeOperator(this.type) && !this.containsEsc;
        return isTypeOperator ? this.tsParseTypeOperator() : this.isContextual("infer") ? this.tsParseInferType() : this.tsInAllowConditionalTypesContext(() => this.tsParseArrayTypeOrHigher());
      }
      tsParseIntersectionTypeOrHigher() {
        return this.tsParseUnionOrIntersectionType(
          "TSIntersectionType",
          this.tsParseTypeOperatorOrHigher.bind(this),
          tt.bitwiseAND
        );
      }
      tsParseUnionTypeOrHigher() {
        return this.tsParseUnionOrIntersectionType(
          "TSUnionType",
          this.tsParseIntersectionTypeOrHigher.bind(this),
          tt.bitwiseOR
        );
      }
      tsParseNonConditionalType() {
        if (this.tsIsStartOfFunctionType()) {
          return this.tsParseFunctionOrConstructorType("TSFunctionType");
        }
        if (this.match(tt._new)) {
          return this.tsParseFunctionOrConstructorType("TSConstructorType");
        } else if (this.isAbstractConstructorSignature()) {
          return this.tsParseFunctionOrConstructorType(
            "TSConstructorType",
            /* abstract */
            true
          );
        }
        return this.tsParseUnionTypeOrHigher();
      }
      /** Be sure to be in a type context before calling this, using `tsInType`. */
      tsParseType() {
        assert(this.inType);
        const type = this.tsParseNonConditionalType();
        if (this.inDisallowConditionalTypesContext || this.hasPrecedingLineBreak() || !this.eat(tt._extends)) {
          return type;
        }
        const node = this.startNodeAtNode(type);
        node.checkType = type;
        node.extendsType = this.tsInDisallowConditionalTypesContext(
          () => this.tsParseNonConditionalType()
        );
        this.expect(tt.question);
        node.trueType = this.tsInAllowConditionalTypesContext(() => this.tsParseType());
        this.expect(tt.colon);
        node.falseType = this.tsInAllowConditionalTypesContext(() => this.tsParseType());
        return this.finishNode(node, "TSConditionalType");
      }
      tsIsUnambiguouslyIndexSignature() {
        this.next();
        if (tokenIsIdentifier(this.type)) {
          this.next();
          return this.match(tt.colon);
        }
        return false;
      }
      /**
       * Runs `cb` in a type context.
       * This should be called one token *before* the first type token,
       * so that the call to `next()` is run in type context.
       */
      tsInType(cb) {
        const oldInType = this.inType;
        this.inType = true;
        try {
          return cb();
        } finally {
          this.inType = oldInType;
        }
      }
      tsTryParseIndexSignature(node) {
        if (!(this.match(tt.bracketL) && this.tsLookAhead(this.tsIsUnambiguouslyIndexSignature.bind(this)))) {
          return void 0;
        }
        this.expect(tt.bracketL);
        const id2 = this.parseIdent();
        id2.typeAnnotation = this.tsParseTypeAnnotation();
        this.resetEndLocation(id2);
        this.expect(tt.bracketR);
        node.parameters = [id2];
        const type = this.tsTryParseTypeAnnotation();
        if (type) node.typeAnnotation = type;
        this.tsParseTypeMemberSemicolon();
        return this.finishNode(node, "TSIndexSignature");
      }
      // for better error recover
      tsParseNoneModifiers(node) {
        this.tsParseModifiers({
          modified: node,
          allowedModifiers: [],
          disallowedModifiers: ["in", "out"],
          errorTemplate: TypeScriptError.InvalidModifierOnTypeParameterPositions
        });
      }
      tsParseTypeParameter(parseModifiers = this.tsParseNoneModifiers.bind(this)) {
        const node = this.startNode();
        parseModifiers(node);
        node.name = this.tsParseTypeParameterName();
        node.constraint = this.tsEatThenParseType(tt._extends);
        node.default = this.tsEatThenParseType(tt.eq);
        return this.finishNode(node, "TSTypeParameter");
      }
      tsParseTypeParameters(parseModifiers) {
        const node = this.startNode();
        if (this.tsMatchLeftRelational() || this.matchJsx("jsxTagStart")) {
          this.next();
        } else {
          this.unexpected();
        }
        const refTrailingCommaPos = { value: -1 };
        node.params = this.tsParseBracketedList(
          "TypeParametersOrArguments",
          this.tsParseTypeParameter.bind(this, parseModifiers),
          /* bracket */
          false,
          /* skipFirstToken */
          true,
          refTrailingCommaPos
        );
        if (node.params.length === 0) {
          this.raise(this.start, TypeScriptError.EmptyTypeParameters);
        }
        if (refTrailingCommaPos.value !== -1) {
          this.addExtra(node, "trailingComma", refTrailingCommaPos.value);
        }
        return this.finishNode(node, "TSTypeParameterDeclaration");
      }
      tsTryParseTypeParameters(parseModifiers) {
        if (this.tsMatchLeftRelational()) {
          return this.tsParseTypeParameters(parseModifiers);
        }
      }
      tsTryParse(f) {
        const frame2 = this.beginParseEffectScope();
        let result;
        try {
          result = f();
        } catch (error) {
          this.parseEffects.rollback(frame2);
          throw error;
        }
        if (result !== void 0 && result !== false) {
          this.parseEffects.commit(frame2);
          return result;
        }
        this.parseEffects.rollback(frame2);
        return void 0;
      }
      tsTokenCanFollowModifier() {
        return (this.match(tt.bracketL) || this.match(tt.braceL) || this.match(tt.star) || this.match(tt.ellipsis) || this.match(tt.privateId) || this.isLiteralPropertyName()) && !this.hasPrecedingLineBreak();
      }
      tsNextTokenCanFollowModifier() {
        this.next(true);
        return this.tsTokenCanFollowModifier();
      }
      /** Parses a modifier matching one the given modifier names. */
      tsParseModifier(allowedModifiers, stopOnStartOfClassStaticBlock) {
        const modifier = this.value;
        if (allowedModifiers.indexOf(modifier) !== -1 && !this.containsEsc) {
          if (stopOnStartOfClassStaticBlock && this.tsIsStartOfStaticBlocks()) {
            return void 0;
          }
          if (this.tsTryParse(this.tsNextTokenCanFollowModifier.bind(this))) {
            return modifier;
          }
        }
        return void 0;
      }
      tsParseModifiersByMap({
        modified,
        map: map2
      }) {
        for (const key of Object.keys(map2)) {
          modified[key] = map2[key];
        }
      }
      /** Parses a list of modifiers, in any order.
       *  If you need a specific order, you must call this function multiple times:
       *    this.tsParseModifiers({ modified: node, allowedModifiers: ['public'] });
       *    this.tsParseModifiers({ modified: node, allowedModifiers: ["abstract", "readonly"] });
       */
      tsParseModifiers({
        modified,
        allowedModifiers,
        disallowedModifiers,
        stopOnStartOfClassStaticBlock,
        errorTemplate = TypeScriptError.InvalidModifierOnTypeMember
      }) {
        const modifiedMap = {};
        const enforceOrder = (loc, modifier, before, after) => {
          if (modifier === before && modified[after]) {
            this.raise(
              loc.column,
              TypeScriptError.InvalidModifiersOrder({ orderedModifiers: [before, after] })
            );
          }
        };
        const incompatible = (loc, modifier, mod1, mod2) => {
          if (modified[mod1] && modifier === mod2 || modified[mod2] && modifier === mod1) {
            this.raise(
              loc.column,
              TypeScriptError.IncompatibleModifiers({ modifiers: [mod1, mod2] })
            );
          }
        };
        for (; ; ) {
          const startLoc = this.startLoc;
          const modifier = this.tsParseModifier(
            allowedModifiers.concat(disallowedModifiers ?? []),
            stopOnStartOfClassStaticBlock
          );
          if (!modifier) break;
          if (tsIsAccessModifier(modifier)) {
            if (modified.accessibility) {
              this.raise(this.start, TypeScriptError.DuplicateAccessibilityModifier());
            } else {
              enforceOrder(startLoc, modifier, modifier, "override");
              enforceOrder(startLoc, modifier, modifier, "static");
              enforceOrder(startLoc, modifier, modifier, "readonly");
              enforceOrder(startLoc, modifier, modifier, "accessor");
              modifiedMap.accessibility = modifier;
              modified["accessibility"] = modifier;
            }
          } else if (tsIsVarianceAnnotations(modifier)) {
            if (modified[modifier]) {
              this.raise(this.start, TypeScriptError.DuplicateModifier({ modifier }));
            } else {
              enforceOrder(startLoc, modifier, "in", "out");
              modifiedMap[modifier] = modifier;
              modified[modifier] = true;
            }
          } else if (tsIsClassAccessor(modifier)) {
            if (modified[modifier]) {
              this.raise(this.start, TypeScriptError.DuplicateModifier({ modifier }));
            } else {
              incompatible(startLoc, modifier, "accessor", "readonly");
              incompatible(startLoc, modifier, "accessor", "override");
              modifiedMap[modifier] = modifier;
              modified[modifier] = true;
            }
          } else if (modifier === "const") {
            if (modified[modifier]) {
              this.raise(this.start, TypeScriptError.DuplicateModifier({ modifier }));
            } else {
              modifiedMap[modifier] = modifier;
              modified[modifier] = true;
            }
          } else {
            if (Object.hasOwnProperty.call(modified, modifier)) {
              this.raise(this.start, TypeScriptError.DuplicateModifier({ modifier }));
            } else {
              enforceOrder(startLoc, modifier, "static", "readonly");
              enforceOrder(startLoc, modifier, "static", "override");
              enforceOrder(startLoc, modifier, "override", "readonly");
              enforceOrder(startLoc, modifier, "abstract", "override");
              incompatible(startLoc, modifier, "declare", "override");
              incompatible(startLoc, modifier, "static", "abstract");
              modifiedMap[modifier] = modifier;
              modified[modifier] = true;
            }
          }
          if (disallowedModifiers?.includes(modifier)) {
            this.raise(this.start, errorTemplate);
          }
        }
        return modifiedMap;
      }
      tsParseInOutModifiers(node) {
        this.tsParseModifiers({
          modified: node,
          allowedModifiers: ["in", "out"],
          disallowedModifiers: [
            "public",
            "private",
            "protected",
            "readonly",
            "declare",
            "abstract",
            "override"
          ],
          errorTemplate: TypeScriptError.InvalidModifierOnTypeParameter
        });
      }
      tsParseClassTypeParameterModifiers(node) {
        this.tsParseModifiers({
          modified: node,
          allowedModifiers: ["const", "in", "out"],
          disallowedModifiers: [
            "public",
            "private",
            "protected",
            "readonly",
            "declare",
            "abstract",
            "override"
          ],
          errorTemplate: TypeScriptError.InvalidModifierOnTypeParameter
        });
      }
      // Handle type assertions
      parseMaybeUnary(refExpressionErrors, sawUnary, incDec, forInit) {
        if (!options2?.jsx && this.tsMatchLeftRelational()) {
          return this.tsParseTypeAssertion();
        } else {
          return super.parseMaybeUnary(refExpressionErrors, sawUnary, incDec, forInit);
        }
      }
      tsParseTypeAssertion() {
        if (disallowAmbiguousJSXLike) {
          this.raise(this.start, TypeScriptError.ReservedTypeAssertion);
        }
        const result = this.tryParse(() => {
          const node = this.startNode();
          const _const = this.tsTryNextParseConstantContext();
          node.typeAnnotation = _const || this.tsNextThenParseType();
          this.expect(tt.relational);
          node.expression = this.parseMaybeUnary();
          return this.finishNode(node, "TSTypeAssertion");
        });
        if (result.error) {
          return this.tsParseTypeParameters(this.tsParseConstModifier);
        } else {
          return result.node;
        }
      }
      tsParseTypeArguments(inExpression = false) {
        const node = this.startNode();
        node.params = this.tsInType(
          () => (
            // Temporarily remove a JSX parsing context, which makes us scan different tokens.
            this.tsInNoContext(() => {
              this.expect(tt.relational);
              return this.tsParseDelimitedList(
                "TypeParametersOrArguments",
                this.tsParseType.bind(this)
              );
            })
          )
        );
        if (node.params.length === 0) {
          this.raise(this.start, TypeScriptError.EmptyTypeArguments);
        }
        if (inExpression && this.curContext() !== tsTokContexts.tc_oTag) {
          this.reScan_lt_gt();
        }
        if (!this.tsMatchRightRelational()) {
          this.unexpected();
        }
        this.exprAllowed = false;
        this.next();
        return this.finishNode(node, "TSTypeParameterInstantiation");
      }
      tsParseHeritageClause(token) {
        const originalStart = this.start;
        const delimitedList = this.tsParseDelimitedList("HeritageClauseElement", () => {
          const node = this.startNode();
          node.expression = this.tsParseEntityName();
          if (this.tsMatchLeftRelational()) {
            node.typeParameters = this.tsParseTypeArguments();
          }
          return this.finishNode(node, "TSExpressionWithTypeArguments");
        });
        if (!delimitedList.length) {
          this.raise(originalStart, TypeScriptError.EmptyHeritageClauseType({ token }));
        }
        return delimitedList;
      }
      tsParseTypeMemberSemicolon() {
        if (!this.eat(tt.comma) && !this.isLineTerminator()) {
          this.expect(tt.semi);
        }
      }
      tsTryParseAndCatch(f) {
        const result = this.tryParse(
          (abort) => (
            // @ts-expect-error todo(flow->ts)
            f() || abort()
          )
        );
        if (result.aborted || !result.node) return void 0;
        return result.node;
      }
      tsParseSignatureMember(kind, node) {
        this.tsFillSignature(tt.colon, node);
        this.tsParseTypeMemberSemicolon();
        return this.finishNode(node, kind);
      }
      tsParsePropertyOrMethodSignature(node, readonly) {
        if (this.eat(tt.question)) node.optional = true;
        const nodeAny = node;
        if (this.match(tt.parenL) || this.tsMatchLeftRelational()) {
          if (readonly) {
            this.raise(node.start, TypeScriptError.ReadonlyForMethodSignature);
          }
          const method = nodeAny;
          if (method.kind && this.tsMatchLeftRelational()) {
            this.raise(this.start, TypeScriptError.AccesorCannotHaveTypeParameters);
          }
          this.tsFillSignature(tt.colon, method);
          this.tsParseTypeMemberSemicolon();
          const paramsKey = "parameters";
          const returnTypeKey = "typeAnnotation";
          if (method.kind === "get") {
            if (method[paramsKey].length > 0) {
              this.raise(this.start, "A 'get' accesor must not have any formal parameters.");
              if (this.isThisParam(method[paramsKey][0])) {
                this.raise(this.start, TypeScriptError.AccesorCannotDeclareThisParameter);
              }
            }
          } else if (method.kind === "set") {
            if (method[paramsKey].length !== 1) {
              this.raise(this.start, "A 'get' accesor must not have any formal parameters.");
            } else {
              const firstParameter = method[paramsKey][0];
              if (this.isThisParam(firstParameter)) {
                this.raise(this.start, TypeScriptError.AccesorCannotDeclareThisParameter);
              }
              if (firstParameter.type === "Identifier" && firstParameter.optional) {
                this.raise(this.start, TypeScriptError.SetAccesorCannotHaveOptionalParameter);
              }
              if (firstParameter.type === "RestElement") {
                this.raise(this.start, TypeScriptError.SetAccesorCannotHaveRestParameter);
              }
            }
            if (method[returnTypeKey]) {
              this.raise(
                method[returnTypeKey].start,
                TypeScriptError.SetAccesorCannotHaveReturnType
              );
            }
          } else {
            method.kind = "method";
          }
          return this.finishNode(method, "TSMethodSignature");
        } else {
          const property = nodeAny;
          if (readonly) property.readonly = true;
          const type = this.tsTryParseTypeAnnotation();
          if (type) property.typeAnnotation = type;
          this.tsParseTypeMemberSemicolon();
          return this.finishNode(property, "TSPropertySignature");
        }
      }
      tsParseTypeMember() {
        const node = this.startNode();
        if (this.match(tt.parenL) || this.tsMatchLeftRelational()) {
          return this.tsParseSignatureMember("TSCallSignatureDeclaration", node);
        }
        if (this.match(tt._new)) {
          const id2 = this.startNode();
          this.next();
          if (this.match(tt.parenL) || this.tsMatchLeftRelational()) {
            return this.tsParseSignatureMember("TSConstructSignatureDeclaration", node);
          } else {
            node.key = this.createIdentifier(id2, "new");
            return this.tsParsePropertyOrMethodSignature(node, false);
          }
        }
        this.tsParseModifiers({
          modified: node,
          allowedModifiers: ["readonly"],
          disallowedModifiers: [
            "declare",
            "abstract",
            "private",
            "protected",
            "public",
            "static",
            "override"
          ]
        });
        const idx = this.tsTryParseIndexSignature(node);
        if (idx) {
          return idx;
        }
        this.parsePropertyName(node);
        if (!node.computed && node.key.type === "Identifier" && (node.key.name === "get" || node.key.name === "set") && this.tsTokenCanFollowModifier()) {
          node.kind = node.key.name;
          this.parsePropertyName(node);
        }
        return this.tsParsePropertyOrMethodSignature(node, !!node.readonly);
      }
      tsParseList(kind, parseElement) {
        const result = [];
        while (!this.tsIsListTerminator(kind)) {
          result.push(parseElement());
        }
        return result;
      }
      tsParseObjectTypeMembers() {
        this.expect(tt.braceL);
        const members = this.tsParseList("TypeMembers", this.tsParseTypeMember.bind(this));
        this.expect(tt.braceR);
        return members;
      }
      tsParseInterfaceDeclaration(node, properties = {}) {
        if (this.hasFollowingLineBreak()) return null;
        this.expectContextual("interface");
        if (properties.declare) node.declare = true;
        if (tokenIsIdentifier(this.type)) {
          node.id = this.parseIdent();
          this.checkLValSimple(node.id, acornScope.BIND_TS_INTERFACE);
          const scope = this.currentScope();
          this.maybeExportDefined(scope, node.id.name);
        } else {
          node.id = null;
          this.raise(this.start, TypeScriptError.MissingInterfaceName);
        }
        node.typeParameters = this.tsTryParseTypeParameters(this.tsParseInOutModifiers.bind(this));
        if (this.eat(tt._extends)) {
          node.extends = this.tsParseHeritageClause("extends");
        }
        const body2 = this.startNode();
        body2.body = this.tsParseInterfaceBody();
        node.body = this.finishNode(body2, "TSInterfaceBody");
        return this.finishNode(node, "TSInterfaceDeclaration");
      }
      /**
       * Parse interface body, ensuring the closing brace is read outside of type context
       * so that decorators following the interface are properly tokenized.
       */
      tsParseInterfaceBody() {
        this.expect(tt.braceL);
        const oldInType = this.inType;
        this.inType = true;
        let members = this.tsParseList("TypeMembers", this.tsParseTypeMember.bind(this));
        this.inType = oldInType;
        this.expect(tt.braceR);
        return members;
      }
      tsParseAbstractDeclaration(node) {
        if (this.match(tt._class)) {
          node.abstract = true;
          return this.parseClass(node, true);
        } else if (this.ts_isContextual(tokTypes.interface)) {
          if (!this.hasFollowingLineBreak()) {
            node.abstract = true;
            return this.tsParseInterfaceDeclaration(node);
          }
        } else {
          this.unexpected(node.start);
        }
      }
      tsIsDeclarationStart() {
        return tokenIsTSDeclarationStart(this.type);
      }
      tsParseExpressionStatement(node, expr) {
        switch (expr.name) {
          case "declare": {
            const declaration = this.tsTryParseDeclare(node);
            if (declaration) {
              declaration.declare = true;
              return declaration;
            }
            break;
          }
          case "global":
            if (this.match(tt.braceL)) {
              this.enterScope(TS_SCOPE_TS_MODULE);
              const mod = node;
              mod.global = true;
              mod.id = expr;
              mod.body = this.tsParseModuleBlock();
              super.exitScope();
              return this.finishNode(mod, "TSModuleDeclaration");
            }
            break;
          default:
            return this.tsParseDeclaration(
              node,
              expr.name,
              /* next */
              false
            );
        }
      }
      tsParseModuleReference() {
        return this.tsIsExternalModuleReference() ? this.tsParseExternalModuleReference() : this.tsParseEntityName(
          /* allowReservedWords */
          false
        );
      }
      tsIsExportDefaultSpecifier() {
        const { type } = this;
        const isAsync = this.isAsyncFunction();
        const isLet = this.isLet();
        if (tokenIsIdentifier(type)) {
          if (isAsync && !this.containsEsc || isLet) {
            return false;
          }
          if ((type === tokTypes.type || type === tokTypes.interface) && !this.containsEsc) {
            const ahead = this.lookahead();
            if (tokenIsIdentifier(ahead.type) && !this.isContextualWithState("from", ahead) || ahead.type === tt.braceL) {
              return false;
            }
          }
        } else if (!this.match(tt._default)) {
          return false;
        }
        const next = this.nextTokenStart();
        const hasFrom = this.isUnparsedContextual(next, "from");
        if (this.input.charCodeAt(next) === 44 || tokenIsIdentifier(this.type) && hasFrom) {
          return true;
        }
        if (this.match(tt._default) && hasFrom) {
          const nextAfterFrom = this.input.charCodeAt(this.nextTokenStartSince(next + 4));
          return nextAfterFrom === 34 || nextAfterFrom === 39;
        }
        return false;
      }
      tsInAmbientContext(cb) {
        const oldIsAmbientContext = this.isAmbientContext;
        this.isAmbientContext = true;
        try {
          return cb();
        } finally {
          this.isAmbientContext = oldIsAmbientContext;
        }
      }
      tsCheckLineTerminator(next) {
        if (next) {
          if (this.hasFollowingLineBreak()) return false;
          this.next();
          return true;
        }
        return !this.isLineTerminator();
      }
      tsParseModuleOrNamespaceDeclaration(node, nested = false) {
        node.id = this.parseIdent();
        if (!nested) {
          this.checkLValSimple(node.id, acornScope.BIND_TS_NAMESPACE);
        }
        if (this.eat(tt.dot)) {
          const inner = this.startNode();
          this.tsParseModuleOrNamespaceDeclaration(inner, true);
          node.body = inner;
        } else {
          this.enterScope(TS_SCOPE_TS_MODULE);
          node.body = this.tsParseModuleBlock();
          super.exitScope();
        }
        return this.finishNode(node, "TSModuleDeclaration");
      }
      checkLValSimple(expr, bindingType = acornScope.BIND_NONE, checkClashes) {
        while (expr.type === "TSNonNullExpression" || expr.type === "TSAsExpression" || expr.type === "TSSatisfiesExpression" || expr.type === "TSTypeAssertion") {
          expr = expr.expression;
        }
        return super.checkLValSimple(expr, bindingType, checkClashes);
      }
      isSimpleAssignTarget(expr) {
        while (expr.type === "TSNonNullExpression" || expr.type === "TSAsExpression" || expr.type === "TSSatisfiesExpression" || expr.type === "TSTypeAssertion") {
          expr = expr.expression;
        }
        return super.isSimpleAssignTarget(expr);
      }
      tsParseTypeAliasDeclaration(node) {
        node.id = this.parseIdent();
        this.checkLValSimple(node.id, acornScope.BIND_TS_TYPE);
        const scope = this.currentScope();
        this.maybeExportDefined(scope, node.id.name);
        node.typeAnnotation = this.tsInType(() => {
          node.typeParameters = this.tsTryParseTypeParameters(
            this.tsParseInOutModifiers.bind(this)
          );
          this.expect(tt.eq);
          if (this.ts_isContextual(tokTypes.interface) && this.lookahead().type !== tt.dot) {
            const node2 = this.startNode();
            this.next();
            return this.finishNode(node2, "TSIntrinsicKeyword");
          }
          return this.tsParseType();
        });
        this.semicolon();
        return this.finishNode(node, "TSTypeAliasDeclaration");
      }
      // Common to tsTryParseDeclare, tsTryParseExportDeclaration, and tsParseExpressionStatement.
      tsParseDeclaration(node, value, next) {
        switch (value) {
          case "abstract":
            if (this.tsCheckLineTerminator(next) && (this.match(tt._class) || tokenIsIdentifier(this.type))) {
              return this.tsParseAbstractDeclaration(node);
            }
            break;
          case "module":
            if (this.tsCheckLineTerminator(next)) {
              if (this.match(tt.string)) {
                return this.tsParseAmbientExternalModuleDeclaration(node);
              } else if (tokenIsIdentifier(this.type)) {
                return this.tsParseModuleOrNamespaceDeclaration(node);
              }
            }
            break;
          case "namespace":
            if (this.tsCheckLineTerminator(next) && tokenIsIdentifier(this.type)) {
              return this.tsParseModuleOrNamespaceDeclaration(node);
            }
            break;
          case "type":
            if (this.tsCheckLineTerminator(next) && tokenIsIdentifier(this.type)) {
              return this.tsParseTypeAliasDeclaration(node);
            }
            break;
        }
      }
      // Note: this won't b·e called unless the keyword is allowed in
      // `shouldParseExportDeclaration`.
      tsTryParseExportDeclaration() {
        return this.tsParseDeclaration(
          this.startNode(),
          this.value,
          /* next */
          true
        );
      }
      tsParseImportEqualsDeclaration(node, isExport) {
        node.isExport = isExport || false;
        node.id = this.parseIdent();
        this.checkLValSimple(node.id, acornScope.BIND_LEXICAL);
        super.expect(tt.eq);
        const moduleReference = this.tsParseModuleReference();
        if (node.importKind === "type" && moduleReference.type !== "TSExternalModuleReference") {
          this.raise(moduleReference.start, TypeScriptError.ImportAliasHasImportType);
        }
        node.moduleReference = moduleReference;
        super.semicolon();
        return this.finishNode(node, "TSImportEqualsDeclaration");
      }
      isExportDefaultSpecifier() {
        if (this.tsIsDeclarationStart()) return false;
        const { type } = this;
        if (tokenIsIdentifier(type)) {
          if (this.isContextual("async") || this.isContextual("let")) {
            return false;
          }
          if ((type === tokTypes.type || type === tokTypes.interface) && !this.containsEsc) {
            const ahead = this.lookahead();
            if (tokenIsIdentifier(ahead.type) && !this.isContextualWithState("from", ahead) || ahead.type === tt.braceL) {
              return false;
            }
          }
        } else if (!this.match(tt._default)) {
          return false;
        }
        const next = this.nextTokenStart();
        const hasFrom = this.isUnparsedContextual(next, "from");
        if (this.input.charCodeAt(next) === 44 || tokenIsIdentifier(this.type) && hasFrom) {
          return true;
        }
        if (this.match(tt._default) && hasFrom) {
          const nextAfterFrom = this.input.charCodeAt(this.nextTokenStartSince(next + 4));
          return nextAfterFrom === 34 || nextAfterFrom === 39;
        }
        return false;
      }
      parseTemplate({ isTagged = false } = {}) {
        let node = this.startNode();
        this.next();
        node.expressions = [];
        let curElt = this.parseTemplateElement({ isTagged });
        node.quasis = [curElt];
        while (!curElt.tail) {
          if (this.type === tt.eof) this.raise(this.pos, "Unterminated template literal");
          this.expect(tt.dollarBraceL);
          node.expressions.push(this.inType ? this.tsParseType() : this.parseExpression());
          this.expect(tt.braceR);
          node.quasis.push(curElt = this.parseTemplateElement({ isTagged }));
        }
        this.next();
        return this.finishNode(node, "TemplateLiteral");
      }
      parseFunction(node, statement, allowExpressionBody, isAsync, forInit) {
        this.initFunction(node);
        if (this.ecmaVersion >= 9 || this.ecmaVersion >= 6 && !isAsync) {
          if (this.type === tt.star && statement & FUNC_HANGING_STATEMENT2) {
            this.unexpected();
          }
          node.generator = this.eat(tt.star);
        }
        if (this.ecmaVersion >= 8) {
          node.async = !!isAsync;
        }
        if (statement & FUNC_STATEMENT2) {
          node.id = statement & FUNC_NULLABLE_ID2 && this.type !== tt.name ? null : this.parseIdent();
        }
        let oldYieldPos = this.yieldPos, oldAwaitPos = this.awaitPos, oldAwaitIdentPos = this.awaitIdentPos;
        const oldMaybeInArrowParameters = this.maybeInArrowParameters;
        this.maybeInArrowParameters = false;
        this.yieldPos = 0;
        this.awaitPos = 0;
        this.awaitIdentPos = 0;
        this.enterScope(functionFlags2(node.async, node.generator));
        if (!(statement & FUNC_STATEMENT2)) {
          node.id = this.type === tt.name ? this.parseIdent() : null;
        }
        this.parseFunctionParams(node);
        const isDeclaration = statement & FUNC_STATEMENT2;
        this.parseFunctionBody(node, allowExpressionBody, false, forInit, {
          isFunctionDeclaration: isDeclaration
        });
        if (isDeclaration && this.isAmbientContext && node.id) {
          const scope = this.currentScope();
          if (scope.flags & acornScope.SCOPE_TOP) {
            this.declareName(node.id.name, acornScope.BIND_FLAGS_TS_EXPORT_ONLY, node.id.start);
          }
        }
        this.yieldPos = oldYieldPos;
        this.awaitPos = oldAwaitPos;
        this.awaitIdentPos = oldAwaitIdentPos;
        if (statement & FUNC_STATEMENT2 && node.id && !(statement & FUNC_HANGING_STATEMENT2)) {
          if (node.body) {
            this.checkLValSimple(
              node.id,
              this.strict || node.generator || node.async ? this.treatFunctionsAsVar ? acornScope.BIND_VAR : acornScope.BIND_LEXICAL : acornScope.BIND_FUNCTION
            );
          } else {
            this.checkLValSimple(node.id, acornScope.BIND_NONE);
          }
        }
        this.maybeInArrowParameters = oldMaybeInArrowParameters;
        return this.finishNode(node, isDeclaration ? "FunctionDeclaration" : "FunctionExpression");
      }
      parseFunctionBody(node, isArrowFunction = false, isMethod = false, forInit = false, tsConfig) {
        if (this.match(tt.colon)) {
          node.returnType = this.tsParseTypeOrTypePredicateAnnotation(tt.colon);
        }
        const bodilessType = tsConfig?.isFunctionDeclaration ? "TSDeclareFunction" : tsConfig?.isClassMethod ? "TSDeclareMethod" : void 0;
        if (bodilessType && !this.match(tt.braceL) && this.isLineTerminator()) {
          this.exitScope();
          return this.finishNode(node, bodilessType);
        }
        if (bodilessType === "TSDeclareFunction" && this.isAmbientContext) {
          this.raise(node.start, TypeScriptError.DeclareFunctionHasImplementation);
          if (node.declare) {
            super.parseFunctionBody(node, isArrowFunction, isMethod, false);
            return this.finishNode(node, bodilessType);
          }
        }
        super.parseFunctionBody(node, isArrowFunction, isMethod, forInit);
        return node;
      }
      parseNew() {
        if (this.containsEsc) this.raiseRecoverable(this.start, "Escape sequence in keyword new");
        let node = this.startNode();
        let meta = this.parseIdent(true);
        if (this.ecmaVersion >= 6 && this.eat(tt.dot)) {
          node.meta = meta;
          let containsEsc = this.containsEsc;
          node.property = this.parseIdent(true);
          if (node.property.name !== "target")
            this.raiseRecoverable(
              node.property.start,
              "The only valid meta property for new is 'new.target'"
            );
          if (containsEsc)
            this.raiseRecoverable(node.start, "'new.target' must not contain escaped characters");
          if (!this["allowNewDotTarget"])
            this.raiseRecoverable(
              node.start,
              "'new.target' can only be used in functions and class static block"
            );
          return this.finishNode(node, "MetaProperty");
        }
        let startPos = this.start, startLoc = this.startLoc, isImport = this.type === tt._import;
        node.callee = this.parseSubscripts(this.parseExprAtom(), startPos, startLoc, true, false);
        if (isImport && node.callee.type === "ImportExpression") {
          this.raise(startPos, "Cannot use new with import()");
        }
        const { callee } = node;
        if (callee.type === "TSInstantiationExpression" && !callee.extra?.parenthesized) {
          node.typeArguments = callee.typeArguments;
          node.callee = callee.expression;
        }
        if (this.eat(tt.parenL))
          node.arguments = this.parseExprList(tt.parenR, this.ecmaVersion >= 8, false);
        else node.arguments = [];
        return this.finishNode(node, "NewExpression");
      }
      parseExprOp(left, leftStartPos, leftStartLoc, minPrec, forInit) {
        if (tt._in.binop > minPrec && !this.hasPrecedingLineBreak()) {
          let nodeType;
          if (this.isContextual("as")) {
            nodeType = "TSAsExpression";
          }
          if (this.isContextual("satisfies")) {
            nodeType = "TSSatisfiesExpression";
          }
          if (nodeType) {
            const node = this.startNodeAt(leftStartPos, leftStartLoc);
            node.expression = left;
            const _const = this.tsTryNextParseConstantContext();
            if (_const) {
              node.typeAnnotation = _const;
            } else {
              node.typeAnnotation = this.tsNextThenParseType();
            }
            this.finishNode(node, nodeType);
            this.reScan_lt_gt();
            return this.parseExprOp(node, leftStartPos, leftStartLoc, minPrec, forInit);
          }
        }
        return super.parseExprOp(left, leftStartPos, leftStartLoc, minPrec, forInit);
      }
      parseImportSpecifiers() {
        let nodes = [], first = true;
        if (acornTypeScript.tokenIsIdentifier(this.type)) {
          nodes.push(this.parseImportDefaultSpecifier());
          if (!this.eat(tt.comma)) return nodes;
        }
        if (this.type === tt.star) {
          nodes.push(this.parseImportNamespaceSpecifier());
          return nodes;
        }
        this.expect(tt.braceL);
        while (!this.eat(tt.braceR)) {
          if (!first) {
            this.expect(tt.comma);
            if (this.afterTrailingComma(tt.braceR)) break;
          } else first = false;
          nodes.push(this.parseImportSpecifier());
        }
        return nodes;
      }
      /**
       * @param {Node} node this may be ImportDeclaration |
       * TsImportEqualsDeclaration
       * @returns AnyImport
       * */
      parseImport(node) {
        let enterHead = this.lookahead();
        node.importKind = "value";
        this.importOrExportOuterKind = "value";
        if (tokenIsIdentifier(enterHead.type) || this.match(tt.star) || this.match(tt.braceL)) {
          let ahead = this.lookahead(2);
          if (
            // import type, { a } from "b";
            ahead.type !== tt.comma && // import type from "a";
            !this.isContextualWithState("from", ahead) && // import type = require("a");
            ahead.type !== tt.eq && this.ts_eatContextualWithState("type", 1, enterHead)
          ) {
            this.importOrExportOuterKind = "type";
            node.importKind = "type";
            enterHead = this.lookahead();
            ahead = this.lookahead(2);
          }
          if (tokenIsIdentifier(enterHead.type) && ahead.type === tt.eq) {
            this.next();
            const importNode = this.tsParseImportEqualsDeclaration(node);
            this.importOrExportOuterKind = "value";
            return importNode;
          }
        }
        this.next();
        if (this.type === tt.string) {
          node.specifiers = [];
          node.source = this.parseExprAtom();
        } else {
          node.specifiers = this.parseImportSpecifiers();
          this.expectContextual("from");
          node.source = this.type === tt.string ? this.parseExprAtom() : this.unexpected();
        }
        this.parseMaybeImportAttributes(node);
        this.semicolon();
        this.finishNode(node, "ImportDeclaration");
        this.importOrExportOuterKind = "value";
        if (node.importKind === "type" && node.specifiers.length > 1 && node.specifiers[0].type === "ImportDefaultSpecifier") {
          this.raise(node.start, TypeScriptError.TypeImportCannotSpecifyDefaultAndNamed);
        }
        return node;
      }
      parseExportDefaultDeclaration() {
        if (this.isAbstractClass()) {
          const cls = this.startNode();
          this.next();
          cls.abstract = true;
          return this.parseClass(cls, true);
        }
        if (this.match(tokTypes.interface)) {
          const result = this.tsParseInterfaceDeclaration(this.startNode());
          if (result) return result;
        }
        return super.parseExportDefaultDeclaration();
      }
      parseExportAllDeclaration(node, exports) {
        if (this.ecmaVersion >= 11) {
          if (this.eatContextual("as")) {
            node.exported = this.parseModuleExportName();
            this.checkExport(exports, node.exported, this.lastTokStart);
          } else {
            node.exported = null;
          }
        }
        this.expectContextual("from");
        if (this.type !== tt.string) this.unexpected();
        node.source = this.parseExprAtom();
        this.parseMaybeImportAttributes(node);
        this.semicolon();
        return this.finishNode(node, "ExportAllDeclaration");
      }
      parseDynamicImport(node) {
        this.next();
        node.source = this.parseMaybeAssign();
        if (this.eat(tt.comma)) {
          const expr = this.parseExpression();
          node.arguments = [expr];
        }
        if (!this.eat(tt.parenR)) {
          const errorPos = this.start;
          if (this.eat(tt.comma) && this.eat(tt.parenR)) {
            this.raiseRecoverable(errorPos, "Trailing comma is not allowed in import()");
          } else {
            this.unexpected(errorPos);
          }
        }
        return this.finishNode(node, "ImportExpression");
      }
      parseExport(node, exports) {
        let enterHead = this.lookahead();
        if (this.ts_eatWithState(tt._import, 2, enterHead)) {
          if (this.ts_isContextual(tokTypes.type) && this.lookaheadCharCode() !== 61) {
            node.importKind = "type";
            this.importOrExportOuterKind = "type";
            this.next();
          } else {
            node.importKind = "value";
            this.importOrExportOuterKind = "value";
          }
          const exportEqualsNode = this.tsParseImportEqualsDeclaration(
            node,
            /* isExport */
            true
          );
          this.importOrExportOuterKind = void 0;
          return exportEqualsNode;
        } else if (this.ts_eatWithState(tt.eq, 2, enterHead)) {
          const assign = node;
          assign.expression = this.parseExpression();
          this.semicolon();
          this.importOrExportOuterKind = void 0;
          return this.finishNode(assign, "TSExportAssignment");
        } else if (this.ts_eatContextualWithState("as", 2, enterHead)) {
          const decl = node;
          this.expectContextual("namespace");
          decl.id = this.parseIdent();
          this.semicolon();
          this.importOrExportOuterKind = void 0;
          return this.finishNode(decl, "TSNamespaceExportDeclaration");
        } else {
          const lookahead2 = this.lookahead(2).type;
          if (this.ts_isContextualWithState(enterHead, tokTypes.type) && (lookahead2 === tt.braceL || // export type { ... }
          lookahead2 === tt.star)) {
            this.next();
            this.importOrExportOuterKind = "type";
            node.exportKind = "type";
          } else {
            this.importOrExportOuterKind = "value";
            node.exportKind = "value";
          }
          this.next();
          if (this.eat(tt.star)) {
            return this.parseExportAllDeclaration(node, exports);
          }
          if (this.eat(tt._default)) {
            this.checkExport(exports, "default", this.lastTokStart);
            node.declaration = this.parseExportDefaultDeclaration();
            return this.finishNode(node, "ExportDefaultDeclaration");
          }
          if (this.shouldParseExportStatement()) {
            node.declaration = this.parseExportDeclaration(node);
            if (node.declaration.type === "VariableDeclaration")
              this.checkVariableExport(exports, node.declaration.declarations);
            else this.checkExport(exports, node.declaration.id, node.declaration.id.start);
            node.specifiers = [];
            node.source = null;
          } else {
            node.declaration = null;
            node.specifiers = this.parseExportSpecifiers(exports);
            if (this.eatContextual("from")) {
              if (this.type !== tt.string) this.unexpected();
              node.source = this.parseExprAtom();
              this.parseMaybeImportAttributes(node);
            } else {
              for (let spec of node.specifiers) {
                this.checkUnreserved(spec.local);
                this.checkLocalExport(spec.local);
                if (spec.local.type === "Literal") {
                  this.raise(
                    spec.local.start,
                    "A string literal cannot be used as an exported binding without `from`."
                  );
                }
              }
              node.source = null;
            }
            this.semicolon();
          }
          return this.finishNode(node, "ExportNamedDeclaration");
        }
      }
      checkExport(exports, name, _2) {
        if (!exports) {
          return;
        }
        if (typeof name !== "string") {
          name = name.type === "Identifier" ? name.name : name.value;
        }
        exports[name] = true;
      }
      parseMaybeDefault(startPos, startLoc, left) {
        const node = super.parseMaybeDefault(startPos, startLoc, left);
        if (node.type === "AssignmentPattern" && node.typeAnnotation && node.right.start < node.typeAnnotation.start) {
          this.raise(node.typeAnnotation.start, TypeScriptError.TypeAnnotationAfterAssign);
        }
        return node;
      }
      typeCastToParameter(node) {
        node.expression.typeAnnotation = node.typeAnnotation;
        this.resetEndLocation(
          node.expression,
          node.typeAnnotation.end,
          node.typeAnnotation.loc?.end
        );
        return node.expression;
      }
      toAssignableList(exprList, isBinding) {
        if (!exprList) exprList = [];
        for (let i2 = 0; i2 < exprList.length; i2++) {
          const expr = exprList[i2];
          if (expr?.type === "TSTypeCastExpression") {
            exprList[i2] = this.typeCastToParameter(expr);
          }
        }
        return super.toAssignableList(exprList, isBinding);
      }
      reportReservedArrowTypeParam(node) {
        if (node.params.length === 1 && !node.extra?.trailingComma && disallowAmbiguousJSXLike) {
          this.raise(node.start, TypeScriptError.ReservedArrowTypeParam);
        }
      }
      parseExprAtom(refDestructuringErrors, forInit, forNew) {
        if (this.type === tokTypes.jsxText) {
          return this.jsx_parseText();
        } else if (this.type === tokTypes.jsxTagStart) {
          return this.jsx_parseElement();
        } else if (this.type === tokTypes.at) {
          this.parseDecorators();
          return this.parseExprAtom();
        } else if (tokenIsIdentifier(this.type)) {
          let canBeArrow = this.potentialArrowAt === this.start;
          let startPos = this.start, startLoc = this.startLoc, containsEsc = this.containsEsc;
          let id2 = this.parseIdent(false);
          if (this.ecmaVersion >= 8 && !containsEsc && id2.name === "async" && !this.canInsertSemicolon() && this.eat(tt._function)) {
            this.overrideContext(tokContexts.f_expr);
            return this.parseFunction(
              this.startNodeAt(startPos, startLoc),
              0,
              false,
              true,
              forInit
            );
          }
          if (canBeArrow && !this.canInsertSemicolon()) {
            if (this.eat(tt.arrow))
              return this.parseArrowExpression(
                this.startNodeAt(startPos, startLoc),
                [id2],
                false,
                forInit
              );
            if (this.ecmaVersion >= 8 && id2.name === "async" && this.type === tt.name && !containsEsc && (!this.potentialArrowInForAwait || this.value !== "of" || this.containsEsc)) {
              id2 = this.parseIdent(false);
              if (this.canInsertSemicolon() || !this.eat(tt.arrow)) this.unexpected();
              return this.parseArrowExpression(
                this.startNodeAt(startPos, startLoc),
                [id2],
                true,
                forInit
              );
            }
          }
          return id2;
        } else {
          return super.parseExprAtom(refDestructuringErrors, forInit, forNew);
        }
      }
      parseExprAtomDefault() {
        if (tokenIsIdentifier(this.type)) {
          const canBeArrow = this["potentialArrowAt"] === this.start;
          const containsEsc = this.containsEsc;
          const id2 = this.parseIdent();
          if (!containsEsc && id2.name === "async" && !this.canInsertSemicolon()) {
            const { type } = this;
            if (type === tt._function) {
              this.next();
              return this.parseFunction(this.startNodeAtNode(id2), void 0, true, true);
            } else if (tokenIsIdentifier(type)) {
              if (this.lookaheadCharCode() === 61) {
                const paramId = this.parseIdent(false);
                if (this.canInsertSemicolon() || !this.eat(tt.arrow)) this.unexpected();
                return this.parseArrowExpression(this.startNodeAtNode(id2), [paramId], true);
              } else {
                return id2;
              }
            }
          }
          if (canBeArrow && this.match(tt.arrow) && !this.canInsertSemicolon()) {
            this.next();
            return this.parseArrowExpression(this.startNodeAtNode(id2), [id2], false);
          }
          return id2;
        } else {
          this.unexpected();
        }
      }
      parseIdentNode() {
        let node = this.startNode();
        if (tokenIsKeywordOrIdentifier(this.type) && // Taken from super-class method
        !((this.type.keyword === "class" || this.type.keyword === "function") && (this.lastTokEnd !== this.lastTokStart + 1 || this.input.charCodeAt(this.lastTokStart) !== 46))) {
          node.name = this.value;
        } else {
          return super.parseIdentNode();
        }
        return node;
      }
      parseVarStatement(node, kind, allowMissingInitializer = false) {
        const { isAmbientContext } = this;
        this.next();
        super.parseVar(node, false, kind, allowMissingInitializer || isAmbientContext);
        this.semicolon();
        const declaration = this.finishNode(node, "VariableDeclaration");
        if (!isAmbientContext) return declaration;
        for (const { id: id2, init } of declaration.declarations) {
          if (!init) continue;
          if (kind !== "const" || !!id2.typeAnnotation) {
            this.raise(init.start, TypeScriptError.InitializerNotAllowedInAmbientContext);
          } else if (init.type !== "Literal" && (init.type !== "TemplateLiteral" || init.expressions.length > 0) && !isAmbientNumericUnaryExpression(init) && !isPossiblyLiteralEnum(init)) {
            this.raise(
              init.start,
              TypeScriptError.ConstInitiailizerMustBeStringOrNumericLiteralOrLiteralEnumReference
            );
          }
        }
        return declaration;
      }
      parseStatement(context, topLevel, exports) {
        if (this.match(tokTypes.at)) {
          this.parseDecorators(true);
        }
        if (this.match(tt._const) && this.isLookaheadContextual("enum")) {
          const node = this.startNode();
          this.expect(tt._const);
          return this.tsParseEnumDeclaration(node, { const: true });
        }
        if (this.ts_isContextual(tokTypes.enum)) {
          return this.tsParseEnumDeclaration(this.startNode());
        }
        if (this.ts_isContextual(tokTypes.interface)) {
          const result = this.tsParseInterfaceDeclaration(this.startNode());
          if (result) return result;
        }
        return super.parseStatement(context, topLevel, exports);
      }
      // NOTE: unused function
      parseAccessModifier() {
        return this.tsParseModifier(["public", "protected", "private"]);
      }
      parsePostMemberNameModifiers(methodOrProp) {
        const optional = this.eat(tt.question);
        if (optional) methodOrProp.optional = true;
        if (methodOrProp.readonly && this.match(tt.parenL)) {
          this.raise(methodOrProp.start, TypeScriptError.ClassMethodHasReadonly);
        }
        if (methodOrProp.declare && this.match(tt.parenL)) {
          this.raise(methodOrProp.start, TypeScriptError.ClassMethodHasDeclare);
        }
      }
      // Note: The reason we do this in `parseExpressionStatement` and not `parseStatement`
      // is that e.g. `type()` is valid JS, so we must try parsing that first.
      // If it's really a type, we will parse `type` as the statement, and can correct it here
      // by parsing the rest.
      parseExpressionStatement(node, expr) {
        const decl = expr.type === "Identifier" ? this.tsParseExpressionStatement(node, expr) : void 0;
        return decl || super.parseExpressionStatement(node, expr);
      }
      shouldParseExportStatement() {
        if (this.tsIsDeclarationStart()) return true;
        if (this.match(tokTypes.at)) {
          return true;
        }
        return super.shouldParseExportStatement();
      }
      parseConditional(expr, startPos, startLoc, forInit, refDestructuringErrors) {
        if (this.eat(tt.question)) {
          let node = this.startNodeAt(startPos, startLoc);
          node.test = expr;
          node.consequent = this.parseMaybeAssign();
          this.expect(tt.colon);
          node.alternate = this.parseMaybeAssign(forInit);
          return this.finishNode(node, "ConditionalExpression");
        }
        return expr;
      }
      parseMaybeConditional(forInit, refDestructuringErrors) {
        let startPos = this.start, startLoc = this.startLoc;
        let expr = this.parseExprOps(forInit, refDestructuringErrors);
        if (this.checkExpressionErrors(refDestructuringErrors)) return expr;
        if (!this.maybeInArrowParameters || !this.match(tt.question)) {
          return this.parseConditional(expr, startPos, startLoc, forInit, refDestructuringErrors);
        }
        const result = this.tryParse(
          () => this.parseConditional(expr, startPos, startLoc, forInit, refDestructuringErrors)
        );
        if (!result.node) {
          if (result.error) {
            this.setOptionalParametersError(refDestructuringErrors, result.error);
          }
          return expr;
        }
        return result.node;
      }
      parseParenItem(node) {
        const startPos = this.start;
        const startLoc = this.startLoc;
        node = super.parseParenItem(node);
        if (this.eat(tt.question)) {
          node.optional = true;
          this.resetEndLocation(node);
        }
        if (this.match(tt.colon)) {
          const typeCastNode = this.startNodeAt(startPos, startLoc);
          typeCastNode.expression = node;
          typeCastNode.typeAnnotation = this.tsParseTypeAnnotation();
          return this.finishNode(typeCastNode, "TSTypeCastExpression");
        }
        return node;
      }
      parseExportDeclaration(node) {
        if (!this.isAmbientContext && this.ts_isContextual(tokTypes.declare)) {
          return this.tsInAmbientContext(() => this.parseExportDeclaration(node));
        }
        const startPos = this.start;
        const startLoc = this.startLoc;
        const isDeclare = this.eatContextual("declare");
        if (isDeclare && (this.ts_isContextual(tokTypes.declare) || !this.shouldParseExportStatement())) {
          this.raise(this.start, TypeScriptError.ExpectedAmbientAfterExportDeclare);
        }
        const isIdentifier = tokenIsIdentifier(this.type);
        const declaration = isIdentifier && this.tsTryParseExportDeclaration() || this.parseStatement(null);
        if (!declaration) return null;
        if (declaration.type === "TSInterfaceDeclaration" || declaration.type === "TSTypeAliasDeclaration" || isDeclare) {
          node.exportKind = "type";
        }
        if (isDeclare) {
          this.resetStartLocation(declaration, startPos, startLoc);
          declaration.declare = true;
        }
        return declaration;
      }
      parseClassId(node, isStatement) {
        if (!isStatement && this.isContextual("implements")) {
          return;
        }
        super.parseClassId(node, isStatement);
        const typeParameters = this.tsTryParseTypeParameters(
          this.tsParseClassTypeParameterModifiers.bind(this)
        );
        if (typeParameters) node.typeParameters = typeParameters;
      }
      parseClassPropertyAnnotation(node) {
        if (!node.optional) {
          if (this.value === "!" && this.eat(tt.prefix)) {
            node.definite = true;
          } else if (this.eat(tt.question)) {
            node.optional = true;
          }
        }
        const type = this.tsTryParseTypeAnnotation();
        if (type) node.typeAnnotation = type;
      }
      parseClassField(field) {
        const isPrivate = field.key.type === "PrivateIdentifier";
        if (isPrivate) {
          if (field.abstract) {
            this.raise(field.start, TypeScriptError.PrivateElementHasAbstract);
          }
          if (field.accessibility) {
            this.raise(
              field.start,
              TypeScriptError.PrivateElementHasAccessibility({
                modifier: field.accessibility
              })
            );
          }
          this.parseClassPropertyAnnotation(field);
        } else {
          this.parseClassPropertyAnnotation(field);
          if (this.isAmbientContext && !(field.readonly && !field.typeAnnotation) && this.match(tt.eq)) {
            this.raise(this.start, TypeScriptError.DeclareClassFieldHasInitializer);
          }
          if (field.abstract && this.match(tt.eq)) {
            const { key } = field;
            this.raise(
              this.start,
              TypeScriptError.AbstractPropertyHasInitializer({
                propertyName: key.type === "Identifier" && !field.computed ? key.name : `[${this.input.slice(key.start, key.end)}]`
              })
            );
          }
        }
        return super.parseClassField(field);
      }
      parseClassMethod(method, isGenerator, isAsync, allowsDirectSuper) {
        const isConstructor = method.kind === "constructor";
        const isPrivate = method.key.type === "PrivateIdentifier";
        const typeParameters = this.tsTryParseTypeParameters(this.tsParseConstModifier);
        if (isPrivate) {
          if (typeParameters) method.typeParameters = typeParameters;
          if (method.accessibility) {
            this.raise(
              method.start,
              TypeScriptError.PrivateMethodsHasAccessibility({
                modifier: method.accessibility
              })
            );
          }
        } else {
          if (typeParameters && isConstructor) {
            this.raise(typeParameters.start, TypeScriptError.ConstructorHasTypeParameters);
          }
        }
        const { declare = false, kind } = method;
        if (declare && (kind === "get" || kind === "set")) {
          this.raise(method.start, TypeScriptError.DeclareAccessor({ kind }));
        }
        if (typeParameters) method.typeParameters = typeParameters;
        const key = method.key;
        if (method.kind === "constructor") {
          if (isGenerator) this.raise(key.start, "Constructor can't be a generator");
          if (isAsync) this.raise(key.start, "Constructor can't be an async method");
        } else if (method.static && checkKeyName2(method, "prototype")) {
          this.raise(key.start, "Classes may not have a static property named prototype");
        }
        const value = method.value = this.parseMethod(
          isGenerator,
          isAsync,
          allowsDirectSuper,
          true,
          method
        );
        if (method.kind === "get" && value["params"].length !== 0)
          this.raiseRecoverable(value.start, "getter should have no params");
        if (method.kind === "set" && value["params"].length !== 1)
          this.raiseRecoverable(value.start, "setter should have exactly one param");
        if (method.kind === "set" && value["params"][0].type === "RestElement")
          this.raiseRecoverable(value["params"][0].start, "Setter cannot use rest params");
        return this.finishNode(method, "MethodDefinition");
      }
      isClassMethod() {
        return this.match(tt.relational);
      }
      parseClassElement(constructorAllowsSuper) {
        if (this.eat(tt.semi)) return null;
        let node = this.startNode();
        let keyName = "";
        let isGenerator = false;
        let isAsync = false;
        let kind = "method";
        let isStatic = false;
        const modifiers = [
          "declare",
          "private",
          "public",
          "protected",
          "accessor",
          "override",
          "abstract",
          "readonly",
          "static"
        ];
        const modifierMap = this.tsParseModifiers({
          modified: node,
          allowedModifiers: modifiers,
          disallowedModifiers: ["in", "out"],
          stopOnStartOfClassStaticBlock: true,
          errorTemplate: TypeScriptError.InvalidModifierOnTypeParameterPositions
        });
        isStatic = Boolean(modifierMap.static);
        const callParseClassMemberWithIsStatic = () => {
          if (this.tsIsStartOfStaticBlocks()) {
            this.next();
            this.next();
            if (this.tsHasSomeModifiers(node, modifiers)) {
              this.raise(this.start, TypeScriptError.StaticBlockCannotHaveModifier);
            }
            if (this.ecmaVersion >= 13) {
              super.parseClassStaticBlock(node);
              return node;
            }
          } else {
            const idx = this.tsTryParseIndexSignature(node);
            if (idx) {
              if (node.abstract) {
                this.raise(node.start, TypeScriptError.IndexSignatureHasAbstract);
              }
              if (node.accessibility) {
                this.raise(
                  node.start,
                  TypeScriptError.IndexSignatureHasAccessibility({
                    modifier: node.accessibility
                  })
                );
              }
              if (node.declare) {
                this.raise(node.start, TypeScriptError.IndexSignatureHasDeclare);
              }
              if (node.override) {
                this.raise(node.start, TypeScriptError.IndexSignatureHasOverride);
              }
              return idx;
            }
            if (!this.inAbstractClass && node.abstract) {
              this.raise(node.start, TypeScriptError.NonAbstractClassHasAbstractMethod);
            }
            if (node.override) {
              if (!constructorAllowsSuper) {
                this.raise(node.start, TypeScriptError.OverrideNotInSubClass);
              }
            }
            node.static = isStatic;
            if (isStatic) {
              if (!(this.isClassElementNameStart() || this.type === tt.star)) {
                keyName = "static";
              }
            }
            if (!keyName && this.ecmaVersion >= 8 && this.eatContextual("async")) {
              if ((this.isClassElementNameStart() || this.type === tt.star) && !this.canInsertSemicolon()) {
                isAsync = true;
              } else {
                keyName = "async";
              }
            }
            if (!keyName && (this.ecmaVersion >= 9 || !isAsync) && this.eat(tt.star)) {
              isGenerator = true;
            }
            if (!keyName && !isAsync && !isGenerator) {
              const lastValue = this.value;
              if (this.eatContextual("get") || this.eatContextual("set")) {
                if (this.isClassElementNameStart()) {
                  kind = lastValue;
                } else {
                  keyName = lastValue;
                }
              }
            }
            if (keyName) {
              node.computed = false;
              node.key = this.startNodeAt(this.lastTokStart, this.lastTokStartLoc);
              node.key.name = keyName;
              this.finishNode(node.key, "Identifier");
            } else {
              this.parseClassElementName(node);
            }
            this.parsePostMemberNameModifiers(node);
            if (this.isClassMethod() || this.ecmaVersion < 13 || this.type === tt.parenL || kind !== "method" || isGenerator || isAsync) {
              const isConstructor = !node.static && checkKeyName2(node, "constructor");
              const allowsDirectSuper = isConstructor && constructorAllowsSuper;
              if (isConstructor && kind !== "method")
                this.raise(node.key.start, "Constructor can't have get/set modifier");
              node.kind = isConstructor ? "constructor" : kind;
              this.parseClassMethod(node, isGenerator, isAsync, allowsDirectSuper);
            } else {
              this.parseClassField(node);
            }
            return node;
          }
        };
        if (node.declare) {
          this.tsInAmbientContext(callParseClassMemberWithIsStatic);
        } else {
          callParseClassMemberWithIsStatic();
        }
        return node;
      }
      isClassElementNameStart() {
        if (this.tsIsIdentifier()) {
          return true;
        }
        return super.isClassElementNameStart();
      }
      parseClassSuper(node) {
        super.parseClassSuper(node);
        if (node.superClass && (this.tsMatchLeftRelational() || this.match(tt.bitShift))) {
          node.superTypeParameters = this.tsParseTypeArgumentsInExpression();
        }
        if (this.eatContextual("implements")) {
          node.implements = this.tsParseHeritageClause("implements");
        }
      }
      parseFunctionParams(node) {
        const typeParameters = this.tsTryParseTypeParameters(this.tsParseConstModifier);
        if (typeParameters) node.typeParameters = typeParameters;
        super.parseFunctionParams(node);
      }
      // `let x: number;`
      parseVarId(decl, kind) {
        super.parseVarId(decl, kind);
        if (decl.id.type === "Identifier" && !this.hasPrecedingLineBreak() && this.value === "!" && this.eat(tt.prefix)) {
          decl.definite = true;
        }
        const type = this.tsTryParseTypeAnnotation();
        if (type) {
          decl.id.typeAnnotation = type;
          this.resetEndLocation(decl.id);
        }
      }
      // parse the return type of an async arrow function - let foo = (async (): number => {});
      parseArrowExpression(node, params, isAsync, forInit) {
        if (this.match(tt.colon)) {
          node.returnType = this.tsParseTypeAnnotation();
        }
        let oldYieldPos = this.yieldPos, oldAwaitPos = this.awaitPos, oldAwaitIdentPos = this.awaitIdentPos;
        this.enterScope(functionFlags2(isAsync, false) | acornScope.SCOPE_ARROW);
        this.initFunction(node);
        const oldMaybeInArrowParameters = this.maybeInArrowParameters;
        if (this.ecmaVersion >= 8) node.async = !!isAsync;
        this.yieldPos = 0;
        this.awaitPos = 0;
        this.awaitIdentPos = 0;
        this.maybeInArrowParameters = true;
        node.params = this.toAssignableList(params, true);
        this.maybeInArrowParameters = false;
        this.parseFunctionBody(node, true, false, forInit);
        this.yieldPos = oldYieldPos;
        this.awaitPos = oldAwaitPos;
        this.awaitIdentPos = oldAwaitIdentPos;
        this.maybeInArrowParameters = oldMaybeInArrowParameters;
        return this.finishNode(node, "ArrowFunctionExpression");
      }
      parseYield(forInit) {
        if (!this.yieldPos) this.yieldPos = this.start;
        const node = this.startNode();
        this.next();
        const startsTypeScriptExpression = this.tsMatchLeftRelational();
        const hasArgument = !this.match(tt.semi) && !this.canInsertSemicolon() && (this.match(tt.star) || this.type.startsExpr || startsTypeScriptExpression);
        if (!hasArgument) {
          node.delegate = false;
          node.argument = null;
          return this.finishNode(node, "YieldExpression");
        }
        node.delegate = this.eat(tt.star);
        node.argument = this.parseMaybeAssign(forInit);
        return this.finishNode(node, "YieldExpression");
      }
      parseMaybeAssignOrigin(forInit, refDestructuringErrors, afterLeftParse) {
        if (this.isContextual("yield")) {
          if (this.inGenerator) return this.parseYield(forInit);
          else this.exprAllowed = false;
        }
        let ownDestructuringErrors = false, oldParenAssign = -1, oldTrailingComma = -1, oldDoubleProto = -1;
        if (refDestructuringErrors) {
          oldParenAssign = refDestructuringErrors.parenthesizedAssign;
          oldTrailingComma = refDestructuringErrors.trailingComma;
          oldDoubleProto = refDestructuringErrors.doubleProto;
          refDestructuringErrors.parenthesizedAssign = refDestructuringErrors.trailingComma = -1;
        } else {
          refDestructuringErrors = new DestructuringErrors3();
          ownDestructuringErrors = true;
        }
        let startPos = this.start, startLoc = this.startLoc;
        if (this.type === tt.parenL || tokenIsIdentifier(this.type)) {
          this.potentialArrowAt = this.start;
          this.potentialArrowInForAwait = forInit === "await";
        }
        let left = this.parseMaybeConditional(forInit, refDestructuringErrors);
        if (afterLeftParse) left = afterLeftParse.call(this, left, startPos, startLoc);
        if (this.type.isAssign) {
          let node = this.startNodeAt(startPos, startLoc);
          node.operator = this.value;
          if (this.type === tt.eq)
            left = this.toAssignable(left, true, refDestructuringErrors, true);
          if (!ownDestructuringErrors) {
            refDestructuringErrors.parenthesizedAssign = refDestructuringErrors.trailingComma = refDestructuringErrors.doubleProto = -1;
          }
          if (refDestructuringErrors.shorthandAssign >= left.start)
            refDestructuringErrors.shorthandAssign = -1;
          if (!this.maybeInArrowParameters) {
            if (this.type === tt.eq) this.checkLValPattern(left);
            else this.checkLValSimple(left);
          }
          node.left = left;
          this.next();
          node.right = this.parseMaybeAssign(forInit);
          if (oldDoubleProto > -1) refDestructuringErrors.doubleProto = oldDoubleProto;
          return this.finishNode(node, "AssignmentExpression");
        } else {
          if (ownDestructuringErrors) this.checkExpressionErrors(refDestructuringErrors, true);
        }
        if (oldParenAssign > -1) refDestructuringErrors.parenthesizedAssign = oldParenAssign;
        if (oldTrailingComma > -1) refDestructuringErrors.trailingComma = oldTrailingComma;
        return left;
      }
      parseMaybeAssign(forInit, refExpressionErrors, afterLeftParse) {
        let jsx;
        let typeCast;
        if (options2?.jsx && (this.matchJsx("jsxTagStart") || this.tsMatchLeftRelational())) {
          jsx = this.tryParse(
            () => this.parseMaybeAssignOrigin(forInit, refExpressionErrors, afterLeftParse)
          );
          if (!jsx.error) return jsx.node;
          const context = this.context;
          const currentContext = context[context.length - 1];
          const lastCurrentContext = context[context.length - 2];
          if (currentContext === acornTypeScript.tokContexts.tc_oTag && lastCurrentContext === acornTypeScript.tokContexts.tc_expr) {
            this.parseEffects.pop(context);
            this.parseEffects.pop(context);
          } else if (currentContext === acornTypeScript.tokContexts.tc_oTag || currentContext === acornTypeScript.tokContexts.tc_expr) {
            this.parseEffects.pop(context);
          }
        }
        if (!jsx?.error && !this.tsMatchLeftRelational()) {
          return this.parseMaybeAssignOrigin(forInit, refExpressionErrors, afterLeftParse);
        }
        let typeParameters;
        const arrow = this.tryParse((abort) => {
          typeParameters = this.tsParseTypeParameters(this.tsParseConstModifier);
          const expr = this.parseMaybeAssignOrigin(forInit, refExpressionErrors, afterLeftParse);
          if (expr.type !== "ArrowFunctionExpression" || expr.extra?.parenthesized) {
            abort();
          }
          if (typeParameters?.params.length !== 0) {
            this.resetStartLocationFromNode(expr, typeParameters);
          }
          expr.typeParameters = typeParameters;
          return expr;
        });
        if (!arrow.error && !arrow.aborted) {
          if (typeParameters) this.reportReservedArrowTypeParam(typeParameters);
          return arrow.node;
        }
        if (!jsx) {
          assert(true);
          typeCast = this.tryParse(
            () => this.parseMaybeAssignOrigin(forInit, refExpressionErrors, afterLeftParse)
          );
          if (!typeCast.error) return typeCast.node;
        }
        if (jsx?.thrown) {
          this.selectTryParseResult(jsx);
          throw jsx.error;
        }
        if (arrow.thrown) {
          this.selectTryParseResult(arrow);
          throw arrow.error;
        }
        if (typeCast?.thrown) {
          this.selectTryParseResult(typeCast);
          throw typeCast.error;
        }
        throw jsx?.error || arrow.error || typeCast?.error;
      }
      parseAssignableListItem(allowModifiers) {
        const decorators = [];
        while (this.match(tokTypes.at)) {
          decorators.push(this.parseDecorator());
        }
        const startPos = this.start;
        const startLoc = this.startLoc;
        let accessibility;
        let readonly = false;
        let override = false;
        if (allowModifiers !== void 0) {
          const modified = {};
          this.tsParseModifiers({
            modified,
            allowedModifiers: ["public", "private", "protected", "override", "readonly"]
          });
          accessibility = modified.accessibility;
          override = modified.override;
          readonly = modified.readonly;
          if (allowModifiers === false && (accessibility || readonly || override)) {
            this.raise(startLoc.column, TypeScriptError.UnexpectedParameterModifier);
          }
        }
        const left = this.parseMaybeDefault(startPos, startLoc);
        this.parseBindingListItem(left);
        const elt = this.parseMaybeDefault(left["start"], left["loc"].start, left);
        if (decorators.length) {
          elt.decorators = decorators;
        }
        if (accessibility || readonly || override) {
          const pp2 = this.startNodeAt(startPos, startLoc);
          if (accessibility) pp2.accessibility = accessibility;
          if (readonly) pp2.readonly = readonly;
          if (override) pp2.override = override;
          if (elt.type !== "Identifier" && elt.type !== "AssignmentPattern") {
            this.raise(pp2.start, TypeScriptError.UnsupportedParameterPropertyKind);
          }
          pp2.parameter = elt;
          return this.finishNode(pp2, "TSParameterProperty");
        }
        return elt;
      }
      // AssignmentPattern
      checkLValInnerPattern(expr, bindingType = acornScope.BIND_NONE, checkClashes) {
        switch (expr.type) {
          case "TSParameterProperty":
            this.checkLValInnerPattern(expr.parameter, bindingType, checkClashes);
            break;
          default: {
            super.checkLValInnerPattern(expr, bindingType, checkClashes);
            break;
          }
        }
      }
      // Allow type annotations inside of a parameter list.
      parseBindingListItem(param) {
        if (this.eat(tt.question)) {
          if (param.type !== "Identifier" && !this.isAmbientContext && !this.inType) {
            this.raise(param.start, TypeScriptError.PatternIsOptional);
          }
          param.optional = true;
        }
        const type = this.tsTryParseTypeAnnotation();
        if (type) param.typeAnnotation = type;
        this.resetEndLocation(param);
        return param;
      }
      isAssignable(node, isBinding) {
        switch (node.type) {
          case "TSTypeCastExpression":
            return this.isAssignable(node.expression, isBinding);
          case "TSParameterProperty":
            return true;
          case "Identifier":
          case "ObjectPattern":
          case "ArrayPattern":
          case "AssignmentPattern":
          case "RestElement":
            return true;
          case "ObjectExpression": {
            const last = node.properties.length - 1;
            return node.properties.every((prop, i2) => {
              return prop.type !== "ObjectMethod" && (i2 === last || prop.type !== "SpreadElement") && this.isAssignable(prop);
            });
          }
          case "Property":
          case "ObjectProperty":
            return this.isAssignable(node.value);
          case "SpreadElement":
            return this.isAssignable(node.argument);
          case "ArrayExpression":
            return node.elements.every(
              (element2) => element2 === null || this.isAssignable(element2)
            );
          case "AssignmentExpression":
            return node.operator === "=";
          case "ParenthesizedExpression":
            return this.isAssignable(node.expression);
          case "MemberExpression":
          case "OptionalMemberExpression":
            return !isBinding;
          default:
            return false;
        }
      }
      toAssignable(node, isBinding = false, refDestructuringErrors = new DestructuringErrors3(), preserveTypeScriptWrapper = false) {
        switch (node.type) {
          case "ParenthesizedExpression":
            return this.toAssignableParenthesizedExpression(
              node,
              isBinding,
              refDestructuringErrors,
              preserveTypeScriptWrapper
            );
          case "TSAsExpression":
          case "TSSatisfiesExpression":
          case "TSNonNullExpression":
          case "TSTypeAssertion":
            if (isBinding) {
            } else {
              this.raise(node.start, TypeScriptError.UnexpectedTypeCastInParameter);
            }
            const expression = this.toAssignable(
              node.expression,
              isBinding,
              refDestructuringErrors,
              preserveTypeScriptWrapper
            );
            if (preserveTypeScriptWrapper) {
              node.expression = expression;
              return node;
            }
            return expression;
          case "MemberExpression":
            break;
          case "AssignmentExpression":
            if (!isBinding && node.left.type === "TSTypeCastExpression") {
              node.left = this.typeCastToParameter(node.left);
            }
            return super.toAssignable(node, isBinding, refDestructuringErrors);
          case "TSTypeCastExpression": {
            return this.typeCastToParameter(node);
          }
          default:
            return super.toAssignable(node, isBinding, refDestructuringErrors);
        }
        return node;
      }
      toAssignableParenthesizedExpression(node, isBinding, refDestructuringErrors, preserveTypeScriptWrapper = false) {
        switch (node.expression.type) {
          case "TSAsExpression":
          case "TSSatisfiesExpression":
          case "TSNonNullExpression":
          case "TSTypeAssertion":
          case "ParenthesizedExpression":
            const expression = this.toAssignable(
              node.expression,
              isBinding,
              refDestructuringErrors,
              preserveTypeScriptWrapper
            );
            if (preserveTypeScriptWrapper) {
              node.expression = expression;
              return node;
            }
            return expression;
          default:
            return super.toAssignable(node, isBinding, refDestructuringErrors);
        }
      }
      parseBindingAtom() {
        switch (this.type) {
          case tt._this:
            return this.parseIdent(
              /* liberal */
              true
            );
          default:
            return super.parseBindingAtom();
        }
      }
      shouldParseArrow(exprList) {
        let shouldParseArrowRes;
        if (this.match(tt.colon)) {
          shouldParseArrowRes = exprList.every((expr) => this.isAssignable(expr, true));
        } else {
          shouldParseArrowRes = !this.canInsertSemicolon();
        }
        if (shouldParseArrowRes) {
          if (this.match(tt.colon)) {
            const result = this.tryParse((abort) => {
              const returnType = this.tsParseTypeOrTypePredicateAnnotation(tt.colon);
              if (this.canInsertSemicolon() || !this.match(tt.arrow)) abort();
              return returnType;
            });
            if (result.aborted) {
              this.shouldParseArrowReturnType = void 0;
              return false;
            }
            if (!result.thrown) {
              this.shouldParseArrowReturnType = result.node;
            }
          }
          if (!this.match(tt.arrow)) {
            this.shouldParseArrowReturnType = void 0;
            return false;
          }
          return true;
        }
        this.shouldParseArrowReturnType = void 0;
        return shouldParseArrowRes;
      }
      parseParenArrowList(startPos, startLoc, exprList, forInit) {
        const node = this.startNodeAt(startPos, startLoc);
        node.returnType = this.shouldParseArrowReturnType;
        this.shouldParseArrowReturnType = void 0;
        return this.parseArrowExpression(node, exprList, false, forInit);
      }
      parseParenAndDistinguishExpression(canBeArrow, forInit) {
        let startPos = this.start, startLoc = this.startLoc, val, allowTrailingComma = this.ecmaVersion >= 8;
        if (this.ecmaVersion >= 6) {
          const oldMaybeInArrowParameters = this.maybeInArrowParameters;
          this.maybeInArrowParameters = true;
          this.next();
          let innerStartPos = this.start, innerStartLoc = this.startLoc;
          let exprList = [], first = true, lastIsComma = false;
          let refDestructuringErrors = new DestructuringErrors3(), oldYieldPos = this.yieldPos, oldAwaitPos = this.awaitPos, spreadStart;
          this.yieldPos = 0;
          this.awaitPos = 0;
          while (this.type !== tt.parenR) {
            first ? first = false : this.expect(tt.comma);
            if (allowTrailingComma && this.afterTrailingComma(tt.parenR, true)) {
              lastIsComma = true;
              break;
            } else if (this.type === tt.ellipsis) {
              spreadStart = this.start;
              exprList.push(this.parseParenItem(this.parseRestBinding()));
              if (this.type === tt.comma) {
                this.raise(this.start, "Comma is not permitted after the rest element");
              }
              break;
            } else {
              exprList.push(
                this.parseMaybeAssign(false, refDestructuringErrors, this.parseParenItem)
              );
            }
          }
          let innerEndPos = this.lastTokEnd, innerEndLoc = this.lastTokEndLoc;
          this.expect(tt.parenR);
          this.maybeInArrowParameters = oldMaybeInArrowParameters;
          if (canBeArrow && this.shouldParseArrow(exprList) && this.eat(tt.arrow)) {
            this.checkPatternErrors(refDestructuringErrors, false);
            this.checkYieldAwaitInDefaultParams();
            this.yieldPos = oldYieldPos;
            this.awaitPos = oldAwaitPos;
            return this.parseParenArrowList(startPos, startLoc, exprList, forInit);
          }
          if (!exprList.length || lastIsComma) this.unexpected(this.lastTokStart);
          if (spreadStart) this.unexpected(spreadStart);
          this.checkExpressionErrors(refDestructuringErrors, true);
          this.yieldPos = oldYieldPos || this.yieldPos;
          this.awaitPos = oldAwaitPos || this.awaitPos;
          if (exprList.length > 1) {
            val = this.startNodeAt(innerStartPos, innerStartLoc);
            val.expressions = exprList;
            this.finishNodeAt(val, "SequenceExpression", innerEndPos, innerEndLoc);
          } else {
            val = exprList[0];
          }
        } else {
          val = this.parseParenExpression();
        }
        if (this.options.preserveParens) {
          let par = this.startNodeAt(startPos, startLoc);
          par.expression = val;
          return this.finishNode(par, "ParenthesizedExpression");
        } else {
          return val;
        }
      }
      parseTaggedTemplateExpression(base2, startPos, startLoc, optionalChainMember) {
        const node = this.startNodeAt(startPos, startLoc);
        node.tag = base2;
        node.quasi = this.parseTemplate({ isTagged: true });
        if (optionalChainMember) {
          this.raise(
            startPos,
            "Tagged Template Literals are not allowed in optionalChain."
          );
        }
        return this.finishNode(node, "TaggedTemplateExpression");
      }
      shouldParseAsyncArrow() {
        if (this.match(tt.colon)) {
          const result = this.tryParse((abort) => {
            const returnType = this.tsParseTypeOrTypePredicateAnnotation(tt.colon);
            if (this.canInsertSemicolon() || !this.match(tt.arrow)) abort();
            return returnType;
          });
          if (result.aborted) {
            this.shouldParseAsyncArrowReturnType = void 0;
            return false;
          }
          if (!result.thrown) {
            this.shouldParseAsyncArrowReturnType = result.node;
            return !this.canInsertSemicolon() && this.eat(tt.arrow);
          }
        } else {
          return !this.canInsertSemicolon() && this.eat(tt.arrow);
        }
      }
      parseSubscriptAsyncArrow(startPos, startLoc, exprList, forInit) {
        const arrN = this.startNodeAt(startPos, startLoc);
        arrN.returnType = this.shouldParseAsyncArrowReturnType;
        this.shouldParseAsyncArrowReturnType = void 0;
        return this.parseArrowExpression(arrN, exprList, true, forInit);
      }
      parseExprList(close, allowTrailingComma, allowEmpty, refDestructuringErrors) {
        let elts = [], first = true;
        while (!this.eat(close)) {
          if (!first) {
            this.expect(tt.comma);
            if (allowTrailingComma && this.afterTrailingComma(close)) break;
          } else first = false;
          let elt;
          if (allowEmpty && this.type === tt.comma) elt = null;
          else if (this.type === tt.ellipsis) {
            elt = this.parseSpread(refDestructuringErrors);
            if (this.maybeInArrowParameters && this.match(tt.colon)) {
              elt.typeAnnotation = this.tsParseTypeAnnotation();
            }
            if (refDestructuringErrors && this.type === tt.comma && refDestructuringErrors.trailingComma < 0)
              refDestructuringErrors.trailingComma = this.start;
          } else {
            elt = this.parseMaybeAssign(false, refDestructuringErrors, this.parseParenItem);
          }
          elts.push(elt);
        }
        return elts;
      }
      parseMaybeDecoratorArguments(expr) {
        const typeArguments = this.tsMatchLeftRelational() || this.match(tt.bitShift) ? this.tsParseTypeArgumentsInExpression() : void 0;
        if (this.eat(tt.parenL)) {
          const node = this.startNodeAtNode(expr);
          node.callee = expr;
          node.arguments = this.parseExprList(tt.parenR, false);
          if (typeArguments) node.typeArguments = typeArguments;
          return this.finishNode(node, "CallExpression");
        }
        if (typeArguments) {
          const node = this.startNodeAtNode(expr);
          node.expression = expr;
          node.typeArguments = typeArguments;
          return this.finishNode(node, "TSInstantiationExpression");
        }
        return expr;
      }
      parseSubscript(base2, startPos, startLoc, noCalls, maybeAsyncArrow, optionalChained, forInit) {
        let _optionalChained = optionalChained;
        if (!this.hasPrecedingLineBreak() && // NODE: replace bang
        this.value === "!" && this.match(tt.prefix)) {
          this.exprAllowed = false;
          this.next();
          const nonNullExpression = this.startNodeAt(startPos, startLoc);
          nonNullExpression.expression = base2;
          base2 = this.finishNode(nonNullExpression, "TSNonNullExpression");
          return base2;
        }
        let isOptionalCall = false;
        if (this.match(tt.questionDot) && this.lookaheadCharCode() === 60) {
          if (noCalls) {
            return base2;
          }
          base2.optional = true;
          _optionalChained = isOptionalCall = true;
          this.next();
        }
        if (this.tsMatchLeftRelational() || this.match(tt.bitShift)) {
          let missingParenErrorLoc;
          const result = this.tsTryParseAndCatch(() => {
            if (!noCalls && this.atPossibleAsyncArrow(base2)) {
              const asyncArrowFn = this.tsTryParseGenericAsyncArrowFunction(
                startPos,
                startLoc,
                forInit
              );
              if (asyncArrowFn) {
                base2 = asyncArrowFn;
                return base2;
              }
            }
            const typeArguments = this.tsParseTypeArgumentsInExpression();
            if (!typeArguments) return base2;
            if (isOptionalCall && !this.match(tt.parenL)) {
              missingParenErrorLoc = this.curPosition();
              return base2;
            }
            if (tokenIsTemplate(this.type) || this.type === tt.backQuote) {
              const result2 = this.parseTaggedTemplateExpression(
                base2,
                startPos,
                startLoc,
                _optionalChained
              );
              result2.typeArguments = typeArguments;
              return result2;
            }
            if (!noCalls && this.eat(tt.parenL)) {
              let refDestructuringErrors = new DestructuringErrors3();
              const node2 = this.startNodeAt(startPos, startLoc);
              node2.callee = base2;
              node2.arguments = this.parseExprList(
                tt.parenR,
                this.ecmaVersion >= 8,
                false,
                refDestructuringErrors
              );
              this.tsCheckForInvalidTypeCasts(node2.arguments);
              node2.typeArguments = typeArguments;
              if (_optionalChained) {
                node2.optional = isOptionalCall;
              }
              this.checkExpressionErrors(refDestructuringErrors, true);
              base2 = this.finishNode(node2, "CallExpression");
              return base2;
            }
            const tokenType = this.type;
            if (
              // a<b>>c is not (a<b>)>c, but a<(b>>c)
              this.tsMatchRightRelational() || // a<b>>>c is not (a<b>)>>c, but a<(b>>>c)
              tokenType === tt.bitShift || // a<b>c is (a<b)>c
              tokenType !== tt.parenL && tokenCanStartExpression(tokenType) && !this.hasPrecedingLineBreak()
            ) {
              return;
            }
            const node = this.startNodeAt(startPos, startLoc);
            node.expression = base2;
            node.typeArguments = typeArguments;
            return this.finishNode(node, "TSInstantiationExpression");
          });
          if (missingParenErrorLoc) {
            this.unexpected(missingParenErrorLoc);
          }
          if (result) {
            if (result.type === "TSInstantiationExpression" && (this.match(tt.dot) || this.match(tt.questionDot) && this.lookaheadCharCode() !== 40)) {
              this.raise(
                this.start,
                TypeScriptError.InvalidPropertyAccessAfterInstantiationExpression
              );
            }
            base2 = result;
            return base2;
          }
        }
        let optionalSupported = this.ecmaVersion >= 11;
        let optional = optionalSupported && this.eat(tt.questionDot);
        if (noCalls && optional)
          this.raise(
            this.lastTokStart,
            "Optional chaining cannot appear in the callee of new expressions"
          );
        let computed = this.eat(tt.bracketL);
        if (computed || optional && this.type !== tt.parenL && this.type !== tt.backQuote || this.eat(tt.dot)) {
          let node = this.startNodeAt(startPos, startLoc);
          node.object = base2;
          if (computed) {
            node.property = this.parseExpression();
            this.expect(tt.bracketR);
          } else if (this.type === tt.privateId && base2.type !== "Super") {
            node.property = this.parsePrivateIdent();
          } else {
            node.property = this.parseIdent(this.options.allowReserved !== "never");
          }
          node.computed = !!computed;
          if (optionalSupported) {
            node.optional = optional;
          }
          base2 = this.finishNode(node, "MemberExpression");
        } else if (!noCalls && this.eat(tt.parenL)) {
          const oldMaybeInArrowParameters = this.maybeInArrowParameters;
          this.maybeInArrowParameters = true;
          let refDestructuringErrors = new DestructuringErrors3(), oldYieldPos = this.yieldPos, oldAwaitPos = this.awaitPos, oldAwaitIdentPos = this.awaitIdentPos;
          this.yieldPos = 0;
          this.awaitPos = 0;
          this.awaitIdentPos = 0;
          let exprList = this.parseExprList(
            tt.parenR,
            this.ecmaVersion >= 8,
            false,
            refDestructuringErrors
          );
          if (maybeAsyncArrow && !optional && this.shouldParseAsyncArrow()) {
            this.checkPatternErrors(refDestructuringErrors, false);
            this.checkYieldAwaitInDefaultParams();
            if (this.awaitIdentPos > 0)
              this.raise(
                this.awaitIdentPos,
                "Cannot use 'await' as identifier inside an async function"
              );
            this.yieldPos = oldYieldPos;
            this.awaitPos = oldAwaitPos;
            this.awaitIdentPos = oldAwaitIdentPos;
            base2 = this.parseSubscriptAsyncArrow(startPos, startLoc, exprList, forInit);
          } else {
            this.checkExpressionErrors(refDestructuringErrors, true);
            this.yieldPos = oldYieldPos || this.yieldPos;
            this.awaitPos = oldAwaitPos || this.awaitPos;
            this.awaitIdentPos = oldAwaitIdentPos || this.awaitIdentPos;
            let node = this.startNodeAt(startPos, startLoc);
            node.callee = base2;
            node.arguments = exprList;
            if (optionalSupported) {
              node.optional = optional;
            }
            base2 = this.finishNode(node, "CallExpression");
          }
          this.maybeInArrowParameters = oldMaybeInArrowParameters;
        } else if (this.type === tt.backQuote) {
          if (optional || _optionalChained) {
            this.raise(
              this.start,
              "Optional chaining cannot appear in the tag of tagged template expressions"
            );
          }
          let node = this.startNodeAt(startPos, startLoc);
          node.tag = base2;
          node.quasi = this.parseTemplate({ isTagged: true });
          base2 = this.finishNode(node, "TaggedTemplateExpression");
        }
        return base2;
      }
      parseGetterSetter(prop) {
        prop.kind = prop.key.name;
        this.parsePropertyName(prop);
        const typeParameters = this.tsTryParseTypeParameters(this.tsParseConstModifier);
        prop.value = this.parseMethod(false);
        if (typeParameters) prop.value.typeParameters = typeParameters;
        let paramCount = prop.kind === "get" ? 0 : 1;
        const firstParam = prop.value.params[0];
        const hasContextParam = firstParam && this.isThisParam(firstParam);
        paramCount = hasContextParam ? paramCount + 1 : paramCount;
        if (prop.value.params.length !== paramCount) {
          let start = prop.value.start;
          if (prop.kind === "get") this.raiseRecoverable(start, "getter should have no params");
          else this.raiseRecoverable(start, "setter should have exactly one param");
        } else {
          if (prop.kind === "set" && prop.value.params[0].type === "RestElement")
            this.raiseRecoverable(prop.value.params[0].start, "Setter cannot use rest params");
        }
      }
      parsePropertyValue(prop, isPattern, isGenerator, isAsync, startPos, startLoc, refDestructuringErrors, containsEsc) {
        if (this.tsMatchLeftRelational()) {
          if (isPattern) this.unexpected();
          prop.kind = "init";
          prop.method = true;
          const typeParameters = this.tsTryParseTypeParameters(this.tsParseConstModifier);
          prop.value = this.parseMethod(isGenerator, isAsync);
          if (typeParameters) prop.value.typeParameters = typeParameters;
          return;
        }
        return super.parsePropertyValue(
          prop,
          isPattern,
          isGenerator,
          isAsync,
          startPos,
          startLoc,
          refDestructuringErrors,
          containsEsc
        );
      }
      parseProperty(isPattern, refDestructuringErrors) {
        if (!isPattern) {
          let decorators = [];
          if (this.match(tokTypes.at)) {
            while (this.match(tokTypes.at)) {
              decorators.push(this.parseDecorator());
            }
          }
          const property = super.parseProperty(isPattern, refDestructuringErrors);
          if (property.type === "SpreadElement") {
            if (decorators.length)
              this.raise(property.start, DecoratorsError.SpreadElementDecorator);
          }
          if (decorators.length) {
            property.decorators = decorators;
            decorators = [];
          }
          return property;
        }
        return super.parseProperty(isPattern, refDestructuringErrors);
      }
      parseCatchClauseParam() {
        const param = this.parseBindingAtom();
        let simple3 = param.type === "Identifier";
        this.enterScope(simple3 ? acornScope.SCOPE_SIMPLE_CATCH : 0);
        this.checkLValPattern(
          param,
          simple3 ? acornScope.BIND_SIMPLE_CATCH : acornScope.BIND_LEXICAL
        );
        const type = this.tsTryParseTypeAnnotation();
        if (type) {
          param.typeAnnotation = type;
          this.resetEndLocation(param);
        }
        this.expect(tt.parenR);
        return param;
      }
      parseClass(node, isStatement) {
        const oldInAbstractClass = this.inAbstractClass;
        this.inAbstractClass = !!node.abstract;
        try {
          this.next();
          this.takeDecorators(node);
          const oldStrict = this.strict;
          this.strict = true;
          this.parseClassId(node, isStatement);
          this.parseClassSuper(node);
          const privateNameMap = this.enterClassBody();
          const classBody = this.startNode();
          let hadConstructor = false;
          classBody.body = [];
          let decorators = [];
          this.expect(tt.braceL);
          while (this.type !== tt.braceR) {
            if (this.match(tokTypes.at)) {
              decorators.push(this.parseDecorator());
              continue;
            }
            const element2 = this.parseClassElement(node.superClass !== null);
            if (decorators.length) {
              element2.decorators = decorators;
              this.resetStartLocationFromNode(element2, decorators[0]);
              decorators = [];
            }
            if (element2) {
              classBody.body.push(element2);
              if (element2.type === "MethodDefinition" && element2.kind === "constructor" && element2.value.type === "FunctionExpression") {
                if (hadConstructor) {
                  this.raiseRecoverable(element2.start, "Duplicate constructor in the same class");
                }
                hadConstructor = true;
                if (element2.decorators && element2.decorators.length > 0) {
                  this.raise(element2.start, DecoratorsError.DecoratorConstructor);
                }
              } else if (element2.key && element2.key.type === "PrivateIdentifier" && element2.value?.type !== "TSDeclareMethod") {
                const privateName = element2.key.name;
                const conflicted = this.parseEffects.modify(
                  privateNameMap,
                  privateName,
                  (current2) => resolvePrivateNameConflict(current2, element2)
                );
                if (conflicted) {
                  this.raiseRecoverable(
                    element2.key.start,
                    `Identifier '#${privateName}' has already been declared`
                  );
                }
              }
            }
          }
          this.strict = oldStrict;
          this.next();
          if (decorators.length) {
            this.raise(this.start, DecoratorsError.TrailingDecorator);
          }
          node.body = this.finishNode(classBody, "ClassBody");
          this.exitClassBody();
          return this.finishNode(node, isStatement ? "ClassDeclaration" : "ClassExpression");
        } finally {
          this.inAbstractClass = oldInAbstractClass;
        }
      }
      parseClassFunctionParams() {
        const typeParameters = this.tsTryParseTypeParameters();
        let params = this.parseBindingList(tt.parenR, false, this.ecmaVersion >= 8, true);
        if (typeParameters) params.typeParameters = typeParameters;
        return params;
      }
      parseMethod(isGenerator, isAsync, allowDirectSuper, inClassScope, method) {
        let node = this.startNode(), oldYieldPos = this.yieldPos, oldAwaitPos = this.awaitPos, oldAwaitIdentPos = this.awaitIdentPos;
        this.initFunction(node);
        if (this.ecmaVersion >= 6) node.generator = isGenerator;
        if (this.ecmaVersion >= 8) node.async = !!isAsync;
        this.yieldPos = 0;
        this.awaitPos = 0;
        this.awaitIdentPos = 0;
        this.enterScope(
          functionFlags2(isAsync, node.generator) | acornScope.SCOPE_SUPER | (allowDirectSuper ? acornScope.SCOPE_DIRECT_SUPER : 0)
        );
        this.expect(tt.parenL);
        node.params = this.parseClassFunctionParams();
        this.checkYieldAwaitInDefaultParams();
        this.parseFunctionBody(node, false, true, false, {
          isClassMethod: inClassScope
        });
        this.yieldPos = oldYieldPos;
        this.awaitPos = oldAwaitPos;
        this.awaitIdentPos = oldAwaitIdentPos;
        if (method && method.abstract) {
          const hasBody = !!node.body;
          if (hasBody) {
            const { key } = method;
            this.raise(
              method.start,
              TypeScriptError.AbstractMethodHasImplementation({
                methodName: key.type === "Identifier" && !method.computed ? key.name : `[${this.input.slice(key.start, key.end)}]`
              })
            );
          }
        }
        return this.finishNode(node, "FunctionExpression");
      }
      static parse(input3, options22) {
        if (options22.locations === false) {
          throw new Error(`You have to enable options.locations while using acorn-typescript`);
        } else {
          options22.locations = true;
        }
        const parser = new this(options22, input3);
        if (dts) {
          parser.isAmbientContext = true;
        }
        return parser.parse();
      }
      static parseExpressionAt(input3, pos, options22) {
        if (options22.locations === false) {
          throw new Error(`You have to enable options.locations while using acorn-typescript`);
        } else {
          options22.locations = true;
        }
        const parser = new this(options22, input3, pos);
        if (dts) {
          parser.isAmbientContext = true;
        }
        parser.nextToken();
        return parser.parseExpression();
      }
      parseImportSpecifier() {
        const isMaybeTypeOnly = this.ts_isContextual(tokTypes.type);
        if (isMaybeTypeOnly) {
          let node = this.startNode();
          node.imported = this.parseModuleExportName();
          this.parseTypeOnlyImportExportSpecifier(
            node,
            /* isImport */
            true,
            this.importOrExportOuterKind === "type"
          );
          return this.finishNode(node, "ImportSpecifier");
        } else {
          const node = super.parseImportSpecifier();
          node.importKind = "value";
          return node;
        }
      }
      parseExportSpecifier(exports) {
        const isMaybeTypeOnly = this.ts_isContextual(tokTypes.type);
        const isString = this.match(tt.string);
        if (!isString && isMaybeTypeOnly) {
          let node = this.startNode();
          node.local = this.parseModuleExportName();
          this.parseTypeOnlyImportExportSpecifier(
            node,
            /* isImport */
            false,
            this.importOrExportOuterKind === "type"
          );
          this.finishNode(node, "ExportSpecifier");
          this.checkExport(exports, node.exported, node.exported.start);
          return node;
        } else {
          const node = super.parseExportSpecifier(exports);
          node.exportKind = "value";
          return node;
        }
      }
      parseTypeOnlyImportExportSpecifier(node, isImport, isInTypeOnlyImportExport) {
        const leftOfAsKey = isImport ? "imported" : "local";
        const rightOfAsKey = isImport ? "local" : "exported";
        let leftOfAs = node[leftOfAsKey];
        let rightOfAs;
        let hasTypeSpecifier = false;
        let canParseAsKeyword = true;
        const loc = leftOfAs.start;
        if (this.isContextual("as")) {
          const firstAs = this.parseIdent();
          if (this.isContextual("as")) {
            const secondAs = this.parseIdent();
            if (tokenIsKeywordOrIdentifier(this.type)) {
              hasTypeSpecifier = true;
              leftOfAs = firstAs;
              rightOfAs = isImport ? this.parseIdent() : this.parseModuleExportName();
              canParseAsKeyword = false;
            } else {
              rightOfAs = secondAs;
              canParseAsKeyword = false;
            }
          } else if (tokenIsKeywordOrIdentifier(this.type)) {
            canParseAsKeyword = false;
            rightOfAs = isImport ? this.parseIdent() : this.parseModuleExportName();
          } else {
            hasTypeSpecifier = true;
            leftOfAs = firstAs;
          }
        } else if (tokenIsKeywordOrIdentifier(this.type)) {
          hasTypeSpecifier = true;
          if (isImport) {
            leftOfAs = super.parseIdent(true);
            if (!this.isContextual("as")) {
              this.checkUnreserved(leftOfAs);
            }
          } else {
            leftOfAs = this.parseModuleExportName();
          }
        }
        if (hasTypeSpecifier && isInTypeOnlyImportExport) {
          this.raise(
            loc,
            isImport ? TypeScriptError.TypeModifierIsUsedInTypeImports : TypeScriptError.TypeModifierIsUsedInTypeExports
          );
        }
        node[leftOfAsKey] = leftOfAs;
        node[rightOfAsKey] = rightOfAs;
        const kindKey = isImport ? "importKind" : "exportKind";
        node[kindKey] = hasTypeSpecifier ? "type" : "value";
        if (canParseAsKeyword && this.eatContextual("as")) {
          node[rightOfAsKey] = isImport ? this.parseIdent() : this.parseModuleExportName();
        }
        if (!node[rightOfAsKey]) {
          node[rightOfAsKey] = this.copyNode(node[leftOfAsKey]);
        }
        if (isImport) {
          this.checkLValSimple(node[rightOfAsKey], acornScope.BIND_LEXICAL);
        }
      }
      raiseCommonCheck(pos, message, recoverable) {
        switch (message) {
          case "Comma is not permitted after the rest element": {
            if (this.isAmbientContext && this.match(tt.comma) && this.lookaheadCharCode() === 41) {
              this.next();
              return;
            } else {
              return super.raise(pos, message);
            }
          }
        }
        return recoverable ? super.raiseRecoverable(pos, message) : super.raise(pos, message);
      }
      raiseRecoverable(pos, message) {
        return this.raiseCommonCheck(pos, message, true);
      }
      raise(pos, message) {
        return this.raiseCommonCheck(pos, message, true);
      }
      updateContext(prevType) {
        const { type } = this;
        if (type == tt.braceL) {
          var curContext = this.curContext();
          if (curContext == tsTokContexts.tc_oTag) {
            this.parseEffects.append(this.context, tokContexts.b_expr);
          } else if (curContext == tsTokContexts.tc_expr) {
            this.parseEffects.append(this.context, tokContexts.b_tmpl);
          } else {
            super.updateContext(prevType);
          }
          this.exprAllowed = true;
        } else if (type === tt.slash && prevType === tokTypes.jsxTagStart) {
          this.parseEffects.truncate(this.context, this.context.length - 2);
          this.parseEffects.append(this.context, tsTokContexts.tc_cTag);
          this.exprAllowed = false;
        } else {
          return super.updateContext(prevType);
        }
      }
      // Parses JSX opening tag starting after '<'.
      jsx_parseOpeningElementAt(startPos, startLoc) {
        let node = this.startNodeAt(startPos, startLoc);
        let nodeName = this.jsx_parseElementName();
        if (nodeName) node.name = nodeName;
        if (this.match(tt.relational) || this.match(tt.bitShift)) {
          const typeArguments = this.tsTryParseAndCatch(
            () => this.tsParseTypeArgumentsInExpression()
          );
          if (typeArguments) node.typeArguments = typeArguments;
        }
        node.attributes = [];
        while (this.type !== tt.slash && this.type !== tokTypes.jsxTagEnd)
          node.attributes.push(this.jsx_parseAttribute());
        node.selfClosing = this.eat(tt.slash);
        this.expect(tokTypes.jsxTagEnd);
        return this.finishNode(node, nodeName ? "JSXOpeningElement" : "JSXOpeningFragment");
      }
      enterScope(flags) {
        const isTypeScriptModule = flags === TS_SCOPE_TS_MODULE;
        if (isTypeScriptModule) {
          this.parseEffects.append(this.importsStack, []);
        }
        const acornFlags = isTypeScriptModule ? flags | acornScope.SCOPE_CLASS_STATIC_BLOCK : flags;
        super.enterScope(acornFlags);
        const scope = super.currentScope();
        scope.types = [];
        scope.enums = [];
        scope.constEnums = [];
        scope.classes = [];
        scope.exportOnlyBindings = [];
      }
      exitScope() {
        const scope = super.currentScope();
        if (scope.flags & TS_SCOPE_TS_MODULE) {
          this.parseEffects.pop(this.importsStack);
        }
        super.exitScope();
      }
      hasImport(name, allowShadow) {
        const len = this.importsStack.length;
        if (this.importsStack[len - 1].indexOf(name) > -1) {
          return true;
        }
        if (!allowShadow && len > 1) {
          for (let i2 = 0; i2 < len - 1; i2++) {
            if (this.importsStack[i2].indexOf(name) > -1) return true;
          }
        }
        return false;
      }
      maybeExportDefined(scope, name) {
        if (this.inModule && scope.flags & acornScope.SCOPE_TOP) {
          this.parseEffects.remove(this.undefinedExports, name);
        }
      }
      declareName(name, bindingType, pos) {
        if (bindingType & acornScope.BIND_FLAGS_TS_IMPORT) {
          if (this.hasImport(name, true)) {
            this.raise(pos, `Identifier '${name}' has already been declared.`);
          }
          this.parseEffects.append(this.importsStack[this.importsStack.length - 1], name);
          return;
        }
        const scope = this.currentScope();
        if (bindingType & acornScope.BIND_FLAGS_TS_EXPORT_ONLY) {
          this.maybeExportDefined(scope, name);
          this.parseEffects.append(scope.exportOnlyBindings, name);
          return;
        }
        if (bindingType === acornScope.BIND_TS_TYPE || bindingType === acornScope.BIND_TS_INTERFACE) {
          if (bindingType === acornScope.BIND_TS_TYPE && scope.types.includes(name)) {
            this.raise(pos, `type '${name}' has already been declared.`);
          }
          this.parseEffects.append(scope.types, name);
        } else if (bindingType & acornScope.BIND_FLAGS_TS_ENUM) {
          if (scope.enums.includes(name)) return;
          super.declareName(name, acornScope.BIND_LEXICAL, pos);
        } else {
          super.declareName(name, bindingType, pos);
        }
        if (bindingType & acornScope.BIND_FLAGS_TS_ENUM) {
          this.parseEffects.append(scope.enums, name);
        }
        if (bindingType & acornScope.BIND_FLAGS_TS_CONST_ENUM) {
          this.parseEffects.append(scope.constEnums, name);
        }
        if (bindingType & acornScope.BIND_FLAGS_CLASS) {
          this.parseEffects.append(scope.classes, name);
        }
      }
      checkLocalExport(id2) {
        const { name } = id2;
        if (this.hasImport(name)) return;
        const len = this.scopeStack.length;
        for (let i2 = len - 1; i2 >= 0; i2--) {
          const scope = this.scopeStack[i2];
          if (scope.types.indexOf(name) > -1 || scope.exportOnlyBindings.indexOf(name) > -1) return;
        }
        super.checkLocalExport(id2);
      }
    }
    return TypeScriptParser;
  };
}

// node_modules/@observablehq/notebook-kit/dist/src/javascript/awaits.js
function findAwaits(node) {
  const nodes = [];
  recursive2(node, null, {
    FunctionDeclaration() {
    },
    FunctionExpression() {
    },
    ArrowFunctionExpression() {
    },
    ForOfStatement(node2, state, callback) {
      if (node2.await)
        nodes.push(node2);
      if (node2.left)
        callback(node2.left, state);
      if (node2.right)
        callback(node2.right, state);
      if (node2.body)
        callback(node2.body, state);
    },
    AwaitExpression(node2) {
      nodes.push(node2);
    }
  });
  return nodes;
}

// node_modules/@observablehq/notebook-kit/dist/src/javascript/declarations.js
function findDeclarations(node, input3) {
  const declarations = [];
  function declareLocal(node2) {
    if (defaultGlobals.has(node2.name) || node2.name === "arguments") {
      throw syntaxError(`Global '${node2.name}' cannot be redefined`, node2, input3);
    }
    declarations.push(node2);
  }
  function declarePattern(node2) {
    switch (node2.type) {
      case "Identifier":
        declareLocal(node2);
        break;
      case "ObjectPattern":
        node2.properties.forEach((node3) => declarePattern(node3.type === "Property" ? node3.value : node3));
        break;
      case "ArrayPattern":
        node2.elements.forEach((node3) => node3 && declarePattern(node3));
        break;
      case "RestElement":
        declarePattern(node2.argument);
        break;
      case "AssignmentPattern":
        declarePattern(node2.left);
        break;
    }
  }
  for (const child of node.body) {
    switch (child.type) {
      case "VariableDeclaration":
        child.declarations.forEach((node2) => declarePattern(node2.id));
        break;
      case "ClassDeclaration":
      case "FunctionDeclaration":
        declareLocal(child.id);
        break;
      case "ImportDeclaration":
        if (isTypeImport(child))
          break;
        child.specifiers.filter((node2) => !isTypeImport(node2)).forEach((node2) => declareLocal(node2.local));
        break;
    }
  }
  return declarations;
}

// node_modules/@observablehq/notebook-kit/dist/src/javascript/assignments.js
function checkAssignments(node, { input: input3, locals, references, globals = defaultGlobals }) {
  function isLocal({ name }, parents) {
    for (const p of parents)
      if (locals.get(p)?.has(name))
        return true;
    return false;
  }
  function checkConst(node2, parents) {
    switch (node2.type) {
      case "Identifier":
        if (isLocal(node2, parents))
          break;
        if (references.includes(node2))
          throw syntaxError(`Assignment to external variable '${node2.name}'`, node2, input3);
        if (globals.has(node2.name))
          throw syntaxError(`Assignment to global '${node2.name}'`, node2, input3);
        break;
      case "ArrayPattern":
        for (const e of node2.elements)
          if (e)
            checkConst(e, parents);
        break;
      case "ObjectPattern":
        for (const p of node2.properties)
          checkConst(p.type === "Property" ? p.value : p, parents);
        break;
      case "RestElement":
        checkConst(node2.argument, parents);
        break;
    }
  }
  function checkConstArgument({ argument }, parents) {
    checkConst(argument, parents);
  }
  function checkConstLeft({ left }, parents) {
    checkConst(left, parents);
  }
  ancestor2(node, {
    AssignmentExpression: checkConstLeft,
    AssignmentPattern: checkConstLeft,
    UpdateExpression: checkConstArgument,
    ForOfStatement: checkConstLeft,
    ForInStatement: checkConstLeft
  });
}

// node_modules/@observablehq/notebook-kit/dist/src/javascript/references.js
function isScope(node) {
  return node.type === "FunctionExpression" || node.type === "FunctionDeclaration" || node.type === "ArrowFunctionExpression" || node.type === "Program";
}
function isBlockScope(node) {
  return node.type === "BlockStatement" || node.type === "SwitchStatement" || node.type === "ForInStatement" || node.type === "ForOfStatement" || node.type === "ForStatement" || isScope(node);
}
function findReferences(node, { input: input3, globals = defaultGlobals, filterReference = (identifier) => !globals.has(identifier.name), filterDeclaration = () => true } = {}) {
  const locals = /* @__PURE__ */ new Map();
  const references = [];
  function hasLocal(node2, name) {
    return locals.get(node2)?.has(name) ?? false;
  }
  function declareLocal(node2, id2) {
    if (!filterDeclaration(id2))
      return;
    const l = locals.get(node2);
    if (l)
      l.add(id2.name);
    else
      locals.set(node2, /* @__PURE__ */ new Set([id2.name]));
  }
  function declareClass(node2) {
    if (node2.id)
      declareLocal(node2, node2.id);
  }
  function declareFunction(node2) {
    node2.params.forEach((param) => declarePattern(param, node2));
    if (node2.id)
      declareLocal(node2, node2.id);
    if (node2.type !== "ArrowFunctionExpression")
      declareLocal(node2, { name: "arguments" });
  }
  function declareCatchClause(node2) {
    if (node2.param)
      declarePattern(node2.param, node2);
  }
  function declarePattern(node2, parent2) {
    switch (node2.type) {
      case "Identifier":
        declareLocal(parent2, node2);
        break;
      case "ObjectPattern":
        node2.properties.forEach((node3) => declarePattern(node3.type === "Property" ? node3.value : node3, parent2));
        break;
      case "ArrayPattern":
        node2.elements.forEach((node3) => node3 && declarePattern(node3, parent2));
        break;
      case "RestElement":
        declarePattern(node2.argument, parent2);
        break;
      case "AssignmentPattern":
        declarePattern(node2.left, parent2);
        break;
    }
  }
  ancestor2(node, {
    VariableDeclaration(node2, _state, parents) {
      let parent2 = null;
      for (let i2 = parents.length - 1; i2 >= 0 && parent2 === null; --i2) {
        if (node2.kind === "var" ? isScope(parents[i2]) : isBlockScope(parents[i2])) {
          parent2 = parents[i2];
        }
      }
      node2.declarations.forEach((declaration) => declarePattern(declaration.id, parent2));
    },
    FunctionDeclaration(node2, _state, parents) {
      let parent2 = null;
      for (let i2 = parents.length - 2; i2 >= 0 && parent2 === null; --i2) {
        if (isScope(parents[i2])) {
          parent2 = parents[i2];
        }
      }
      if (node2.id)
        declareLocal(parent2, node2.id);
      declareFunction(node2);
    },
    FunctionExpression: declareFunction,
    ArrowFunctionExpression: declareFunction,
    ClassDeclaration(node2, _state, parents) {
      let parent2 = null;
      for (let i2 = parents.length - 2; i2 >= 0 && parent2 === null; --i2) {
        if (isScope(parents[i2])) {
          parent2 = parents[i2];
        }
      }
      if (node2.id)
        declareLocal(parent2, node2.id);
    },
    ClassExpression: declareClass,
    CatchClause: declareCatchClause,
    ImportDeclaration(node2, _state, [root2]) {
      if (isTypeImport(node2))
        return;
      node2.specifiers.filter((specifier) => !isTypeImport(specifier)).forEach((specifier) => declareLocal(root2, specifier.local));
    }
  });
  function identifier(node2, _state, parents) {
    const name = node2.name;
    if (name === "undefined")
      return;
    for (let i2 = parents.length - 2; i2 >= 0; --i2) {
      if (hasLocal(parents[i2], name)) {
        return;
      }
    }
    if (filterReference(node2)) {
      references.push(node2);
    }
  }
  ancestor2(node, {
    Pattern(node2, _state, parents) {
      if (node2.type === "Identifier") {
        identifier(node2, _state, parents);
      }
    },
    Identifier: identifier
  });
  if (input3 !== void 0) {
    checkAssignments(node, { locals, references, globals, input: input3 });
    checkExports(node, { input: input3 });
  }
  return references;
}

// node_modules/@observablehq/notebook-kit/dist/src/javascript/features.js
function findFeatures(name, body2, input3) {
  const filter = (ref2) => ref2.name === name;
  const references = new Set(findReferences(body2, { filterDeclaration: filter, filterReference: filter }));
  const calls = [];
  simple2(body2, {
    CallExpression(node) {
      const { callee } = node;
      if (callee.type !== "Identifier" || !references.has(callee))
        return;
      const [arg] = node.arguments;
      if (!arg || !isStringLiteral(arg))
        throw syntaxError(`${name} requires a literal string argument`, node, input3);
      calls.push(Object.assign(node, { argument: getStringLiteralValue(arg) }));
    }
  });
  return calls;
}

// node_modules/@observablehq/notebook-kit/dist/src/javascript/typescript.js
var MODIFIERS = /* @__PURE__ */ new Set([
  "public",
  "private",
  "protected",
  "readonly",
  "override",
  "declare",
  "abstract"
]);
var checkErasableVisitors = {
  TSEnumDeclaration: checkErasable,
  TSModuleDeclaration: checkErasable,
  TSParameterProperty: checkErasable,
  TSImportEqualsDeclaration: checkErasable,
  TSExportAssignment: checkErasable
};
function checkErasableSyntax(node, input3) {
  simple2(node, checkErasableVisitors, input3);
}
function checkErasable(node, input3) {
  if (node.declare)
    return;
  throw syntaxError(`unsupported syntax: ${node.type}`, node, input3);
}
function stripTypes(cell, output) {
  recursive(cell.body, output, stripTypesVisitors);
}
var stripTypesVisitors = {
  // Type-only declarations, erased entirely.
  TSTypeAliasDeclaration: deleteStatement,
  TSInterfaceDeclaration: deleteStatement,
  TSDeclareFunction: deleteStatement,
  TSDeclareMethod: deleteStatement,
  TSIndexSignature: deleteStatement,
  TSNamespaceExportDeclaration: deleteStatement,
  // Ambient (declare) enums and namespaces; non-ambient forms, which require
  // runtime support, are rejected earlier by checkErasableSyntax.
  TSEnumDeclaration: deleteStatement,
  TSModuleDeclaration: deleteStatement,
  // TypeScript expression wrappers, unwrapped to their value expression.
  TSAsExpression: unwrapType,
  // x as T
  TSSatisfiesExpression: unwrapType,
  // x satisfies T
  TSNonNullExpression: unwrapType,
  // x!
  TSInstantiationExpression: unwrapType,
  // f<T>
  TSTypeAssertion: unwrapAssertion,
  // <T>x
  TSTypeCastExpression: unwrapCast,
  // (x: T)
  // Standard nodes that may carry type syntax. Function and Class are aggregate
  // types dispatched by acorn-walk’s base walkers, so overriding them covers
  // every function and class form.
  Function: stripFunction,
  Class: stripClass,
  PropertyDefinition: stripMember,
  MethodDefinition: stripMember,
  AccessorProperty: stripMember,
  VariablePattern: stripBindingIdentifier,
  ObjectPattern: stripPattern,
  ArrayPattern: stripPattern,
  RestElement: stripPattern,
  VariableDeclarator: stripVariableDeclarator,
  CallExpression: stripTypeArguments,
  NewExpression: stripTypeArguments,
  TaggedTemplateExpression: stripTypeArguments
};
function deleteStatement(node, output) {
  let end = node.end;
  const input3 = output.input;
  if (input3[end] === ";")
    ++end;
  if (input3[end] === "\n")
    ++end;
  output.delete(node.start, end);
}
function unwrapType(node, output, next) {
  output.delete(node.expression.end, node.end);
  next(node.expression, output);
}
function unwrapAssertion(node, output, next) {
  output.delete(node.start, node.expression.start);
  next(node.expression, output);
}
function unwrapCast(node, output, next) {
  output.delete(node.typeAnnotation.start, node.typeAnnotation.end);
  next(node.expression, output);
}
function stripFunction(node, output, next) {
  deleteType(output, node, "returnType");
  deleteType(output, node, "typeParameters");
  base.Function(node, output, next);
}
function stripClass(node, output, next) {
  deleteType(output, node, "typeParameters");
  deleteType(output, node, "superTypeParameters");
  deleteType(output, node, "superTypeArguments");
  if (node.abstract && node.id)
    deleteModifiers(output, findModifiersStart(node), node.id.start);
  if (node.implements?.length)
    deleteImplements(output, node);
  base.Class(node, output, next);
}
function stripMember(node, output, next) {
  if (node.abstract || node.declare || node.value?.type === "TSDeclareMethod")
    return deleteStatement(node, output);
  deleteModifiers(output, findModifiersStart(node), node.key.start);
  if (node.optional || node.definite)
    deleteMarker(output, node.key.end, findMarkerEnd(node));
  deleteType(output, node, "typeParameters");
  deleteType(output, node, "typeAnnotation");
  base.PropertyDefinition(node, output, next);
}
function stripBindingIdentifier(node, output) {
  if (node.optional)
    deleteMarker(output, node.start, node.typeAnnotation?.start ?? node.end);
  deleteType(output, node, "typeAnnotation");
}
function stripPattern(node, output, next) {
  deleteType(output, node, "typeAnnotation");
  base[node.type](node, output, next);
}
function stripVariableDeclarator(node, output, next) {
  if (node.definite && node.id.type === "Identifier")
    deleteMarker(output, node.id.start, node.id.typeAnnotation?.start ?? node.init?.start ?? node.id.end);
  base.VariableDeclarator(node, output, next);
}
function stripTypeArguments(node, output, next) {
  deleteType(output, node, "typeArguments");
  base[node.type](node, output, next);
}
function deleteType(output, node, key) {
  const child = node[key];
  if (child)
    output.delete(child.start, child.end);
}
function findModifiersStart(node) {
  const decorators = node.decorators;
  return decorators?.length ? decorators[decorators.length - 1].end : node.start;
}
function findMarkerEnd(node) {
  return node.typeAnnotation?.start ?? node.value?.start ?? node.end;
}
function deleteMarker(output, start, end) {
  forEachToken(output.input, start, end, (t) => {
    if (t.type === types$1.question || t.type === types$1.prefix)
      output.delete(t.start, t.end);
  });
}
function deleteModifiers(output, start, end) {
  const input3 = output.input;
  forEachToken(input3, start, end, (t) => {
    if (t.type !== types$1.name || !MODIFIERS.has(t.value))
      return;
    let e = t.end;
    while (input3[e] === " " || input3[e] === "	")
      ++e;
    output.delete(t.start, e);
  });
}
function deleteImplements(output, node) {
  const list2 = node.implements;
  const start = node.superTypeParameters?.end ?? node.superTypeArguments?.end ?? node.superClass?.end ?? node.id?.end ?? node.start;
  output.delete(start, list2[list2.length - 1].end);
}
function forEachToken(input3, start, end, fn) {
  if (start >= end)
    return;
  const T = tokenizer2(input3, { ecmaVersion: "latest" });
  T.pos = start;
  for (const t of T) {
    if (t.type === types$1.eof)
      break;
    if (t.start >= end)
      break;
    fn(t);
  }
}

// node_modules/@observablehq/notebook-kit/dist/src/javascript/parse.js
var jsOptions = {
  ecmaVersion: "latest",
  sourceType: "module"
};
var tsOptions = {
  ...jsOptions,
  locations: true,
  preserveParens: true
  // needed for accurate type stripping
};
var JsParser = Parser;
var TsParser = Parser.extend(tsPlugin());
function getParser(dialect = "js") {
  return dialect === "ts" ? TsParser : JsParser;
}
function getOptions2(dialect = "js") {
  return dialect === "ts" ? tsOptions : jsOptions;
}
function parseJavaScript(input3, dialect) {
  let expression = maybeParseExpression(input3, dialect);
  if (expression?.type === "ClassExpression" && expression.id)
    expression = null;
  if (expression?.type === "FunctionExpression" && expression.id)
    expression = null;
  const body2 = expression ?? parseProgram(input3, dialect);
  if (dialect === "ts")
    checkErasableSyntax(body2, input3);
  return {
    body: body2,
    declarations: expression ? null : findDeclarations(body2, input3),
    references: findReferences(body2, { input: input3 }),
    files: findFeatures("FileAttachment", body2, input3),
    databases: findFeatures("DatabaseClient", body2, input3),
    secrets: findFeatures("Secret", body2, input3),
    expression: !!expression,
    async: findAwaits(body2).length > 0
  };
}
function parseProgram(input3, dialect) {
  return getParser(dialect).parse(input3, getOptions2(dialect));
}
function maybeParseExpression(input3, dialect) {
  const parser = new (getParser(dialect))(getOptions2(dialect), input3, 0);
  parser.nextToken();
  try {
    const node = parser.parseExpression();
    return parser.type === types$1.eof ? node : null;
  } catch {
    return null;
  }
}

// node_modules/@observablehq/notebook-kit/dist/src/lib/interpreters.js
function isInterpreter(mode) {
  return mode === "node" || mode === "python" || mode === "r";
}
function getInterpreterExtension(format2) {
  switch (format2) {
    case "html":
    case "text":
      return ".txt";
    case "jpeg":
      return ".jpg";
    case "json":
    case "arrow":
    case "parquet":
    case "csv":
    case "tsv":
    case "png":
    case "gif":
    case "svg":
    case "webp":
    case "xml":
      return `.${format2}`;
    default:
      return ".bin";
  }
}
function getInterpreterMethod(format2) {
  switch (format2) {
    case "arrow":
    case "parquet":
    case "json":
    case "blob":
    case "text":
    case "xml":
      return `.${format2}()`;
    case "html":
      return `.text().then((text) => html({raw: [text]}))`;
    case "buffer":
      return ".arrayBuffer()";
    case "jpeg":
    case "png":
    case "gif":
    case "svg":
    case "webp":
      return ".image()";
    case "csv":
    case "tsv":
      return `.${format2}({typed: true})`;
    default:
      return "";
  }
}

// node_modules/@observablehq/notebook-kit/dist/src/javascript/sourcemap.js
var Sourcemap = class {
  constructor(input3) {
    Object.defineProperty(this, "length", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "input", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "_edits", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    this.length = input3.length;
    this.input = input3;
    this._edits = [];
  }
  _bisectLeft(index) {
    let lo = 0;
    let hi = this._edits.length;
    while (lo < hi) {
      const mid = lo + hi >>> 1;
      if (this._edits[mid].start < index)
        lo = mid + 1;
      else
        hi = mid;
    }
    return lo;
  }
  _bisectRight(index) {
    let lo = 0;
    let hi = this._edits.length;
    while (lo < hi) {
      const mid = lo + hi >>> 1;
      if (this._edits[mid].start > index)
        hi = mid;
      else
        lo = mid + 1;
    }
    return lo;
  }
  _subsume(start, end) {
    let n = 0;
    for (let i2 = 0; i2 < this._edits.length; ++i2) {
      const e = this._edits[i2];
      if (start <= e.start && e.end < end)
        continue;
      this._edits[n++] = e;
    }
    this._edits.length = n;
  }
  insertLeft(index, value) {
    return this.replaceLeft(index, index, value);
  }
  insertRight(index, value) {
    return this.replaceRight(index, index, value);
  }
  delete(start, end) {
    return this.replaceRight(start, end, "");
  }
  replaceLeft(start, end, value) {
    this._subsume(start, end);
    this._edits.splice(this._bisectLeft(start), 0, { start, end, value });
    return this;
  }
  replaceRight(start, end, value) {
    this._subsume(start, end);
    this._edits.splice(this._bisectRight(start), 0, { start, end, value });
    return this;
  }
  translate(position) {
    let index = 0;
    let ci = { line: 1, column: 0 };
    let co = { line: 1, column: 0 };
    for (const { start, end, value } of this._edits) {
      if (start > index) {
        const l2 = positionLength(this.input, index, start);
        const ci22 = positionAdd(ci, l2);
        const co22 = positionAdd(co, l2);
        if (positionCompare(co22, position) > 0)
          break;
        ci = ci22;
        co = co22;
      }
      const il = positionLength(this.input, start, end);
      const ol = positionLength(value);
      const ci2 = positionAdd(ci, il);
      const co2 = positionAdd(co, ol);
      if (positionCompare(co2, position) > 0)
        return ci;
      ci = ci2;
      co = co2;
      index = end;
    }
    const l = positionSubtract(position, co);
    return positionAdd(ci, l);
  }
  trim() {
    const input3 = this.input;
    if (input3.startsWith("\n"))
      this.delete(0, 1);
    if (input3.endsWith("\n"))
      this.delete(input3.length - 1, input3.length);
    return this;
  }
  toString() {
    let output = "";
    let index = 0;
    for (const { start, end, value } of this._edits) {
      if (start > index)
        output += this.input.slice(index, start);
      output += value;
      index = end;
    }
    output += this.input.slice(index);
    return output;
  }
};
function positionCompare(a, b) {
  return a.line - b.line || a.column - b.column;
}
function positionLength(input3, start = 0, end = input3.length) {
  let match;
  let line = 0;
  lineBreakG.lastIndex = start;
  while ((match = lineBreakG.exec(input3)) && match.index < end) {
    ++line;
    start = match.index + match[0].length;
  }
  return { line, column: end - start };
}
function positionSubtract(b, a) {
  return b.line === a.line ? { line: 0, column: b.column - a.column } : { line: b.line - a.line, column: b.column };
}
function positionAdd(p, l) {
  return l.line === 0 ? { line: p.line, column: p.column + l.column } : { line: p.line + l.line, column: l.column };
}

// node_modules/@observablehq/notebook-kit/dist/src/javascript/template.js
var options = {
  ecmaVersion: "latest",
  sourceType: "module"
};
var CODE_DOLLAR = 36;
var CODE_BACKSLASH = 92;
var CODE_BACKTICK = 96;
var CODE_BRACEL = 123;
var o_tmpl = new TokContext(
  "`",
  // token
  true,
  // isExpr
  true,
  // preserveSpace
  (parser) => parser.readTemplateToken()
  // override
);
var TemplateCellParser = class extends Parser {
  constructor(options2, input3, startPos) {
    super(options2, input3, startPos);
    this.type = types$1.backQuote;
    this.exprAllowed = false;
  }
  initialContext() {
    return [o_tmpl];
  }
  parseTopLevel(node) {
    if (this.type === types$1.eof)
      this.value = "";
    const isTagged = true;
    const template = node;
    template.expressions = [];
    let curElt = this.parseTemplateElement({ isTagged });
    template.quasis = [curElt];
    while (this.type !== types$1.eof) {
      this.expect(types$1.dollarBraceL);
      template.expressions.push(this.parseExpression());
      this.expect(types$1.braceR);
      template.quasis.push(curElt = this.parseTemplateElement({ isTagged }));
    }
    curElt.tail = true;
    this.next();
    this.finishNode(template, "TemplateLiteral");
    this.expect(types$1.eof);
    return template;
  }
  readTemplateToken() {
    out: for (; this.pos < this.input.length; this.pos++) {
      switch (this.input.charCodeAt(this.pos)) {
        case CODE_BACKSLASH: {
          if (this.pos < this.input.length - 1)
            ++this.pos;
          break;
        }
        case CODE_DOLLAR: {
          if (this.input.charCodeAt(this.pos + 1) === CODE_BRACEL) {
            if (this.pos === this.start && this.type === types$1.invalidTemplate) {
              this.pos += 2;
              return this.finishToken(types$1.dollarBraceL);
            }
            break out;
          }
          break;
        }
      }
    }
    return this.finishToken(types$1.invalidTemplate, this.input.slice(this.start, this.pos));
  }
};
function parseTemplate(input3) {
  return TemplateCellParser.parse(input3, options);
}
function transpileTemplate(input3, tag = "", raw = false) {
  let cell;
  let prefix;
  let suffix;
  if (typeof input3 !== "string") {
    cell = input3;
    input3 = cell.value;
    prefix = getPrefix(cell);
    suffix = getSuffix(cell);
    raw = getRaw(cell);
  } else {
    prefix = tag;
    suffix = "";
  }
  if (!input3)
    return input3;
  const source = new Sourcemap(input3);
  let node;
  if (cell && isInterpreter(cell.mode)) {
    node = { type: "Literal", start: 0, end: input3.length };
    escapeBacktick(source, node);
    escapeBackslash(source, node);
    escapeDollarCurly(source, node);
  } else {
    const template = parseTemplate(input3);
    (raw ? escapeRawTemplateElements : escapeTemplateElements)(source, template);
    node = template;
  }
  source.insertLeft(node.start, `${prefix}\``);
  source.insertRight(node.end, `\`${suffix}`);
  return String(source);
}
function getRaw(cell) {
  return cell.mode !== "md";
}
function getPrefix(cell) {
  return cell.mode === "tex" ? "tex.block" : cell.mode === "sql" ? getSqlPrefix(cell) : isInterpreter(cell.mode) ? getInterpreterPrefix(cell) : cell.mode === "html" ? "htl.html" : cell.mode;
}
function getDatabase(cell) {
  const { id: id2, database = "var:db", since } = cell;
  if (database.startsWith("var:")) {
    const name = database.slice("var:".length);
    return `(await DatabaseClient.of(${name}, ${JSON.stringify(name)}))`;
  }
  return `DatabaseClient(${JSON.stringify(database)}, {id: ${id2}${since === void 0 ? "" : `, since: ${JSON.stringify(since)}`}})`;
}
function getSqlPrefix(cell) {
  return `${getDatabase(cell)}.sql`;
}
function getSqlViewSuffix(cell) {
  return `.bind(${getDatabase(cell)})`;
}
function getInterpreterPrefix(cell) {
  const { id: id2, mode, format: format2, since } = cell;
  return `Interpreter(${JSON.stringify(mode)}, {id: ${id2}${format2 === void 0 ? "" : `, format: ${JSON.stringify(format2)}`}${since === void 0 ? "" : `, since: ${JSON.stringify(since)}`}}).run(`;
}
function getSuffix(cell) {
  return cell.mode === "sql.view" ? getSqlViewSuffix(cell) : isInterpreter(cell.mode) ? getInterpreterSuffix(cell) : "";
}
function getInterpreterSuffix(cell) {
  const method = getInterpreterMethod(cell.format);
  return method ? `).then((file) => file${method})` : ")";
}
function escapeTemplateElements(source, node) {
  for (const quasi of node.quasis) {
    escapeBacktick(source, quasi);
    escapeLiteralBackslash(source, quasi);
  }
}
function escapeRawTemplateElements(source, node) {
  for (const quasi of node.quasis) {
    escapeBacktick(source, quasi);
  }
  interpolateTerminalBackslash(source);
}
function escapeBacktick(source, { start, end }) {
  const { input: input3 } = source;
  for (let i2 = start; i2 < end; ++i2) {
    if (input3.charCodeAt(i2) === CODE_BACKTICK) {
      source.insertRight(i2, "\\");
    }
  }
}
function escapeBackslash(source, { start, end }) {
  const { input: input3 } = source;
  for (let i2 = start; i2 < end; ++i2) {
    if (input3.charCodeAt(i2) === CODE_BACKSLASH) {
      source.insertRight(i2, "\\");
    }
  }
}
function escapeLiteralBackslash(source, { start, end }) {
  const { input: input3 } = source;
  let afterDollar = false;
  let oddBackslashes = false;
  for (let i2 = start; i2 < end; ++i2) {
    switch (input3.charCodeAt(i2)) {
      case CODE_DOLLAR: {
        afterDollar = true;
        oddBackslashes = false;
        break;
      }
      case CODE_BACKSLASH: {
        oddBackslashes = !oddBackslashes;
        if (afterDollar && input3.charCodeAt(i2 + 1) === CODE_BRACEL)
          continue;
        if (oddBackslashes && input3.charCodeAt(i2 + 1) === CODE_DOLLAR && input3.charCodeAt(i2 + 2) === CODE_BRACEL)
          continue;
        source.insertRight(i2, "\\");
        break;
      }
      default: {
        afterDollar = false;
        oddBackslashes = false;
        break;
      }
    }
  }
}
function interpolateTerminalBackslash(source) {
  const { input: input3 } = source;
  let oddBackslashes = false;
  for (let i2 = input3.length - 1; i2 >= 0; i2--) {
    if (input3.charCodeAt(i2) !== CODE_BACKSLASH)
      break;
    oddBackslashes = !oddBackslashes;
  }
  if (oddBackslashes)
    source.replaceRight(input3.length - 1, input3.length, "${'\\\\'}");
}
function escapeDollarCurly(source, { start, end }) {
  const { input: input3 } = source;
  for (let i2 = start; i2 < end; ++i2) {
    if (input3.charCodeAt(i2) !== CODE_BRACEL || input3.charCodeAt(i2 - 1) !== CODE_DOLLAR)
      continue;
    source.insertRight(i2, "\\");
  }
}

// node_modules/@observablehq/notebook-kit/dist/src/lib/notebook.js
function toNotebook({ cells: cells2 = [], title = "Untitled", theme = "air", readOnly = false }) {
  return {
    cells: cells2.map(toCell),
    title,
    theme,
    readOnly
  };
}
function toCell({ id: id2, value = "", mode = "js", pinned = defaultPinned(mode), hidden = false, output, format: format2 = isInterpreter(mode) ? "buffer" : void 0, database = isDatabase(mode) ? "var:db" : void 0, since }) {
  return {
    id: id2,
    value,
    mode,
    pinned,
    hidden,
    output,
    format: isInterpreter(mode) ? format2 : void 0,
    database: isDatabase(mode) ? database : void 0,
    since: since !== void 0 ? asDate(since) : void 0
  };
}
function isDatabase(mode) {
  return mode === "sql" || mode === "sql.view";
}
function isJavaScript(mode) {
  return mode === "js" || mode === "ts" || mode === "ojs";
}
function asDate(date) {
  return date instanceof Date ? date : new Date(date);
}
function defaultPinned(mode) {
  return isJavaScript(mode) || isDatabase(mode) || isInterpreter(mode);
}

// node_modules/@observablehq/notebook-kit/dist/src/javascript/files.js
function rewriteFileExpressions(output, body2) {
  const files = new Set(findReferences(body2, { filterReference: ({ name }) => name === "FileAttachment" }));
  simple2(body2, {
    CallExpression(node) {
      const { callee } = node;
      if (callee.type !== "Identifier" || !files.has(callee))
        return;
      const args = node.arguments;
      if (args.length === 0)
        return;
      const [arg] = args;
      output.insertLeft(arg.start, "new URL(");
      output.insertRight(arg.end, ", import.meta.url).href");
    }
  });
}

// node_modules/@observablehq/parser/src/globals.js
var globals_default = /* @__PURE__ */ new Set([
  "Array",
  "ArrayBuffer",
  "atob",
  "AudioContext",
  "Blob",
  "Boolean",
  "BigInt",
  "btoa",
  "clearInterval",
  "clearTimeout",
  "console",
  "crypto",
  "CustomEvent",
  "DataView",
  "Date",
  "decodeURI",
  "decodeURIComponent",
  "devicePixelRatio",
  "document",
  "encodeURI",
  "encodeURIComponent",
  "Error",
  "escape",
  "eval",
  "fetch",
  "File",
  "FileList",
  "FileReader",
  "Float32Array",
  "Float64Array",
  "Function",
  "Headers",
  "Image",
  "ImageData",
  "Infinity",
  "Int16Array",
  "Int32Array",
  "Int8Array",
  "Intl",
  "isFinite",
  "isNaN",
  "JSON",
  "Map",
  "Math",
  "NaN",
  "Number",
  "navigator",
  "Object",
  "parseFloat",
  "parseInt",
  "performance",
  "Path2D",
  "Promise",
  "Proxy",
  "RangeError",
  "ReferenceError",
  "Reflect",
  "RegExp",
  "cancelAnimationFrame",
  "requestAnimationFrame",
  "Set",
  "setInterval",
  "setTimeout",
  "String",
  "Symbol",
  "SyntaxError",
  "TextDecoder",
  "TextEncoder",
  "this",
  "TypeError",
  "Uint16Array",
  "Uint32Array",
  "Uint8Array",
  "Uint8ClampedArray",
  "undefined",
  "unescape",
  "URIError",
  "URL",
  "WeakMap",
  "WeakSet",
  "WebSocket",
  "Worker",
  "window"
]);

// node_modules/@observablehq/parser/src/walk.js
var walk_default = make({
  Import() {
  },
  ViewExpression(node, st, c) {
    c(node.id, st, "Identifier");
  },
  MutableExpression(node, st, c) {
    c(node.id, st, "Identifier");
  }
});

// node_modules/@observablehq/parser/src/references.js
function isScope2(node) {
  return node.type === "FunctionExpression" || node.type === "FunctionDeclaration" || node.type === "ArrowFunctionExpression" || node.type === "Program";
}
function isBlockScope2(node) {
  return node.type === "BlockStatement" || node.type === "ForInStatement" || node.type === "ForOfStatement" || node.type === "ForStatement" || isScope2(node);
}
function declaresArguments(node) {
  return node.type === "FunctionExpression" || node.type === "FunctionDeclaration";
}
function findReferences2(cell, globals) {
  const ast = { type: "Program", body: [cell.body] };
  const locals = /* @__PURE__ */ new Map();
  const globalSet = new Set(globals);
  const references = [];
  function hasLocal(node, name) {
    const l = locals.get(node);
    return l ? l.has(name) : false;
  }
  function declareLocal(node, id2) {
    const l = locals.get(node);
    if (l) l.add(id2.name);
    else locals.set(node, /* @__PURE__ */ new Set([id2.name]));
  }
  function declareClass(node) {
    if (node.id) declareLocal(node, node.id);
  }
  function declareFunction(node) {
    node.params.forEach((param) => declarePattern(param, node));
    if (node.id) declareLocal(node, node.id);
  }
  function declareCatchClause(node) {
    if (node.param) declarePattern(node.param, node);
  }
  function declarePattern(node, parent2) {
    switch (node.type) {
      case "Identifier":
        declareLocal(parent2, node);
        break;
      case "ObjectPattern":
        node.properties.forEach((node2) => declarePattern(node2, parent2));
        break;
      case "ArrayPattern":
        node.elements.forEach((node2) => node2 && declarePattern(node2, parent2));
        break;
      case "Property":
        declarePattern(node.value, parent2);
        break;
      case "RestElement":
        declarePattern(node.argument, parent2);
        break;
      case "AssignmentPattern":
        declarePattern(node.left, parent2);
        break;
      default:
        throw new Error("Unrecognized pattern type: " + node.type);
    }
  }
  function declareModuleSpecifier(node) {
    declareLocal(ast, node.local);
  }
  ancestor(
    ast,
    {
      VariableDeclaration: (node, parents) => {
        let parent2 = null;
        for (let i2 = parents.length - 1; i2 >= 0 && parent2 === null; --i2) {
          if (node.kind === "var" ? isScope2(parents[i2]) : isBlockScope2(parents[i2])) {
            parent2 = parents[i2];
          }
        }
        node.declarations.forEach((declaration) => declarePattern(declaration.id, parent2));
      },
      FunctionDeclaration: (node, parents) => {
        let parent2 = null;
        for (let i2 = parents.length - 2; i2 >= 0 && parent2 === null; --i2) {
          if (isScope2(parents[i2])) {
            parent2 = parents[i2];
          }
        }
        declareLocal(parent2, node.id);
        declareFunction(node);
      },
      Function: declareFunction,
      ClassDeclaration: (node, parents) => {
        let parent2 = null;
        for (let i2 = parents.length - 2; i2 >= 0 && parent2 === null; i2--) {
          if (isScope2(parents[i2])) {
            parent2 = parents[i2];
          }
        }
        declareLocal(parent2, node.id);
      },
      Class: declareClass,
      CatchClause: declareCatchClause,
      ImportDefaultSpecifier: declareModuleSpecifier,
      ImportSpecifier: declareModuleSpecifier,
      ImportNamespaceSpecifier: declareModuleSpecifier
    },
    walk_default
  );
  function identifier(node, parents) {
    let name = node.name;
    if (name === "undefined") return;
    for (let i2 = parents.length - 2; i2 >= 0; --i2) {
      if (name === "arguments") {
        if (declaresArguments(parents[i2])) {
          return;
        }
      }
      if (hasLocal(parents[i2], name)) {
        return;
      }
      if (parents[i2].type === "ViewExpression") {
        node = parents[i2];
        name = `viewof ${node.id.name}`;
      }
      if (parents[i2].type === "MutableExpression") {
        node = parents[i2];
        name = `mutable ${node.id.name}`;
      }
    }
    if (!globalSet.has(name)) {
      if (name === "arguments") {
        throw Object.assign(new SyntaxError(`arguments is not allowed`), { node });
      }
      references.push(node);
    }
  }
  ancestor(
    ast,
    {
      VariablePattern: identifier,
      Identifier: identifier
    },
    walk_default
  );
  function checkConst(node, parents) {
    if (!node) return;
    switch (node.type) {
      case "Identifier":
      case "VariablePattern": {
        for (const parent2 of parents) {
          if (hasLocal(parent2, node.name)) {
            return;
          }
        }
        if (parents[parents.length - 2].type === "MutableExpression") {
          return;
        }
        throw Object.assign(new SyntaxError(`Assignment to constant variable ${node.name}`), { node });
      }
      case "ArrayPattern": {
        for (const element2 of node.elements) {
          checkConst(element2, parents);
        }
        return;
      }
      case "ObjectPattern": {
        for (const property of node.properties) {
          checkConst(property, parents);
        }
        return;
      }
      case "Property": {
        checkConst(node.value, parents);
        return;
      }
      case "RestElement": {
        checkConst(node.argument, parents);
        return;
      }
    }
  }
  function checkConstArgument(node, parents) {
    checkConst(node.argument, parents);
  }
  function checkConstLeft(node, parents) {
    checkConst(node.left, parents);
  }
  ancestor(
    ast,
    {
      AssignmentExpression: checkConstLeft,
      AssignmentPattern: checkConstLeft,
      UpdateExpression: checkConstArgument,
      ForOfStatement: checkConstLeft,
      ForInStatement: checkConstLeft
    },
    walk_default
  );
  return references;
}

// node_modules/@observablehq/parser/src/features.js
function findFeatures2(cell, featureName) {
  const ast = { type: "Program", body: [cell.body] };
  const features = /* @__PURE__ */ new Map();
  const { references } = cell;
  simple(
    ast,
    {
      CallExpression: (node) => {
        const { callee, arguments: args } = node;
        if (callee.type !== "Identifier" || callee.name !== featureName || references.indexOf(callee) < 0) return;
        if (args.length !== 1 || !(args[0].type === "Literal" && /^['"]/.test(args[0].raw) || args[0].type === "TemplateLiteral" && args[0].expressions.length === 0)) {
          throw Object.assign(new SyntaxError(`${featureName} requires a single literal string argument`), { node });
        }
        const [arg] = args;
        const name = arg.type === "Literal" ? arg.value : arg.quasis[0].value.cooked;
        const location2 = { start: arg.start, end: arg.end };
        if (features.has(name)) features.get(name).push(location2);
        else features.set(name, [location2]);
      }
    },
    walk_default
  );
  return features;
}

// node_modules/@observablehq/parser/src/parse.js
var SCOPE_FUNCTION2 = 2;
var SCOPE_ASYNC2 = 4;
var SCOPE_GENERATOR2 = 8;
function parseCell(input3, { tag, raw, globals, ...options2 } = {}) {
  let cell;
  if (tag != null && input3) {
    cell = TemplateCellParser2.parse(input3, options2);
    const parsedTag = CellTagParser.parse(tag, options2);
    parseReferences(parsedTag, tag, globals);
    parseFeatures(parsedTag, tag);
    cell.tag = parsedTag;
    cell.raw = !!raw;
  } else {
    cell = CellParser.parse(input3, options2);
  }
  parseReferences(cell, input3, globals);
  parseFeatures(cell, input3);
  return cell;
}
var CellParser = class _CellParser extends Parser {
  constructor(options2, ...args) {
    super(Object.assign({ ecmaVersion: 13 }, options2), ...args);
  }
  enterScope(flags) {
    if (flags & SCOPE_FUNCTION2) ++this.O_function;
    return super.enterScope(flags);
  }
  exitScope() {
    if (this.currentScope().flags & SCOPE_FUNCTION2) --this.O_function;
    return super.exitScope();
  }
  parseForIn(node, init) {
    if (this.O_function === 1 && node.await) this.O_async = true;
    return super.parseForIn(node, init);
  }
  parseAwait() {
    if (this.O_function === 1) this.O_async = true;
    return super.parseAwait();
  }
  parseYield(noIn) {
    if (this.O_function === 1) this.O_generator = true;
    return super.parseYield(noIn);
  }
  parseImport(node) {
    this.next();
    node.specifiers = this.parseImportSpecifiers();
    if (this.type === types$1._with) {
      this.next();
      node.injections = this.parseImportSpecifiers();
    }
    this.expectContextual("from");
    node.source = this.type === types$1.string ? this.parseExprAtom() : this.unexpected();
    return this.finishNode(node, "ImportDeclaration");
  }
  parseImportSpecifiers() {
    const nodes = [];
    const identifiers = /* @__PURE__ */ new Set();
    let first = true;
    this.expect(types$1.braceL);
    while (!this.eat(types$1.braceR)) {
      if (first) {
        first = false;
      } else {
        this.expect(types$1.comma);
        if (this.afterTrailingComma(types$1.braceR)) break;
      }
      const node = this.startNode();
      node.view = this.eatContextual("viewof");
      node.mutable = node.view ? false : this.eatContextual("mutable");
      node.imported = this.parseIdent();
      this.checkUnreserved(node.imported);
      this.checkLocal(node.imported);
      if (this.eatContextual("as")) {
        node.local = this.parseIdent();
        this.checkUnreserved(node.local);
        this.checkLocal(node.local);
      } else {
        node.local = node.imported;
      }
      this.checkLValSimple(node.local, "let");
      if (identifiers.has(node.local.name)) {
        this.raise(node.local.start, `Identifier '${node.local.name}' has already been declared`);
      }
      identifiers.add(node.local.name);
      nodes.push(this.finishNode(node, "ImportSpecifier"));
    }
    return nodes;
  }
  parseExprAtom(refDestructuringErrors) {
    return this.parseMaybeKeywordExpression("viewof", "ViewExpression") || this.parseMaybeKeywordExpression("mutable", "MutableExpression") || super.parseExprAtom(refDestructuringErrors);
  }
  startCell() {
    this.O_function = 0;
    this.O_async = false;
    this.O_generator = false;
    this.strict = true;
    this.enterScope(SCOPE_FUNCTION2 | SCOPE_ASYNC2 | SCOPE_GENERATOR2);
  }
  finishCell(node, body2, id2) {
    if (id2) this.checkLocal(id2);
    node.id = id2;
    node.body = body2;
    node.async = this.O_async;
    node.generator = this.O_generator;
    this.exitScope();
    return this.finishNode(node, "Cell");
  }
  parseCell(node, eof) {
    const lookahead2 = new _CellParser({}, this.input, this.start);
    let token = lookahead2.getToken();
    let body2 = null;
    let id2 = null;
    this.startCell();
    if (token.type === types$1._import && lookahead2.getToken().type !== types$1.parenL) {
      body2 = this.parseImport(this.startNode());
    } else if (token.type !== types$1.eof && token.type !== types$1.semi) {
      if (token.type === types$1.name) {
        if (token.value === "viewof" || token.value === "mutable") {
          token = lookahead2.getToken();
          if (token.type !== types$1.name) {
            lookahead2.unexpected();
          }
        }
        token = lookahead2.getToken();
        if (token.type === types$1.eq) {
          id2 = this.parseMaybeKeywordExpression("viewof", "ViewExpression") || this.parseMaybeKeywordExpression("mutable", "MutableExpression") || this.parseIdent();
          token = lookahead2.getToken();
          this.expect(types$1.eq);
        }
      }
      if (token.type === types$1.braceL) {
        body2 = this.parseBlock();
      } else {
        body2 = this.parseExpression();
        if (id2 === null && (body2.type === "FunctionExpression" || body2.type === "ClassExpression")) {
          id2 = body2.id;
        }
      }
    }
    this.semicolon();
    if (eof) this.expect(types$1.eof);
    return this.finishCell(node, body2, id2);
  }
  parseTopLevel(node) {
    return this.parseCell(node, true);
  }
  toAssignable(node, isBinding, refDestructuringErrors) {
    return node.type === "MutableExpression" ? node : super.toAssignable(node, isBinding, refDestructuringErrors);
  }
  checkLocal(id2) {
    const node = id2.id || id2;
    if (globals_default.has(node.name) || node.name === "arguments") {
      this.raise(node.start, `Identifier '${node.name}' is reserved`);
    }
  }
  checkUnreserved(node) {
    if (node.name === "viewof" || node.name === "mutable") {
      this.raise(node.start, `Unexpected keyword '${node.name}'`);
    }
    return super.checkUnreserved(node);
  }
  checkLValSimple(expr, bindingType, checkClashes) {
    return super.checkLValSimple(
      expr.type === "MutableExpression" ? expr.id : expr,
      bindingType,
      checkClashes
    );
  }
  unexpected(pos) {
    this.raise(
      pos != null ? pos : this.start,
      this.type === types$1.eof ? "Unexpected end of input" : "Unexpected token"
    );
  }
  parseMaybeKeywordExpression(keyword, type) {
    if (this.isContextual(keyword)) {
      const node = this.startNode();
      this.next();
      node.id = this.parseIdent();
      return this.finishNode(node, type);
    }
  }
};
var o_tmpl2 = new TokContext(
  "`",
  // token
  true,
  // isExpr
  true,
  // preserveSpace
  (parser) => readTemplateToken.call(parser)
  // override
);
var TemplateCellParser2 = class extends CellParser {
  constructor(...args) {
    super(...args);
    this.type = types$1.backQuote;
    this.exprAllowed = false;
  }
  initialContext() {
    return [o_tmpl2];
  }
  parseCell(node) {
    this.startCell();
    if (this.type === types$1.eof) this.value = "";
    const isTagged = true;
    const body2 = this.startNode();
    body2.expressions = [];
    let curElt = this.parseTemplateElement({ isTagged });
    body2.quasis = [curElt];
    while (this.type !== types$1.eof) {
      this.expect(types$1.dollarBraceL);
      body2.expressions.push(this.parseExpression());
      this.expect(types$1.braceR);
      body2.quasis.push(curElt = this.parseTemplateElement({ isTagged }));
    }
    curElt.tail = true;
    this.next();
    this.finishNode(body2, "TemplateLiteral");
    this.expect(types$1.eof);
    return this.finishCell(node, body2, null);
  }
};
function readTemplateToken() {
  out: for (; this.pos < this.input.length; this.pos++) {
    switch (this.input.charCodeAt(this.pos)) {
      case 92: {
        if (this.pos < this.input.length - 1) ++this.pos;
        break;
      }
      case 36: {
        if (this.input.charCodeAt(this.pos + 1) === 123) {
          if (this.pos === this.start && this.type === types$1.invalidTemplate) {
            this.pos += 2;
            return this.finishToken(types$1.dollarBraceL);
          }
          break out;
        }
        break;
      }
    }
  }
  return this.finishToken(types$1.invalidTemplate, this.input.slice(this.start, this.pos));
}
var CellTagParser = class extends Parser {
  constructor(options2, ...args) {
    super(Object.assign({ ecmaVersion: 12 }, options2), ...args);
  }
  enterScope(flags) {
    if (flags & SCOPE_FUNCTION2) ++this.O_function;
    return super.enterScope(flags);
  }
  exitScope() {
    if (this.currentScope().flags & SCOPE_FUNCTION2) --this.O_function;
    return super.exitScope();
  }
  parseForIn(node, init) {
    if (this.O_function === 1 && node.await) this.O_async = true;
    return super.parseForIn(node, init);
  }
  parseAwait() {
    if (this.O_function === 1) this.O_async = true;
    return super.parseAwait();
  }
  parseYield(noIn) {
    if (this.O_function === 1) this.O_generator = true;
    return super.parseYield(noIn);
  }
  parseTopLevel(node) {
    this.O_function = 0;
    this.O_async = false;
    this.O_generator = false;
    this.strict = true;
    this.enterScope(SCOPE_FUNCTION2 | SCOPE_ASYNC2 | SCOPE_GENERATOR2);
    node.body = this.parseExpression();
    node.input = this.input;
    node.async = this.O_async;
    node.generator = this.O_generator;
    this.exitScope();
    return this.finishNode(node, "CellTag");
  }
};
function parseReferences(cell, input3, globals = globals_default) {
  if (!cell.body) {
    cell.references = [];
  } else if (cell.body.type === "ImportDeclaration") {
    cell.references = cell.body.injections ? cell.body.injections.map((i2) => i2.imported) : [];
  } else {
    try {
      cell.references = findReferences2(cell, globals);
    } catch (error) {
      if (error.node) {
        const loc = getLineInfo(input3, error.node.start);
        error.message += ` (${loc.line}:${loc.column})`;
        error.pos = error.node.start;
        error.loc = loc;
        delete error.node;
      }
      throw error;
    }
  }
  return cell;
}
function parseFeatures(cell, input3) {
  if (cell.body && cell.body.type !== "ImportDeclaration") {
    try {
      cell.fileAttachments = findFeatures2(cell, "FileAttachment");
      cell.databaseClients = findFeatures2(cell, "DatabaseClient");
      cell.secrets = findFeatures2(cell, "Secret");
      cell.notificationClients = findFeatures2(cell, "NotificationClient");
    } catch (error) {
      if (error.node) {
        const loc = getLineInfo(input3, error.node.start);
        error.message += ` (${loc.line}:${loc.column})`;
        error.pos = error.node.start;
        error.loc = loc;
        delete error.node;
      }
      throw error;
    }
  } else {
    cell.fileAttachments = /* @__PURE__ */ new Map();
    cell.databaseClients = /* @__PURE__ */ new Map();
    cell.secrets = /* @__PURE__ */ new Map();
    cell.notificationClients = /* @__PURE__ */ new Map();
  }
  return cell;
}

// node_modules/@observablehq/notebook-kit/dist/src/javascript/observable.js
function transpileObservable(input3, options2) {
  const cell = parseCell(input3);
  if (!cell.body)
    return transpileJavaScript(input3);
  if (isImportCell(cell))
    return transpileObservableImport(input3, cell, options2);
  if (cell.tag)
    throw new Error("tagged ojs cells are not supported");
  const output = new Sourcemap(input3).trim();
  rewriteSpecialReferences(output, cell.body);
  rewriteDynamicImports(output, cell.body);
  if (options2?.resolveFiles)
    rewriteFileExpressions(output, cell.body);
  const inputs = Array.from(new Set(cell.references.map(asReference)));
  let start = "";
  let end = "";
  start += `${cell.async ? "async " : ""}function${cell.generator ? "*" : ""}`;
  if (cell.id)
    start += ` ${asReference(cell.id)}`;
  start += `(${inputs})`;
  if (cell.body.type !== "BlockStatement") {
    start += "{return(";
    end += ")}";
  }
  output.replaceLeft(0, cell.body.start, `${start}
`);
  output.replaceRight(cell.body.end, input3.length, `
${end}`);
  return {
    body: String(output),
    inputs,
    output: cell.id ? asDeclaration(cell.id) : void 0,
    autodisplay: true,
    automutable: cell.id?.type === "MutableExpression",
    autoview: cell.id?.type === "ViewExpression",
    files: new Set(cell.fileAttachments.keys()),
    databases: new Set(cell.databaseClients.keys()),
    secrets: new Set(cell.secrets.keys())
  };
}
function isImportCell(cell) {
  return cell.body.type === "ImportDeclaration";
}
function transpileObservableImport(input3, cell, options2) {
  const output = new Sourcemap(input3).trim();
  const inputs = ["@variable"];
  const declarations = flatMapImportSpecifiers(cell.body, (s) => s.local);
  const outputs = Array.from(new Set(declarations.map(asDeclaration)));
  transformObservableImport(cell.body);
  rewriteImportDeclarations(output, cell.body, inputs, options2);
  output.insertLeft(0, `async (__variable) => {
`);
  if (outputs.length > 0)
    output.insertRight(input3.length, `
return {${outputs}};`);
  output.insertRight(input3.length, "\n}");
  const body2 = String(output);
  return {
    body: body2,
    inputs,
    outputs,
    autodisplay: false,
    files: /* @__PURE__ */ new Set(),
    secrets: /* @__PURE__ */ new Set(),
    databases: /* @__PURE__ */ new Set()
  };
}
function transformObservableImport(body2) {
  const source = body2.source.value;
  if (typeof source === "string" && !/^\w+:/.test(source)) {
    body2.source.value = `observable:${source}`;
  }
  body2.attributes = [
    {
      type: "ImportAttribute",
      key: { type: "Literal", value: "type", start: 0, end: 0 },
      value: { type: "Literal", value: "observable", start: 0, end: 0 },
      start: 0,
      end: 0
    }
  ];
}
function rewriteDynamicImports(output, body2) {
  simple2(body2, {
    ImportExpression({ source }) {
      if (!isStringLiteral(source))
        return;
      let value = getStringLiteralValue(source);
      if (/^(\w+:|\.?\.?\/)/.test(value))
        return;
      if (/\.(js|mjs|cjs)$/.test(value))
        value += "/+esm";
      const resolution = resolveNpmImport(`npm:${value}`);
      output.replaceLeft(source.start, source.end, JSON.stringify(resolution));
    }
  });
}
function rewriteSpecialReferences(output, body2) {
  simple2(body2, {
    MutableExpression(node) {
      output.replaceLeft(node.start, node.end, `${asReference(node)}.value`);
    },
    ViewExpression(node) {
      output.replaceLeft(node.start, node.end, asReference(node));
    }
  });
}
function asReference(ref2) {
  return ref2.type === "ViewExpression" ? `viewof$${ref2.id.name}` : ref2.type === "MutableExpression" ? `mutable$${ref2.id.name}` : ref2.name;
}
function asDeclaration(ref2) {
  return ref2.type === "ViewExpression" ? `viewof$${ref2.id.name}` : ref2.type === "MutableExpression" ? `initial ${ref2.id.name}` : ref2.name;
}

// node_modules/@observablehq/notebook-kit/dist/src/javascript/transpile.js
function transpile(input3, mode, options2) {
  let cell;
  if (typeof input3 === "string") {
    mode = mode;
    cell = toCell({ id: -1, value: input3, mode });
  } else {
    options2 = mode;
    mode = input3.mode;
    cell = input3;
    input3 = cell.value;
  }
  const transpiled = mode === "ts" ? transpileTypeScript(input3, options2) : mode === "ojs" ? transpileObservable(input3, options2) : mode !== "js" ? transpileJavaScript(transpileTemplate(cell), options2) : transpileJavaScript(input3, options2);
  if (mode !== "ts" && mode !== "js" && mode !== "ojs")
    transpiled.output = cell.output;
  if (cell.hidden)
    transpiled.autodisplay = false;
  return transpiled;
}
function transpileTypeScript(input3, options2) {
  const cell = parseJavaScript(input3, "ts");
  const output = new Sourcemap(input3);
  stripTypes(cell, output);
  return transpileCell(cell, output, options2);
}
function transpileJavaScript(input3, options2) {
  const cell = parseJavaScript(input3, "js");
  const output = new Sourcemap(input3);
  return transpileCell(cell, output, options2);
}
function transpileCell(cell, output, options2) {
  let async = cell.async;
  const inputs = Array.from(new Set(cell.references.map((r) => r.name)));
  if (hasImportDeclaration(cell.body))
    async = true;
  const outputs = Array.from(new Set(cell.declarations?.map((r) => r.name)));
  output.trim();
  rewriteImportDeclarations(output, cell.body, inputs, options2);
  rewriteImportExpressions(output, cell.body, options2);
  if (options2?.resolveFiles)
    rewriteFileExpressions(output, cell.body);
  if (cell.expression)
    output.insertLeft(0, `return (
`);
  output.insertLeft(0, `${async ? "async " : ""}(${inputs.map(deat)}) => {
`);
  if (outputs.length > 0)
    output.insertRight(output.length, `
return {${outputs}};`);
  if (cell.expression)
    output.insertRight(output.length, `
)`);
  output.insertRight(output.length, "\n}");
  const body2 = String(output);
  const autodisplay = cell.expression && !(inputs.includes("display") || inputs.includes("view"));
  const files = new Set(cell.files.map((f) => f.argument));
  const databases = new Set(cell.databases.map((f) => f.argument));
  const secrets = new Set(cell.secrets.map((f) => f.argument));
  return { body: body2, inputs, outputs, autodisplay, files, databases, secrets };
}
function deat(input3) {
  return input3.replace(/^@/, "__");
}

// node_modules/@observablehq/notebook-kit/dist/src/lib/text.js
function isEmpty(text5) {
  return /^\s*$/.test(text5);
}

// node_modules/@observablehq/notebook-kit/dist/src/lib/serialize.js
var DEFAULT_THEME = "air";
function serialize(notebook2, { document: document2 = globalThis.document } = {}) {
  const _notebook = document2.createElement("notebook");
  _notebook.setAttribute("theme", serializeTheme(notebook2.theme));
  if (notebook2.readOnly)
    _notebook.setAttribute("readonly", "");
  _notebook.appendChild(document2.createTextNode("\n  "));
  const _title = document2.createElement("title");
  _title.textContent = notebook2.title;
  _notebook.appendChild(_title);
  for (const cell of notebook2.cells) {
    _notebook.appendChild(document2.createTextNode("\n  "));
    const _cell = document2.createElement("script");
    _cell.id = String(cell.id);
    _cell.type = serializeMode(cell.mode);
    _cell.textContent = indent(cell.value.replace(/<(?=\\*\/script(\s|>))/gi, "<\\"));
    if (cell.pinned)
      _cell.setAttribute("pinned", "");
    if (cell.hidden)
      _cell.setAttribute("hidden", "");
    if (cell.database)
      _cell.setAttribute("database", cell.database);
    if (cell.output)
      _cell.setAttribute("output", cell.output);
    if (cell.format)
      _cell.setAttribute("format", cell.format);
    _notebook.appendChild(_cell);
  }
  _notebook.appendChild(document2.createTextNode("\n"));
  return `<!doctype html>
${_notebook.outerHTML}
`;
}
function deserialize(data2, { parser = new DOMParser() } = {}) {
  const document2 = parser.parseFromString(data2, "text/html");
  const _notebook = document2.querySelector("notebook");
  const theme = deserializeTheme(_notebook?.getAttribute("theme"));
  const readOnly = _notebook?.hasAttribute("readonly");
  const title = document2.querySelector("title")?.textContent ?? void 0;
  let maxCellId = 0;
  const cellIds = /* @__PURE__ */ new Set();
  const cells2 = Array.from(document2.querySelectorAll("notebook script"), (cell) => {
    let id2 = Math.floor(Number(cell.id));
    if (!isFinite(id2) || !(id2 > 0) || cellIds.has(id2))
      id2 = ++maxCellId;
    else if (id2 > maxCellId)
      maxCellId = id2;
    cellIds.add(id2);
    const mode = deserializeMode(cell.getAttribute("type"));
    const value = dedent(cell.textContent?.replace(/<\\(?=\\*\/script(\s|>))/gi, "<") ?? "");
    const pinned = cell.hasAttribute("pinned");
    const hidden = cell.hasAttribute("hidden");
    const format2 = deserializeFormat(cell.getAttribute("format"));
    const output = cell.getAttribute("output") ?? void 0;
    const database = cell.getAttribute("database") ?? void 0;
    return { id: id2, mode, value, pinned, hidden, format: format2, output, database };
  });
  return toNotebook({ title, theme, readOnly, cells: cells2 });
}
function serializeMode(mode) {
  switch (mode) {
    case "md":
      return "text/markdown";
    case "html":
      return "text/html";
    case "tex":
      return "application/x-tex";
    case "sql":
      return "application/sql";
    case "sql.view":
      return "application/sql+view";
    case "dot":
      return "text/vnd.graphviz";
    case "node":
      return "application/vnd.node.javascript";
    case "python":
      return "text/x-python";
    case "r":
      return "text/x-r";
    case "ojs":
      return "application/vnd.observable.javascript";
    case "ts":
      return "text/x-typescript";
    default:
      return "module";
  }
}
function deserializeMode(mode) {
  switch (mode) {
    case "text/markdown":
      return "md";
    case "text/html":
      return "html";
    case "application/x-tex":
      return "tex";
    case "application/sql":
      return "sql";
    case "application/sql+view":
      return "sql.view";
    case "text/vnd.graphviz":
      return "dot";
    case "application/vnd.node.javascript":
      return "node";
    case "text/x-python":
      return "python";
    case "text/x-r":
      return "r";
    case "application/vnd.observable.javascript":
      return "ojs";
    case "text/x-typescript":
      return "ts";
    default:
      return "js";
  }
}
function deserializeFormat(format2) {
  switch (format2) {
    case "text":
    case "blob":
    case "buffer":
    case "json":
    case "csv":
    case "tsv":
    case "jpeg":
    case "png":
    case "webp":
    case "gif":
    case "arrow":
    case "parquet":
    case "html":
      return format2;
  }
}
function serializeTheme(theme) {
  return typeof theme === "string" ? theme : `light-dark(${theme.light}, ${theme.dark})`;
}
function deserializeTheme(theme) {
  theme = theme?.trim().toLowerCase() ?? DEFAULT_THEME;
  const match = /^light-dark\(([\w-]+),\s*([\w-]+)\)$/.exec(theme);
  if (match) {
    const [, light, dark2] = match;
    return { light, dark: dark2 };
  }
  return theme;
}
function dedent(text5) {
  const lines = text5.split(/\r\n?|\n/);
  if (isEmpty(lines[lines.length - 1]))
    lines.pop();
  if (isEmpty(lines[0]))
    lines.shift();
  return lines.map((l) => l.replace(/^ {4}/, "")).join("\n");
}
function indent(text5) {
  const lines = text5.split(/\r\n?|\n/);
  return `
${lines.map((l) => l.trim() ? `    ${l}` : "").join("\n")}
  `;
}

// node_modules/@observablehq/runtime/src/errors.js
var RuntimeError = class extends Error {
  constructor(message, input3) {
    super(message);
    this.input = input3;
  }
};
RuntimeError.prototype.name = "RuntimeError";

// node_modules/@observablehq/runtime/src/generatorish.js
function generatorish(value) {
  return value && typeof value.next === "function" && typeof value.return === "function";
}

// node_modules/@observablehq/runtime/src/constant.js
function constant(x) {
  return () => x;
}

// node_modules/@observablehq/runtime/src/identity.js
function identity(x) {
  return x;
}

// node_modules/@observablehq/runtime/src/array.js
var prototype = Array.prototype;
var map = prototype.map;
var forEach = prototype.forEach;

// node_modules/@observablehq/runtime/src/noop.js
function noop() {
}

// node_modules/@observablehq/runtime/src/variable.js
var TYPE_NORMAL = 1;
var TYPE_IMPLICIT = 2;
var TYPE_DUPLICATE = 3;
var no_observer = /* @__PURE__ */ Symbol("no-observer");
var no_value = Promise.resolve();
function Variable(type, module, observer, options2) {
  if (!observer) observer = no_observer;
  Object.defineProperties(this, {
    _observer: { value: observer, writable: true },
    _definition: { value: variable_undefined, writable: true },
    _duplicate: { value: void 0, writable: true },
    _duplicates: { value: void 0, writable: true },
    _indegree: { value: NaN, writable: true },
    // The number of computing inputs.
    _inputs: { value: [], writable: true },
    _invalidate: { value: noop, writable: true },
    _module: { value: module },
    _name: { value: null, writable: true },
    _outputs: { value: /* @__PURE__ */ new Set(), writable: true },
    _promise: { value: no_value, writable: true },
    _reachable: { value: observer !== no_observer, writable: true },
    // Is this variable transitively visible?
    _rejector: { value: variable_rejector(this) },
    _shadow: { value: initShadow(module, options2) },
    _type: { value: type },
    _value: { value: void 0, writable: true },
    _version: { value: 0, writable: true }
  });
}
Object.defineProperties(Variable.prototype, {
  _pending: { value: variable_pending, writable: true, configurable: true },
  _fulfilled: { value: variable_fulfilled, writable: true, configurable: true },
  _rejected: { value: variable_rejected, writable: true, configurable: true },
  _resolve: { value: variable_resolve, writable: true, configurable: true },
  define: { value: variable_define, writable: true, configurable: true },
  delete: { value: variable_delete, writable: true, configurable: true },
  dispose: { value: variable_dispose, writable: true, configurable: true },
  import: { value: variable_import, writable: true, configurable: true }
});
function initShadow(module, options2) {
  if (!options2?.shadow) return null;
  return new Map(
    Object.entries(options2.shadow).map(([name, definition]) => [name, new Variable(TYPE_IMPLICIT, module).define([], definition)])
  );
}
function variable_attach(variable) {
  variable._module._runtime._dirty.add(variable);
  variable._outputs.add(this);
}
function variable_detach(variable) {
  variable._module._runtime._dirty.add(variable);
  variable._outputs.delete(this);
}
function variable_undefined() {
  throw variable_undefined;
}
function variable_stale() {
  throw variable_stale;
}
function variable_rejector(variable) {
  return (error) => {
    if (error === variable_stale) throw error;
    if (error === variable_undefined) throw new RuntimeError(`${variable._name} is not defined`, variable._name);
    if (error instanceof Error && error.message) throw new RuntimeError(error.message, variable._name);
    throw new RuntimeError(`${variable._name} could not be resolved`, variable._name);
  };
}
function variable_duplicate(name) {
  return () => {
    throw new RuntimeError(`${name} is defined more than once`);
  };
}
function variable_define(name, inputs, definition) {
  switch (arguments.length) {
    case 1: {
      definition = name, name = inputs = null;
      break;
    }
    case 2: {
      definition = inputs;
      if (typeof name === "string") inputs = null;
      else inputs = name, name = null;
      break;
    }
  }
  return variable_defineImpl.call(
    this,
    name == null ? null : String(name),
    inputs == null ? [] : map.call(inputs, this._resolve, this),
    typeof definition === "function" ? definition : constant(definition)
  );
}
function variable_resolve(name) {
  return this._shadow?.get(name) ?? this._module._resolve(name);
}
function variable_defineImpl(name, inputs, definition) {
  const scope = this._module._scope, runtime3 = this._module._runtime;
  this._inputs.forEach(variable_detach, this);
  inputs.forEach(variable_attach, this);
  this._inputs = inputs;
  this._definition = definition;
  this._value = void 0;
  if (definition === noop) runtime3._variables.delete(this);
  else runtime3._variables.add(this);
  if (name !== this._name || scope.get(name) !== this) {
    let error, found;
    if (this._name) {
      if (this._outputs.size) {
        scope.delete(this._name);
        found = this._module._resolve(this._name);
        found._outputs = this._outputs, this._outputs = /* @__PURE__ */ new Set();
        found._outputs.forEach(function(output) {
          output._inputs[output._inputs.indexOf(this)] = found;
        }, this);
        found._outputs.forEach(runtime3._updates.add, runtime3._updates);
        runtime3._dirty.add(found).add(this);
        scope.set(this._name, found);
      } else if ((found = scope.get(this._name)) === this) {
        scope.delete(this._name);
      } else if (found._type === TYPE_DUPLICATE) {
        found._duplicates.delete(this);
        this._duplicate = void 0;
        if (found._duplicates.size === 1) {
          found = found._duplicates.keys().next().value;
          error = scope.get(this._name);
          found._outputs = error._outputs, error._outputs = /* @__PURE__ */ new Set();
          found._outputs.forEach(function(output) {
            output._inputs[output._inputs.indexOf(error)] = found;
          });
          found._definition = found._duplicate, found._duplicate = void 0;
          runtime3._dirty.add(error).add(found);
          runtime3._updates.add(found);
          scope.set(this._name, found);
        }
      } else {
        throw new Error();
      }
    }
    if (this._outputs.size) throw new Error();
    if (name) {
      if (found = scope.get(name)) {
        if (found._type === TYPE_DUPLICATE) {
          this._definition = variable_duplicate(name), this._duplicate = definition;
          found._duplicates.add(this);
        } else if (found._type === TYPE_IMPLICIT) {
          this._outputs = found._outputs, found._outputs = /* @__PURE__ */ new Set();
          this._outputs.forEach(function(output) {
            output._inputs[output._inputs.indexOf(found)] = this;
          }, this);
          runtime3._dirty.add(found).add(this);
          scope.set(name, this);
        } else {
          found._duplicate = found._definition, this._duplicate = definition;
          error = new Variable(TYPE_DUPLICATE, this._module);
          error._name = name;
          error._definition = this._definition = found._definition = variable_duplicate(name);
          error._outputs = found._outputs, found._outputs = /* @__PURE__ */ new Set();
          error._outputs.forEach(function(output) {
            output._inputs[output._inputs.indexOf(found)] = error;
          });
          error._duplicates = /* @__PURE__ */ new Set([this, found]);
          runtime3._dirty.add(found).add(error);
          runtime3._updates.add(found).add(error);
          scope.set(name, error);
        }
      } else {
        scope.set(name, this);
      }
    }
    this._name = name;
  }
  if (this._version > 0) ++this._version;
  runtime3._updates.add(this);
  runtime3._compute();
  return this;
}
function variable_import(remote, name, module) {
  if (arguments.length < 3) module = name, name = remote;
  return variable_defineImpl.call(this, String(name), [module._resolve(String(remote))], identity);
}
function variable_dispose() {
  this._invalidate();
  this._version = NaN;
}
function variable_delete() {
  return variable_defineImpl.call(this, null, [], noop);
}
function variable_pending() {
  if (this._observer.pending) this._observer.pending();
}
function variable_fulfilled(value) {
  if (this._observer.fulfilled) this._observer.fulfilled(value, this._name);
}
function variable_rejected(error) {
  if (this._observer.rejected) this._observer.rejected(error, this._name);
}

// node_modules/@observablehq/runtime/src/module.js
var variable_variable = /* @__PURE__ */ Symbol("variable");
var variable_invalidation = /* @__PURE__ */ Symbol("invalidation");
var variable_visibility = /* @__PURE__ */ Symbol("visibility");
function Module(runtime3, builtins = []) {
  Object.defineProperties(this, {
    _runtime: { value: runtime3 },
    _scope: { value: /* @__PURE__ */ new Map() },
    _builtins: { value: new Map([
      ["@variable", variable_variable],
      ["invalidation", variable_invalidation],
      ["visibility", variable_visibility],
      ...builtins
    ]) },
    _source: { value: null, writable: true }
  });
}
Object.defineProperties(Module.prototype, {
  _resolve: { value: module_resolve, writable: true, configurable: true },
  redefine: { value: module_redefine, writable: true, configurable: true },
  define: { value: module_define, writable: true, configurable: true },
  derive: { value: module_derive, writable: true, configurable: true },
  import: { value: module_import, writable: true, configurable: true },
  value: { value: module_value, writable: true, configurable: true },
  variable: { value: module_variable, writable: true, configurable: true },
  builtin: { value: module_builtin, writable: true, configurable: true }
});
function module_redefine(name) {
  const v = this._scope.get(name);
  if (!v) throw new RuntimeError(`${name} is not defined`);
  if (v._type === TYPE_DUPLICATE) throw new RuntimeError(`${name} is defined more than once`);
  return v.define.apply(v, arguments);
}
function module_define() {
  const v = new Variable(TYPE_NORMAL, this);
  return v.define.apply(v, arguments);
}
function module_import() {
  const v = new Variable(TYPE_NORMAL, this);
  return v.import.apply(v, arguments);
}
function module_variable(observer, options2) {
  return new Variable(TYPE_NORMAL, this, observer, options2);
}
async function module_value(name) {
  let v = this._scope.get(name);
  if (!v) throw new RuntimeError(`${name} is not defined`);
  if (v._observer === no_observer) {
    v = this.variable(true).define([name], identity);
    try {
      return await module_revalue(this._runtime, v);
    } finally {
      v.delete();
    }
  } else {
    return module_revalue(this._runtime, v);
  }
}
async function module_revalue(runtime3, variable) {
  await runtime3._compute();
  try {
    return await variable._promise;
  } catch (error) {
    if (error === variable_stale) return module_revalue(runtime3, variable);
    throw error;
  }
}
function module_derive(injects, injectModule) {
  const map2 = /* @__PURE__ */ new Map();
  const modules = /* @__PURE__ */ new Set();
  const copies = [];
  function alias(source) {
    let target = map2.get(source);
    if (target) return target;
    target = new Module(source._runtime, source._builtins);
    target._source = source;
    map2.set(source, target);
    copies.push([target, source]);
    modules.add(source);
    return target;
  }
  const derive = alias(this);
  for (const inject of injects) {
    const { alias: alias2, name } = typeof inject === "object" ? inject : { name: inject };
    derive.import(name, alias2 == null ? name : alias2, injectModule);
  }
  for (const module of modules) {
    for (const [name, variable] of module._scope) {
      if (variable._definition === identity) {
        if (module === this && derive._scope.has(name)) continue;
        const importedModule = variable._inputs[0]._module;
        if (importedModule._source) alias(importedModule);
      }
    }
  }
  for (const [target, source] of copies) {
    for (const [name, sourceVariable] of source._scope) {
      const targetVariable = target._scope.get(name);
      if (targetVariable && targetVariable._type !== TYPE_IMPLICIT) continue;
      if (sourceVariable._definition === identity) {
        const sourceInput = sourceVariable._inputs[0];
        const sourceModule = sourceInput._module;
        target.import(sourceInput._name, name, map2.get(sourceModule) || sourceModule);
      } else {
        target.define(name, sourceVariable._inputs.map(variable_name), sourceVariable._definition);
      }
    }
  }
  return derive;
}
function module_resolve(name) {
  let variable = this._scope.get(name);
  if (!variable) {
    variable = new Variable(TYPE_IMPLICIT, this);
    if (this._builtins.has(name)) {
      variable.define(name, constant(this._builtins.get(name)));
    } else if (this._runtime._builtin._scope.has(name)) {
      variable.import(name, this._runtime._builtin);
    } else {
      variable.define(name, () => this._runtime._global(name));
    }
  }
  return variable;
}
function module_builtin(name, value) {
  this._builtins.set(name, value);
}
function variable_name(variable) {
  return variable._name;
}

// node_modules/@observablehq/runtime/src/runtime.js
var frame = typeof requestAnimationFrame === "function" ? requestAnimationFrame : typeof setImmediate === "function" ? setImmediate : (f) => setTimeout(f, 0);
function Runtime(builtins, global = window_global) {
  const builtin = this.module();
  Object.defineProperties(this, {
    _dirty: { value: /* @__PURE__ */ new Set() },
    _updates: { value: /* @__PURE__ */ new Set() },
    _precomputes: { value: [], writable: true },
    _computing: { value: null, writable: true },
    _init: { value: null, writable: true },
    _modules: { value: /* @__PURE__ */ new Map() },
    _variables: { value: /* @__PURE__ */ new Set() },
    _disposed: { value: false, writable: true },
    _builtin: { value: builtin },
    _global: { value: global }
  });
  if (builtins) for (const name in builtins) {
    new Variable(TYPE_IMPLICIT, builtin).define(name, [], builtins[name]);
  }
}
Object.defineProperties(Runtime.prototype, {
  _precompute: { value: runtime_precompute, writable: true, configurable: true },
  _compute: { value: runtime_compute, writable: true, configurable: true },
  _computeSoon: { value: runtime_computeSoon, writable: true, configurable: true },
  _computeNow: { value: runtime_computeNow, writable: true, configurable: true },
  dispose: { value: runtime_dispose, writable: true, configurable: true },
  module: { value: runtime_module, writable: true, configurable: true }
});
function runtime_dispose() {
  this._computing = Promise.resolve();
  this._disposed = true;
  this._variables.forEach((v) => v.dispose());
}
function runtime_module(define3, observer = noop) {
  let module;
  if (define3 === void 0) {
    if (module = this._init) {
      this._init = null;
      return module;
    }
    return new Module(this);
  }
  module = this._modules.get(define3);
  if (module) return module;
  this._init = module = new Module(this);
  this._modules.set(define3, module);
  try {
    define3(this, observer);
  } finally {
    this._init = null;
  }
  return module;
}
function runtime_precompute(callback) {
  this._precomputes.push(callback);
  this._compute();
}
function runtime_compute() {
  return this._computing || (this._computing = this._computeSoon());
}
function runtime_computeSoon() {
  return new Promise(frame).then(() => this._disposed ? void 0 : this._computeNow());
}
async function runtime_computeNow() {
  let queue2 = [], variables, variable, precomputes = this._precomputes;
  if (precomputes.length) {
    this._precomputes = [];
    for (const callback of precomputes) callback();
    await runtime_defer(3);
  }
  variables = new Set(this._dirty);
  variables.forEach(function(variable2) {
    variable2._inputs.forEach(variables.add, variables);
    const reachable = variable_reachable(variable2);
    if (reachable > variable2._reachable) {
      this._updates.add(variable2);
    } else if (reachable < variable2._reachable) {
      variable2._invalidate();
    }
    variable2._reachable = reachable;
  }, this);
  variables = new Set(this._updates);
  variables.forEach(function(variable2) {
    if (variable2._reachable) {
      variable2._indegree = 0;
      variable2._outputs.forEach(variables.add, variables);
    } else {
      variable2._indegree = NaN;
      variables.delete(variable2);
    }
  });
  this._computing = null;
  this._updates.clear();
  this._dirty.clear();
  variables.forEach(function(variable2) {
    variable2._outputs.forEach(variable_increment);
  });
  do {
    variables.forEach(function(variable2) {
      if (variable2._indegree === 0) {
        queue2.push(variable2);
      }
    });
    while (variable = queue2.pop()) {
      variable_compute(variable);
      variable._outputs.forEach(postqueue);
      variables.delete(variable);
    }
    variables.forEach(function(variable2) {
      if (variable_circular(variable2)) {
        variable_error(variable2, new RuntimeError("circular definition"));
        variable2._outputs.forEach(variable_decrement);
        variables.delete(variable2);
      }
    });
  } while (variables.size);
  function postqueue(variable2) {
    if (--variable2._indegree === 0) {
      queue2.push(variable2);
    }
  }
}
function runtime_defer(depth = 0) {
  let p = Promise.resolve();
  for (let i2 = 0; i2 < depth; ++i2) p = p.then(() => {
  });
  return p;
}
function variable_circular(variable) {
  const inputs = new Set(variable._inputs);
  for (const i2 of inputs) {
    if (i2 === variable) return true;
    i2._inputs.forEach(inputs.add, inputs);
  }
  return false;
}
function variable_increment(variable) {
  ++variable._indegree;
}
function variable_decrement(variable) {
  --variable._indegree;
}
function variable_value(variable) {
  return variable._promise.catch(variable._rejector);
}
function variable_invalidator(variable) {
  return new Promise(function(resolve) {
    variable._invalidate = resolve;
  });
}
function variable_intersector(invalidation, variable) {
  let node = typeof IntersectionObserver === "function" && variable._observer && variable._observer._node;
  let visible = !node, resolve = noop, reject = noop, promise, observer;
  if (node) {
    observer = new IntersectionObserver(([entry]) => (visible = entry.isIntersecting) && (promise = null, resolve()));
    observer.observe(node);
    invalidation.then(() => (observer.disconnect(), observer = null, reject()));
  }
  return function(value) {
    if (visible) return Promise.resolve(value);
    if (!observer) return Promise.reject();
    if (!promise) promise = new Promise((y, n) => (resolve = y, reject = n));
    return promise.then(() => value);
  };
}
function variable_compute(variable) {
  variable._invalidate();
  variable._invalidate = noop;
  variable._pending();
  const value0 = variable._value;
  const version2 = ++variable._version;
  const inputs = variable._inputs;
  const definition = variable._definition;
  let invalidation = null;
  const promise = variable._promise = variable._promise.then(init, init).then(define3).then(generate);
  function init() {
    return Promise.all(inputs.map(variable_value));
  }
  function define3(inputs2) {
    if (variable._version !== version2) throw variable_stale;
    for (let i2 = 0, n = inputs2.length; i2 < n; ++i2) {
      switch (inputs2[i2]) {
        case variable_invalidation: {
          inputs2[i2] = invalidation = variable_invalidator(variable);
          break;
        }
        case variable_visibility: {
          if (!invalidation) invalidation = variable_invalidator(variable);
          inputs2[i2] = variable_intersector(invalidation, variable);
          break;
        }
        case variable_variable: {
          inputs2[i2] = variable;
          break;
        }
      }
    }
    return definition.apply(value0, inputs2);
  }
  function generate(value) {
    if (variable._version !== version2) throw variable_stale;
    if (generatorish(value)) {
      (invalidation || variable_invalidator(variable)).then(variable_return(value));
      return variable_generate(variable, version2, value);
    }
    return value;
  }
  promise.then((value) => {
    variable._value = value;
    variable._fulfilled(value);
  }, (error) => {
    if (error === variable_stale || variable._version !== version2) return;
    variable._value = void 0;
    variable._rejected(error);
  });
}
function variable_generate(variable, version2, generator) {
  const runtime3 = variable._module._runtime;
  let currentValue;
  function compute(onfulfilled) {
    return new Promise((resolve) => resolve(generator.next(currentValue))).then(({ done, value }) => {
      return done ? void 0 : Promise.resolve(value).then(onfulfilled);
    });
  }
  function recompute() {
    const promise = compute((value) => {
      if (variable._version !== version2) throw variable_stale;
      currentValue = value;
      postcompute(value, promise).then(() => runtime3._precompute(recompute));
      variable._fulfilled(value);
      return value;
    });
    promise.catch((error) => {
      if (error === variable_stale || variable._version !== version2) return;
      postcompute(void 0, promise);
      variable._rejected(error);
    });
  }
  function postcompute(value, promise) {
    variable._value = value;
    variable._promise = promise;
    variable._outputs.forEach(runtime3._updates.add, runtime3._updates);
    return runtime3._compute();
  }
  return compute((value) => {
    if (variable._version !== version2) throw variable_stale;
    currentValue = value;
    runtime3._precompute(recompute);
    return value;
  });
}
function variable_error(variable, error) {
  variable._invalidate();
  variable._invalidate = noop;
  variable._pending();
  ++variable._version;
  variable._indegree = NaN;
  (variable._promise = Promise.reject(error)).catch(noop);
  variable._value = void 0;
  variable._rejected(error);
}
function variable_return(generator) {
  return function() {
    generator.return();
  };
}
function variable_reachable(variable) {
  if (variable._observer !== no_observer) return true;
  const outputs = new Set(variable._outputs);
  for (const output of outputs) {
    if (output._observer !== no_observer) return true;
    output._outputs.forEach(outputs.add, outputs);
  }
  return false;
}
function window_global(name) {
  if (name in globalThis) return globalThis[name];
  throw variable_undefined;
}

// node_modules/@observablehq/notebook-kit/dist/src/lib/unprefix.js
function unprefix(name, prefix) {
  if (!name.startsWith(prefix))
    throw new Error(`expected ${prefix}: ${name}`);
  return name.slice(prefix.length);
}

// node_modules/@observablehq/inspector/src/dispatch.js
function dispatch(node, type, detail) {
  detail = detail || {};
  var document2 = node.ownerDocument, event = document2.defaultView.CustomEvent;
  if (typeof event === "function") {
    event = new event(type, { detail });
  } else {
    event = document2.createEvent("Event");
    event.initEvent(type, false, false);
    event.detail = detail;
  }
  node.dispatchEvent(event);
}

// node_modules/@observablehq/inspector/src/array.js
function isarray(value) {
  return Array.isArray(value) || value instanceof Int8Array || value instanceof Int16Array || value instanceof Int32Array || value instanceof Uint8Array || value instanceof Uint8ClampedArray || value instanceof Uint16Array || value instanceof Uint32Array || value instanceof Float32Array || value instanceof Float64Array;
}
function isindex(key) {
  return key === (key | 0) + "";
}

// node_modules/@observablehq/inspector/src/inspectName.js
function inspectName(name) {
  const n = document.createElement("span");
  n.className = "observablehq--cellname";
  n.textContent = `${name} = `;
  return n;
}

// node_modules/@observablehq/inspector/src/formatSymbol.js
var symbolToString = Symbol.prototype.toString;
function formatSymbol(symbol) {
  return symbolToString.call(symbol);
}

// node_modules/@observablehq/inspector/src/object.js
var { getOwnPropertySymbols, prototype: { hasOwnProperty: hasOwnProperty2 } } = Object;
var { toStringTag } = Symbol;
var FORBIDDEN = {};
var symbolsof = getOwnPropertySymbols;
function isown(object, key) {
  return hasOwnProperty2.call(object, key);
}
function tagof(object) {
  return object[toStringTag] || object.constructor && object.constructor.name || "Object";
}
function valueof(object, key) {
  try {
    const value = object[key];
    if (value) value.constructor;
    return value;
  } catch (ignore2) {
    return FORBIDDEN;
  }
}

// node_modules/@observablehq/inspector/src/immutable.js
var SYMBOLS = [
  { symbol: "@@__IMMUTABLE_INDEXED__@@", name: "Indexed", modifier: true },
  { symbol: "@@__IMMUTABLE_KEYED__@@", name: "Keyed", modifier: true },
  { symbol: "@@__IMMUTABLE_LIST__@@", name: "List", arrayish: true },
  { symbol: "@@__IMMUTABLE_MAP__@@", name: "Map" },
  {
    symbol: "@@__IMMUTABLE_ORDERED__@@",
    name: "Ordered",
    modifier: true,
    prefix: true
  },
  { symbol: "@@__IMMUTABLE_RECORD__@@", name: "Record" },
  {
    symbol: "@@__IMMUTABLE_SET__@@",
    name: "Set",
    arrayish: true,
    setish: true
  },
  { symbol: "@@__IMMUTABLE_STACK__@@", name: "Stack", arrayish: true }
];
function immutableName(obj) {
  try {
    let symbols = SYMBOLS.filter(({ symbol }) => obj[symbol] === true);
    if (!symbols.length) return;
    const name = symbols.find((s) => !s.modifier);
    const prefix = name.name === "Map" && symbols.find((s) => s.modifier && s.prefix);
    const arrayish = symbols.some((s) => s.arrayish);
    const setish = symbols.some((s) => s.setish);
    return {
      name: `${prefix ? prefix.name : ""}${name.name}`,
      symbols,
      arrayish: arrayish && !setish,
      setish
    };
  } catch (e) {
    return null;
  }
}

// node_modules/@observablehq/inspector/src/expanded.js
var { getPrototypeOf, getOwnPropertyDescriptors } = Object;
var objectPrototype = getPrototypeOf({});
function inspectExpanded(object, _2, name, proto) {
  let arrayish = isarray(object);
  let tag, fields, next, n;
  if (object instanceof Map) {
    if (object instanceof object.constructor) {
      tag = `Map(${object.size})`;
      fields = iterateMap;
    } else {
      tag = "Map()";
      fields = iterateObject;
    }
  } else if (object instanceof Set) {
    if (object instanceof object.constructor) {
      tag = `Set(${object.size})`;
      fields = iterateSet;
    } else {
      tag = "Set()";
      fields = iterateObject;
    }
  } else if (arrayish) {
    tag = `${object.constructor.name}(${object.length})`;
    fields = iterateArray;
  } else if (n = immutableName(object)) {
    tag = `Immutable.${n.name}${n.name === "Record" ? "" : `(${object.size})`}`;
    arrayish = n.arrayish;
    fields = n.arrayish ? iterateImArray : n.setish ? iterateImSet : iterateImObject;
  } else if (proto) {
    tag = tagof(object);
    fields = iterateProto;
  } else {
    tag = tagof(object);
    fields = iterateObject;
  }
  const span = document.createElement("span");
  span.className = "observablehq--expanded";
  if (name) {
    span.appendChild(inspectName(name));
  }
  const a = span.appendChild(document.createElement("a"));
  a.innerHTML = `<svg width=8 height=8 class='observablehq--caret'>
    <path d='M4 7L0 1h8z' fill='currentColor' />
  </svg>`;
  a.appendChild(document.createTextNode(`${tag}${arrayish ? " [" : " {"}`));
  a.addEventListener("mouseup", function(event) {
    event.stopPropagation();
    replace(span, inspectCollapsed(object, null, name, proto));
  });
  fields = fields(object);
  for (let i2 = 0; !(next = fields.next()).done && i2 < 20; ++i2) {
    span.appendChild(next.value);
  }
  if (!next.done) {
    const a2 = span.appendChild(document.createElement("a"));
    a2.className = "observablehq--field";
    a2.style.display = "block";
    a2.appendChild(document.createTextNode(`  \u2026 more`));
    a2.addEventListener("mouseup", function(event) {
      event.stopPropagation();
      span.insertBefore(next.value, span.lastChild.previousSibling);
      for (let i2 = 0; !(next = fields.next()).done && i2 < 19; ++i2) {
        span.insertBefore(next.value, span.lastChild.previousSibling);
      }
      if (next.done) span.removeChild(span.lastChild.previousSibling);
      dispatch(span, "load");
    });
  }
  span.appendChild(document.createTextNode(arrayish ? "]" : "}"));
  return span;
}
function* iterateMap(map2) {
  for (const [key, value] of map2) {
    yield formatMapField(key, value);
  }
  yield* iterateObject(map2);
}
function* iterateSet(set) {
  for (const value of set) {
    yield formatSetField(value);
  }
  yield* iterateObject(set);
}
function* iterateImSet(set) {
  for (const value of set) {
    yield formatSetField(value);
  }
}
function* iterateArray(array) {
  for (let i2 = 0, n = array.length; i2 < n; ++i2) {
    if (i2 in array) {
      yield formatField(i2, valueof(array, i2), "observablehq--index");
    }
  }
  for (const key in array) {
    if (!isindex(key) && isown(array, key)) {
      yield formatField(key, valueof(array, key), "observablehq--key");
    }
  }
  for (const symbol of symbolsof(array)) {
    yield formatField(
      formatSymbol(symbol),
      valueof(array, symbol),
      "observablehq--symbol"
    );
  }
}
function* iterateImArray(array) {
  let i1 = 0;
  for (const n = array.size; i1 < n; ++i1) {
    yield formatField(i1, array.get(i1), true);
  }
}
function* iterateProto(object) {
  for (const key in getOwnPropertyDescriptors(object)) {
    yield formatField(key, valueof(object, key), "observablehq--key");
  }
  for (const symbol of symbolsof(object)) {
    yield formatField(
      formatSymbol(symbol),
      valueof(object, symbol),
      "observablehq--symbol"
    );
  }
  const proto = getPrototypeOf(object);
  if (proto && proto !== objectPrototype) {
    yield formatPrototype(proto);
  }
}
function* iterateObject(object) {
  for (const key in object) {
    if (isown(object, key)) {
      yield formatField(key, valueof(object, key), "observablehq--key");
    }
  }
  for (const symbol of symbolsof(object)) {
    yield formatField(
      formatSymbol(symbol),
      valueof(object, symbol),
      "observablehq--symbol"
    );
  }
  const proto = getPrototypeOf(object);
  if (proto && proto !== objectPrototype) {
    yield formatPrototype(proto);
  }
}
function* iterateImObject(object) {
  for (const [key, value] of object) {
    yield formatField(key, value, "observablehq--key");
  }
}
function formatPrototype(value) {
  const item = document.createElement("div");
  const span = item.appendChild(document.createElement("span"));
  item.className = "observablehq--field";
  span.className = "observablehq--prototype-key";
  span.textContent = `  <prototype>`;
  item.appendChild(document.createTextNode(": "));
  item.appendChild(inspect(value, void 0, void 0, void 0, true));
  return item;
}
function formatField(key, value, className) {
  const item = document.createElement("div");
  const span = item.appendChild(document.createElement("span"));
  item.className = "observablehq--field";
  span.className = className;
  span.textContent = `  ${key}`;
  item.appendChild(document.createTextNode(": "));
  item.appendChild(inspect(value));
  return item;
}
function formatMapField(key, value) {
  const item = document.createElement("div");
  item.className = "observablehq--field";
  item.appendChild(document.createTextNode("  "));
  item.appendChild(inspect(key));
  item.appendChild(document.createTextNode(" => "));
  item.appendChild(inspect(value));
  return item;
}
function formatSetField(value) {
  const item = document.createElement("div");
  item.className = "observablehq--field";
  item.appendChild(document.createTextNode("  "));
  item.appendChild(inspect(value));
  return item;
}

// node_modules/@observablehq/inspector/src/collapsed.js
function hasSelection(elem) {
  const sel = window.getSelection();
  return sel.type === "Range" && (sel.containsNode(elem, true) || elem.contains(sel.anchorNode) || elem.contains(sel.focusNode));
}
function inspectCollapsed(object, shallow, name, proto) {
  let arrayish = isarray(object);
  let tag, fields, next, n;
  if (object instanceof Map) {
    if (object instanceof object.constructor) {
      tag = `Map(${object.size})`;
      fields = iterateMap2;
    } else {
      tag = "Map()";
      fields = iterateObject2;
    }
  } else if (object instanceof Set) {
    if (object instanceof object.constructor) {
      tag = `Set(${object.size})`;
      fields = iterateSet2;
    } else {
      tag = "Set()";
      fields = iterateObject2;
    }
  } else if (arrayish) {
    tag = `${object.constructor.name}(${object.length})`;
    fields = iterateArray2;
  } else if (n = immutableName(object)) {
    tag = `Immutable.${n.name}${n.name === "Record" ? "" : `(${object.size})`}`;
    arrayish = n.arrayish;
    fields = n.arrayish ? iterateImArray2 : n.setish ? iterateImSet2 : iterateImObject2;
  } else {
    tag = tagof(object);
    fields = iterateObject2;
  }
  if (shallow) {
    const span2 = document.createElement("span");
    span2.className = "observablehq--shallow";
    if (name) {
      span2.appendChild(inspectName(name));
    }
    span2.appendChild(document.createTextNode(tag));
    span2.addEventListener("mouseup", function(event) {
      if (hasSelection(span2)) return;
      event.stopPropagation();
      replace(span2, inspectCollapsed(object));
    });
    return span2;
  }
  const span = document.createElement("span");
  span.className = "observablehq--collapsed";
  if (name) {
    span.appendChild(inspectName(name));
  }
  const a = span.appendChild(document.createElement("a"));
  a.innerHTML = `<svg width=8 height=8 class='observablehq--caret'>
    <path d='M7 4L1 8V0z' fill='currentColor' />
  </svg>`;
  a.appendChild(document.createTextNode(`${tag}${arrayish ? " [" : " {"}`));
  span.addEventListener("mouseup", function(event) {
    if (hasSelection(span)) return;
    event.stopPropagation();
    replace(span, inspectExpanded(object, null, name, proto));
  }, true);
  fields = fields(object);
  for (let i2 = 0; !(next = fields.next()).done && i2 < 20; ++i2) {
    if (i2 > 0) span.appendChild(document.createTextNode(", "));
    span.appendChild(next.value);
  }
  if (!next.done) span.appendChild(document.createTextNode(", \u2026"));
  span.appendChild(document.createTextNode(arrayish ? "]" : "}"));
  return span;
}
function* iterateMap2(map2) {
  for (const [key, value] of map2) {
    yield formatMapField2(key, value);
  }
  yield* iterateObject2(map2);
}
function* iterateSet2(set) {
  for (const value of set) {
    yield inspect(value, true);
  }
  yield* iterateObject2(set);
}
function* iterateImSet2(set) {
  for (const value of set) {
    yield inspect(value, true);
  }
}
function* iterateImArray2(array) {
  let i0 = -1, i1 = 0;
  for (const n = array.size; i1 < n; ++i1) {
    if (i1 > i0 + 1) yield formatEmpty(i1 - i0 - 1);
    yield inspect(array.get(i1), true);
    i0 = i1;
  }
  if (i1 > i0 + 1) yield formatEmpty(i1 - i0 - 1);
}
function* iterateArray2(array) {
  let i0 = -1, i1 = 0;
  for (const n = array.length; i1 < n; ++i1) {
    if (i1 in array) {
      if (i1 > i0 + 1) yield formatEmpty(i1 - i0 - 1);
      yield inspect(valueof(array, i1), true);
      i0 = i1;
    }
  }
  if (i1 > i0 + 1) yield formatEmpty(i1 - i0 - 1);
  for (const key in array) {
    if (!isindex(key) && isown(array, key)) {
      yield formatField2(key, valueof(array, key), "observablehq--key");
    }
  }
  for (const symbol of symbolsof(array)) {
    yield formatField2(formatSymbol(symbol), valueof(array, symbol), "observablehq--symbol");
  }
}
function* iterateObject2(object) {
  for (const key in object) {
    if (isown(object, key)) {
      yield formatField2(key, valueof(object, key), "observablehq--key");
    }
  }
  for (const symbol of symbolsof(object)) {
    yield formatField2(formatSymbol(symbol), valueof(object, symbol), "observablehq--symbol");
  }
}
function* iterateImObject2(object) {
  for (const [key, value] of object) {
    yield formatField2(key, value, "observablehq--key");
  }
}
function formatEmpty(e) {
  const span = document.createElement("span");
  span.className = "observablehq--empty";
  span.textContent = e === 1 ? "empty" : `empty \xD7 ${e}`;
  return span;
}
function formatField2(key, value, className) {
  const fragment = document.createDocumentFragment();
  const span = fragment.appendChild(document.createElement("span"));
  span.className = className;
  span.textContent = key;
  fragment.appendChild(document.createTextNode(": "));
  fragment.appendChild(inspect(value, true));
  return fragment;
}
function formatMapField2(key, value) {
  const fragment = document.createDocumentFragment();
  fragment.appendChild(inspect(key, true));
  fragment.appendChild(document.createTextNode(" => "));
  fragment.appendChild(inspect(value, true));
  return fragment;
}

// node_modules/isoformat/src/format.js
function format(date, fallback) {
  if (!(date instanceof Date)) date = /* @__PURE__ */ new Date(+date);
  if (isNaN(date)) return typeof fallback === "function" ? fallback(date) : fallback;
  const hours = date.getUTCHours();
  const minutes = date.getUTCMinutes();
  const seconds = date.getUTCSeconds();
  const milliseconds = date.getUTCMilliseconds();
  return `${formatYear(date.getUTCFullYear(), 4)}-${pad(date.getUTCMonth() + 1, 2)}-${pad(date.getUTCDate(), 2)}${hours || minutes || seconds || milliseconds ? `T${pad(hours, 2)}:${pad(minutes, 2)}${seconds || milliseconds ? `:${pad(seconds, 2)}${milliseconds ? `.${pad(milliseconds, 3)}` : ``}` : ``}Z` : ``}`;
}
function formatYear(year) {
  return year < 0 ? `-${pad(-year, 6)}` : year > 9999 ? `+${pad(year, 6)}` : pad(year, 4);
}
function pad(value, width2) {
  return `${value}`.padStart(width2, "0");
}

// node_modules/@observablehq/inspector/src/formatDate.js
function formatDate(date) {
  return format(date, "Invalid Date");
}

// node_modules/@observablehq/inspector/src/formatError.js
var errorToString = Error.prototype.toString;
function formatError(value) {
  return value.stack || errorToString.call(value);
}

// node_modules/@observablehq/inspector/src/formatRegExp.js
var regExpToString = RegExp.prototype.toString;
function formatRegExp(value) {
  return regExpToString.call(value);
}

// node_modules/@observablehq/inspector/src/formatString.js
var NEWLINE_LIMIT = 20;
function formatString(string, shallow, expanded, name) {
  if (shallow === false) {
    if (count(string, /["\n]/g) <= count(string, /`|\${/g)) {
      const span3 = document.createElement("span");
      if (name) span3.appendChild(inspectName(name));
      const textValue3 = span3.appendChild(document.createElement("span"));
      textValue3.className = "observablehq--string";
      textValue3.textContent = JSON.stringify(string);
      return span3;
    }
    const lines = string.split("\n");
    if (lines.length > NEWLINE_LIMIT && !expanded) {
      const div = document.createElement("div");
      if (name) div.appendChild(inspectName(name));
      const textValue3 = div.appendChild(document.createElement("span"));
      textValue3.className = "observablehq--string";
      textValue3.textContent = "`" + templatify(lines.slice(0, NEWLINE_LIMIT).join("\n"));
      const splitter = div.appendChild(document.createElement("span"));
      const truncatedCount = lines.length - NEWLINE_LIMIT;
      splitter.textContent = `Show ${truncatedCount} truncated line${truncatedCount > 1 ? "s" : ""}`;
      splitter.className = "observablehq--string-expand";
      splitter.addEventListener("mouseup", function(event) {
        event.stopPropagation();
        replace(div, inspect(string, shallow, true, name));
      });
      return div;
    }
    const span2 = document.createElement("span");
    if (name) span2.appendChild(inspectName(name));
    const textValue2 = span2.appendChild(document.createElement("span"));
    textValue2.className = `observablehq--string${expanded ? " observablehq--expanded" : ""}`;
    textValue2.textContent = "`" + templatify(string) + "`";
    return span2;
  }
  const span = document.createElement("span");
  if (name) span.appendChild(inspectName(name));
  const textValue = span.appendChild(document.createElement("span"));
  textValue.className = "observablehq--string";
  textValue.textContent = JSON.stringify(string.length > 100 ? `${string.slice(0, 50)}\u2026${string.slice(-49)}` : string);
  return span;
}
function templatify(string) {
  return string.replace(/[\\`\x00-\x09\x0b-\x19]|\${/g, templatifyChar);
}
function templatifyChar(char) {
  var code = char.charCodeAt(0);
  switch (code) {
    case 8:
      return "\\b";
    case 9:
      return "\\t";
    case 11:
      return "\\v";
    case 12:
      return "\\f";
    case 13:
      return "\\r";
  }
  return code < 16 ? "\\x0" + code.toString(16) : code < 32 ? "\\x" + code.toString(16) : "\\" + char;
}
function count(string, re) {
  var n = 0;
  while (re.exec(string)) ++n;
  return n;
}

// node_modules/@observablehq/inspector/src/inspectFunction.js
var toString2 = Function.prototype.toString;
var TYPE_ASYNC = { prefix: "async \u0192" };
var TYPE_ASYNC_GENERATOR = { prefix: "async \u0192*" };
var TYPE_CLASS = { prefix: "class" };
var TYPE_FUNCTION = { prefix: "\u0192" };
var TYPE_GENERATOR = { prefix: "\u0192*" };
function inspectFunction(f, name) {
  var type, m, t = toString2.call(f);
  switch (f.constructor && f.constructor.name) {
    case "AsyncFunction":
      type = TYPE_ASYNC;
      break;
    case "AsyncGeneratorFunction":
      type = TYPE_ASYNC_GENERATOR;
      break;
    case "GeneratorFunction":
      type = TYPE_GENERATOR;
      break;
    default:
      type = /^class\b/.test(t) ? TYPE_CLASS : TYPE_FUNCTION;
      break;
  }
  if (type === TYPE_CLASS) {
    return formatFunction(type, "", name);
  }
  if (m = /^(?:async\s*)?(\w+)\s*=>/.exec(t)) {
    return formatFunction(type, "(" + m[1] + ")", name);
  }
  if (m = /^(?:async\s*)?\(\s*(\w+(?:\s*,\s*\w+)*)?\s*\)/.exec(t)) {
    return formatFunction(type, m[1] ? "(" + m[1].replace(/\s*,\s*/g, ", ") + ")" : "()", name);
  }
  if (m = /^(?:async\s*)?function(?:\s*\*)?(?:\s*\w+)?\s*\(\s*(\w+(?:\s*,\s*\w+)*)?\s*\)/.exec(t)) {
    return formatFunction(type, m[1] ? "(" + m[1].replace(/\s*,\s*/g, ", ") + ")" : "()", name);
  }
  return formatFunction(type, "(\u2026)", name);
}
function formatFunction(type, args, cellname) {
  var span = document.createElement("span");
  span.className = "observablehq--function";
  if (cellname) {
    span.appendChild(inspectName(cellname));
  }
  var spanType = span.appendChild(document.createElement("span"));
  spanType.className = "observablehq--keyword";
  spanType.textContent = type.prefix;
  span.appendChild(document.createTextNode(args));
  return span;
}

// node_modules/@observablehq/inspector/src/inspect.js
var { prototype: { toString: toString3 } } = Object;
function inspect(value, shallow, expand, name, proto) {
  let type = typeof value;
  switch (type) {
    case "boolean":
    case "undefined": {
      value += "";
      break;
    }
    case "number": {
      value = value === 0 && 1 / value < 0 ? "-0" : value + "";
      break;
    }
    case "bigint": {
      value = value + "n";
      break;
    }
    case "symbol": {
      value = formatSymbol(value, name);
      break;
    }
    case "function": {
      return inspectFunction(value, name);
    }
    case "string": {
      return formatString(value, shallow, expand, name);
    }
    default: {
      if (value === null) {
        type = null, value = "null";
        break;
      }
      if (value instanceof Date) {
        type = "date", value = formatDate(value, name);
        break;
      }
      if (value === FORBIDDEN) {
        type = "forbidden", value = "[forbidden]";
        break;
      }
      switch (toString3.call(value)) {
        case "[object RegExp]": {
          type = "regexp", value = formatRegExp(value, name);
          break;
        }
        case "[object Error]":
        // https://github.com/lodash/lodash/blob/master/isError.js#L26
        case "[object DOMException]": {
          type = "error", value = formatError(value, name);
          break;
        }
        default:
          return (expand ? inspectExpanded : inspectCollapsed)(value, shallow, name, proto);
      }
      break;
    }
  }
  const span = document.createElement("span");
  if (name) span.appendChild(inspectName(name));
  const n = span.appendChild(document.createElement("span"));
  n.className = `observablehq--${type}`;
  n.textContent = value;
  return span;
}
function replace(spanOld, spanNew) {
  if (spanOld.classList.contains("observablehq--inspect")) spanNew.classList.add("observablehq--inspect");
  spanOld.parentNode.replaceChild(spanNew, spanOld);
  dispatch(spanNew, "load");
}

// node_modules/@observablehq/inspector/src/index.js
var LOCATION_MATCH = /\s+\(\d+:\d+\)$/m;
var Inspector = class {
  constructor(node) {
    if (!node) throw new Error("invalid node");
    this._node = node;
    node.classList.add("observablehq");
  }
  pending() {
    const { _node } = this;
    _node.classList.remove("observablehq--error");
    _node.classList.add("observablehq--running");
  }
  fulfilled(value, name) {
    const { _node } = this;
    if (!isnode(value) || value.parentNode && value.parentNode !== _node) {
      value = inspect(value, false, _node.firstChild && _node.firstChild.classList && _node.firstChild.classList.contains("observablehq--expanded"), name);
      value.classList.add("observablehq--inspect");
    }
    _node.classList.remove("observablehq--running", "observablehq--error");
    if (_node.firstChild !== value) {
      if (_node.firstChild) {
        while (_node.lastChild !== _node.firstChild) _node.removeChild(_node.lastChild);
        _node.replaceChild(value, _node.firstChild);
      } else {
        _node.appendChild(value);
      }
    }
    dispatch(_node, "update");
  }
  rejected(error, name) {
    const { _node } = this;
    _node.classList.remove("observablehq--running");
    _node.classList.add("observablehq--error");
    while (_node.lastChild) _node.removeChild(_node.lastChild);
    var div = document.createElement("div");
    div.className = "observablehq--inspect";
    if (name) div.appendChild(inspectName(name));
    div.appendChild(document.createTextNode((error + "").replace(LOCATION_MATCH, "")));
    _node.appendChild(div);
    dispatch(_node, "error", { error });
  }
};
Inspector.into = function(container) {
  if (typeof container === "string") {
    container = document.querySelector(container);
    if (container == null) throw new Error("container not found");
  }
  return function() {
    return new Inspector(container.appendChild(document.createElement("div")));
  };
};
function isnode(value) {
  return (value instanceof Element || value instanceof Text) && value instanceof value.constructor;
}

// node_modules/@observablehq/notebook-kit/dist/src/runtime/inspect.js
function inspect2(value, expanded, name) {
  const node = document.createElement("div");
  new Inspector(node).fulfilled(value, name);
  if (expanded) {
    for (const path of expanded) {
      let child = node;
      for (const i2 of path)
        child = child?.childNodes[i2];
      child?.dispatchEvent(new Event("mouseup"));
    }
  }
  return node;
}
function inspectError(value, name) {
  const node = document.createElement("div");
  new Inspector(node).rejected(value, name);
  return node;
}
function getExpanded(node) {
  if (!isInspector(node))
    return;
  const expanded = node.querySelectorAll(".observablehq--expanded");
  if (expanded.length)
    return Array.from(expanded, (e) => getNodePath(node, e));
}
function isElement(node) {
  return node.nodeType === 1;
}
function isInspector(node) {
  return isElement(node) && node.classList.contains("observablehq");
}
function getNodePath(node, descendant) {
  const path = [];
  while (descendant !== node) {
    path.push(getChildIndex(descendant));
    descendant = descendant.parentNode;
  }
  return path.reverse();
}
function getChildIndex(node) {
  return Array.prototype.indexOf.call(node.parentNode.childNodes, node);
}

// node_modules/@observablehq/notebook-kit/dist/src/runtime/stdlib/assets.js
var SRC_SELECTOR = [
  "audio source[src]",
  // audio
  "audio[src]",
  // audio
  "img[src]",
  // images
  "picture source[src]",
  // images
  "video source[src]",
  // videos
  "video[src]"
  // videos
].join();
var SRCSET_SELECTOR = [
  "img[srcset]",
  // images
  "picture source[srcset]"
  // images
].join();
var HREF_SELECTOR = [
  "a[href][download]",
  // download links
  "link[href]"
  // stylesheets
].join();
var ASSET_ATTRIBUTES = [
  [SRC_SELECTOR, "src"],
  [SRCSET_SELECTOR, "srcset"],
  [HREF_SELECTOR, "href"]
];
function mapAssets(root2, assets) {
  const resolve = (s) => assets.get(asImportPath(s)) ?? s;
  for (const [selector, src] of ASSET_ATTRIBUTES) {
    for (const element2 of root2.querySelectorAll(selector)) {
      if (isRelExternal(element2))
        continue;
      const source = decodeURI(element2.getAttribute(src));
      if (src === "srcset")
        element2.setAttribute(src, resolveSrcset(source, resolve));
      else
        element2.setAttribute(src, resolve(source));
    }
  }
}
function isRelExternal(a) {
  return /(?:^|\s)external(?:\s|$)/i.test(a.getAttribute("rel") ?? "");
}
function asPath(source) {
  const i2 = source.indexOf("?");
  const j = source.indexOf("#");
  const k = i2 >= 0 && j >= 0 ? Math.min(i2, j) : i2 >= 0 ? i2 : j;
  return k >= 0 ? source.slice(0, k) : source;
}
function asImportPath(source) {
  const path = asPath(source);
  return isImportPath(path) ? path : `./${path}`;
}
function isImportPath(specifier) {
  return ["./", "../", "/"].some((prefix) => specifier.startsWith(prefix));
}
function resolveSrcset(srcset, resolve) {
  return srcset.trim().split(/\s*,\s*/).filter((src) => src).map((src) => {
    const parts = src.split(/\s+/);
    const path = resolve(parts[0]);
    if (path)
      parts[0] = encodeURI(path);
    return parts.join(" ");
  }).join(", ");
}

// node_modules/@observablehq/notebook-kit/dist/src/runtime/display.js
function display(state, value, name, mode) {
  return mode === "table" ? displayTable(state, value) : displayDefault(state, value, name);
}
function displayDefault(state, value, name) {
  const { root: root2, expanded } = state;
  const node = isDisplayable(value, root2) ? value : inspect2(value, expanded[root2.childNodes.length], name);
  displayNode(state, node);
}
function displayTable(state, value) {
  const placeholder = document.createComment("table");
  displayNode(state, placeholder);
  import("./inputs-YZ3OSELD.js").then(({ table }) => {
    if (!placeholder.parentNode)
      return;
    placeholder.replaceWith(table(value));
  });
}
function displayNode(state, node) {
  if (node.nodeType === 11) {
    let child;
    while (child = node.firstChild) {
      state.root.appendChild(child);
    }
  } else {
    state.root.appendChild(node);
  }
}
function displayError(state, value, name) {
  displayNode(state, inspectError(value, name));
}
function isDisplayable(value, root2) {
  return (value instanceof Element || value instanceof Text) && value instanceof value.constructor && (!value.parentNode || root2.contains(value));
}
function clear(state) {
  state.autoclear = false;
  state.expanded = Array.from(state.root.childNodes, getExpanded);
  while (state.root.lastChild)
    state.root.lastChild.remove();
}
function observe(state, { autodisplay, assets, output: name, automutable, displayMode: mode }) {
  if (automutable && name)
    name = unprefix(name, "initial ");
  return {
    _error: false,
    _node: state.root,
    // _node for visibility promise
    pending() {
      if (this._error) {
        this._error = false;
        clear(state);
      }
    },
    fulfilled(value) {
      if (autodisplay) {
        if (assets && value instanceof Element)
          mapAssets(value, assets);
        clear(state);
        display(state, value, name, mode);
      } else if (state.autoclear) {
        clear(state);
      }
    },
    rejected(error) {
      console.error(error);
      this._error = true;
      clear(state);
      displayError(state, error, name);
    }
  };
}

// node_modules/@observablehq/notebook-kit/dist/src/runtime/stdlib/generators/index.js
var generators_exports = {};
__export(generators_exports, {
  dark: () => dark,
  input: () => input,
  now: () => now,
  observe: () => observe2,
  queue: () => queue,
  width: () => width
});

// node_modules/@observablehq/notebook-kit/dist/src/runtime/stdlib/generators/observe.js
function observe2(initialize) {
  let resolve;
  let reject;
  let value;
  let stale = false;
  const dispose = initialize((x) => {
    value = x;
    if (resolve != null) {
      resolve(x);
      resolve = reject = void 0;
    } else {
      stale = true;
    }
    return x;
  });
  if (dispose != null && typeof dispose !== "function") {
    throw new Error(typeof dispose === "object" && typeof dispose["then"] === "function" ? "async initializers are not supported" : "initializer returned something, but not a dispose function");
  }
  return {
    async next() {
      return {
        done: false,
        value: await (stale ? (stale = false, value) : new Promise((res, rej) => (resolve = res, reject = rej)))
      };
    },
    async return() {
      if (reject != null) {
        reject(new Error("Generator returned"));
        resolve = reject = void 0;
      }
      if (dispose != null) {
        dispose();
      }
      return { done: true, value: void 0 };
    },
    async throw(e) {
      if (reject != null) {
        reject(e);
        resolve = reject = void 0;
      }
      if (dispose != null) {
        dispose();
      }
      return { done: true, value: void 0 };
    },
    [Symbol.asyncIterator]() {
      return this;
    }
  };
}

// node_modules/@observablehq/notebook-kit/dist/src/runtime/stdlib/generators/dark.js
function dark() {
  return observe2((notify) => {
    let dark2;
    const media = matchMedia("(prefers-color-scheme: dark)");
    const probe = document.createElement("div");
    probe.style.transitionProperty = "color, background-color";
    probe.style.transitionDuration = "1ms";
    const changed = () => {
      const s = getComputedStyle(document.body).getPropertyValue("color-scheme").split(/\s+/);
      const d = s.includes("light") && s.includes("dark") ? media.matches : s.includes("dark");
      if (dark2 === d)
        return;
      notify(dark2 = d);
    };
    document.body.appendChild(probe);
    changed();
    probe.addEventListener("transitionstart", changed);
    media.addEventListener("change", changed);
    return () => {
      probe.remove();
      media.removeEventListener("change", changed);
    };
  });
}

// node_modules/@observablehq/notebook-kit/dist/src/runtime/stdlib/generators/input.js
function input(element2) {
  return observe2((change) => {
    const event = eventof(element2);
    const value = valueof2(element2);
    const inputted = () => change(valueof2(element2));
    element2.addEventListener(event, inputted);
    if (value !== void 0)
      change(value);
    return () => element2.removeEventListener(event, inputted);
  });
}
function valueof2(element2) {
  const input3 = element2;
  const select2 = element2;
  if ("type" in element2) {
    switch (element2.type) {
      case "range":
      case "number":
        return input3.valueAsNumber;
      case "date":
        return input3.valueAsDate;
      case "checkbox":
        return input3.checked;
      case "file":
        return input3.multiple ? input3.files : input3.files[0];
      case "select-multiple":
        return Array.from(select2.selectedOptions, (o) => o.value);
    }
  }
  return input3.value;
}
function eventof(element2) {
  if ("type" in element2) {
    switch (element2.type) {
      case "button":
      case "submit":
      case "checkbox":
        return "click";
      case "file":
        return "change";
    }
  }
  return "input";
}

// node_modules/@observablehq/notebook-kit/dist/src/runtime/stdlib/generators/now.js
async function* now() {
  while (true) {
    yield Date.now();
  }
}

// node_modules/@observablehq/notebook-kit/dist/src/runtime/stdlib/generators/queue.js
function queue(initialize) {
  let resolve;
  let reject;
  const values = [];
  const dispose = initialize((x) => {
    values.push(x);
    if (resolve != null) {
      resolve(values.shift());
      resolve = void 0;
    }
    return x;
  });
  if (dispose != null && typeof dispose !== "function") {
    throw new Error(typeof dispose === "object" && typeof dispose["then"] === "function" ? "async initializers are not supported" : "initializer returned something, but not a dispose function");
  }
  return {
    async next() {
      return {
        done: false,
        value: await (values.length ? values.shift() : new Promise((res, rej) => (resolve = res, reject = rej)))
      };
    },
    async return() {
      if (reject != null) {
        reject(new Error("Generator returned"));
        resolve = reject = void 0;
      }
      if (dispose != null) {
        dispose();
      }
      return { done: true, value: void 0 };
    },
    async throw(e) {
      if (reject != null) {
        reject(e);
        resolve = reject = void 0;
      }
      if (dispose != null) {
        dispose();
      }
      return { done: true, value: void 0 };
    },
    [Symbol.asyncIterator]() {
      return this;
    }
  };
}

// node_modules/@observablehq/notebook-kit/dist/src/runtime/stdlib/generators/width.js
function width(target, options2) {
  return observe2((notify) => {
    let width2;
    const observer = new ResizeObserver(([entry]) => {
      const w = entry.contentRect.width;
      if (w !== width2)
        notify(width2 = w);
    });
    observer.observe(target, options2);
    return () => observer.disconnect();
  });
}

// node_modules/@observablehq/notebook-kit/dist/src/runtime/stdlib/mutable.js
function Mutable(value) {
  let change;
  return Object.defineProperty(observe2((_2) => {
    change = _2;
    if (value !== void 0)
      change(value);
  }), "value", {
    get: () => value,
    set: (x) => (value = x, void change?.(value))
  });
}
function Mutator(value) {
  const mutable = Mutable(value);
  return [
    mutable,
    {
      get value() {
        return mutable.value;
      },
      set value(v) {
        mutable.value = v;
      }
    }
  ];
}

// node_modules/@observablehq/notebook-kit/dist/src/runtime/define.js
function define(main3, state, definition, observer = observe) {
  const { id: id2, body: body2, inputs = [], outputs = [], output, displayMode } = definition;
  const { autodisplay, autoview, automutable, display: defineDisplay = true } = definition;
  const variables = state.variables;
  const v = main3.variable(observer(state, definition), { shadow: {} });
  const vid = output ?? (outputs.length ? `cell ${id2}` : null);
  state.autoclear = true;
  if (defineDisplay && (inputs.includes("display") || inputs.includes("view"))) {
    let displayVersion = -1;
    const vd = new v.constructor(2, v._module);
    vd.define(inputs.filter((i2) => i2 !== "display" && i2 !== "view"), () => {
      const version2 = v._version;
      return (value) => {
        if (version2 < displayVersion)
          throw new Error("stale display");
        else if (state.variables[0] !== v)
          throw new Error("stale display");
        else if (version2 > displayVersion)
          clear(state);
        displayVersion = version2;
        display(state, value, output, displayMode);
        return value;
      };
    });
    v._shadow.set("display", vd);
    if (inputs.includes("view")) {
      const vv = new v.constructor(2, v._module, null, { shadow: {} });
      vv._shadow.set("display", vd);
      vv.define(["display"], (display2) => (value) => input(display2(value)));
      v._shadow.set("view", vv);
    }
  } else if (!autodisplay) {
    clear(state);
  }
  variables.push(v.define(vid, inputs, body2));
  if (output != null) {
    if (autoview) {
      const o = unprefix(output, "viewof$");
      variables.push(main3.define(o, [output], input));
    } else if (automutable) {
      const o = unprefix(output, "initial ");
      const x = `cell ${id2}`;
      v.define(o, [x], ([mutable]) => mutable);
      variables.push(
        main3.define(output, inputs, body2),
        // initial value
        main3.define(x, [output], Mutator),
        main3.define(`mutable$${o}`, [x], ([, mutator]) => mutator)
      );
    }
  } else {
    for (const o of outputs) {
      variables.push(main3.variable(true).define(o, [vid], (exports) => exports[o]));
    }
  }
}

// node_modules/@observablehq/notebook-kit/dist/src/lib/sluggify.js
function sluggify(string, { length = 50, fallback = "untitled", separator = "-" } = {}) {
  const parts = string.normalize("NFD").replace(/[\u0300-\u036f'‘’]/g, "").toLowerCase().split(/\W+/g).filter(nonempty);
  let i2 = -1;
  for (let l = 0, n = parts.length; ++i2 < n; ) {
    if ((l += parts[i2].length) + i2 > length) {
      parts[i2] = parts[i2].substring(0, length - l + parts[i2].length - i2);
      break;
    }
  }
  return parts.slice(0, i2 + 1).filter(Boolean).join(separator) || fallback.slice(0, length);
}
function nonempty(string) {
  return string.length > 0;
}

// node_modules/@observablehq/notebook-kit/dist/src/lib/hash.js
async function sha256(input3) {
  const encoded = new TextEncoder().encode(input3);
  const buffer2 = await crypto.subtle.digest("SHA-256", encoded);
  return new Uint8Array(buffer2).reduce((i2, byte) => i2 << 8n | BigInt(byte), 0n);
}
function base36(int, length) {
  return int.toString(36).padStart(length, "0").slice(0, length);
}
async function hash(strings, ...params) {
  return base36(await sha256(JSON.stringify([strings, ...params])), 16);
}
async function stringHash(string) {
  return base36(await sha256(string), 16);
}
async function nameHash(name) {
  return /^[\w-]+$/.test(name) ? name : `${sluggify(basename(name))}.${base36(await sha256(name), 8)}`;
}
function basename(name) {
  return name.replace(/^.*\//, "");
}

// node_modules/@observablehq/notebook-kit/dist/src/runtime/stdlib/databaseClient.js
var DatabaseClient = (name, options2) => {
  return new DatabaseClientImpl(name, normalizeOptions(options2));
};
function normalizeOptions({ id: id2, since } = {}) {
  const options2 = {};
  if (id2 !== void 0)
    options2.id = id2;
  if (since !== void 0)
    options2.since = new Date(since);
  return options2;
}
var DatabaseClientImpl = class {
  constructor(name, options2) {
    Object.defineProperty(this, "name", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "options", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperties(this, {
      name: { value: name, enumerable: true },
      options: { value: options2, enumerable: true }
    });
  }
  async sql(strings, ...params) {
    const path = await this.cachePath(strings, ...params);
    const response = await fetch(path);
    if (!response.ok)
      throw new Error(`failed to fetch: ${path}`);
    return await response.json().then(revive);
  }
  async cachePath(strings, ...params) {
    return `.observable/cache/${await nameHash(this.name)}-${await hash(strings, ...params)}.json`;
  }
};
async function of(source, name) {
  return source != null && typeof source === "object" && "sql" in source && typeof source["sql"] === "function" ? source : (await import("./duckdb-BCM5ESBF.js")).DuckDBClient.of({ [name]: source });
}
function revive({ rows, schema, date, ...meta }) {
  for (const column of schema) {
    switch (column.type) {
      case "bigint": {
        const { name } = column;
        for (const row of rows) {
          const value = row[name];
          if (value == null)
            continue;
          row[name] = Number(value);
        }
        break;
      }
      case "date": {
        const { name } = column;
        for (const row of rows) {
          const value = row[name];
          if (value == null)
            continue;
          row[name] = asDate2(value);
        }
        break;
      }
    }
  }
  if (date != null)
    date = new Date(date);
  return Object.assign(rows, { schema, date }, meta);
}
function asDate2(value) {
  return new Date(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}(?::\d{2})?$/.test(value) ? value + "Z" : value);
}
DatabaseClient.of = of;
DatabaseClient.revive = revive;
DatabaseClient.prototype = DatabaseClientImpl.prototype;
Object.defineProperty(DatabaseClientImpl, "name", { value: "DatabaseClient" });

// node_modules/@observablehq/notebook-kit/dist/src/runtime/stdlib/dom/index.js
var dom_exports = {};
__export(dom_exports, {
  canvas: () => canvas,
  context2d: () => context2d,
  download: () => download,
  element: () => element,
  input: () => input2,
  range: () => range,
  select: () => select,
  svg: () => svg,
  text: () => text,
  uid: () => uid
});

// node_modules/@observablehq/notebook-kit/dist/src/runtime/stdlib/dom/canvas.js
function canvas(width2, height) {
  const canvas2 = document.createElement("canvas");
  canvas2.width = width2;
  canvas2.height = height;
  return canvas2;
}

// node_modules/@observablehq/notebook-kit/dist/src/runtime/stdlib/dom/context2d.js
function context2d(width2, height, dpi = devicePixelRatio) {
  const canvas2 = document.createElement("canvas");
  canvas2.width = width2 * dpi;
  canvas2.height = height * dpi;
  canvas2.style.width = `${width2}px`;
  const context = canvas2.getContext("2d");
  context.scale(dpi, dpi);
  return context;
}

// node_modules/@observablehq/notebook-kit/dist/src/runtime/stdlib/dom/download.js
function download(value, name = "untitled", label = "Save") {
  const a = document.createElement("a");
  const b = a.appendChild(document.createElement("button"));
  b.textContent = label;
  a.download = name;
  async function reset2() {
    await new Promise(requestAnimationFrame);
    URL.revokeObjectURL(a.href);
    a.removeAttribute("href");
    b.textContent = label;
    b.disabled = false;
  }
  a.onclick = async (event) => {
    b.disabled = true;
    if (a.href)
      return reset2();
    b.textContent = "Saving\u2026";
    try {
      const object = await (typeof value === "function" ? value() : value);
      b.textContent = "Download";
      a.href = URL.createObjectURL(object);
    } catch {
      b.textContent = label;
    }
    if (event.eventPhase)
      return reset2();
    b.disabled = false;
  };
  return a;
}

// node_modules/@observablehq/notebook-kit/dist/src/runtime/stdlib/dom/element.js
var namespaces = {
  math: "http://www.w3.org/1998/Math/MathML",
  svg: "http://www.w3.org/2000/svg",
  xhtml: "http://www.w3.org/1999/xhtml",
  xlink: "http://www.w3.org/1999/xlink",
  xml: "http://www.w3.org/XML/1998/namespace",
  xmlns: "http://www.w3.org/2000/xmlns/"
};
function isNamespace(prefix) {
  return Object.prototype.hasOwnProperty.call(namespaces, prefix);
}
function element(name, attributes) {
  let prefix = name += "";
  let i2 = prefix.indexOf(":");
  if (i2 >= 0 && (prefix = name.slice(0, i2)) !== "xmlns")
    name = name.slice(i2 + 1);
  const element2 = isNamespace(prefix) ? document.createElementNS(namespaces[prefix], name) : document.createElement(name);
  if (attributes) {
    for (let key in attributes) {
      const value = attributes[key];
      i2 = (prefix = key).indexOf(":");
      if (i2 >= 0 && (prefix = key.slice(0, i2)) !== "xmlns")
        key = key.slice(i2 + 1);
      if (isNamespace(prefix))
        element2.setAttributeNS(namespaces[prefix], key, value);
      else
        element2.setAttribute(key, value);
    }
  }
  return element2;
}

// node_modules/@observablehq/notebook-kit/dist/src/runtime/stdlib/dom/input.js
function input2(type) {
  const input3 = document.createElement("input");
  if (type != null)
    input3.type = type;
  return input3;
}

// node_modules/@observablehq/notebook-kit/dist/src/runtime/stdlib/dom/range.js
function range(min, max, step) {
  if (arguments.length === 1) {
    max = min;
    min = void 0;
  }
  const input3 = document.createElement("input");
  input3.min = String(min = min == null ? 0 : +min);
  input3.max = String(max = max == null ? 1 : +max);
  input3.step = step == null ? "any" : String(step = +step);
  input3.type = "range";
  return input3;
}

// node_modules/@observablehq/notebook-kit/dist/src/runtime/stdlib/dom/select.js
function select(values) {
  const select2 = document.createElement("select");
  for (const value of values) {
    const option = document.createElement("option");
    option.value = option.textContent = value;
    select2.appendChild(option);
  }
  return select2;
}

// node_modules/@observablehq/notebook-kit/dist/src/runtime/stdlib/dom/svg.js
function svg(width2, height) {
  const svg3 = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg3.setAttribute("viewBox", `0 0 ${width2} ${height}`);
  svg3.setAttribute("width", `${width2}`);
  svg3.setAttribute("height", `${height}`);
  return svg3;
}

// node_modules/@observablehq/notebook-kit/dist/src/runtime/stdlib/dom/text.js
function text(value) {
  return document.createTextNode(value);
}

// node_modules/@observablehq/notebook-kit/dist/src/runtime/stdlib/dom/uid.js
var count2 = 0;
function uid(name) {
  return new Id(`O-${name == null ? "" : `${name}-`}${++count2}`);
}
var Id = class {
  constructor(id2) {
    Object.defineProperty(this, "id", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "href", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    this.id = id2;
    this.href = new URL(`#${id2}`, location.href).href;
  }
  toString() {
    return `url(${this.href})`;
  }
};

// node_modules/@observablehq/notebook-kit/dist/src/runtime/stdlib/files/index.js
var files_exports = {};
__export(files_exports, {
  buffer: () => buffer,
  text: () => text2,
  url: () => url
});

// node_modules/@observablehq/notebook-kit/dist/src/runtime/stdlib/files/buffer.js
function buffer(blob) {
  return blob.arrayBuffer();
}

// node_modules/@observablehq/notebook-kit/dist/src/runtime/stdlib/files/text.js
function text2(blob) {
  return blob.text();
}

// node_modules/@observablehq/notebook-kit/dist/src/runtime/stdlib/files/url.js
function url(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

// node_modules/@observablehq/notebook-kit/dist/src/runtime/stdlib/interpreter.js
var Interpreter = (name, options2) => {
  return new InterpreterImpl(name, normalizeOptions2(options2));
};
function normalizeOptions2({ format: format2 = "buffer", id: id2, since } = {}) {
  const options2 = { format: format2 };
  if (id2 !== void 0)
    options2.id = id2;
  if (since !== void 0)
    options2.since = new Date(since);
  return options2;
}
var InterpreterImpl = class {
  constructor(name, options2) {
    Object.defineProperty(this, "name", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "options", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperties(this, {
      name: { value: name, enumerable: true },
      options: { value: options2, enumerable: true }
    });
  }
  async run(input3) {
    return FileAttachment(await this.cachePath(input3));
  }
  async cachePath(input3) {
    const { format: format2 } = this.options;
    return `.observable/cache/${await nameHash(this.name)}-${await stringHash(input3)}${getInterpreterExtension(format2)}`;
  }
};
Interpreter.prototype = InterpreterImpl.prototype;
Object.defineProperty(InterpreterImpl, "name", { value: "Interpreter" });

// node_modules/@observablehq/notebook-kit/dist/src/runtime/stdlib/promises/index.js
var promises_exports = {};
__export(promises_exports, {
  delay: () => delay,
  tick: () => tick,
  when: () => when
});

// node_modules/@observablehq/notebook-kit/dist/src/runtime/stdlib/promises/delay.js
function delay(duration, value) {
  return new Promise((resolve) => setTimeout(() => resolve(value), duration));
}

// node_modules/@observablehq/notebook-kit/dist/src/runtime/stdlib/promises/when.js
var timeouts = /* @__PURE__ */ new Map();
async function when(time, value) {
  let timeout = timeouts.get(time = +time);
  if (!timeout) {
    const now2 = Date.now();
    const delay2 = time - now2;
    if (delay2 > 0) {
      if (delay2 > 2147483647)
        throw new Error("too long to wait");
      timeout = new Promise((resolve) => setTimeout(resolve, delay2));
      timeout.then(() => timeouts.delete(time));
      timeouts.set(time, timeout);
    }
  }
  await timeout;
  return value;
}

// node_modules/@observablehq/notebook-kit/dist/src/runtime/stdlib/promises/tick.js
function tick(duration, value) {
  return when(Math.ceil((Date.now() + 1) / duration) * duration, value);
}

// node_modules/@observablehq/notebook-kit/dist/src/runtime/stdlib/recommendedLibraries.js
var recommendedLibraries_exports = {};
__export(recommendedLibraries_exports, {
  Arrow: () => Arrow,
  DuckDBClient: () => DuckDBClient,
  Flechette: () => Flechette,
  Inputs: () => Inputs,
  L: () => L,
  Plot: () => Plot,
  React: () => React,
  ReactDOM: () => ReactDOM,
  _: () => _,
  aq: () => aq,
  d3: () => d3,
  dot: () => dot,
  duckdb: () => duckdb,
  echarts: () => echarts,
  htl: () => htl,
  html: () => html,
  mapboxgl: () => mapboxgl,
  md: () => md,
  mermaid: () => mermaid,
  svg: () => svg2,
  tex: () => tex,
  topojson: () => topojson,
  vl: () => vl
});
var _ = () => import("https://cdn.jsdelivr.net/npm/lodash/+esm").then((_2) => _2.default);
var aq = () => import("https://cdn.jsdelivr.net/npm/arquero/+esm");
var Arrow = () => import("https://cdn.jsdelivr.net/npm/apache-arrow@17.0.0/+esm");
var d3 = () => import("https://cdn.jsdelivr.net/npm/d3/+esm");
var dot = () => import("./dot-IMGFN5UH.js").then((_2) => _2.dot);
var duckdb = () => import("https://cdn.jsdelivr.net/npm/@duckdb/duckdb-wasm@1.32.0/+esm");
var DuckDBClient = () => import("./duckdb-BCM5ESBF.js").then((_2) => _2.DuckDBClient);
var echarts = () => import("https://cdn.jsdelivr.net/npm/echarts/+esm");
var Flechette = () => import("https://cdn.jsdelivr.net/npm/@uwdata/flechette/+esm");
var htl = () => import("https://cdn.jsdelivr.net/npm/htl/+esm");
var html = () => import("https://cdn.jsdelivr.net/npm/htl/+esm").then((_2) => _2.html);
var svg2 = () => import("https://cdn.jsdelivr.net/npm/htl/+esm").then((_2) => _2.svg);
var Inputs = () => import("./inputs-YZ3OSELD.js");
var L = () => import("./leaflet-XZIUBY3S.js");
var mapboxgl = () => import("./mapboxgl-HZTSPP67.js").then((_2) => _2.default);
var md = () => import("./md-SLVOVQJM.js").then((_2) => _2.md);
var mermaid = () => import("./mermaid-CG7QX73Q.js").then((_2) => _2.mermaid);
var Plot = () => import("https://cdn.jsdelivr.net/npm/@observablehq/plot/+esm");
var React = () => import("https://cdn.jsdelivr.net/npm/react/+esm");
var ReactDOM = () => import("https://cdn.jsdelivr.net/npm/react-dom/+esm");
var tex = () => import("./tex-WKH74LQW.js").then((_2) => _2.tex);
var topojson = () => import("https://cdn.jsdelivr.net/npm/topojson-client/+esm");
var vl = () => import("./vega-lite-VP73GKT6.js").then((_2) => _2.vl);

// node_modules/@observablehq/notebook-kit/dist/src/runtime/stdlib/sampleDatasets.js
var sampleDatasets_exports = {};
__export(sampleDatasets_exports, {
  aapl: () => aapl,
  alphabet: () => alphabet,
  cars: () => cars,
  citywages: () => citywages,
  diamonds: () => diamonds,
  flare: () => flare,
  industries: () => industries,
  miserables: () => miserables,
  olympians: () => olympians,
  penguins: () => penguins,
  pizza: () => pizza,
  weather: () => weather
});
var aapl = () => csv(dataset("aapl.csv"), true);
var alphabet = () => csv(dataset("alphabet.csv"), true);
var cars = () => csv(dataset("cars.csv"), true);
var citywages = () => csv(dataset("citywages.csv"), true);
var diamonds = () => csv(dataset("diamonds.csv"), true);
var flare = () => csv(dataset("flare.csv"), true);
var industries = () => csv(dataset("industries.csv"), true);
var miserables = () => json(dataset("miserables.json"));
var olympians = () => csv(dataset("olympians.csv"), true);
var penguins = () => csv(dataset("penguins.csv"), true);
var pizza = () => csv(dataset("pizza.csv"), true);
var weather = () => csv(dataset("weather.csv"), true);
function dataset(name) {
  return `https://cdn.jsdelivr.net/npm/@observablehq/sample-datasets/${name}`;
}
async function json(url2) {
  const response = await fetch(url2);
  if (!response.ok)
    throw new Error(`unable to fetch ${url2}: status ${response.status}`);
  return response.json();
}
async function text3(url2) {
  const response = await fetch(url2);
  if (!response.ok)
    throw new Error(`unable to fetch ${url2}: status ${response.status}`);
  return response.text();
}
async function csv(url2, typed) {
  const [contents, d32] = await Promise.all([text3(url2), import("https://cdn.jsdelivr.net/npm/d3-dsv/+esm")]);
  return d32.csvParse(contents, typed && d32.autoType);
}

// node_modules/@observablehq/notebook-kit/dist/src/runtime/stdlib/sql.js
function sql(strings, ...params) {
  return new SqlFragment(strings, params);
}
sql.view = function view(strings, ...params) {
  return new SqlView(strings, params);
};
sql.variant = function variant(variants) {
  return new SqlVariant(variants);
};
sql.ident = function ident(name) {
  return new SqlVariant({
    get databricks() {
      return sql([tquote(name)]);
    },
    get bigquery() {
      return sql([tquote(name)]);
    },
    get default() {
      return sql([dquote(name)]);
    }
  });
};
sql.text = function text4(value) {
  return sql([squote(value)]);
};
var SqlFragment = class _SqlFragment {
  constructor(strings, params) {
    Object.defineProperty(this, "strings", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "params", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    this.strings = strings;
    this.params = params;
  }
  flat(dialect) {
    const iquote = getIquote(dialect);
    const that = this.toDialect(dialect);
    const { strings, params } = that;
    const names = findUndernames(strings, params);
    const map2 = /* @__PURE__ */ new Map();
    const views = {};
    let cteIndex = 0;
    function flatParams(istrings, iparams) {
      let ostrings;
      let oparams;
      for (let i2 = 0; i2 < iparams.length; ++i2) {
        const param = iparams[i2];
        const string = istrings[i2 + 1];
        if (param instanceof SqlView) {
          if (ostrings === void 0) {
            ostrings = istrings.slice(0, i2 + 1);
            oparams = iparams.slice(0, i2);
          }
          let key = map2.get(param);
          if (key == null) {
            do
              key = `_${++cteIndex}`;
            while (names.has(key));
            names.add(key);
            map2.set(param, key);
            const [pstrings, pparams] = flatParams(param.strings, param.params);
            views[key] = new _SqlFragment(pstrings, pparams);
          }
          ostrings[ostrings.length - 1] += iquote(key) + string;
        } else if (param instanceof _SqlFragment) {
          if (ostrings === void 0) {
            ostrings = istrings.slice(0, i2 + 1);
            oparams = iparams.slice(0, i2);
          }
          const [pstrings, pparams] = flatParams(param.strings, param.params);
          ostrings[ostrings.length - 1] += pstrings[0];
          ostrings.push(...pstrings.slice(1));
          ostrings[ostrings.length - 1] += string;
          oparams.push(...pparams);
        } else if (ostrings !== void 0) {
          oparams.push(param);
          ostrings.push(string);
        }
      }
      return ostrings === void 0 ? [istrings, iparams] : [ostrings, oparams];
    }
    const [fstrings, fparams] = flatParams(strings, params);
    const [vstrings, vparams] = withViews(fstrings, fparams, views, iquote);
    return vstrings === strings && vparams === params ? that : reconstruct(that, vstrings, vparams);
  }
  query(database) {
    const { strings, params } = this.flat(database.dialect);
    return database.sql(strings, ...params);
  }
  toDialect(dialect) {
    return fragmentToDialect(this, dialect, /* @__PURE__ */ new Map());
  }
  toString() {
    return this.flat().strings.join("?");
  }
};
var SqlView = class extends SqlFragment {
  constructor(strings, params) {
    super(strings, params);
  }
  bind(database) {
    return new BoundSqlView(this.strings, this.params, database);
  }
};
var BoundSqlView = class extends SqlView {
  constructor(strings, params, database) {
    super(strings, params);
    Object.defineProperty(this, "database", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    this.database = database;
  }
  flat() {
    const flat = super.flat(this.database.dialect);
    if (flat !== this)
      flat.database = this.database;
    return flat;
  }
  query() {
    return super.query(this.database);
  }
  bind() {
    throw new Error("already bound");
  }
};
var SqlVariant = class {
  constructor(variants) {
    Object.defineProperty(this, "variants", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    this.variants = variants;
  }
  toDialect(dialect) {
    return variantToDialect(this, dialect, /* @__PURE__ */ new Map());
  }
  toString() {
    return String(this.toDialect());
  }
};
sql.Fragment = SqlFragment;
sql.View = SqlView;
sql.Variant = SqlVariant;
function fragmentToDialect(fragment, dialect, cache) {
  const { strings, params } = fragment;
  let ostrings;
  let oparams;
  for (let i2 = 0; i2 < params.length; ++i2) {
    const param = params[i2];
    const string = strings[i2 + 1];
    if (param instanceof SqlFragment) {
      let dparam;
      if (cache.has(param))
        dparam = cache.get(param);
      else
        cache.set(param, dparam = fragmentToDialect(param, dialect, cache));
      if (dparam !== param) {
        if (ostrings === void 0) {
          ostrings = strings.slice(0, i2 + 1);
          oparams = params.slice(0, i2);
        }
        ostrings.push(string);
        oparams.push(dparam);
      } else if (ostrings !== void 0) {
        ostrings.push(string);
        oparams.push(param);
      }
    } else if (param instanceof SqlVariant) {
      let dparam;
      if (cache.has(param))
        dparam = cache.get(param);
      else
        cache.set(param, dparam = variantToDialect(param, dialect, cache));
      if (ostrings === void 0) {
        ostrings = strings.slice(0, i2 + 1);
        oparams = params.slice(0, i2);
      }
      ostrings.push(string);
      oparams.push(dparam);
    } else if (ostrings !== void 0) {
      ostrings.push(string);
      oparams.push(param);
    }
  }
  return ostrings === void 0 ? fragment : reconstruct(fragment, ostrings, oparams);
}
function reconstruct(fragment, strings, params) {
  return new fragment.constructor(strings, params);
}
function variantToDialect(variant2, dialect, cache) {
  let v;
  if (dialect !== void 0 && dialect in variant2.variants)
    v = variant2.variants[dialect];
  else if ("default" in variant2.variants)
    v = variant2.variants.default;
  else
    throw new Error(dialect ? `missing variant: ${dialect}` : `missing dialect`);
  return v instanceof SqlFragment ? fragmentToDialect(v, dialect, cache) : v instanceof SqlVariant ? variantToDialect(v, dialect, cache) : v;
}
function withViews(istrings, iparams, views, iquote) {
  const entries = Object.entries(views);
  if (!entries.length)
    return [istrings, iparams];
  const input3 = istrings[0];
  const withIndex = findWith(input3);
  const ostrings = [];
  const oparams = [];
  let first = true;
  ostrings[0] = `${withIndex >= 0 ? input3.slice(0, withIndex) : "WITH"}
`;
  for (const [name, view2] of entries) {
    if (view2.params.some((p) => p instanceof SqlFragment))
      throw new Error("nested fragment");
    if (first)
      first = false;
    else
      ostrings[ostrings.length - 1] += ",\n";
    ostrings[ostrings.length - 1] += `${iquote(name)} AS (${view2.strings[0]}`;
    ostrings.push(...view2.strings.slice(1));
    ostrings[ostrings.length - 1] += ")";
    oparams.push(...view2.params);
  }
  ostrings[ostrings.length - 1] += withIndex >= 0 ? `,
${input3.slice(withIndex)}` : `
${input3}`;
  ostrings.push(...istrings.slice(1));
  oparams.push(...iparams);
  return [ostrings, oparams];
}
function findWith(input3) {
  const match = /^\s*(--.*\n|\/\*[\s\S]*?\*\/|\s)*with\b(\s+recursive\b)?/i.exec(input3);
  return match ? match[0].length : -1;
}
function findUndernames(strings, params, names = /* @__PURE__ */ new Set()) {
  const string = strings.join(" ");
  const pattern = /\b_\d+\b/g;
  for (let match; (match = pattern.exec(string)) !== null; ) {
    names.add(match[0]);
  }
  for (const param of params) {
    if (param instanceof SqlFragment) {
      findUndernames(param.strings, param.params, names);
    }
  }
  return names;
}
function getIquote(dialect) {
  switch (dialect) {
    case "databricks":
    case "bigquery":
      return tquote;
    default:
      return dquote;
  }
}
function dquote(name) {
  return `"${name.replace(/"/g, '""')}"`;
}
function tquote(name) {
  return `\`${name.replace(/`/g, "``")}\``;
}
function squote(name) {
  return `'${name.replace(/'/g, "''")}'`;
}

// node_modules/@observablehq/notebook-kit/dist/src/runtime/stdlib/index.js
var root = document.querySelector("main") ?? document.body;
var library = {
  dark: () => dark(),
  now: () => now(),
  width: () => width(root),
  DatabaseClient: () => DatabaseClient,
  FileAttachment: () => FileAttachment,
  Generators: () => generators_exports,
  Interpreter: () => Interpreter,
  Mutable: () => Mutable,
  Promises: () => promises_exports,
  // deprecated!
  Files: () => files_exports,
  // deprecated!
  DOM: () => dom_exports,
  // deprecated!
  sql: () => sql,
  ...recommendedLibraries_exports,
  ...sampleDatasets_exports
};

// node_modules/@observablehq/notebook-kit/dist/src/runtime/index.js
var NotebookRuntime = class {
  constructor(builtins = library) {
    Object.defineProperty(this, "runtime", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "main", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    const runtime3 = new Runtime(builtins);
    this.runtime = Object.assign(runtime3, { fileAttachments });
    this.main = runtime3.module();
  }
  define(state, definition, observer) {
    define(this.main, state, definition, observer);
  }
};
var defaultNotebook = new NotebookRuntime();
var runtime = defaultNotebook.runtime;
var main = defaultNotebook.main;
var define2 = defaultNotebook.define.bind(defaultNotebook);
main.constructor.prototype.defines = function(name) {
  return this._scope.has(name) || // prettier
  this._builtins.has(name) || this._runtime._builtin._scope.has(name);
};

// src/assets/js/worker.js
var compile = (body, id) => {
  return eval(`"use strict";(
${body}
)
${id ? `//# sourceURL=observablehq-${id}` : ""}`);
};
var showError = (root2, error) => {
  root2.replaceChildren();
  const outer = document.createElement("div");
  outer.className = "observablehq observablehq--error";
  const inner = document.createElement("div");
  inner.className = "observablehq--inspect";
  inner.textContent = error instanceof Error ? `${error.name}: ${error.message}` : String(error);
  outer.appendChild(inner);
  root2.appendChild(outer);
};
var port = null;
var send = (msg) => port?.postMessage(msg);
var pendingResizes = /* @__PURE__ */ new Map();
var resizeScheduled = false;
var sendResize = (id2, value) => {
  pendingResizes.set(id2, value);
  if (!resizeScheduled) {
    resizeScheduled = true;
    requestAnimationFrame(() => {
      send({
        type: "resizeCells",
        values: [...pendingResizes]
      });
      pendingResizes.clear();
      resizeScheduled = false;
    });
  }
};
var main2 = document.querySelector("main");
var runtime2 = new NotebookRuntime();
var cells = /* @__PURE__ */ new Map();
var order = [];
var nextId = 0;
var createCell = (cell) => {
  if (cell.id === void 0) {
    let max = 0;
    for (const c of cells.values()) {
      if (Number.isInteger(c.cell.id) && c.cell.id > max) max = c.cell.id;
    }
    cell.id = max + 1;
  }
  const id2 = nextId++;
  const container = document.createElement("div");
  container.className = "observablehq observablehq--cell";
  container.style.minHeight = "1px";
  main2.appendChild(container);
  const observer = new ResizeObserver(() => {
    const r = container.getBoundingClientRect();
    sendResize(id2, r.height);
  });
  observer.observe(container);
  const output = document.createElement("div");
  container.appendChild(output);
  const state = {
    root: output,
    variables: []
  };
  const execute = async (mode, value) => {
    if (mode !== void 0) cell.mode = mode;
    if (value !== void 0) cell.value = value;
    state.variables.forEach((v) => {
      v._observer = {};
      v.delete();
    });
    state.variables = [];
    try {
      const definition = transpile(cell);
      const body2 = compile(definition.body);
      await runtime2.define(
        state,
        {
          ...definition,
          body: body2
        }
      );
    } catch (error) {
      showError(output, error);
    }
  };
  const remove = () => {
    observer.disconnect();
    state.variables.forEach((v) => {
      v._observer = {};
      v.delete();
    });
    container.remove();
    cells.delete(id2);
    const i2 = order.indexOf(id2);
    if (i2 !== -1) {
      order.splice(i2, 1);
    }
    pendingResizes.delete(id2);
  };
  const pin = () => {
    cell.pinned = !cell.pinned;
  };
  const hide = () => {
    cell.hidden = !cell.hidden;
    execute();
  };
  const up = () => {
    const index = order.indexOf(id2);
    if (index <= 0) return;
    [order[index - 1], order[index]] = [order[index], order[index - 1]];
    const previous = cells.get(order[index]);
    main2.insertBefore(
      container,
      previous.container
    );
  };
  const down = () => {
    const index = order.indexOf(id2);
    if (index === -1 || index >= order.length - 1) return;
    [order[index], order[index + 1]] = [order[index + 1], order[index]];
    const next = cells.get(order[index]);
    main2.insertBefore(
      next.container,
      container
    );
  };
  cells.set(id2, {
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
  order.push(id2);
  execute();
  return id2;
};
var clear2 = () => {
  nextId = 0;
  for (const id2 of [...order]) {
    cells.get(id2)?.remove();
  }
  order.length = 0;
};
var notebook = null;
var open = (html2) => {
  if (!/<notebook[\s>]/i.test(html2)) {
    send({ type: "error", value: "Not an Observable notebook" });
    return false;
  }
  clear2();
  notebook = deserialize(html2);
  send({
    type: "notebook",
    value: notebook
  });
  for (const c of notebook.cells) {
    createCell(c);
  }
  return true;
};
var handle = (msg) => {
  switch (msg.type) {
    case "open":
      open(msg.value);
      break;
    case "sync":
      for (const [id2, value] of msg.values) {
        const c = cells.get(id2);
        if (c) c.cell.value = value;
      }
      break;
    case "save":
      notebook.cells = order.map((id2) => cells.get(id2).cell);
      send({
        type: "save",
        value: serialize(notebook)
      });
      break;
    case "insert":
      const index = order.indexOf(msg.id);
      const nid = createCell(msg.cell);
      order.splice(order.indexOf(nid), 1);
      order.splice(index + 1, 0, nid);
      const current2 = cells.get(msg.id);
      const inserted = cells.get(nid);
      main2.insertBefore(
        inserted.container,
        current2.container.nextSibling
      );
      break;
    case "remove":
      cells.get(msg.id)?.remove();
      break;
    case "modify":
      cells.get(msg.id)?.execute(msg.mode, msg.value);
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
      for (const [id2, value] of msg.values) {
        const cell = cells.get(id2);
        if (!cell) continue;
        cell.container.style.marginBottom = `${value}px`;
      }
      break;
  }
};
window.addEventListener("message", (e) => {
  if (e.source !== parent) return;
  if (e.data?.type !== "init" || !e.ports.length || port) return;
  port = e.ports[0];
  port.onmessage = (e2) => handle(e2.data);
  send({ type: "hello" });
});
var handleFiles = (files) => {
  if (files.length === 1 && (files[0].type === "text/html" || files[0].name.toLowerCase().endsWith(".html") || files[0].name.toLowerCase().endsWith(".htm"))) {
    const file = files[0];
    file.text().then((html2) => {
      if (open(html2)) send({ type: "loaded", value: file.name });
    });
    return;
  }
};
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
var announce = () => {
  if (port) return;
  parent.postMessage({ type: "hello" }, "*");
  setTimeout(announce, 100);
};
announce();
