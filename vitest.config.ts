import { defineConfig } from "vitest/config";

export default defineConfig({
    test: {
        include: ["tests/**/*.test.ts"],
    },
    resolve: {
        alias: [{ find: /^(\.{1,2}\/.+)\.js$/, replacement: "$1" }],
    },
});
