import { spawnSync } from "node:child_process";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const portfolioDir = path.join(rootDir, "artifacts", "portfolio");

const viteBins = [
  path.join(portfolioDir, "node_modules", "vite", "bin", "vite.js"),
  path.join(rootDir, "node_modules", "vite", "bin", "vite.js"),
];

const env = {
  ...process.env,
  PORT: process.env.PORT || "8080",
  BASE_PATH: process.env.BASE_PATH || "/",
};

function getViteBin() {
  return viteBins.find((viteBin) => existsSync(viteBin));
}

function run(command, args, options = {}) {
  const result = spawnSync(command, args, {
    cwd: rootDir,
    env,
    stdio: "inherit",
    shell: false,
    ...options,
  });

  if (result.error) {
    return { ok: false, error: result.error };
  }

  return { ok: result.status === 0, status: result.status ?? 1 };
}

function ensureViteAvailable() {
  const existingBin = getViteBin();
  if (existingBin) return existingBin;

  console.log("Portfolio dependencies are missing; installing workspace dependencies...");

  const installCommands = [
    ["pnpm", ["install", "--frozen-lockfile"]],
    ["bunx", ["pnpm", "install", "--frozen-lockfile"]],
    ["corepack", ["pnpm", "install", "--frozen-lockfile"]],
  ];

  for (const [command, args] of installCommands) {
    const install = run(command, args);
    if (!install.ok) continue;

    const installedBin = getViteBin();
    if (installedBin) return installedBin;
  }

  console.error("Unable to prepare the portfolio build toolchain.");
  process.exit(1);
}

const viteBin = ensureViteAvailable();
const viteArgs = process.argv.slice(2);

const vite = run(process.execPath, [viteBin, ...viteArgs], {
  cwd: portfolioDir,
});

process.exit(vite.ok ? 0 : vite.status || 1);