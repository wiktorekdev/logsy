import { Logger } from "../src/index.js";

const log = new Logger({ prefix: "app" });

log.time("database-query");

setTimeout(() => {
  log.timeEnd("database-query");
  log.success("Data fetched successfully");
}, 250);

log.time("api-call");
setTimeout(() => {
  log.timeEnd("api-call");
}, 100);
