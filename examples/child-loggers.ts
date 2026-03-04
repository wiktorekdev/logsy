import { Logger } from "../src/index.js";

const httpLog = new Logger({ prefix: "http", level: "info" });
const dbLog = httpLog.child({ prefix: "db" });
const cacheLog = httpLog.child({ prefix: "cache" });

httpLog.info("Request received", { method: "POST", path: "/api/orders" });
dbLog.info("Query executed", { table: "orders", rows: 5 });
cacheLog.warn("Cache miss", { key: "user:1234" });
httpLog.success("Response sent", { status: 201, ms: 45 });
