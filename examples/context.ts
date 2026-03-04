import { Logger } from "../src/index.js";

const log = new Logger({
  prefix: "worker",
  context: { workerId: "w-123", jobType: "email" }
});

log.info("Job started");
log.info("Processing user", { userId: "u-456" });
log.success("Job completed", { sent: 3, failed: 0 });

const taskLog = log.child({
  prefix: "task",
  context: { taskId: "t-789" }
});

taskLog.info("Subtask executed");
taskLog.warn("Retry scheduled", { attempt: 1, maxRetries: 3 });
