import { mkdir, rm } from "node:fs/promises";
import { join } from "node:path";

const targets = [
  ["bun-darwin-arm64", "kp-cli-macos-arm64"],
  ["bun-darwin-x64", "kp-cli-macos-x64"],
  ["bun-windows-x64", "kp-cli-windows-x64.exe"],
] as const;

await rm("dist", { recursive: true, force: true });
await mkdir("dist", { recursive: true });

for (const [target, filename] of targets) {
  console.log(`构建 ${filename}`);
  const process = Bun.spawn(
    ["bun", "build", "--compile", `--target=${target}`, "--minify", "src/kp-cli.ts", `--outfile=${join("dist", filename)}`],
    { stdout: "inherit", stderr: "inherit" },
  );
  const code = await process.exited;
  if (code !== 0) throw new Error(`${filename} 构建失败，退出码 ${code}`);
}
