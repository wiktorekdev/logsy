import { format, formatJson } from "./formatter.js";
import { isAboveThreshold } from "./levels.js";
import type { LogEntry, LogLevel, LogsyOptions } from "./types.js";

export class Logger {
  private readonly options: Required<LogsyOptions>;
  private readonly _timers = new Map<string, number>();

  constructor(options: LogsyOptions = {}) {
    this.options = {
      level: options.level ?? "debug",
      prefix: options.prefix ?? "",
      timestamps: options.timestamps ?? false,
      noColor: options.noColor ?? (!process.stdout.isTTY && !process.env.FORCE_COLOR),
      json: options.json ?? false,
      context: options.context ?? {},
    };
  }

  // Create a child logger that inherits current options but overrides what you pass.
  // Handy for per-module prefixes: const log = logger.child({ prefix: "db" })
  child(overrides: LogsyOptions): Logger {
    return new Logger({ ...this.options, ...overrides });
  }

  private write(level: LogLevel, message: string, data?: unknown): void {
    if (!isAboveThreshold(level, this.options.level)) return;

    const ctx = this.options.context;
    const hasCtx = Object.keys(ctx).length > 0;
    const resolved = hasCtx
      ? (typeof data === "object" && data !== null && !(data instanceof Error)
        ? { ...ctx, ...(data as object) }
        : data ?? ctx)
      : data;

    const entry: LogEntry = {
      level,
      message,
      timestamp: new Date(),
      prefix: this.options.prefix || undefined,
      data: resolved,
    };

    const line = this.options.json
      ? formatJson(entry)
      : format(entry, this.options.noColor, this.options.timestamps);

    // errors and fatals go to stderr, everything else to stdout
    if (level === "error" || level === "fatal") {
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

  fatal(message: string, data?: unknown): void {
    this.write("fatal", message, data);
    process.exit(1);
  }

  time(label: string): void {
    this._timers.set(label, performance.now());
  }

  timeEnd(label: string): void {
    const start = this._timers.get(label);
    if (start === undefined) return;
    this._timers.delete(label);
    this.write("info", label, { ms: Math.round(performance.now() - start) });
  }
}