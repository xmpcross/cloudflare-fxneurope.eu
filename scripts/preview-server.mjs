// Serve only dist. Mail credentials are loaded server-side for each submission.
import { createServer } from "node:http";
import { readFile, realpath, stat } from "node:fs/promises";
import { createReadStream } from "node:fs";
import { Readable } from "node:stream";
import { parseEnv } from "node:util";
import { resolve, extname, sep } from "node:path";
import { fileURLToPath } from "node:url";
import { createContactHandler } from "../server/contact.mjs";
const project = fileURLToPath(new URL("../", import.meta.url));
const root = resolve(project, "dist");
const contact = createContactHandler();
const types = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css",
  ".js": "text/javascript",
  ".json": "application/json",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".ico": "image/x-icon",
  ".woff2": "font/woff2",
  ".xml": "application/xml",
  ".txt": "text/plain",
};
createServer(async (req, res) => {
  res.setHeader("X-Robots-Tag", "noindex, nofollow");
  res.setHeader("X-Content-Type-Options", "nosniff");
  try {
    const url = new URL(req.url, `http://${req.headers.host}`);
    if (url.pathname === "/api/contact") {
      let env = {};
      try {
        env = parseEnv(await readFile(resolve(project, ".dev.vars"), "utf8"));
      } catch {}
      const headers = new Headers();
      for (const [key, value] of Object.entries(req.headers)) {
        if (value != null) headers.set(key, Array.isArray(value) ? value.join(", ") : value);
      }
      // Trust the socket address, not a client-supplied Cloudflare header.
      headers.set("cf-connecting-ip", req.socket.remoteAddress || "local");
      const request = new Request(url, {
        method: req.method,
        headers,
        ...(!["GET", "HEAD"].includes(req.method)
          ? { body: Readable.toWeb(req), duplex: "half" }
          : {}),
      });
      const response = await contact({ request, env });
      res.writeHead(response.status, Object.fromEntries(response.headers));
      res.end(Buffer.from(await response.arrayBuffer()));
      return;
    }
    if (!["GET", "HEAD"].includes(req.method)) {
      res.writeHead(405, { Allow: "GET, HEAD" });
      res.end();
      return;
    }
    if (url.pathname === "/") {
      res.writeHead(302, { Location: "/en/" });
      res.end();
      return;
    }
    if (["/404", "/404/", "/404.html", "/_not-found", "/_not-found/"].includes(url.pathname)) {
      res.writeHead(404);
      res.end("Page not found");
      return;
    }
    const relative = decodeURIComponent(url.pathname).replace(/^\/+/, "");
    let file = resolve(root, relative);
    if (!file.startsWith(root + sep)) {
      res.writeHead(404);
      res.end();
      return;
    }
    let info = await stat(file);
    if (info.isDirectory()) {
      if (!url.pathname.endsWith("/")) {
        res.writeHead(301, { Location: url.pathname + "/" + url.search });
        res.end();
        return;
      }
      file = resolve(file, "index.html");
    }
    file = await realpath(file);
    if (!file.startsWith(root + sep)) {
      res.writeHead(404);
      res.end();
      return;
    }
    info = await stat(file);
    res.writeHead(200, {
      "Content-Type": types[extname(file)] || "application/octet-stream",
      "Content-Length": info.size,
    });
    if (req.method === "HEAD") res.end();
    else
      createReadStream(file)
        .on("error", () => res.destroy())
        .pipe(res);
  } catch {
    if (!res.headersSent) res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("Page not found");
  }
}).listen(8790, "0.0.0.0", () => console.log("FXN Europe preview listening on port 8790"));
