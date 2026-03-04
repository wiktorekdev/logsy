export { Logger } from "./logger.js";
export type { LogEntry, LogLevel, LogsyOptions } from "./types.js";

// Default instance – covers the "just import and use it" case
import { Logger } from "./logger.js";
export const logger = new Logger();
