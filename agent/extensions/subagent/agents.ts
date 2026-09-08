/**
 * Agent discovery and configuration
 */

import * as fs from "node:fs";
import * as path from "node:path";
import { CONFIG_DIR_NAME, getAgentDir, parseFrontmatter } from "@earendil-works/pi-coding-agent";

export type AgentScope = "user" | "project" | "both";

export interface AgentConfig {
	name: string;
	description: string;
	tools?: string[];
	model?: string;
	fallbackModel?: string;
	systemPrompt: string;
	source: "user" | "project";
	filePath: string;
}

export interface AgentDiscoveryResult {
	agents: AgentConfig[];
	projectAgentsDir: string | null;
}

function loadAgentsFromDir(dir: string, source: "user" | "project"): AgentConfig[] {
	const agents: AgentConfig[] = [];

	if (!fs.existsSync(dir)) {
		return agents;
	}

	let entries: fs.Dirent[];
	try {
		entries = fs.readdirSync(dir, { withFileTypes: true });
	} catch {
		return agents;
	}

	for (const entry of entries) {
		if (!entry.name.endsWith(".md")) continue;
		if (!entry.isFile() && !entry.isSymbolicLink()) continue;

		const filePath = path.join(dir, entry.name);
		let content: string;
		try {
			content = fs.readFileSync(filePath, "utf-8");
		} catch {
			continue;
		}

		const { frontmatter, body } = parseFrontmatter<Record<string, string>>(content);

		if (!frontmatter.name || !frontmatter.description) {
			continue;
		}

		const tools = frontmatter.tools
			?.split(",")
			.map((t: string) => t.trim())
			.filter(Boolean);

		agents.push({
			name: frontmatter.name,
			description: frontmatter.description,
			tools: tools && tools.length > 0 ? tools : undefined,
			model: frontmatter.model,
			fallbackModel: frontmatter.fallbackModel,
			systemPrompt: body,
			source,
			filePath,
		});
	}

	return agents;
}

function isDirectory(p: string): boolean {
	try {
		return fs.statSync(p).isDirectory();
	} catch {
		return false;
	}
}

function findNearestProjectAgentsDir(cwd: string): string | null {
	let currentDir = cwd;
	while (true) {
		const candidate = path.join(currentDir, CONFIG_DIR_NAME, "agents");
		if (isDirectory(candidate)) return candidate;

		const parentDir = path.dirname(currentDir);
		if (parentDir === currentDir) return null;
		currentDir = parentDir;
	}
}

/**
 * Post-load validation: warn when an agent's frontmatter `model` is not
 * present in settings.json `enabledModels`. Never throws — agent loading
 * must not break because of a model reference mismatch.
 *
 * Matching logic:
 *   - frontmatter `model` is stored as `<provider>/<prefix>/<name>`
 *     (e.g. `clipproxy/kp/deepseek-v4-pro`).
 *   - settings.json `enabledModels` entries are `<prefix>/<name>`
 *     (e.g. `kp/deepseek-v4-pro`) — the provider segment is omitted.
 *   - A model is considered enabled when EITHER its full string OR the
 *     string with the first `/`-segment (the provider) stripped is found
 *     in `enabledModels`. This stays robust to both 3-part and 2-part forms.
 *   - Agents without an explicit `model` fall back to defaultModel and are
 *     skipped here (out of scope).
 */
function validateModelsEnabled(agents: AgentConfig[]): void {
	let enabledModels: string[] | null;
	try {
		const settingsPath = path.join(getAgentDir(), "settings.json");
		const parsed = JSON.parse(fs.readFileSync(settingsPath, "utf-8")) as {
			enabledModels?: unknown;
		};
		enabledModels = Array.isArray(parsed.enabledModels)
			? parsed.enabledModels.filter((v): v is string => typeof v === "string")
			: null;
	} catch {
		// Settings unavailable — skip silently rather than warn on every call.
		return;
	}

	if (!enabledModels || enabledModels.length === 0) return;

	const enabledSet = new Set(enabledModels);
	const invalid: string[] = [];

	for (const agent of agents) {
		for (const m of [agent.model, agent.fallbackModel].filter(Boolean)) {
			const stripped = m!.includes("/")
				? m!.slice(m!.indexOf("/") + 1)
				: m!;
			if (!enabledSet.has(m!) && !enabledSet.has(stripped)) {
				invalid.push(`  - ${agent.name}: ${m === agent.model ? "model" : "fallbackModel"} "${m}" is not in settings.enabledModels`);
			}
		}
	}

	if (invalid.length > 0) {
		console.warn(
			`[subagent] ${invalid.length} agent(s) reference a model not in settings.json enabledModels:\n` +
				invalid.join("\n"),
		);
	}
}

export function discoverAgents(cwd: string, scope: AgentScope): AgentDiscoveryResult {
	const userDir = path.join(getAgentDir(), "agents");
	const projectAgentsDir = findNearestProjectAgentsDir(cwd);

	const userAgents = scope === "project" ? [] : loadAgentsFromDir(userDir, "user");
	const projectAgents = scope === "user" || !projectAgentsDir ? [] : loadAgentsFromDir(projectAgentsDir, "project");

	const agentMap = new Map<string, AgentConfig>();

	if (scope === "both") {
		for (const agent of userAgents) agentMap.set(agent.name, agent);
		for (const agent of projectAgents) agentMap.set(agent.name, agent);
	} else if (scope === "user") {
		for (const agent of userAgents) agentMap.set(agent.name, agent);
	} else {
		for (const agent of projectAgents) agentMap.set(agent.name, agent);
	}

	const agents = Array.from(agentMap.values());
	validateModelsEnabled(agents);

	return { agents, projectAgentsDir };
}

export function formatAgentList(agents: AgentConfig[], maxItems: number): { text: string; remaining: number } {
	if (agents.length === 0) return { text: "none", remaining: 0 };
	const listed = agents.slice(0, maxItems);
	const remaining = agents.length - listed.length;
	return {
		text: listed.map((a) => `${a.name} (${a.source}): ${a.description}`).join("; "),
		remaining,
	};
}
