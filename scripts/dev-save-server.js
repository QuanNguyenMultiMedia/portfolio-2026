const http = require("http");
const fs = require("fs");
const path = require("path");
const { spawn } = require("child_process");

// 1. Start the file-saving HTTP server
const PORT = 3001;
const server = http.createServer((req, res) => {
  // Enable CORS so the next dev server can call it
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.writeHead(200);
    res.end();
    return;
  }

  if (req.method === "POST" && req.url === "/api/save") {
    let body = "";
    req.on("data", chunk => {
      body += chunk.toString();
    });
    req.on("end", async () => {
      try {
        const { content } = JSON.parse(body);
        if (!content) {
          res.writeHead(400, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ success: false, error: "Content is required" }));
          return;
        }
        const filePath = path.join(__dirname, "..", "src", "lib", "designSystem.ts");
        await fs.promises.writeFile(filePath, content, "utf8");
        console.log(`[Dev Save Server] Successfully wrote designSystem.ts`);
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ success: true }));
      } catch (error) {
        console.error(`[Dev Save Server] Error saving file:`, error);
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ success: false, error: error.message }));
      }
    });
  } else {
    res.writeHead(404);
    res.end();
  }
});

server.listen(PORT, "127.0.0.1", () => {
  console.log(`[Dev Save Server] Running on http://127.0.0.1:${PORT}`);
});

// 2. Spawn Next.js dev server
const next = spawn("npx", ["next", "dev", "--hostname", "127.0.0.1"], {
  stdio: "inherit",
  shell: true
});

next.on("close", (code) => {
  process.exit(code);
});
