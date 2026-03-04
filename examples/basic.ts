import { logger, Logger } from "../src/index.js";

// --- Basic usage ---
logger.info("Server started", { port: 3000 });
logger.success("Database connected");
logger.warn("Rate limit approaching", { requests: 980, limit: 1000 });
logger.error("Unhandled exception", new Error("Something went wrong"));
logger.debug("Incoming request", { method: "GET", path: "/api/users" });

// --- Per-module loggers (Discord bot example) ---
const botLog = new Logger({ prefix: "bot" });
const dbLog = new Logger({ prefix: "db" });

botLog.info("Logged in as MyBot#1234");
botLog.debug("Received interaction", { user: "wiktor", command: "/ping" });

dbLog.info("Running migrations");
dbLog.success("Migrations complete");

// --- Production mode: only warn and above ---
const prodLog = new Logger({ level: "warn", prefix: "api" });
prodLog.debug("This won't show up");
prodLog.warn("Slow query detected", { ms: 1200, query: "SELECT * FROM users" });
