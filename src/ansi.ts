const ESC = "\x1b";

// Basic ANSI helpers – kept minimal to avoid pulling in chalk or similar
export const ansi = {
  reset: `${ESC}[0m`,
  bold: `${ESC}[1m`,
  dim: `${ESC}[2m`,
  underline: `${ESC}[4m`,

  black: `${ESC}[30m`,
  red: `${ESC}[31m`,
  green: `${ESC}[32m`,
  yellow: `${ESC}[33m`,
  blue: `${ESC}[34m`,
  magenta: `${ESC}[35m`,
  cyan: `${ESC}[36m`,
  white: `${ESC}[37m`,
  gray: `${ESC}[90m`,

  bgRed: `${ESC}[41m`,
  bgYellow: `${ESC}[43m`,
};

export function colorize(text: string, ...codes: string[]): string {
  return `${codes.join("")}${text}${ansi.reset}`;
}

export function strip(text: string): string {
  // eslint-disable-next-line no-control-regex
  return text.replace(/\x1b\[[0-9;]*m/g, "");
}

// Detect terminal color capability once at startup.
// 3 = truecolor (16M), 2 = 256-color, 1 = basic ANSI 16.
// Color stripping is handled separately via noColor.
export function colorLevel(): 1 | 2 | 3 {
  if (process.env.COLORTERM === "truecolor" || process.env.COLORTERM === "24bit") return 3;
  if (process.env.TERM_PROGRAM === "iTerm.app" || process.env.TERM_PROGRAM === "vscode") return 3;
  if (/^(xterm-256|screen-256)/.test(process.env.TERM ?? "")) return 2;
  return 1;
}

// Truecolor foreground escape from RGB components.
export function rgb(r: number, g: number, b: number): string {
  return `${ESC}[38;2;${r};${g};${b}m`;
}

// Returns the best available foreground escape for a #RRGGBB hex color.
// Degrades: truecolor → 256-color → basic ANSI 16.
export function hex(color: string): string {
  const n = parseInt(color.slice(1), 16);
  const r = (n >> 16) & 0xff;
  const g = (n >> 8) & 0xff;
  const b = n & 0xff;
  const cl = colorLevel();
  if (cl >= 3) return rgb(r, g, b);
  if (cl >= 2) {
    const ri = Math.round((r / 255) * 5);
    const gi = Math.round((g / 255) * 5);
    const bi = Math.round((b / 255) * 5);
    return `${ESC}[38;5;${16 + 36 * ri + 6 * gi + bi}m`;
  }
  return nearestAnsi(r, g, b);
}

function nearestAnsi(r: number, g: number, b: number): string {
  const max = Math.max(r, g, b);
  const chroma = max - Math.min(r, g, b);
  if (chroma < 40) return max < 192 ? ansi.gray : ansi.white;
  if (r > 128 && g > 128 && b < 128) return ansi.yellow;
  if (r > 128 && b > 128 && g < 128) return ansi.magenta;
  if (g > 128 && b > 128 && r < 128) return ansi.cyan;
  if (r === max) return ansi.red;
  if (g === max) return ansi.green;
  return ansi.blue;
}
