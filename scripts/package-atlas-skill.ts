import { createHash } from "node:crypto";
import { chmod, mkdir, readdir, readFile, stat } from "node:fs/promises";
import { basename, join, relative, resolve, sep } from "node:path";
import { zipSync } from "fflate";
import packageJson from "../package.json" with { type: "json" };

const repositoryRoot = resolve(import.meta.dir, "..");
const outputDirectory = join(repositoryRoot, "packages");
const archiveName = `lark-utils-exp-api-atlas-v${packageJson.version}.zip`;
const archivePath = join(outputDirectory, archiveName);
const checksumPath = `${archivePath}.sha256`;
const internalConfigPath = "assets/internal-bootstrap.json";
const requiredFiles = ["SKILL.md", "agents/openai.yaml", "package.json", internalConfigPath];
const includedDirectories = ["references"];
const includedScripts = ["scripts/install-kp-cli.mjs"];

async function collectDirectory(directory: string): Promise<string[]> {
  const absoluteDirectory = join(repositoryRoot, directory);
  const entries = await readdir(absoluteDirectory, { withFileTypes: true });
  const files: string[] = [];
  for (const entry of entries) {
    const absolutePath = join(absoluteDirectory, entry.name);
    const relativePath = relative(repositoryRoot, absolutePath);
    if (entry.isDirectory()) files.push(...(await collectDirectory(relativePath)));
    else if (entry.isFile()) files.push(relativePath);
  }
  return files;
}

async function assertInternalConfiguration(): Promise<void> {
  const configPath = join(repositoryRoot, internalConfigPath);
  const metadata = await stat(configPath).catch(() => undefined);
  if (!metadata?.isFile()) throw new Error("缺少默认接口配置，拒绝生成 Atlas Skill 包");
  const contents = JSON.parse(await readFile(configPath, "utf8")) as Record<string, unknown>;
  const apiBaseUrl = typeof contents["接口地址"] === "string" ? contents["接口地址"].trim() : "";
  if (!apiBaseUrl.startsWith("https://")) {
    throw new Error("默认接口配置中缺少有效的 HTTPS 接口地址");
  }
  if ("管理令牌" in contents) {
    throw new Error("默认接口配置不得包含管理令牌");
  }
  if (process.platform !== "win32") await chmod(configPath, 0o600);
}

await assertInternalConfiguration();
const files = [
  ...requiredFiles,
  ...includedScripts,
  ...(await Promise.all(includedDirectories.map(collectDirectory))).flat(),
].sort();
const archiveEntries: Record<string, Uint8Array> = {};

for (const file of files) {
  const normalizedPath = file.split(sep).join("/");
  archiveEntries[normalizedPath] = new Uint8Array(await readFile(join(repositoryRoot, file)));
}

const archive = zipSync(archiveEntries, { level: 9 });
const checksum = createHash("sha256").update(archive).digest("hex");
await mkdir(outputDirectory, { recursive: true, mode: 0o700 });
await Bun.write(archivePath, archive, { mode: 0o600 });
await Bun.write(checksumPath, `${checksum}  ${basename(archivePath)}\n`, { mode: 0o600 });
if (process.platform !== "win32") {
  await chmod(archivePath, 0o600);
  await chmod(checksumPath, 0o600);
}

console.log(JSON.stringify({
  ok: true,
  archivePath,
  checksumPath,
  sha256: checksum,
  fileCount: files.length,
  containsInternalConfig: files.includes(internalConfigPath),
}, null, 2));
