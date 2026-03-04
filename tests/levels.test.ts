import { describe, it } from "vitest";
import { strict as assert } from "node:assert";
import { isAboveThreshold } from "../src/levels.js";

describe("isAboveThreshold", () => {
    it("allows levels at or above the minimum", () => {
        assert(isAboveThreshold("error", "warn"));
        assert(isAboveThreshold("warn", "warn"));
        assert(isAboveThreshold("fatal", "debug"));
    });

    it("blocks levels below the minimum", () => {
        assert(!isAboveThreshold("debug", "info"));
        assert(!isAboveThreshold("info", "warn"));
        assert(!isAboveThreshold("warn", "error"));
        assert(!isAboveThreshold("error", "fatal"));
    });

    it("silent threshold blocks everything", () => {
        assert(!isAboveThreshold("fatal", "silent"));
        assert(!isAboveThreshold("error", "silent"));
        assert(!isAboveThreshold("debug", "silent"));
    });
});
