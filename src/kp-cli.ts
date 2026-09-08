#!/usr/bin/env bun

import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { callApi } from "./api.ts";
import {
  DEFAULT_API_BASE_URL,
  getConfigPath,
  loadConfig,
  normalizeApiBaseUrl,
  redactToken,
  saveConfig,
} from "./config.ts";
import { DB_PRESETS, runReadonlyPreset, type DbPreset } from "./database.ts";
import { syncOpenApi } from "./openapi.ts";
import packageJson from "../package.json" with { type: "json" };

const VERSION = packageJson.version;

function help(): string {
  return `kp-cli (KOC-Project CLI) ${VERSION}

用法：
  kp-cli init <MUTATION_API_TOKEN> [--api-base URL]
  kp-cli init --token-stdin [--api-base URL]
  kp-cli config show|path
  kp-cli api <METHOD> <PATH> [--query key=value]... [--body-file FILE|--body-json JSON] [--protected]
  kp-cli openapi sync [--output DIR]
  kp-cli db presets
  kp-cli db <PRESET> [--project-id ID] [--activity-period-id ID] [--limit N]
  kp-cli version

生产 API 默认地址：${DEFAULT_API_BASE_URL}
数据库只读预置：${DB_PRESETS.join(", ")}
`;
}

function flagValue(args: string[], name: string): string | undefined {
  const index = args.indexOf(name);
  if (index < 0) return undefined;
  const value = args[index + 1];
  if (!value || value.startsWith("--")) throw new Error(`${name} 缺少值`);
  return value;
}

function repeatedFlagValues(args: string[], name: string): string[] {
  const values: string[] = [];
  for (let index = 0; index < args.length; index += 1) {
    if (args[index] !== name) continue;
    const value = args[index + 1];
    if (!value || value.startsWith("--")) throw new Error(`${name} 缺少值`);
    values.push(value);
    index += 1;
  }
  return values;
}

function positiveIntegerFlag(args: string[], name: string): number | undefined {
  const raw = flagValue(args, name);
  if (raw === undefined) return undefined;
  const value = Number(raw);
  if (!Number.isSafeInteger(value) || value <= 0) throw new Error(`${name} 必须是正整数`);
  return value;
}

function parseQuery(values: string[]): Array<[string, string]> {
  return values.map((value) => {
    const separator = value.indexOf("=");
    if (separator < 1) throw new Error(`--query 必须使用 key=value：${value}`);
    return [value.slice(0, separator), value.slice(separator + 1)];
  });
}

async function init(args: string[]): Promise<void> {
  const useStdin = args.includes("--token-stdin");
  const positionalToken = args.find((value) => !value.startsWith("--") && value !== flagValue(args, "--api-base"));
  if (useStdin && positionalToken) throw new Error("不能同时传入 Token 参数和 --token-stdin");
  const token = (useStdin ? await Bun.stdin.text() : positionalToken)?.trim();
  if (!token) throw new Error("MUTATION_API_TOKEN 不能为空");
  const apiBaseUrl = normalizeApiBaseUrl(flagValue(args, "--api-base") ?? DEFAULT_API_BASE_URL);
  const configPath = getConfigPath();
  await saveConfig({ version: 1, apiBaseUrl, mutationApiToken: token }, configPath);
  console.log(JSON.stringify({ ok: true, apiBaseUrl, configPath, token: redactToken(token) }, null, 2));
}

async function configCommand(args: string[]): Promise<void> {
  const action = args[0] ?? "show";
  const configPath = getConfigPath();
  if (action === "path") {
    console.log(configPath);
    return;
  }
  if (action !== "show") throw new Error("config 仅支持 show 或 path");
  const config = await loadConfig(configPath);
  console.log(JSON.stringify({ apiBaseUrl: config.apiBaseUrl, configPath, token: redactToken(config.mutationApiToken) }, null, 2));
}

async function apiCommand(args: string[]): Promise<void> {
  const method = args[0];
  const path = args[1];
  if (!method || !path) throw new Error("api 需要 METHOD 和 PATH");
  const bodyFile = flagValue(args, "--body-file");
  const bodyJson = flagValue(args, "--body-json");
  if (bodyFile && bodyJson) throw new Error("--body-file 与 --body-json 只能使用一个");
  const rawBody = bodyFile ? await readFile(resolve(bodyFile), "utf8") : bodyJson;
  const body = rawBody === undefined ? undefined : JSON.parse(rawBody);
  const result = await callApi(await loadConfig(), method, path, {
    body,
    protectedResponse: args.includes("--protected"),
    query: parseQuery(repeatedFlagValues(args, "--query")),
  });
  console.log(JSON.stringify(result.body, null, 2));
  if (result.status < 200 || result.status >= 300) {
    console.error(`HTTP ${result.status}`);
    process.exitCode = 1;
  }
}

async function openApiCommand(args: string[]): Promise<void> {
  if (args[0] !== "sync") throw new Error("openapi 仅支持 sync");
  const output = resolve(flagValue(args, "--output") ?? "references");
  const result = await syncOpenApi((await loadConfig()).apiBaseUrl, output);
  console.log(JSON.stringify({ ok: true, output, ...result }, null, 2));
}

async function dbCommand(args: string[]): Promise<void> {
  if ((args[0] ?? "presets") === "presets") {
    console.log(DB_PRESETS.join("\n"));
    return;
  }
  const preset = args[0] as DbPreset;
  if (!DB_PRESETS.includes(preset)) throw new Error(`未知数据库预置：${preset}`);
  const rows = await runReadonlyPreset(preset, {
    activityPeriodId: positiveIntegerFlag(args, "--activity-period-id"),
    limit: positiveIntegerFlag(args, "--limit"),
    projectId: positiveIntegerFlag(args, "--project-id"),
  });
  console.log(JSON.stringify(rows, null, 2));
}

export async function main(args = Bun.argv.slice(2)): Promise<void> {
  const command = args[0];
  const rest = args.slice(1);
  switch (command) {
    case "init":
      return init(rest);
    case "config":
      return configCommand(rest);
    case "api":
      return apiCommand(rest);
    case "openapi":
      return openApiCommand(rest);
    case "db":
      return dbCommand(rest);
    case "version":
    case "--version":
    case "-v":
      console.log(VERSION);
      return;
    case "help":
    case "--help":
    case "-h":
    case undefined:
      console.log(help());
      return;
    default:
      throw new Error(`未知指令：${command}\n\n${help()}`);
  }
}

if (import.meta.main) {
  main().catch((error) => {
    console.error(`kp-cli: ${error instanceof Error ? error.message : String(error)}`);
    process.exitCode = 1;
  });
}
