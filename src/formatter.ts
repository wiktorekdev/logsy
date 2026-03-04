import { ansi, colorize, strip } from "./ansi.js";
import type { LogEntry, LogLevel } from "./types.js";

// Each level gets an icon + color pair. The icon column is fixed-width so
// messages align regardless of level name length.
const LEVEL_CONFIG: Record<LogLevel, { icon: string; label: string; color: string }> = {
  debug: { icon: "○", label: "debug", color: ansi.gray },
  info: { icon: "◆", label: "info ", color: ansi.cyan },
  success: { icon: "✔", label: "ok   ", color: ansi.green },
  warn: { icon: "▲", label: "warn ", color: ansi.yellow },
  error: { icon: "✖", label: "error", color: ansi.red },
};

function formatTimestamp(date: Date): string {
  const h = date.getHours().toString().padStart(2, "0");
  const m = date.getMinutes().toString().padStart(2, "0");
  const s = date.getSeconds().toString().padStart(2, "0");
  return `${h}:${m}:${s}`;
}

function formatData(data: unknown): string {
  if (data instanceof Error) {
    return `\n  ${data.stack ?? data.message}`;
  }
  if (typeof data === "object" && data !== null) {
    return "\n  " + JSON.stringify(data, null, 2).replace(/\n/g, "\n  ");
  }
  return ` ${String(data)}`;
}

export function format(entry: LogEntry, noColor = false, timestamps = true): string {
  const cfg = LEVEL_CONFIG[entry.level];

  const ts = timestamps ? colorize(formatTimestamp(entry.timestamp), ansi.dim, ansi.gray) + "  " : "";
  const badge = colorize(`${cfg.icon} ${cfg.label}`, ansi.bold, cfg.color);
  const prefix = entry.prefix ? colorize(`[${entry.prefix}]`, ansi.bold, ansi.magenta) + " " : "";
  const msg = entry.level === "error"
    ? colorize(entry.message, ansi.red)
    : entry.message;
  const extra = entry.data !== undefined ? colorize(formatData(entry.data), ansi.gray) : "";

  const line = `${ts}${badge}  ${prefix}${msg}${extra}`;

  return noColor ? strip(line) : line;
}
