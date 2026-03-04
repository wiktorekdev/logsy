import { Logger } from "../src/index.js";

const levels = ["debug", "info", "warn", "error"] as const;

levels.forEach((level) => {
  const log = new Logger({ level, prefix: level });
  console.log(`\n--- Level: ${level} ---`);
  log.debug("Debug message");
  log.info("Info message");
  log.success("Success message");
  log.warn("Warning message");
  log.error("Error message");
});
