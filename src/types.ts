export type LogLevel = "debug" | "info" | "success" | "warn" | "error" | "fatal";

export interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: Date;
  prefix?: string;
  data?: unknown;
}

export interface LogsyOptions {
  // Minimum level to output. Useful for silencing debug logs in production.
  level?: LogLevel | "silent";
  // Optional prefix shown before every message, e.g. "api" or "bot"
  prefix?: string;
  // Whether to include timestamps. Defaults to true.
  timestamps?: boolean;
  // Disable all color output, e.g. when piping to a file
  noColor?: boolean;
  // Emit newline-delimited JSON instead of pretty output. Useful for production log aggregators.
  json?: boolean;
  // Key-value pairs merged into every log entry's data.
  context?: Record<string, unknown>;
}
