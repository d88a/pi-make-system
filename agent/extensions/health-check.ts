/**
 * Health-check extension for pi
 *
 * Lightweight check on session_start (file existence, config validity)
 * Full check on /health command (scripts executable, proxy reachable, API endpoints)
 */

import { existsSync, readFileSync, accessSync, appendFileSync, constants } from "node:fs";
import { execSync } from "node:child_process";
import { homedir } from "node:os";
import { join } from "node:path";
import type { ExtensionAPI } from "@earendil-works/pi-coding-agent";

const HOME = homedir();
const AGENT_DIR = join(HOME, ".pi", "agent");

// Files to check
const EXTENSION_FILES = [
  join(AGENT_DIR, "extensions", "max-notify.ts"),
  join(AGENT_DIR, "extensions", "handoff.ts"),
];

const CONFIG_FILES = [
  join(AGENT_DIR, "config", "notify.json"),
  join(AGENT_DIR, "secrets", "search_keys.yaml"),
];

const SCRIPT_FILES = [
  join(AGENT_DIR, "scripts", "proxy_setup.sh"),
  join(AGENT_DIR, "scripts", "firecrawl_search.sh"),
  join(AGENT_DIR, "scripts", "arxiv_search.sh"),
  join(AGENT_DIR, "scripts", "github_search.sh"),
  join(AGENT_DIR, "scripts", "hn_search.sh"),
  join(AGENT_DIR, "scripts", "scholar_search.sh"),
];

const ALL_FILES = [...EXTENSION_FILES, ...CONFIG_FILES, ...SCRIPT_FILES];

// ── helpers ────────────────────────────────────────────────────────────

function missingFiles(paths: string[]): string[] {
  return paths.filter((p) => !existsSync(p));
}

function checkJsonValid(path: string): boolean {
  if (!existsSync(path)) return false;
  try {
    JSON.parse(readFileSync(path, "utf-8"));
    return true;
  } catch {
    return false;
  }
}

/**
 * Check that search_keys.yaml has at least one non-empty API key value.
 *
 * NOTE: a real YAML parser is not resolvable from the extension runtime
 * without adding a dependency, so we use a hardened line-based heuristic.
 * Unlike the previous version, this accepts:
 *   - quoted values that contain ':' (e.g. `- "sk:abc"`)
 *   - URL-like values (some API keys are URL-shaped)
 * It still skips empty items, comments, and unquoted mapping items (an
 * unquoted ':' indicates a YAML mapping like `- key: val`, not a scalar).
 * TODO: replace with a proper YAML parser once one is resolvable here.
 */
function checkYamlHasKeys(path: string): boolean {
  if (!existsSync(path)) return false;
  try {
    const text = readFileSync(path, "utf-8");
    const keyLines = text.split("\n").filter((line) => {
      const trimmed = line.trim();
      if (!trimmed.startsWith("- ")) return false;
      const value = trimmed.slice(2).trim();
      // Skip empty items and full-line comments.
      if (!value || value.startsWith("#")) return false;
      const isQuoted =
        (value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"));
      // Unquoted ':' => YAML mapping item (e.g. "- key: val"), not a scalar key.
      // Quoted values may legitimately contain ':' and should be kept.
      if (!isQuoted && value.includes(":")) return false;
      return value.length > 4; // at least 4 chars
    });
    return keyLines.length > 0;
  } catch {
    return false;
  }
}

function checkAllExecutable(paths: string[]): { ok: string[]; notExecutable: string[] } {
  const ok: string[] = [];
  const notExecutable: string[] = [];
  for (const p of paths) {
    if (!existsSync(p)) continue;
    try {
      accessSync(p, constants.X_OK);
      ok.push(p);
    } catch {
      notExecutable.push(p);
    }
  }
  return { ok, notExecutable };
}

function shortName(fullPath: string): string {
  const relative = fullPath.startsWith(AGENT_DIR)
    ? fullPath.slice(AGENT_DIR.length + 1)
    : fullPath;
  return relative;
}

// ── network checks ─────────────────────────────────────────────────────

async function checkProxy(): Promise<"accessible" | "timeout" | "error"> {
  // Use curl through proxy as spec requires: "curl через прокси к ifconfig.me"
  // Proxy URL is read from config/proxy.json (rus.url) — never hardcode credentials.
  // health-check runs on host, so the "rus" proxy applies.
  let proxyUrl: string | null = null;
  try {
    const proxyConfigPath = join(HOME, ".pi", "agent", "config", "proxy.json");
    const raw = readFileSync(proxyConfigPath, "utf-8");
    const parsed = JSON.parse(raw) as {
      rus?: { url?: string };
      foreign?: { url?: string };
    };
    proxyUrl = parsed?.rus?.url ?? null;
  } catch (err: unknown) {
    // proxy.json missing or malformed — warn and continue without proxy (do not crash)
    const msg = err instanceof Error ? err.message : String(err);
    console.warn(`[health-check] proxy.json unreadable, skipping proxy check: ${msg}`);
    return "error";
  }
  if (!proxyUrl) {
    console.warn("[health-check] proxy.json missing rus.url, skipping proxy check");
    return "error";
  }
  try {
    execSync(
      `curl -s --max-time 5 --proxy "${proxyUrl}" http://ifconfig.me > /dev/null 2>&1`,
      { timeout: 6000, stdio: "pipe" },
    );
    return "accessible";
  } catch (err: unknown) {
    if (err instanceof Error && err.message.includes("timed out")) {
      return "timeout";
    }
    return "error";
  }
}

async function checkNtfy(): Promise<"reachable" | "timeout" | "error"> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 3000);
    const response = await fetch("https://ntfy.sh", {
      method: "HEAD",
      signal: controller.signal,
    });
    clearTimeout(timeout);
    return response.ok ? "reachable" : "error";
  } catch (err: unknown) {
    if (err instanceof Error && err.name === "AbortError") {
      return "timeout";
    }
    return "error";
  }
}

async function checkGitHubApi(): Promise<"reachable" | "timeout" | "error"> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 3000);
    const response = await fetch("https://api.github.com", {
      method: "HEAD",
      signal: controller.signal,
      headers: {
        "User-Agent": "pi-health-check/1.0",
      },
    });
    clearTimeout(timeout);
    return response.ok ? "reachable" : "error";
  } catch (err: unknown) {
    if (err instanceof Error && err.name === "AbortError") {
      return "timeout";
    }
    return "error";
  }
}

// ── check runners ──────────────────────────────────────────────────────

interface LightweightResult {
  allFilesExist: boolean;
  missing: string[];
  jsonOk: boolean;
  hasApiKeys: boolean;
}

async function runLightweightCheck(): Promise<LightweightResult> {
  const missing = missingFiles(ALL_FILES);
  const jsonOk = checkJsonValid(join(AGENT_DIR, "config", "notify.json"));
  const hasApiKeys = checkYamlHasKeys(join(AGENT_DIR, "secrets", "search_keys.yaml"));

  return {
    allFilesExist: missing.length === 0,
    missing,
    jsonOk,
    hasApiKeys,
  };
}

interface FullResult {
  extensionsOk: number;
  extensionsTotal: number;
  extensionsMissing: string[];
  scriptsExecOk: number;
  scriptsExecTotal: number;
  scriptsNotExecutable: string[];
  scriptsMissing: string[];
  jsonOk: boolean;
  hasApiKeys: boolean;
  proxy: "accessible" | "timeout" | "error";
  ntfy: "reachable" | "timeout" | "error";
  github: "reachable" | "timeout" | "error";
}

async function runFullCheck(): Promise<FullResult> {
  const extMissing = missingFiles(EXTENSION_FILES);
  const extTotal = EXTENSION_FILES.length;

  const scrMissing = missingFiles(SCRIPT_FILES);
  const scrTotal = SCRIPT_FILES.length;

  const execResult = checkAllExecutable(SCRIPT_FILES);

  const jsonOk = checkJsonValid(join(AGENT_DIR, "config", "notify.json"));
  const hasApiKeys = checkYamlHasKeys(join(AGENT_DIR, "secrets", "search_keys.yaml"));

  const [proxy, ntfy, github] = await Promise.all([
    checkProxy(),
    checkNtfy(),
    checkGitHubApi(),
  ]);

  return {
    extensionsOk: extTotal - extMissing.length,
    extensionsTotal: extTotal,
    extensionsMissing: extMissing,
    scriptsExecOk: execResult.ok.length,
    scriptsExecTotal: scrTotal,
    scriptsNotExecutable: execResult.notExecutable,
    scriptsMissing: scrMissing,
    jsonOk,
    hasApiKeys,
    proxy,
    ntfy,
    github,
  };
}

function iconForCheck(ok: boolean): string {
  return ok ? "✅" : "❌";
}

function iconForCheckWarn(ok: boolean): string {
  return ok ? "✅" : "⚠️";
}

function statusIcon(status: "reachable" | "timeout" | "error" | "accessible"): string {
  switch (status) {
    case "reachable":
    case "accessible":
      return "✅";
    case "timeout":
      return "⚠️";
    case "error":
      return "❌";
  }
}

// ── extension main ─────────────────────────────────────────────────────

export default function (pi: ExtensionAPI) {
  // Lightweight check on session_start (async, non-blocking)
  pi.on("session_start", async (_event, ctx) => {
    try {
      const result = await runLightweightCheck();
      const allOk =
        result.allFilesExist &&
        result.jsonOk &&
        result.hasApiKeys;

      if (allOk) {
        ctx.ui.notify("Health: OK", "info");
      } else {
        const problems: string[] = [];
        if (!result.allFilesExist) {
          problems.push(`missing: ${result.missing.map(shortName).join(", ")}`);
        }
        if (!result.jsonOk) {
          problems.push("notify.json invalid");
        }
        if (!result.hasApiKeys) {
          problems.push("search_keys.yaml empty");
        }
        ctx.ui.notify(`Health: проблемы — ${problems.join("; ")}`, "warning");
      }
    } catch {
      // Ignore errors in session_start health check (non-critical)
    }
  });

  // Full check command: /health
  pi.registerCommand("health", {
    description: "Full health check of pi environment",
    handler: async (_args, ctx) => {
      ctx.ui.notify("Running full health check...", "info");

      const result = await runFullCheck();

      const lines: string[] = [
        "=== Pi Health Check ===",
        "",
      ];

      // Extensions
      const extOk = result.extensionsMissing.length === 0;
      const extExtra = result.extensionsMissing.length > 0
        ? ` (missing: ${result.extensionsMissing.map(shortName).join(", ")})`
        : "";
      lines.push(`${iconForCheckWarn(extOk)} Extensions: ${result.extensionsOk}/${result.extensionsTotal} OK${extExtra}`);

      // Scripts
      const scriptsOk = result.scriptsMissing.length === 0 && result.scriptsNotExecutable.length === 0;
      let scriptDetail = "";
      if (result.scriptsMissing.length > 0) {
        scriptDetail += ` missing: ${result.scriptsMissing.map(shortName).join(", ")}`;
      }
      if (result.scriptsNotExecutable.length > 0) {
        scriptDetail += ` not executable: ${result.scriptsNotExecutable.map(shortName).join(", ")}`;
      }
      const totalScriptProblems = result.scriptsMissing.length + result.scriptsNotExecutable.length;
      const scriptsActualOk = result.scriptsExecTotal - result.scriptsMissing.length;
      lines.push(`${iconForCheckWarn(scriptsOk)} Scripts: ${scriptsActualOk}/${result.scriptsExecTotal} OK${scriptDetail}`);

      // Configs
      lines.push(`${iconForCheck(result.jsonOk)} Configs: ${result.jsonOk ? "valid" : "notify.json invalid"}`);

      // API keys
      lines.push(`${iconForCheck(result.hasApiKeys)} API keys: ${result.hasApiKeys ? "present" : "search_keys.yaml empty"}`);

      // Proxy
      lines.push(`${statusIcon(result.proxy)} Proxy: ${result.proxy}`);

      // ntfy
      lines.push(`${statusIcon(result.ntfy)} ntfy.sh: ${result.ntfy}`);

      // GitHub
      lines.push(`${statusIcon(result.github)} GitHub API: ${result.github}`);

      const report = lines.join("\n");

      // Log to debug file for persistence
      try {
        const logPath = join(HOME, ".pi", "agent", "health_debug.log");
        const timestamp = new Date().toISOString();
        const logEntry = `--- ${timestamp} ---\n${report}\n\n`;
        appendFileSync(logPath, logEntry, "utf-8");
      } catch {
        // Ignore log errors
      }

      // Show as a formatted notification (multi-line works in TUI)
      ctx.ui.notify(report, "info");
    },
  });
}