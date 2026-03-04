import type { LogLevel } from "./types.js";

const ORDER: Record<LogLevel | "silent", number> = {
  debug: 0,
  info: 1,
  success: 2,
  warn: 3,
  error: 4,
  fatal: 5,
  silent: 6,
};

export function isAboveThreshold(level: LogLevel, minimum: LogLevel | "silent"): boolean {
  return ORDER[level] >= ORDER[minimum];
}
