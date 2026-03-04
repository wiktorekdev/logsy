# logsy

Zero-config, pretty terminal logger for Node.js. Works in Express APIs, Discord bots, CLI tools, or anything else you're building.

```
12:34:56 › ℹ info     Server listening on port 3000
12:34:56 › ✔ success  Database connected
12:34:57 › ⚠ warning  Rate limit approaching  { requests: 980, limit: 1000 }
12:34:58 › ✖ error    Connection refused
```

## Install

```sh
npm install @wiktorekdev/logsy
```

## Usage

```ts
import { logger } from "@wiktorekdev/logsy";

logger.info("Server started", { port: 3000 });
logger.success("Database connected");
logger.warn("High memory usage", { used: "1.2gb" });
logger.error("Unhandled error", new Error("Something broke"));
logger.debug("Incoming request", { method: "GET", path: "/" });
```

### Per-module loggers

```ts
import { Logger } from "@wiktorekdev/logsy";

const db  = new Logger({ prefix: "db" });
const bot = new Logger({ prefix: "bot" });

db.info("Running migrations");
bot.info("Logged in as MyBot#1234");
```

Output:
```
12:34:56 [db] › ℹ info     Running migrations
12:34:56 [bot] › ℹ info     Logged in as MyBot#1234
```

### Options

```ts
const log = new Logger({
  level: "warn",       // minimum level to output, or "silent" (default: "debug")
  prefix: "api",       // shown before every message
  timestamps: true,    // include timestamps (default: true)
  noColor: false,      // strip ANSI colors (auto-detected when not a TTY)
  json: false,         // use newline-delimited JSON output for production
  context: { id: 1 },  // key-value pairs merged into all log data
});
```

### Log levels

| Method | Icon | When to use |
|---|---|---|
| `debug` | ● | Internal state, request details |
| `info` | ℹ | Normal operational events |
| `success` | ✔ | Something completed successfully |
| `warn` | ⚠ | Something unexpected but recoverable |
| `error` | ✖ | Something failed |
| `fatal` | ✖ | Something fatally failed; also calls process.exit(1) |

### Passing data

Any second argument gets pretty-printed below the message:

```ts
logger.info("User created", { id: 42, email: "user@example.com" });
logger.error("Query failed", new Error("Connection timeout"));
```

Errors print the full stack trace. Objects are formatted as indented JSON.

### Production

Set `level: "warn"` to silence debug and info logs:

```ts
const log = new Logger({
  level: process.env.NODE_ENV === "production" ? "warn" : "debug",
});
```

### Colors

Color output is automatically disabled when stdout isn't a TTY (e.g. when piping to a file or running in CI). You can also disable manually with `noColor: true`.

## Why choose logsy?

The Node.js logging ecosystem is huge, but it's largely divided into two camps: massive enterprise loggers (Winston, Pino) that require tons of boilerplate/plugins, and beautiful UI loggers (Signale, Consola) that are packed with excessive features that bloat your project.

**logsy sits perfectly in the middle.**

- **0 dependencies**: Extremely lightweight. Doesn't bloat your `node_modules` or bundle size.
- **Signale-tier aesthetics**: Gorgeous, modern terminal output with correct alignments, truecolor/Hex support, and smart fallbacks for older terminals.
- **Production-ready**: Ships with a built-in `json: true` toggle. Locally, it's beautiful. On your server, it's structured NDJSON.
- **Zero-config**: Works perfectly out of the box. No formatting functions to compose, no transports to wire up.

### Comparisons

- **winston** – needs 20+ lines of config and plugins just to look decent.
- **pino** – incredibly fast, but raw JSON isn't readable during development without running a separate `pino-pretty` process (which is massive and annoying to pipe).
- **signale** – virtually abandoned, has 13+ transitive dependencies, and lacks first-class NDJSON support for log aggregators like Datadog.
- **consola** – excellent, but ships with prompt systems, reporters, and utility features that you likely don't need if you just want to log things.

## License

MIT
