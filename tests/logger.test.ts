import { describe, it, vi, beforeEach, afterEach } from "vitest";
import { strict as assert } from "node:assert";
import { Logger } from "../src/logger.js";

describe("Logger", () => {
    let stdout: any;
    let stderr: any;

    beforeEach(() => {
        stdout = vi.spyOn(process.stdout, "write").mockReturnValue(true);
        stderr = vi.spyOn(process.stderr, "write").mockReturnValue(true);
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it("writes info/success/warn/debug to stdout", () => {
        const log = new Logger();
        log.info("a"); log.success("b"); log.warn("c"); log.debug("d");
        assert.equal(stdout.mock.calls.length, 4);
    });

    it("writes error to stderr", () => {
        const log = new Logger();
        log.error("boom");
        assert.equal(stderr.mock.calls.length, 1);
        assert.equal(stdout.mock.calls.length, 0);
    });

    it("respects level threshold", () => {
        const log = new Logger({ level: "warn" });
        log.debug("x"); log.info("x");
        assert.equal(stdout.mock.calls.length, 0);
        log.warn("x");
        assert.equal(stdout.mock.calls.length, 1);
    });

    it("silent level suppresses all output", () => {
        const log = new Logger({ level: "silent" });
        log.debug("x"); log.info("x"); log.warn("x"); log.error("x");
        assert.equal(stdout.mock.calls.length, 0);
        assert.equal(stderr.mock.calls.length, 0);
    });

    it("includes message in output", () => {
        const log = new Logger({ noColor: true });
        log.info("hello world");
        assert((stdout.mock.calls[0][0] as string).includes("hello world"));
    });

    it("json mode outputs valid JSON lines", () => {
        const log = new Logger({ json: true });
        log.info("hello");
        const parsed = JSON.parse((stdout.mock.calls[0][0] as string).trim());
        assert.equal(parsed.level, "info");
        assert.equal(parsed.message, "hello");
    });

    it("merges context into object data", () => {
        const log = new Logger({ json: true, context: { reqId: "abc" } });
        log.info("req", { x: 1 });
        const parsed = JSON.parse((stdout.mock.calls[0][0] as string).trim());
        assert.equal(parsed.data.reqId, "abc");
        assert.equal(parsed.data.x, 1);
    });

    it("uses context as data when no data provided", () => {
        const log = new Logger({ json: true, context: { v: 2 } });
        log.info("bare");
        const parsed = JSON.parse((stdout.mock.calls[0][0] as string).trim());
        assert.equal(parsed.data.v, 2);
    });

    it("data takes precedence over context on key collision", () => {
        const log = new Logger({ json: true, context: { k: "ctx" } });
        log.info("x", { k: "data" });
        const parsed = JSON.parse((stdout.mock.calls[0][0] as string).trim());
        assert.equal(parsed.data.k, "data");
    });

    it("child inherits parent level threshold", () => {
        const parent = new Logger({ level: "warn" });
        const child = parent.child({ prefix: "db" });
        child.debug("quiet"); child.info("quiet");
        assert.equal(stdout.mock.calls.length, 0);
        child.warn("loud");
        assert.equal(stdout.mock.calls.length, 1);
    });

    it("timeEnd logs elapsed ms as info", () => {
        const log = new Logger();
        log.time("op");
        log.timeEnd("op");
        assert.equal(stdout.mock.calls.length, 1);
        assert((stdout.mock.calls[0][0] as string).includes("op"));
    });

    it("timeEnd is a no-op for unknown labels", () => {
        const log = new Logger();
        assert.doesNotThrow(() => log.timeEnd("ghost"));
        assert.equal(stdout.mock.calls.length, 0);
    });

    it("fatal writes to stderr and calls process.exit(1)", () => {
        const exit = vi.spyOn(process, "exit").mockImplementation((() => { }) as never);
        const log = new Logger();
        log.fatal("crash");
        assert.equal(stderr.mock.calls.length, 1);
        assert.equal(exit.mock.calls[0][0], 1);
        exit.mockRestore();
    });
});
