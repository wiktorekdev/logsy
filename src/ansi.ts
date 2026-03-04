const ESC = "\x1b";

// Basic ANSI helpers – kept minimal to avoid pulling in chalk or similar
export const ansi = {
  reset: `${ESC}[0m`,
  bold: `${ESC}[1m`,
  dim: `${ESC}[2m`,

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
