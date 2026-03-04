import { ansi, colorize, strip, hex } from "./ansi.js";
import type { LogEntry, LogLevel } from "./types.js";

// Each level gets an icon + color pair. The icon column is fixed-width so
// messages align regardless of level name length.
const LEVEL_CONFIG: Record<LogLevel, { icon: string; label: string; color: string }> = {
  debug: { icon: "●", label: "debug", color: hex("#6b7280") },
  info: { icon: "ℹ", label: "info", color: hex("#38bdf8") },
  success: { icon: "✔", label: "success", color: hex("#4ade80") },
  warn: { icon: "⚠", label: "warning", color: hex("#fbbf24") },
  error: { icon: "✖", label: "error", color: hex("#f87171") },
  fatal: { icon: "✖", label: "fatal", color: hex("#f87171") },
};

function formatTimestamp(date: Date): string {
  const h = date.getHours().toString().padStart(2, "0");
  const m = date.getMinutes().toString().padStart(2, "0");
  const s = date.getSeconds().toString().padStart(2, "0");
  return `${h}:${m}:${s}`;
}

function formatData(data: unknown): string {
  if (data instanceof Error) {
    return `\n    ${data.stack ?? data.message}`;
  }
  if (typeof data === "object" && data !== null) {
    return "\n    " + JSON.stringify(data, null, 2).replace(/\n/g, "\n    ");
  }
  return ` ${String(data)}`;
}

export function format(entry: LogEntry, noColor = false, timestamps = true): string {
  const cfg = LEVEL_CONFIG[entry.level];

  const tsCol = timestamps ? colorize(formatTimestamp(entry.timestamp), ansi.dim, ansi.gray) + " " : "";

  let prefixCol = "";
  if (entry.prefix) {
    prefixCol = colorize(`[${entry.prefix}]`, ansi.gray) + colorize(" › ", ansi.dim, ansi.gray);
  } else if (timestamps) {
    prefixCol = colorize("› ", ansi.dim, ansi.gray);
  }

  const badgeIcon = colorize(cfg.icon, cfg.color);
  const badgeLabel = colorize(cfg.label.padEnd(7), ansi.underline, cfg.color);
  const badge = `${badgeIcon} ${badgeLabel}`;

  const extra = entry.data !== undefined ? colorize(formatData(entry.data), ansi.gray) : "";

  const line = `${tsCol}${prefixCol}${badge}  ${entry.message}${extra}`;

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
