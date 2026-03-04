export type LogLevel = "debug" | "info" | "success" | "warn" | "error";

export interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: Date;
  prefix?: string;
  data?: unknown;
}

export interface LogsyOptions {
  // Minimum level to output. Useful for silencing debug logs in production.
  level?: LogLevel;
  // Optional prefix shown before every message, e.g. "[API]" or "[Bot]"
  prefix?: string;
  // Whether to include timestamps. Defaults to true.
  timestamps?: boolean;
  // Disable all color output, e.g. when piping to a file
  noColor?: boolean;
}
