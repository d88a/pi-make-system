/**
 * Pi Task Notification Extension
 *
 * Sends push notifications when pi finishes a task.
 * Uses debounce: waits 5s after last agent_end before sending.
 *
 * Architecture: External file-based state to survive closure recreation
 * - lastAgent stored in ~/.pi/agent/.last_agent (survives reload/re-instance)
 * - activeInstanceId in module scope (guards against zombie timers)
 * - session_shutdown handler (cleans up timers on reload)
 *
 * Config: ~/.pi/agent/config/notify.json
 * Commands: /notify on|off|status
 */

import type { ExtensionAPI } from "@earendil-works/pi-coding-agent";
import { readFileSync, existsSync, writeFileSync, appendFileSync } from "node:fs";
import { basename } from "node:path";
import { homedir } from "node:os"; // A-31: robust home dir (no env fallback)

interface NotifyConfig {
  enabled: boolean;
  backend: "ntfy" | "telegram" | "webhook";
  ntfy?: {
    server: string;
    topic: string;
    priority?: number;
    tags?: string[];
  };
  telegram?: {
    botToken: string;
    chatId: string;
  };
  webhook?: {
    url: string;
    method?: string;
    headers?: Record<string, string>;
  };
}

const CONFIG_PATH = homedir() + "/.pi/agent/config/notify.json";
const LAST_AGENT_FILE = homedir() + "/.pi/agent/.last_agent";
const LAST_SENT_FILE = homedir() + "/.pi/agent/.last_sent";
const DEBOUNCE_MS = 5000;
const LOG_PATH = (homedir() || "/tmp") + "/.pi/agent/notify_debug.log";
const HOURLY_FILE = homedir() + "/.pi/agent/.notify_hourly"; // A-31: per-hour send counter
const HOUR_MS = 3600000; // 1 hour
const HOURLY_LIMIT = 20; // A-31: max sends/hour — ntfy abuse-ban protection

function loadConfig(): NotifyConfig {
  const defaults: NotifyConfig = {
    enabled: true,
    backend: "ntfy",
    ntfy: {
      server: "https://ntfy.sh",
      topic: "pi",
      priority: 4,
      tags: ["robot"],
    },
  };
  if (!existsSync(CONFIG_PATH)) return defaults;
  try {
    const raw = readFileSync(CONFIG_PATH, "utf-8");
    return { ...defaults, ...JSON.parse(raw) };
  } catch (_e) {
    return defaults;
  }
}

function writeConfig(config: NotifyConfig): void {
  try {
    writeFileSync(CONFIG_PATH, JSON.stringify(config, null, 2) + "\n", "utf-8");
  } catch (_e) { /* ignore */ }
}

function readLastAgent(): string {
  try {
    if (existsSync(LAST_AGENT_FILE)) {
      return readFileSync(LAST_AGENT_FILE, "utf-8").trim() || "architect";
    }
  } catch (_e) { /* ignore */ }
  return "architect";
}

function writeLastAgent(agent: string): void {
  try {
    writeFileSync(LAST_AGENT_FILE, agent + "\n", "utf-8");
  } catch (_e) { /* ignore */ }
}

function readLastSentTime(): number {
  try {
    if (existsSync(LAST_SENT_FILE)) {
      return parseInt(readFileSync(LAST_SENT_FILE, "utf-8").trim(), 10) || 0;
    }
  } catch (_e) { /* ignore */ }
  return 0;
}

function writeLastSentTime(ts: number): void {
  try {
    writeFileSync(LAST_SENT_FILE, String(ts) + "\n", "utf-8");
  } catch (_e) { /* ignore */ }
}

// A-31: hourly rate-limit state — list of send timestamps (epoch ms)
function readHourlySends(): number[] {
  try {
    if (existsSync(HOURLY_FILE)) {
      const raw = readFileSync(HOURLY_FILE, "utf-8");
      return raw
        .split(/\s+/)
        .filter(Boolean)
        .map((s) => parseInt(s, 10))
        .filter((n) => !Number.isNaN(n));
    }
  } catch (_e) { /* ignore */ }
  return [];
}

function appendHourlySend(ts: number): void {
  try {
    const recent = readHourlySends().filter((t) => ts - t < HOUR_MS);
    recent.push(ts);
    // Bound file growth: keep only the most recent 100 entries
    writeFileSync(HOURLY_FILE, recent.slice(-100).join("\n") + "\n", "utf-8");
  } catch (_e) { /* ignore */ }
}

function detectProject(cwd: string): string {
  const parts = cwd.split("/");
  for (const part of parts) {
    if (["absorb", "mex", "phase_f", "pi"].includes(part)) return part;
  }
  return basename(cwd) || "unknown";
}

function truncate(text: string, maxLen: number): string {
  if (text.length <= maxLen) return text;
  return text.slice(0, maxLen - 3) + "...";
}

function formatTime(ts: number): string {
  const d = new Date(ts);
  return d.toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
}

function log(msg: string): void {
  try {
    appendFileSync(LOG_PATH, `[${new Date().toISOString()}] ${msg}\n`);
  } catch (_e) { /* ignore */ }
}

async function sendNtfy(config: NotifyConfig, title: string, message: string): Promise<string> {
  const ntfy = config.ntfy!;
  const url = `${ntfy.server}/${ntfy.topic}`;
  const headers: Record<string, string> = {
    "Title": title,
    "Priority": String(ntfy.priority ?? 4),
  };
  if (ntfy.tags && ntfy.tags.length > 0) {
    headers["Tags"] = ntfy.tags.join(",");
  }
  const response = await fetch(url, {
    method: "POST",
    headers,
    body: message,
    signal: AbortSignal.timeout(30000),
  });
  if (!response.ok) {
    const body = await response.text().catch(() => "");
    return `ntfy error ${response.status}: ${body.slice(0, 100)}`;
  }
  return `ntfy OK ${response.status}`;
}

async function sendTelegram(config: NotifyConfig, title: string, message: string): Promise<string> {
  const tg = config.telegram!;
  const url = `https://api.telegram.org/bot${tg.botToken}/sendMessage`;
  const body = { chat_id: tg.chatId, text: `*${title}*\n\n${message}`, parse_mode: "Markdown" };
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!response.ok) {
    const err = await response.text().catch(() => "");
    return `telegram error ${response.status}: ${err.slice(0, 100)}`;
  }
  return `telegram OK`;
}

async function sendWebhook(config: NotifyConfig, title: string, message: string): Promise<string> {
  const wh = config.webhook!;
  const payload = { title, message, timestamp: Date.now() };
  const response = await fetch(wh.url, {
    method: wh.method ?? "POST",
    headers: { "Content-Type": "application/json", ...(wh.headers ?? {}) },
    body: JSON.stringify(payload),
  });
  if (!response.ok) return `webhook error ${response.status}`;
  return `webhook OK`;
}

async function sendNotification(config: NotifyConfig, title: string, message: string): Promise<string> {
  if (!config.enabled) return "disabled";
  try {
    switch (config.backend) {
      case "ntfy": return await sendNtfy(config, title, message);
      case "telegram": return await sendTelegram(config, title, message);
      case "webhook": return await sendWebhook(config, title, message);
      default: return "unknown backend";
    }
  } catch (err: unknown) {
    const errMsg = err instanceof Error ? err.message : String(err);
    return `error: ${errMsg}`;
  }
}

export default function (pi: ExtensionAPI) {
  const instanceId = Math.random().toString(36).slice(2, 8);
  log(`EXTENSION INIT: instance=${instanceId}`);

  let config = loadConfig();
  let lastText = "";
  let lastCwd = process.cwd();
  let lastCtx: any = null;
  let debounceTimer: ReturnType<typeof setTimeout> | null = null;
  const SUPPRESS_MS = 60000; // 60s suppress continuations + zombie timers

  // /notify on|off|status
  pi.registerCommand("notify", {
    description: "Toggle notifications: /notify on|off|status",
    handler: async (args, ctx) => {
      const arg = args.trim().toLowerCase();
      if (arg === "on") {
        config = { ...config, enabled: true };
        writeConfig(config);
        ctx.ui.notify("Notifications enabled", "info");
      } else if (arg === "off") {
        config = { ...config, enabled: false };
        writeConfig(config);
        ctx.ui.notify("Notifications disabled", "info");
      } else {
        const topic = config.ntfy ? config.ntfy.topic : "N/A";
        ctx.ui.notify(
          `Notifications: ${config.enabled ? "ON" : "OFF"} | ${config.backend} | ${topic}`,
          "info"
        );
      }
    },
  });

  pi.on("session_start", async () => {
    config = loadConfig();
  });

  // Detect subagent calls — write to external file (survives closure recreation)
  pi.on("tool_call", async (event: any, _ctx: any) => {
    if (event.toolName !== "subagent") return;
    try {
      const input = event.input;
      if (!input) return;

      // Single mode
      if (input.agent && typeof input.agent === "string") {
        const newAgent = input.agent.toLowerCase();
        log(`[${instanceId}] tool_call: -> ${newAgent}`);
        writeLastAgent(newAgent);
        return;
      }

      // Parallel/chain mode
      if (Array.isArray(input.tasks) && input.tasks.length > 0) {
        let first: string | null = null;
        let count = 0;
        for (const t of input.tasks) {
          if (t && t.agent && typeof t.agent === "string") {
            if (!first) first = t.agent.toLowerCase();
            count++;
          }
        }
        if (first) {
          const newAgent = count > 1 ? `${first}+${count - 1}` : first;
          log(`[${instanceId}] tool_call: -> ${newAgent} (parallel x${count})`);
          writeLastAgent(newAgent);
        }
      }
    } catch (_e) { /* ignore */ }
  });

  // Capture last assistant text and cwd
  pi.on("turn_end", async (event: any, ctx: any) => {
    try {
      if (ctx && ctx.cwd) {
        lastCwd = ctx.cwd;
      }
      const msg = event.message;
      if (msg && msg.role === "assistant" && Array.isArray(msg.content)) {
        const parts: string[] = [];
        for (const c of msg.content) {
          if (c && typeof c === "object" && c.type === "text" && c.text) {
            parts.push(c.text);
          }
        }
        if (parts.length > 0) {
          lastText = parts.join("\n");
        }
      }
    } catch (_e) { /* ignore */ }
  });

  // On agent_end: schedule notification with debounce
  pi.on("agent_end", async (_event: any, ctx: any) => {
    try {
      if (ctx && ctx.cwd) {
        lastCwd = ctx.cwd;
      }
    } catch (_e) { /* ignore */ }
    lastCtx = ctx;

    // Read agent from external file (survives closure recreation)
    const lastAgent = readLastAgent();
    log(`[${instanceId}] agent_end: lastAgent=${lastAgent} (from file)`);

    // Log event object for diagnostics
    try {
      log(`[${instanceId}] agent_end event: ${JSON.stringify(_event).slice(0, 200)}`);
    } catch (_e) { /* ignore */ }

    // Cancel previous timer, start new one
    if (debounceTimer) clearTimeout(debounceTimer);

    debounceTimer = setTimeout(async () => {
      debounceTimer = null;

      // Guard: Suppress window (60s after last notification)
      // Covers: architect continuation, zombie timers after reload
      const lastSentTime = readLastSentTime();
      const timeSinceLastSend = Date.now() - lastSentTime;
      if (timeSinceLastSend < SUPPRESS_MS && lastSentTime > 0) {
        const agent = readLastAgent();
        log(`[${instanceId}] SKIP: suppress window (${Math.round(timeSinceLastSend / 1000)}s, agent=${agent})`);
        lastText = "";
        return;
      }

      // A-31: hourly rate-limit — protect ntfy.sh from abuse-ban (max 20/hour)
      {
        const nowMs = Date.now();
        const recentSends = readHourlySends().filter((t) => nowMs - t < HOUR_MS);
        if (recentSends.length >= HOURLY_LIMIT) {
          log(`[${instanceId}] SKIP: hourly limit reached (${recentSends.length}/${HOURLY_LIMIT})`);
          lastText = "";
          return;
        }
      }

      // Read fresh agent name from file
      const agent = readLastAgent();
      const project = detectProject(lastCwd);
      const endStr = formatTime(Date.now());

      const summary = truncate(lastText.replace(/\n+/g, " ").trim(), 300);

      const title = `Pi: ${project}/${agent} - done`;
      const lines = [
        `\u{1F4C1} \u041F\u0440\u043E\u0435\u043A\u0442: ${project}`,
        `\u23F1 ${endStr}`,
      ];
      if (summary) {
        lines.push(``, `\u{1F4CB} \u0420\u0435\u0437\u0443\u043B\u044C\u0442\u0430\u0442:`, summary);
      }
      const message = lines.join("\n");

      const result = await sendNotification(config, title, message);
      writeLastSentTime(Date.now());
      appendHourlySend(Date.now()); // A-31: record send for hourly counter

      log(`[${instanceId}] SENT: ${title} | ${result}`);

      try {
        appendFileSync(LOG_PATH, [
          `--- ${new Date().toISOString()} ---`,
          `Title: ${title}`,
          `Backend: ${config.backend}`,
          `Topic: ${config.ntfy ? config.ntfy.topic : "N/A"}`,
          `Result: ${result}`,
          ``,
        ].join("\n"));
      } catch (_e) { /* ignore */ }

      try {
        if (lastCtx && lastCtx.hasUI) {
          const status = result.includes("error")
            ? `Notify failed: ${result}`
            : `Notify: ${result}`;
          lastCtx.ui.notify(status, result.includes("error") ? "error" : "info");
        }
      } catch (_e) { /* ctx stale — ignore */ }

      // Don't reset file — next tool_call will overwrite it
      lastText = "";
    }, DEBOUNCE_MS);
  });

  // Cleanup on session shutdown
  // Only clean on reload/new/fork — NOT on quit (subagent process ending)
  pi.on("session_shutdown", async (event: any) => {
    const reason = event.reason || "unknown";
    log(`[${instanceId}] session_shutdown: reason=${reason}`);
    if (reason === "reload" || reason === "new" || reason === "fork") {
      if (debounceTimer !== null) {
        clearTimeout(debounceTimer);
        debounceTimer = null;
        log(`[${instanceId}] debounce timer cleared (reason=${reason})`);
      }
    }
  });
}
