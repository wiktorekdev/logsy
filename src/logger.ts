import { format } from "./formatter.js";
import { isAboveThreshold } from "./levels.js";
import type { LogEntry, LogLevel, LogsyOptions } from "./types.js";

export class Logger {
  private readonly options: Required<LogsyOptions>;

  constructor(options: LogsyOptions = {}) {
    this.options = {
      level: options.level ?? "debug",
      prefix: options.prefix ?? "",
      timestamps: options.timestamps ?? true,
      noColor: options.noColor ?? (!process.stdout.isTTY && !process.env.FORCE_COLOR),
    };
  }

  // Create a child logger that inherits current options but overrides what you pass.
  // Handy for per-module prefixes: const log = logger.child({ prefix: "db" })
  child(overrides: LogsyOptions): Logger {
    return new Logger({ ...this.options, ...overrides });
  }

  private write(level: LogLevel, message: string, data?: unknown): void {
    if (!isAboveThreshold(level, this.options.level)) return;

    const entry: LogEntry = {
      level,
      message,
      timestamp: new Date(),
      prefix: this.options.prefix || undefined,
      data,
    };

    const line = format(entry, this.options.noColor, this.options.timestamps);

    // errors go to stderr, everything else to stdout
    if (level === "error") {
      process.stderr.write(line + "\n");
    } else {
      process.stdout.write(line + "\n");
    }
  }

  debug(message: string, data?: unknown): void {
    this.write("debug", message, data);
  }

  info(message: string, data?: unknown): void {
    this.write("info", message, data);
  }

  success(message: string, data?: unknown): void {
    this.write("success", message, data);
  }

  warn(message: string, data?: unknown): void {
    this.write("warn", message, data);
  }

  error(message: string, data?: unknown): void {
    this.write("error", message, data);
  }
}