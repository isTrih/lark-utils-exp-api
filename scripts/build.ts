import { mkdir, rm } from "node:fs/promises";
import { join } from "node:path";

const targets = [
  ["bun-darwin-arm64", "kp-cli-macos-arm64"],
  ["bun-darwin-x64", "kp-cli-macos-x64"],
  ["bun-windows-x64", "kp-cli-windows-x64.exe"],
] as const;

const requestedTargets = new Set(Bun.argv.slice(2));
const selectedTargets = requestedTargets.size === 0
  ? targets
  : targets.filter(([target]) => requestedTargets.has(target));
if (selectedTargets.length !== requestedTargets.size) {
  const unknown = [...requestedTargets].filter((target) => !targets.some(([known]) => known === target));
  throw new Error(`不支持的构建目标：${unknown.join(", ")}`);
}

await rm("dist", { recursive: true, force: true });
await mkdir("dist", { recursive: true });

for (const [target, filename] of selectedTargets) {
  console.log(`构建 ${filename}`);
  const process = Bun.spawn(
    ["bun", "build", "--compile", `--target=${target}`, "--minify", "src/kp-cli.ts", `--outfile=${join("dist", filename)}`],
    { stdout: "inherit", stderr: "inherit" },
  );
  const code = await process.exited;
  if (code !== 0) throw new Error(`${filename} 构建失败，退出码 ${code}`);
}
