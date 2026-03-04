import { Logger } from "../src/index.js";

const log = new Logger({
  prefix: "api",
  json: true,
  timestamps: true
});

log.info("Server starting");
log.info("Request processed", {
  method: "GET",
  path: "/health",
  status: 200,
  duration: 12
});
log.warn("High latency detected", { p99: 450, threshold: 300 });
log.error("Database connection failed", { error: "ECONNREFUSED", host: "db.internal" });
