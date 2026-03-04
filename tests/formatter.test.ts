import { describe, it } from "vitest";
import { strict as assert } from "node:assert";
import { format, formatJson } from "../src/formatter.js";
import type { LogEntry } from "../src/types.js";

const ts = new Date(2024, 0, 15, 12, 30, 45);

function entry(overrides: Partial<LogEntry> = {}): LogEntry {
    return { level: "info", message: "hello", timestamp: ts, ...overrides };
}

describe("format", () => {
    it("includes the message", () => {
        assert(format(entry(), true).includes("hello"));
    });

    it("includes the level label", () => {
        assert(format(entry(), true).includes("info"));
        assert(format(entry({ level: "error" }), true).includes("error"));
        assert(format(entry({ level: "fatal" }), true).includes("fatal"));
    });

    it("includes the timestamp when timestamps: true", () => {
        assert(format(entry(), true, true).includes("12:30:45"));
    });

    it("omits the timestamp when timestamps: false", () => {
        assert(!format(entry(), true, false).includes("12:30:45"));
    });

    it("strips ANSI codes when noColor: true", () => {
        assert(!format(entry(), true).includes("\x1b["));
    });

    it("includes prefix in brackets", () => {
        assert(format(entry({ prefix: "api" }), true).includes("[api]"));
    });

    it("appends string data inline", () => {
        assert(format(entry({ data: "extra" }), true).includes("extra"));
    });

    it("includes Error message in output", () => {
        assert(format(entry({ data: new Error("boom") }), true).includes("boom"));
    });
});

describe("formatJson", () => {
    it("produces valid JSON", () => {
        assert.doesNotThrow(() => JSON.parse(formatJson(entry())));
    });

    it("includes level, ts, and message fields", () => {
        const p = JSON.parse(formatJson(entry()));
        assert.equal(p.level, "info");
        assert.equal(p.message, "hello");
        assert("ts" in p);
    });

    it("includes prefix when set", () => {
        const p = JSON.parse(formatJson(entry({ prefix: "bot" })));
        assert.equal(p.prefix, "bot");
    });

    it("omits prefix when not set", () => {
        const p = JSON.parse(formatJson(entry()));
        assert(!("prefix" in p));
    });

    it("serializes Error to {message, stack}", () => {
        const p = JSON.parse(formatJson(entry({ data: new Error("oops") })));
        assert.equal(p.data.message, "oops");
        assert("stack" in p.data);
    });

    it("passes through plain object data", () => {
        const p = JSON.parse(formatJson(entry({ data: { x: 1 } })));
        assert.equal(p.data.x, 1);
    });

    it("omits data field when not set", () => {
        const p = JSON.parse(formatJson(entry()));
        assert(!("data" in p));
    });
});
