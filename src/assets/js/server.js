import os from "node:os";
import fs from "node:fs";
import path from "node:path";
import http from "node:http";

import { spawn, execSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)),"../../..");

const mime = {
  ".html": "text/html",
  ".js": "text/javascript",
  ".mjs": "text/javascript",
  ".css": "text/css",
  ".json": "application/json",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon"
};

const findChrome = () => {
  const locations = [
    // Registry location
    (() => {
      try {
        return execSync(
          "reg query \"HKLM\\Software\\Microsoft\\Windows\\CurrentVersion\\App Paths\\chrome.exe\" /ve",
          {encoding:"utf8"}
        )
        .match(/REG_SZ\s+(.+)/)?.[1]
        ?.trim();
      } catch {
        return null;
      }
    })(),
    // Common locations
    "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
    "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
    path.join(
      os.homedir(),
      "AppData\\Local\\Google\\Chrome\\Application\\chrome.exe"
    )
  ];
  return locations.find(x => x && fs.existsSync(x));
}

const openChrome = (url,chrome) => {
  spawn(
    chrome,
    [
      `--app=${url}`,
      "--disable-translate",
      "--disable-features=Translate"
    ],
    {
      detached: true,
      stdio: "ignore"
    }
  ).unref();
}

const server = http.createServer((req,res) => {
  const url = new URL(req.url,`http://${req.headers.host}`);
  let pathname = decodeURIComponent(url.pathname);

  if (url.searchParams.has("editor") && pathname.startsWith("/notebooks/") && pathname.endsWith("/worker.js")) {
    pathname = "/src/assets/js/worker.js";
  }

  if (req.method === "POST" && pathname === "/api/save") {
    if (!req.headers.referer || req.headers.referer.endsWith("/src/assets/js/worker.js")) {
      res.writeHead(403);
      return res.end("Forbidden");
    }
    let body = "";
    req.on("data", chunk => {
      body += chunk;
    });
    req.on("end", () => {
      try {
        const { path: notebookPath, html } = JSON.parse(body);
        const file = path.join(root, notebookPath);
        fs.writeFile(file, html, err => {
          if (err) {
            res.writeHead(500);
            return res.end();
          }
          res.writeHead(200);
          res.end();
        });
      } catch {
        res.writeHead(400);
        res.end();
      }
    });
    return;
  }

  const file = path.join(root,pathname);
  if (!file.startsWith(root)){
    res.writeHead(403);
    res.end("Forbidden");
    return;
  }
  if (pathname.endsWith("/")) {
    if (fs.existsSync(file)) {
      res.writeHead(200,{"Content-Type":"application/json"});
      return res.end(JSON.stringify(
        fs.readdirSync(file,{ withFileTypes: true })
        .map(i => i.isDirectory() ? `${i.name}/` : i.name)
      ));
    }
  }
  fs.readFile(file, (err, data) => {
    if (err) {
      res.writeHead(404);
      res.end("Not found");
      return;
    }

    if (pathname === "/src/worker.html") {
      let html = data.toString();
      const referer = req.headers.referer;
      if (referer) {
        try {
          const path = new URL(referer).searchParams.get("path");
          if (path) {
            html = html.replace(
              "/src/assets/js/worker.js",
              `${path.replace(/\/[^/]*\.html?$/,"")}/worker.js?editor`
            );
          }
        } catch {}
      }
      res.writeHead(200, {
        "Content-Type": "text/html"
      });
      return res.end(html);
    }

    res.writeHead(200,{
      "Content-Type":
        mime[path.extname(file)] || "application/octet-stream"
    });
    res.end(data);
  });
});

server.listen(0,"127.0.0.1",()=>{
  const port = server.address().port;
  const url = `http://127.0.0.1:${port}/src/notebooks.html`;
  console.log("Running:",url);
  const chrome = findChrome();
  if (!chrome) {
    console.log("Chrome not found.");
    console.log("Open manually");
    return;
  }
  openChrome(url,chrome);
});