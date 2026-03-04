import { describe, it } from "vitest";
import { strict as assert } from "node:assert";
import { strip, colorize, ansi, hex, rgb } from "../src/ansi.js";

describe("strip", () => {
    it("removes ANSI escape codes", () => {
        assert.equal(strip("\x1b[31mhello\x1b[0m"), "hello");
        assert.equal(strip("\x1b[1m\x1b[32mworld\x1b[0m"), "world");
    });

    it("leaves plain strings unchanged", () => {
        assert.equal(strip("hello world"), "hello world");
    });
});

describe("colorize", () => {
    it("wraps text between codes and reset", () => {
        const out = colorize("hi", ansi.red);
        assert(out.startsWith(ansi.red));
        assert(out.endsWith(ansi.reset));
        assert(out.includes("hi"));
    });

    it("joins multiple codes in order", () => {
        const out = colorize("x", ansi.bold, ansi.cyan);
        assert(out.startsWith(ansi.bold + ansi.cyan));
    });
});

describe("rgb", () => {
    it("produces a truecolor escape sequence", () => {
        assert.equal(rgb(255, 0, 128), "\x1b[38;2;255;0;128m");
    });
});

describe("hex", () => {
    it("returns a non-empty escape string", () => {
        const out = hex("#f87171");
        assert(out.startsWith("\x1b["));
    });

    it("stripped output is empty (pure escape code)", () => {
        assert.equal(strip(hex("#4ade80")), "");
    });
});
