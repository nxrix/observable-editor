import os from "node:os";
import fs from "node:fs";
import path from "node:path";
import http from "node:http";

import { spawn, execSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)),"../../..");

const notebooksDir = path.join(root, "notebooks");
const thumbnailsDir = path.join(root, "thumbnails");


const findNotebooks = (dir) => {
  let result = [];
  if (!fs.existsSync(dir))
    return result;
  for (const item of fs.readdirSync(dir, {
    withFileTypes:true
  })) {
    const full = path.join(dir,item.name);
    if (item.isDirectory()) {
      result.push(...findNotebooks(full));
    }
    else if (
      item.name.endsWith(".html")
    ) {
      result.push(full);
    }
  }
  return result;
};

const getThumbnailPath = (file) => {
  const relative = path.relative(
    notebooksDir,
    file
  );
  return path.join(
    thumbnailsDir,
    relative.replace(
      /\.html$/i,
      ".png"
    )
  );
};

const makeThumbnail = (
  file,
  output,
  port,
  chrome
) => {
  const relative = path.relative(
    notebooksDir,
    file
  ).replaceAll("\\","/");
  const renderURL = `http://127.0.0.1:${port}/src/renderer.html?path=/notebooks/${encodeURIComponent(relative)}`;
  console.log(
    "Thumbnail:",
    renderURL
  );
  spawn(chrome,[
    "--headless",
    //"--disable-gpu",
    "--hide-scrollbars",
    "--window-size=640,400",
    "--virtual-time-budget=5000",
    `--screenshot=${output}`,
    renderURL
  ],{
    stdio:"ignore"
  });
};

const createMissingThumbnails = (
  port,
  chrome
) => {
  for (const file of findNotebooks(notebooksDir)) {
    const thumb = getThumbnailPath(file);
    if (!fs.existsSync(thumb)) {
      fs.mkdirSync(
        path.dirname(thumb),
        {recursive:true}
      );
      makeThumbnail(
        file,
        thumb,
        port,
        chrome
      );
    }
  }
};

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
  const request = new URL(req.url,`http://${req.headers.host}`);
  let pathname = decodeURIComponent(request.pathname);
  const file = path.join(root,pathname);
  if (!file.startsWith(root)){
    res.writeHead(403);
    res.end("Forbidden");
    return;
  }
  if (pathname.endsWith("/")) {
    if (fs.existsSync(file)) {
      res.writeHead(200,{"Content-Type":"application/json"});
      return res.end(JSON.stringify(fs.readdirSync(file,{ withFileTypes: true }).map(i=>i.name)));
    }
  }
  fs.readFile(file, (err, data) => {
    if (err) {
      res.writeHead(404);
      res.end("Not found");
      return;
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
  const url = `http://127.0.0.1:${port}/src/index.html`;
  console.log("Running:",url);
  const chrome = findChrome();
  if (!chrome) {
    console.log("Chrome not found.");
    console.log("Open manually");
    return;
  }
  createMissingThumbnails(port,chrome);
  openChrome(url,chrome);
});