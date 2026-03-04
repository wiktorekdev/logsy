import { Logger } from "../src/index.js";

const log = new Logger({ prefix: "cli", timestamps: false });

async function deploy() {
  log.info("Starting deployment...");
  log.time("build");
  await new Promise((r) => setTimeout(r, 100));
  log.timeEnd("build");

  log.time("upload");
  await new Promise((r) => setTimeout(r, 150));
  log.timeEnd("upload");

  log.success("Deployment complete!");
}

deploy();
