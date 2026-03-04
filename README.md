# logsy

Zero-config, pretty terminal logger for Node.js. Works in Express APIs, Discord bots, CLI tools, or anything else you're building.

```
12:34:56  ◆ info   Server listening on port 3000
12:34:56  ✔ ok     Database connected
12:34:57  ▲ warn   Rate limit approaching  { requests: 980, limit: 1000 }
12:34:58  ✖ error  Connection refused
```

## Install

```sh
npm install logsy
```

## Usage

```ts
import { logger } from "logsy";

logger.info("Server started", { port: 3000 });
logger.success("Database connected");
logger.warn("High memory usage", { used: "1.2gb" });
logger.error("Unhandled error", new Error("Something broke"));
logger.debug("Incoming request", { method: "GET", path: "/" });
```

### Per-module loggers

```ts
import { Logger } from "logsy";

const db  = new Logger({ prefix: "db" });
const bot = new Logger({ prefix: "bot" });

db.info("Running migrations");
bot.info("Logged in as MyBot#1234");
```

Output:
```
12:34:56  ◆ info   [db]  Running migrations
12:34:56  ◆ info   [bot] Logged in as MyBot#1234
```

### Options

```ts
const log = new Logger({
  level: "warn",       // minimum level to output (default: "debug")
  prefix: "api",       // shown before every message
  timestamps: true,    // include timestamps (default: true)
  noColor: false,      // strip ANSI colors (auto-detected when not a TTY)
});
```

### Log levels

| Method | Icon | When to use |
|---|---|---|
| `debug` | ○ | Internal state, request details |
| `info` | ◆ | Normal operational events |
| `success` | ✔ | Something completed successfully |
| `warn` | ▲ | Something unexpected but recoverable |
| `error` | ✖ | Something failed |

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

## Why not winston / pino / consola?

- **winston** – needs 20+ lines of config to look decent
- **pino** – fast, but raw JSON isn't readable during development
- **consola** – close, but ships a lot you probably don't need

logsy is intentionally small. It does one thing: make your terminal output readable with zero setup.

## License

MIT
