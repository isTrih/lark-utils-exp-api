#!/usr/bin/env node

import { createHash } from "node:crypto";
import {
  chmod,
  copyFile,
  mkdir,
  mkdtemp,
  readFile,
  rename,
  rm,
  writeFile,
} from "node:fs/promises";
import { homedir, platform, arch, tmpdir } from "node:os";
import { basename, dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const REPOSITORY = "isTrih/lark-utils-exp-api";
const scriptDirectory = dirname(fileURLToPath(import.meta.url));
const packageJson = JSON.parse(await readFile(join(scriptDirectory, "..", "package.json"), "utf8"));

function parseArguments(argv) {
  const options = {
    installDirectory: undefined,
    initialize: true,
    version: packageJson.version,
  };

  for (let index = 0; index < argv.length; index += 1) {
    const argument = argv[index];
    if (argument === "--no-init") {
      options.initialize = false;
      continue;
    }
    if (argument === "--install-dir" || argument === "--version") {
      const value = argv[index + 1];
      if (!value || value.startsWith("--")) throw new Error(`${argument} 缺少值`);
      if (argument === "--install-dir") options.installDirectory = value;
      else options.version = value.replace(/^v/, "");
      index += 1;
      continue;
    }
    if (argument === "--help" || argument === "-h") {
      console.log(`安装与 Skill 版本匹配的 kp-cli，并验证 GitHub Release SHA-256。\n\n用法：\n  node scripts/install-kp-cli.mjs [--install-dir DIR] [--version VERSION] [--no-init]\n\n认证：\n  私有仓库下载使用 GH_TOKEN、GITHUB_TOKEN，或已登录的 gh CLI。\n  设置 MUTATION_API_TOKEN 后，安装器会通过 stdin 自动执行 kp-cli init。`);
      process.exit(0);
    }
    throw new Error(`未知参数：${argument}`);
  }

  return options;
}

export function resolveTarget(currentPlatform = platform(), currentArch = arch()) {
  if (currentPlatform === "darwin" && currentArch === "arm64") {
    return { asset: "kp-cli-macos-arm64", executable: "kp-cli" };
  }
  if (currentPlatform === "darwin" && currentArch === "x64") {
    return { asset: "kp-cli-macos-x64", executable: "kp-cli" };
  }
  if (currentPlatform === "win32" && currentArch === "x64") {
    return { asset: "kp-cli-windows-x64.exe", executable: "kp-cli.exe" };
  }
  throw new Error(`暂不支持 ${currentPlatform}/${currentArch}，请从源码运行 kp-cli`);
}

function defaultInstallDirectory(currentPlatform = platform()) {
  if (currentPlatform === "win32") {
    return join(process.env.LOCALAPPDATA || join(homedir(), "AppData", "Local"), "kp-cli", "bin");
  }
  return join(homedir(), ".local", "bin");
}

function githubToken() {
  const fromEnvironment = process.env.GH_TOKEN?.trim() || process.env.GITHUB_TOKEN?.trim();
  if (fromEnvironment) return fromEnvironment;

  const result = spawnSync("gh", ["auth", "token"], {
    encoding: "utf8",
    shell: false,
    stdio: ["ignore", "pipe", "ignore"],
  });
  return result.status === 0 ? result.stdout.trim() : "";
}

async function localBootstrapConfig() {
  let apiBaseUrl = "";

  try {
    const internalConfigPath = join(scriptDirectory, "..", "assets", "internal-bootstrap.json");
    if (platform() !== "win32") await chmod(internalConfigPath, 0o600);
    const internalConfig = JSON.parse(await readFile(internalConfigPath, "utf8"));
    apiBaseUrl = internalConfig["接口地址"]?.trim() || "";
  } catch (error) {
    if (error?.code !== "ENOENT") throw error;
  }

  const fromEnvironment = process.env.MUTATION_API_TOKEN?.trim();
  if (fromEnvironment) return { apiBaseUrl, mutationToken: fromEnvironment };

  try {
    const envPath = join(scriptDirectory, "..", ".env");
    if (platform() !== "win32") await chmod(envPath, 0o600);
    const contents = await readFile(envPath, "utf8");
    for (const rawLine of contents.split(/\r?\n/)) {
      const line = rawLine.trim();
      if (!line || line.startsWith("#")) continue;
      const separator = line.indexOf("=");
      if (separator < 1 || line.slice(0, separator).trim() !== "MUTATION_API_TOKEN") continue;
      const value = line.slice(separator + 1).trim();
      if (
        value.length >= 2 &&
        ((value.startsWith('"') && value.endsWith('"')) ||
          (value.startsWith("'") && value.endsWith("'")))
      ) {
        return { apiBaseUrl, mutationToken: value.slice(1, -1).trim() };
      }
      return { apiBaseUrl, mutationToken: value };
    }
  } catch (error) {
    if (error?.code !== "ENOENT") throw error;
  }
  return { apiBaseUrl, mutationToken: "" };
}

async function releaseAssets(tag, names) {
  const token = githubToken();
  const headers = {
    Accept: "application/vnd.github+json",
    "User-Agent": "kp-cli-skill-installer",
    "X-GitHub-Api-Version": "2022-11-28",
  };
  if (token) headers.Authorization = `Bearer ${token}`;

  const response = await fetch(`https://api.github.com/repos/${REPOSITORY}/releases/tags/${tag}`, { headers });
  if (!response.ok) {
    const authenticationHint = token
      ? "请确认当前凭据可以读取内部仓库"
      : "请先运行 gh auth login，或设置 GH_TOKEN/GITHUB_TOKEN";
    throw new Error(`读取 GitHub Release 失败（HTTP ${response.status}），${authenticationHint}`);
  }

  const release = await response.json();
  const assets = new Map(release.assets.map((item) => [item.name, item]));
  return names.map((name) => {
    const asset = assets.get(name);
    if (!asset) throw new Error(`Release ${tag} 缺少资产：${name}`);
    return { asset, headers };
  });
}

async function downloadAsset(asset, headers, outputPath) {
  const response = await fetch(asset.url, {
    headers: { ...headers, Accept: "application/octet-stream" },
    redirect: "follow",
  });
  if (!response.ok) throw new Error(`下载 ${asset.name} 失败（HTTP ${response.status}）`);
  await writeFile(outputPath, Buffer.from(await response.arrayBuffer()), { mode: 0o600 });
}

function expectedChecksum(manifest, assetName) {
  for (const line of manifest.split(/\r?\n/)) {
    const match = line.trim().match(/^([a-fA-F0-9]{64})\s+\*?(.+)$/);
    if (match && basename(match[2]) === assetName) return match[1].toLowerCase();
  }
  throw new Error(`SHA256SUMS.txt 中没有 ${assetName}`);
}

async function sha256(filePath) {
  return createHash("sha256").update(await readFile(filePath)).digest("hex");
}

async function install(options) {
  const target = resolveTarget();
  const tag = `v${options.version}`;
  const installDirectory = options.installDirectory || defaultInstallDirectory();
  const temporaryDirectory = await mkdtemp(join(tmpdir(), "kp-cli-install-"));

  try {
    const executableDownload = join(temporaryDirectory, target.asset);
    const checksumDownload = join(temporaryDirectory, "SHA256SUMS.txt");
    const [executableAsset, checksumAsset] = await releaseAssets(tag, [target.asset, "SHA256SUMS.txt"]);
    await Promise.all([
      downloadAsset(executableAsset.asset, executableAsset.headers, executableDownload),
      downloadAsset(checksumAsset.asset, checksumAsset.headers, checksumDownload),
    ]);

    const expected = expectedChecksum(await readFile(checksumDownload, "utf8"), target.asset);
    const actual = await sha256(executableDownload);
    if (actual !== expected) throw new Error(`${target.asset} SHA-256 校验失败`);

    await mkdir(installDirectory, { recursive: true });
    const executablePath = join(installDirectory, target.executable);
    const stagedPath = `${executablePath}.${process.pid}.tmp`;
    await copyFile(executableDownload, stagedPath);
    if (platform() !== "win32") await chmod(stagedPath, 0o755);
    await rm(executablePath, { force: true });
    await rename(stagedPath, executablePath);

    const bootstrapConfig = await localBootstrapConfig();
    let initialized = false;
    if (options.initialize && bootstrapConfig.mutationToken) {
      const initArguments = ["init", "--token-stdin"];
      if (bootstrapConfig.apiBaseUrl) initArguments.push("--api-base", bootstrapConfig.apiBaseUrl);
      const result = spawnSync(executablePath, initArguments, {
        encoding: "utf8",
        input: bootstrapConfig.mutationToken,
        shell: false,
      });
      if (result.status !== 0) throw new Error(`kp-cli init 失败：${result.stderr.trim()}`);
      initialized = true;
    }

    console.log(JSON.stringify({
      ok: true,
      version: options.version,
      executablePath,
      sha256: actual,
      initialized,
      addToPath: installDirectory,
    }, null, 2));
  } finally {
    await rm(temporaryDirectory, { force: true, recursive: true });
  }
}

const options = parseArguments(process.argv.slice(2));
await install(options);
