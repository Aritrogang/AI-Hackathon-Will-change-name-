import { SandboxInstance } from "@blaxel/core";
import * as fs from "fs";
import * as path from "path";

// ---------------------------------------------------------------------------
// Katabatic — Blaxel Sandbox Setup
// Creates (or retrieves) a sandboxed environment for the FastAPI backend.
//
// Required env vars (set in root .env):
//   BL_API_KEY    — Blaxel API key
//   BL_WORKSPACE  — Blaxel workspace name
//
// Optional (forwarded from backend/.env into the sandbox):
//   ANTHROPIC_API_KEY, GEMINI_API_KEY, ETHERSCAN_API_KEY,
//   PINATA_API_KEY, PINATA_SECRET_API_KEY
// ---------------------------------------------------------------------------

const SANDBOX_NAME = "katabatic-backend";
const BACKEND_PORT = 8000;
const BACKEND_DIR = path.resolve(__dirname, "../backend");

async function main() {
  validateEnv();

  // ------------------------------------------------------------------
  // Step 1: Create or retrieve the sandbox
  // ------------------------------------------------------------------
  console.log(`[sandbox] Creating/retrieving sandbox "${SANDBOX_NAME}"...`);

  const sandbox = await SandboxInstance.createIfNotExists({
    name: SANDBOX_NAME,
    image: "blaxel/python:latest",
    memory: 2048, // MB
    ports: [{ target: BACKEND_PORT, protocol: "HTTP" }],
  });

  console.log("[sandbox] Sandbox ready:", sandbox.metadata?.name);

  // Wait until fully running before issuing commands
  await sandbox.wait({ maxWait: 60_000, interval: 2_000 });

  // ------------------------------------------------------------------
  // Step 2: Upload backend source code
  // ------------------------------------------------------------------
  console.log("[sandbox] Uploading backend source...");
  await uploadDirectory(sandbox, BACKEND_DIR, "/app");
  console.log("[sandbox] Upload complete.");

  // ------------------------------------------------------------------
  // Step 3: Install Python dependencies
  // ------------------------------------------------------------------
  console.log("[sandbox] Installing Python dependencies...");

  await sandbox.process.exec({
    name: "install-deps",
    command: "pip install -r /app/requirements.txt --quiet",
    timeout: 300, // 5 minutes
  });

  // Stream install output to stdout
  const { wait } = sandbox.process.streamLogs("install-deps", {
    onStdout: (line) => process.stdout.write(line),
    onStderr: (line) => process.stderr.write(line),
  });
  await wait();

  const installInfo = await sandbox.process.get("install-deps");
  if (installInfo.status === "failed") {
    const logs = await sandbox.process.logs("install-deps");
    throw new Error(`Dependency installation failed:\n${logs}`);
  }

  // ------------------------------------------------------------------
  // Step 4: Write .env inside the sandbox from local env vars
  // ------------------------------------------------------------------
  console.log("[sandbox] Writing .env to sandbox...");
  await writeEnvFile(sandbox);

  // ------------------------------------------------------------------
  // Step 5: Start the FastAPI server (long-running)
  // ------------------------------------------------------------------
  console.log("[sandbox] Starting FastAPI server...");

  await sandbox.process.exec({
    name: "katabatic-api",
    // cd into /app so relative imports resolve correctly
    command: `cd /app && uvicorn app.main:app --host 0.0.0.0 --port ${BACKEND_PORT}`,
    keepAlive: true, // keep the process alive (scale-to-zero disabled)
    timeout: 0,      // run indefinitely
  });

  // Give uvicorn a few seconds to start
  await sleep(3_000);

  const startupLogs = await sandbox.process.logs("katabatic-api");
  console.log("[sandbox] Startup logs:\n", startupLogs);

  // ------------------------------------------------------------------
  // Step 6: Health check
  // ------------------------------------------------------------------
  console.log("[sandbox] Running health check...");

  await sandbox.process.exec({
    name: "health-check",
    command: `curl -sf http://localhost:${BACKEND_PORT}/health`,
    timeout: 10,
  });

  const healthOutput = await sandbox.process.logs("health-check");
  console.log("[sandbox] Health response:", healthOutput || "(no body — 200 OK)");

  // ------------------------------------------------------------------
  // Done
  // ------------------------------------------------------------------
  console.log("\n[sandbox] Setup complete.");
  console.log(`  Sandbox  : ${sandbox.metadata?.name}`);
  console.log(`  Port     : ${BACKEND_PORT}`);
  console.log(`  API docs : http://localhost:${BACKEND_PORT}/docs`);
  console.log(`  Status   : ${sandbox.status}`);
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Recursively upload a local directory into the sandbox filesystem.
 * Skips virtualenvs, caches, and build artefacts.
 */
async function uploadDirectory(
  sandbox: SandboxInstance,
  localDir: string,
  remotePath: string
): Promise<void> {
  const SKIP = new Set([
    "venv",
    "__pycache__",
    ".git",
    "node_modules",
    "dist",
    ".pytest_cache",
    ".mypy_cache",
    ".ruff_cache",
  ]);

  const entries = fs.readdirSync(localDir, { withFileTypes: true });

  for (const entry of entries) {
    if (SKIP.has(entry.name) || entry.name.endsWith(".pyc")) continue;

    const localPath = path.join(localDir, entry.name);
    const remoteFile = `${remotePath}/${entry.name}`;

    if (entry.isDirectory()) {
      await sandbox.fs.mkdir(remoteFile);
      await uploadDirectory(sandbox, localPath, remoteFile);
    } else {
      // Read as utf-8 text; fall back to binary for non-text files
      try {
        const content = fs.readFileSync(localPath, "utf-8");
        await sandbox.fs.write(remoteFile, content);
      } catch {
        // For truly binary files (e.g. SQLite db), use writeBinary
        const content = fs.readFileSync(localPath);
        await sandbox.fs.writeBinary(remoteFile, content);
      }
    }
  }
}

/**
 * Build a .env string from local process env and write it into the sandbox.
 * Only forwards keys that are present — never hard-codes secrets.
 */
async function writeEnvFile(sandbox: SandboxInstance): Promise<void> {
  const keys = [
    "ANTHROPIC_API_KEY",
    "GEMINI_API_KEY",
    "ETHERSCAN_API_KEY",
    "PINATA_API_KEY",
    "PINATA_SECRET_API_KEY",
  ];

  const lines: string[] = [];
  for (const k of keys) {
    if (process.env[k]) lines.push(`${k}=${process.env[k]}`);
  }
  lines.push("HOST=0.0.0.0");
  lines.push(`PORT=${BACKEND_PORT}`);

  await sandbox.fs.write("/app/.env", lines.join("\n") + "\n");
}

/** Fail fast if required Blaxel env vars are missing. */
function validateEnv(): void {
  const required = ["BL_API_KEY", "BL_WORKSPACE"];
  const missing = required.filter((k) => !process.env[k]);
  if (missing.length > 0) {
    console.error(`[sandbox] Missing env vars: ${missing.join(", ")}`);
    console.error("[sandbox] Copy .env.example → .env and fill in the values.");
    process.exit(1);
  }
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

main().catch((err) => {
  console.error("[sandbox] Fatal error:", err);
  process.exit(1);
});
