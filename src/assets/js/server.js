import os from "node:os";
import fs from "node:fs";
import path from "node:path";
import http from "node:http";

import { spawn, execSync, exec } from "node:child_process";
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

function findChrome() {
  const platform = process.platform;
  if (platform === "win32") {
    // Windows
    try {
      const out = execSync(
        'reg query "HKLM\\Software\\Microsoft\\Windows\\CurrentVersion\\App Paths\\chrome.exe" /ve',
        { encoding: "utf8" }
      );
      const match = out.match(/REG_SZ\s+(.+)/);
      if (match) return match[1].trim();
    } catch {}
    const candidates = [
      "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
      "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
      path.join(os.homedir(), "AppData\\Local\\Google\\Chrome\\Application\\chrome.exe"),
    ];
    for (const c of candidates) {
      if (fs.existsSync(c)) return c;
    }
    // Fallback: try `where`
    try {
      return execSync("where chrome", { encoding: "utf8" }).split("\n")[0].trim();
    } catch {}
    return null;
  }
  if (platform === "darwin") {
    // macOS
    const macPath = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
    if (fs.existsSync(macPath)) return macPath;
    return null;
  }
  if (platform === "linux") {
    // Linux: try `which` first
    try {
      const result = execSync("which google-chrome || which chromium-browser || which chromium", {
        encoding: "utf8",
        shell: "/bin/bash",
      });
      if (result) return result.trim();
    } catch {}
    // Fallback to common locations
    const common = [
      "/usr/bin/google-chrome",
      "/usr/bin/chromium-browser",
      "/snap/bin/chromium",
    ];
    for (const c of common) {
      if (fs.existsSync(c)) return c;
    }
    return null;
  }
  // Unsupported platform
  return null;
}

const openChrome = (url,chrome) => {
  if (chrome) {
    spawn(chrome, [`--app=${url}`, "--disable-translate", "--disable-features=Translate"], {
      detached: true,
      stdio: "ignore",
    }).unref();
    return;
  }

  // Try Termux (Android)
  try {
    execSync("which termux-open-url", { stdio: "ignore" });
    spawn("termux-open-url", [url], { detached: true, stdio: "ignore" }).unref();
    return;
  } catch {}

  // Use system default opener (desktop)
  const platform = process.platform;
  let cmd;
  if (platform === "win32") cmd = `start "${url}"`;
  else if (platform === "darwin") cmd = `open "${url}"`;
  else if (platform === "linux") cmd = `xdg-open "${url}"`;
  else {
    // For iOS, other mobile, or unknown
    console.log("Please open this URL in your browser:", url);
    return;
  }

  exec(cmd, { shell: true }, (err) => {
    if (err) console.log("Could not open browser automatically. Please open manually:", url);
  });
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
  if (!chrome) console.log("Chrome not found.");
  openChrome(url,chrome);
});
