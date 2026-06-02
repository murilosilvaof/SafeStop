const http = require("http");

const PORT = process.env.PORT || 3001;
let emergency = false;
const clients = new Set();

function withCors(res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
}

function sendJson(res, statusCode, payload) {
  withCors(res);
  res.writeHead(statusCode, { "Content-Type": "application/json" });
  res.end(JSON.stringify(payload));
}

function broadcastState() {
  const payload = `data: ${JSON.stringify({
    emergency,
    updatedAt: new Date().toISOString(),
  })}\n\n`;

  for (const res of clients) {
    res.write(payload);
  }
}

function readBody(req) {
  return new Promise((resolve) => {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk.toString("utf8");
    });
    req.on("end", () => resolve(body));
  });
}

const server = http.createServer(async (req, res) => {
  withCors(res);

  if (req.method === "OPTIONS") {
    res.writeHead(204);
    res.end();
    return;
  }

  if (req.method === "GET" && req.url === "/api/emergency/state") {
    sendJson(res, 200, {
      emergency,
      updatedAt: new Date().toISOString(),
    });
    return;
  }

  if (req.method === "POST" && req.url === "/api/emergency/activate") {
    await readBody(req);
    emergency = true;
    broadcastState();
    sendJson(res, 200, { ok: true, emergency });
    return;
  }

  if (req.method === "POST" && req.url === "/api/emergency/reset") {
    await readBody(req);
    emergency = false;
    broadcastState();
    sendJson(res, 200, { ok: true, emergency });
    return;
  }

  if (req.method === "GET" && req.url === "/events") {
    res.writeHead(200, {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
      "Access-Control-Allow-Origin": "*",
    });

    res.write(`data: ${JSON.stringify({
      emergency,
      updatedAt: new Date().toISOString(),
    })}\n\n`);

    clients.add(res);

    req.on("close", () => {
      clients.delete(res);
    });

    return;
  }

  sendJson(res, 404, { error: "not_found" });
});

server.listen(PORT, () => {
  console.log(`[bridge-server] listening on http://127.0.0.1:${PORT}`);
});
