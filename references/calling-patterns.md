# API 调用模式

以下模式来自 `rok-chart-exp` 的实际调用方式，并已移除浏览器专用构建细节。

## kp-cli

查询项目：

```text
kp-cli api GET /api/v1/queries/projects
```

分页查询视频：

```text
kp-cli api GET /api/v1/queries/v2/videos --query activity_period_id=10 --query limit=100 --query offset=0
```

调用写接口时优先把请求体保存为 UTF-8 JSON 文件，Windows PowerShell 与 macOS shell 使用相同命令：

```text
kp-cli api PATCH /api/v1/admin/projects/1 --body-file project-update.json
```

`kp-cli` 自动添加初始化时保存的管理员 Bearer Token。非 2xx 响应仍会打印服务端 JSON，但进程退出码为 1。

## 浏览器 TypeScript

浏览器只通过 HTTPS 读取普通 JSON，不保存应用层加密密钥。管理员 Token 只放页面内存。

```ts
type QueryValue = boolean | number | string | null | undefined;

async function apiRequest<T>(
  baseUrl: string,
  method: "GET" | "POST" | "PUT" | "PATCH",
  path: string,
  options: {
    body?: unknown;
    params?: Record<string, QueryValue>;
    token?: string;
  } = {},
): Promise<T> {
  const url = new URL(path, `${baseUrl.replace(/\/+$/, "")}/`);
  for (const [key, value] of Object.entries(options.params ?? {})) {
    if (value !== null && value !== undefined && value !== "") {
      url.searchParams.set(key, String(value));
    }
  }
  const headers: Record<string, string> = { Accept: "application/json" };
  if (options.token) headers.Authorization = `Bearer ${options.token}`;
  if (options.body !== undefined) headers["Content-Type"] = "application/json";
  const response = await fetch(url, {
    method,
    headers,
    body: options.body === undefined ? undefined : JSON.stringify(options.body),
  });
  const payload = response.status === 204 ? undefined : await response.json();
  if (!response.ok) {
    const message = payload && typeof payload === "object" && "message" in payload
      ? String(payload.message)
      : `${response.status} ${response.statusText}`;
    throw new Error(message);
  }
  return payload as T;
}
```

替换路径参数时必须编码：

```ts
const path = `/api/v1/admin/projects/${encodeURIComponent(String(projectId))}`;
```

## 分页

旧列表接口使用 `limit + offset` 并直接返回数组：

```ts
for (let offset = 0; ; offset += 500) {
  const page = await apiRequest<unknown[]>(baseUrl, "GET", path, {
    params: { limit: 500, offset },
  });
  rows.push(...page);
  if (page.length < 500) break;
}
```

V2 统一分页响应使用 `data` 和 `meta`。优先继续使用服务端返回的 `meta.next_cursor`；没有 cursor 时才递增 offset。精确字段见 OpenAPI 的 `Paged*` schemas。

## 期次配置

创建或完整替换期次时，`contents[].source.spreadsheet_url_update_mode` 使用 `xingtu_export`；只有明确需要人工维护链接时才使用 `manual`。视频和直播每种 `content_type` 在同一期次只能出现一次。

`task_month` 必须是自然月第一天，例如 `2026-09-01`。日期范围按北京时间理解。

## 错误与请求追踪

失败响应通常为：

```json
{
  "ok": false,
  "code": "bad_request",
  "message": "错误信息",
  "request_id": "..."
}
```

记录 `request_id`、HTTP 方法、路径和状态码即可；不要记录 Token、Cookie、CSRF、完整登录态、加密密钥或解密后的敏感响应。
