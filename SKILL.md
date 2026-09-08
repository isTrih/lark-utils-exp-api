---
name: lark-utils-exp-api
description: 使用 kp-cli 查询、调用、调试和维护 Lark Utils Exp 的全部 HTTP API，并以强制只读事务核验生产 PostgreSQL 数据。适用于 API 集成、管理后台、报表指标、工作流、星图登录态、飞书连接器及接口故障排查。
---

# Lark Utils Exp API

使用随 Skill 提供的 `kp-cli` 作为统一入口。不要凭记忆编造路径、字段或返回结构。

## 开始前

1. 运行 `kp-cli config show` 检查当前 API 地址与初始化状态。输出会隐藏 Token。
2. 未初始化时运行 `kp-cli init <MUTATION_API_TOKEN>`。更安全的自动化方式是把 Token 写入 stdin 后运行 `kp-cli init --token-stdin`。
3. 默认生产地址是 `https://autoxingtu.api.ali.trih.top`。只有用户明确指定其他环境时才传 `--api-base`。
4. 选择接口时先查 [references/api-catalog.md](references/api-catalog.md)；需要精确请求/响应 Schema 时读取 [references/openapi.json](references/openapi.json)。

首次安装或分发二进制时读取 [references/installation.md](references/installation.md)。

## 工作方式

- 普通调用：`kp-cli api GET /api/v1/queries/projects`。
- 查询参数：重复使用 `--query key=value`；值会按字符串发送。
- JSON 请求体：优先保存为 UTF-8 JSON 文件，再用 `--body-file request.json`，避免 Windows/macOS shell 引号差异。
- 管理和工作流接口会自动使用初始化保存的 `MUTATION_API_TOKEN`。
- `POST /api/v1/xingtu/sessions` 的浏览器插件可使用独立上传 Token；不要把 Cookie、CSRF、上传 Token 或登录态写入示例、日志、Skill 或 Git。
- 更新接口清单：`kp-cli openapi sync --output <本Skill的references目录>`。同步后检查 Git diff，确认是预期服务版本再提交。
- 浏览器、TypeScript 和分页调用方式见 [references/calling-patterns.md](references/calling-patterns.md)。

## 生产数据库核验

只在 API 返回与业务口径存在疑点、用户要求核验，或需要构造脱敏示例时访问生产库。读取 [references/database.md](references/database.md) 后，使用 `kp-cli db <preset>`；数据库连接只从当前进程的 `DATABASE_URL` 读取。

`kp-cli db` 只开放预置 SELECT，并在 PostgreSQL 中执行 `REPEATABLE READ READ ONLY` 事务、北京时间会话和超时。不要绕过它运行任意 SQL，不要读取 `xingtu_login_session`，不要返回 `audit_extra.key`，不要把数据库连接串保存到 kp-cli 配置。

生产示例是时间敏感的。可参考 [references/production-examples.md](references/production-examples.md) 选择参数，但在做结论前用 API 或只读预置查询重新验证。

## 授权边界

- 查询、文档获取、健康检查和生产库只读核验可以直接执行。
- 创建、更新、发送卡片、运行工作流、重试、忽略、回收消息、规整数据或上传登录态会改变外部状态；只有用户明确要求对应操作时才执行。
- 规整直播数据先调用 `POST /api/v1/admin/live-sessions/normalize` 且 `dry_run=true`，展示统计后再取得实际执行权限。
- 不因已经保存管理员 Token 而推断用户授权了任意写操作。

## 重要业务口径

- 直播“场观 PV”只使用 `live_exposure_pv`。
- 日报视频和直播只统计期次 `task_month` 所在自然月。
- `audit_extra` 顶层 `key` 可用于筛选，但任何响应、示例或诊断都不能回显它。
- 日期和调度以 `Asia/Shanghai` 为准。
- `/api/v1/**` 可选的加密压缩响应只用于可信服务端客户端；浏览器继续使用 HTTPS JSON。需要时读取 [references/data-protection.md](references/data-protection.md)。
- 飞书数据同步协议不属于普通业务响应，读取 [references/feishu-data-sync.md](references/feishu-data-sync.md) 后再调用。

## API 覆盖范围

OpenAPI 快照包含全部已声明业务端点。额外纳入未进入 OpenAPI 的 `/meta.json`、`/api/data-sync/table-meta`、`/api/data-sync/records`、`/api-doc/openapi.json` 和 `/swagger-ui`。静态 HTML/CSS/JS 页面不是业务 API。
