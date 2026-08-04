import { runWorker } from "./worker-loop";
import { startHealthServer } from "./health-server";
import { config } from "dotenv";
import path from "path";

// Load environment variables if not injected by Docker
config({ path: path.join(__dirname, "../../.env") });

async function main() {
  console.log("Starting email worker...");
  
  // Start health check HTTP server
  startHealthServer(3001);

  // Start the infinite worker loop
  await runWorker();
}

main().catch(console.error);
