import { chmod, mkdir, readFile, rename, rm } from "node:fs/promises";
import { homedir } from "node:os";
import { dirname, posix, win32 } from "node:path";

export const DEFAULT_API_BASE_URL = "https://autoxingtu.api.ali.trih.top";

export interface KpConfig {
  version: 1;
  apiBaseUrl: string;
  mutationApiToken: string;
}

export interface ConfigLocationOptions {
  env?: NodeJS.ProcessEnv;
  home?: string;
  platform?: NodeJS.Platform;
}

export function getConfigPath(options: ConfigLocationOptions = {}): string {
  const env = options.env ?? process.env;
  const platform = options.platform ?? process.platform;
  const home = options.home ?? homedir();
  const path = platform === "win32" ? win32 : posix;
  const explicitDirectory = env.KP_CLI_CONFIG_DIR?.trim();
  if (explicitDirectory) return path.join(explicitDirectory, "config.json");

  if (platform === "win32") {
    return path.join(env.APPDATA?.trim() || path.join(home, "AppData", "Roaming"), "kp-cli", "config.json");
  }
  if (platform === "darwin") {
    return path.join(home, "Library", "Application Support", "kp-cli", "config.json");
  }
  return path.join(env.XDG_CONFIG_HOME?.trim() || path.join(home, ".config"), "kp-cli", "config.json");
}

export function normalizeApiBaseUrl(value: string): string {
  const url = new URL(value.trim());
  if (url.protocol !== "https:" && url.hostname !== "127.0.0.1" && url.hostname !== "localhost") {
    throw new Error("API 地址必须使用 HTTPS；只有 localhost/127.0.0.1 可以使用 HTTP");
  }
  url.pathname = url.pathname.replace(/\/+$/, "");
  url.search = "";
  url.hash = "";
  return url.toString().replace(/\/$/, "");
}

export async function saveConfig(config: KpConfig, configPath = getConfigPath()): Promise<void> {
  const directory = dirname(configPath);
  await mkdir(directory, { recursive: true, mode: 0o700 });
  const temporaryPath = `${configPath}.${process.pid}.tmp`;
  try {
    await Bun.write(temporaryPath, `${JSON.stringify(config, null, 2)}\n`, { mode: 0o600 });
    if (process.platform !== "win32") await chmod(temporaryPath, 0o600);
    await rename(temporaryPath, configPath);
  } finally {
    await rm(temporaryPath, { force: true }).catch(() => undefined);
  }
}

export async function loadConfig(configPath = getConfigPath()): Promise<KpConfig> {
  let raw: string;
  try {
    raw = await readFile(configPath, "utf8");
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      throw new Error("kp-cli 尚未初始化，请先运行 kp-cli init <MUTATION_API_TOKEN>");
    }
    throw error;
  }
  const value = JSON.parse(raw) as Partial<KpConfig>;
  if (value.version !== 1 || !value.apiBaseUrl || !value.mutationApiToken) {
    throw new Error(`配置文件格式无效：${configPath}`);
  }
  return {
    version: 1,
    apiBaseUrl: normalizeApiBaseUrl(value.apiBaseUrl),
    mutationApiToken: value.mutationApiToken,
  };
}

export function redactToken(token: string): string {
  if (token.length < 9) return "********";
  return `${token.slice(0, 4)}…${token.slice(-4)}`;
}
