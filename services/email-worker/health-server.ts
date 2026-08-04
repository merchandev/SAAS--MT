import http from "http";
import { prisma } from "../../lib/prisma";

export function startHealthServer(port: number) {
  const server = http.createServer(async (req, res) => {
    if (req.url === "/health") {
      try {
        await prisma.$queryRaw`SELECT 1`;
        res.writeHead(200, { "Content-Type": "text/plain" });
        res.end("OK");
      } catch (e) {
        res.writeHead(500, { "Content-Type": "text/plain" });
        res.end("Database unavailable");
      }
    } else {
      res.writeHead(404);
      res.end();
    }
  });

  server.listen(port, "0.0.0.0", () => {
    console.log(`Email worker health server listening on port ${port}`);
  });

  return server;
}
