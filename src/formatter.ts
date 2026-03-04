import { ansi, colorize, strip, hex } from "./ansi.js";
import type { LogEntry, LogLevel } from "./types.js";

const LEVEL_CONFIG: Record<LogLevel, { icon: string; color: string }> = {
  debug: { icon: "•", color: hex("#6b7280") },
  info: { icon: "ℹ", color: hex("#3b82f6") },
  success: { icon: "✔", color: hex("#22c55e") },
  warn: { icon: "⚠", color: hex("#f59e0b") },
  error: { icon: "✖", color: hex("#ef4444") },
  fatal: { icon: "✖", color: hex("#dc2626") },
};

function formatData(data: unknown): string {
  if (data instanceof Error) {
    return `\n    ${data.stack ?? data.message}`;
  }
  if (typeof data === "object" && data !== null) {
    return " " + JSON.stringify(data);
  }
  return ` ${String(data)}`;
}

export function format(entry: LogEntry, noColor = false, timestamps = true): string {
  const cfg = LEVEL_CONFIG[entry.level];
  const parts: string[] = [];

  if (entry.prefix) {
    parts.push(colorize(`[${entry.prefix}]`, ansi.gray));
  }

  parts.push(colorize(cfg.icon, cfg.color));
  parts.push(entry.message);

  if (entry.data !== undefined) {
    parts.push(colorize(formatData(entry.data), ansi.gray));
  }

  const line = parts.join(" ");
  return noColor ? strip(line) : line;
}

export function formatJson(entry: LogEntry): string {
  const obj: Record<string, unknown> = {
    level: entry.level,
    ts: entry.timestamp.toISOString(),
    message: entry.message,
  };
  if (entry.prefix) obj.prefix = entry.prefix;
  if (entry.data !== undefined) {
    obj.data = entry.data instanceof Error
      ? { message: entry.data.message, stack: entry.data.stack }
      : entry.data;
  }
  return JSON.stringify(obj);
}
