# 安装与分发 kp-cli

仓库使用 npm 管理开发依赖，CLI 源码、测试和编译均使用 Bun。

## 从源码运行

要求 Bun 1.2+、Node.js 22+、npm 11+：

```text
npm install
npm run check
npm run test
npm run kp-cli -- --help
```

全局链接开发版本：

```text
npm link
kp-cli --help
```

这种安装方式的 `kp-cli` shebang 使用 Bun，因此目标机器需要安装 Bun。

## 构建独立二进制

```text
npm run build
```

生成文件位于 `dist/`：

| 文件 | 平台 |
| --- | --- |
| `kp-cli-macos-arm64` | Apple Silicon macOS |
| `kp-cli-macos-x64` | Intel macOS |
| `kp-cli-windows-x64.exe` | 64 位 Windows |

独立二进制包含 Bun runtime，目标机器不需要安装 Bun、Node.js 或 npm。`dist/` 被 Git 忽略，应通过 GitHub/GitLab Release 或内部制品库分发，不要直接提交大文件。

macOS 下载后如丢失执行位：

```sh
chmod 755 kp-cli-macos-arm64
```

Windows 可把 `kp-cli-windows-x64.exe` 重命名为 `kp-cli.exe` 并放入 `PATH`。

## 初始化

用户指定的直接方式：

```text
kp-cli init tokenxxxxxxxx
```

Token 会进入 shell history。更安全的方式：

macOS/Linux：

```sh
printf '%s' "$MUTATION_API_TOKEN" | kp-cli init --token-stdin
```

Windows PowerShell：

```powershell
$env:MUTATION_API_TOKEN | kp-cli init --token-stdin
```

配置位置：

- macOS：`~/Library/Application Support/kp-cli/config.json`
- Windows：`%APPDATA%\kp-cli\config.json`
- Linux：`${XDG_CONFIG_HOME:-~/.config}/kp-cli/config.json`

POSIX 系统的配置文件权限设为 `0600`。Windows 文件继承当前用户配置目录 ACL。不要把该文件复制到项目仓库或共享目录。
