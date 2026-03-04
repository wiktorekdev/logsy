import type { LogLevel } from "./types.js";

const ORDER: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  success: 2,
  warn: 3,
  error: 4,
};

export function isAboveThreshold(level: LogLevel, minimum: LogLevel): boolean {
  return ORDER[level] >= ORDER[minimum];
}
