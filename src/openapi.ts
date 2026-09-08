import { mkdir } from "node:fs/promises";
import { join } from "node:path";

type JsonObject = Record<string, unknown>;

const HTTP_METHODS = new Set(["get", "post", "put", "patch", "delete", "head", "options"]);

function object(value: unknown): JsonObject {
  return value && typeof value === "object" && !Array.isArray(value) ? (value as JsonObject) : {};
}

function text(value: unknown): string {
  return typeof value === "string" ? value : "";
}

function escapeCell(value: unknown): string {
  return String(value ?? "").replaceAll("|", "\\|").replaceAll("\n", " ");
}

function schemaLabel(schemaValue: unknown): string {
  const schema = object(schemaValue);
  const ref = text(schema.$ref);
  if (ref) return `\`${ref.split("/").at(-1)}\``;
  const type = Array.isArray(schema.type)
    ? schema.type.map(String).filter((value) => value !== "null").join("|")
    : text(schema.type);
  const format = text(schema.format);
  if (type === "array") return `array<${schemaLabel(schema.items)}>`;
  return `\`${type || "object"}${format ? `(${format})` : ""}\``;
}

function authLabel(method: string, path: string): string {
  if (path.startsWith("/api/v1/admin/")) return "MUTATION_API_TOKEN";
  if (path.startsWith("/api/v1/workflows/")) return "MUTATION_API_TOKEN";
  if (/^\/api\/v1\/projects\/[^/]+\/report\/send$/.test(path)) return "MUTATION_API_TOKEN";
  if (path === "/api/v1/xingtu/sessions") return "XINGTU_SESSION_UPLOAD_TOKEN 或 MUTATION_API_TOKEN";
  if (path.startsWith("/api/v1/xingtu/sessions/")) return "MUTATION_API_TOKEN";
  if (path.startsWith("/api/v1/queries/")) return "无";
  if (["/health", "/live", "/ready"].includes(path)) return "无";
  return method === "get" ? "无" : "按服务端路由确认";
}

function parameterRows(pathItem: JsonObject, operation: JsonObject): string[] {
  const values = [
    ...(Array.isArray(pathItem.parameters) ? pathItem.parameters : []),
    ...(Array.isArray(operation.parameters) ? operation.parameters : []),
  ];
  return values.map((value) => {
    const parameter = object(value);
    const required = parameter.required === true ? "是" : "否";
    return `| ${escapeCell(parameter.name)} | ${escapeCell(parameter.in)} | ${required} | ${schemaLabel(parameter.schema)} | ${escapeCell(parameter.description)} |`;
  });
}

function requestBodyLines(operation: JsonObject): string[] {
  const requestBody = object(operation.requestBody);
  if (Object.keys(requestBody).length === 0) return [];
  const content = object(requestBody.content);
  const rows = Object.entries(content).map(([contentType, media]) => {
    return `- ${requestBody.required === true ? "必填" : "可选"} \`${contentType}\`：${schemaLabel(object(media).schema)}`;
  });
  return ["", "请求体：", "", ...rows];
}

function responseLines(operation: JsonObject): string[] {
  const responses = object(operation.responses);
  const rows = Object.entries(responses).map(([status, rawResponse]) => {
    const response = object(rawResponse);
    const schemas = Object.values(object(response.content)).map((media) => schemaLabel(object(media).schema));
    return `| ${escapeCell(status)} | ${escapeCell(response.description)} | ${escapeCell(schemas.join(", ") || "-")} |`;
  });
  return rows.length
    ? ["", "响应：", "", "| 状态 | 说明 | Schema |", "| --- | --- | --- |", ...rows]
    : [];
}

export function generateApiCatalog(documentValue: unknown): string {
  const document = object(documentValue);
  const info = object(document.info);
  const operations: Array<{ method: string; path: string; pathItem: JsonObject; operation: JsonObject; tag: string }> = [];
  for (const [path, rawPathItem] of Object.entries(object(document.paths))) {
    const pathItem = object(rawPathItem);
    for (const [method, rawOperation] of Object.entries(pathItem)) {
      if (!HTTP_METHODS.has(method)) continue;
      const operation = object(rawOperation);
      const tags = Array.isArray(operation.tags) ? operation.tags.map(String) : [];
      operations.push({ method, path, pathItem, operation, tag: tags[0] ?? "other" });
    }
  }
  operations.sort((a, b) => a.tag.localeCompare(b.tag) || a.path.localeCompare(b.path) || a.method.localeCompare(b.method));

  const lines = [
    "# Lark Utils Exp API 全量目录",
    "",
    `- 服务版本：\`${escapeCell(info.version)}\``,
    `- OpenAPI：\`${escapeCell(document.openapi)}\``,
    `- 操作数量：\`${operations.length}\``,
    "- 生产基址：`https://autoxingtu.api.ali.trih.top`",
    "",
    "> 本文件由 `kp-cli openapi sync` 生成。精确对象字段以 `openapi.json` 的 schemas 为准。鉴权标记结合服务端路由补充，因为当前 OpenAPI 未声明 securitySchemes。",
  ];

  let currentTag = "";
  for (const item of operations) {
    if (item.tag !== currentTag) {
      currentTag = item.tag;
      lines.push("", `## ${currentTag}`);
    }
    const summary = text(item.operation.summary) || text(item.operation.operationId);
    const description = text(item.operation.description);
    lines.push(
      "",
      `### ${item.method.toUpperCase()} ${item.path}`,
      "",
      summary || "无摘要。",
      "",
      `- 鉴权：${authLabel(item.method, item.path)}`,
      `- Operation ID：\`${text(item.operation.operationId) || "-"}\``,
    );
    if (description && description !== summary) lines.push(`- 说明：${description.replaceAll("\n", " ")}`);
    const parameters = parameterRows(item.pathItem, item.operation);
    if (parameters.length) {
      lines.push("", "参数：", "", "| 名称 | 位置 | 必填 | 类型 | 说明 |", "| --- | --- | --- | --- | --- |", ...parameters);
    }
    lines.push(...requestBodyLines(item.operation), ...responseLines(item.operation));
  }

  lines.push(
    "",
    "## 未进入 OpenAPI 的协议端点",
    "",
    "| 方法 | 路径 | 用途 | 鉴权 |",
    "| --- | --- | --- | --- |",
    "| GET | `/meta.json` | 飞书数据同步插件元信息 | 无 |",
    "| POST | `/api/data-sync/table-meta` | 飞书数据同步字段定义 | 可选 DATA_SYNC_SECRET_KEY 签名 |",
    "| POST | `/api/data-sync/records` | 飞书日报同步记录 | 可选 DATA_SYNC_SECRET_KEY 签名 |",
    "| GET | `/api-doc/openapi.json` | OpenAPI JSON | 无 |",
    "| GET | `/swagger-ui` | Swagger UI | 无 |",
  );
  return lines.join("\n");
}

export async function syncOpenApi(apiBaseUrl: string, outputDirectory: string): Promise<{ operations: number; version: string }> {
  const response = await fetch(`${apiBaseUrl}/api-doc/openapi.json`, {
    headers: { Accept: "application/json" },
  });
  if (!response.ok) throw new Error(`读取 OpenAPI 失败：HTTP ${response.status}`);
  const document = (await response.json()) as JsonObject;
  const paths = object(document.paths);
  if (Object.keys(paths).length === 0) throw new Error("OpenAPI 不包含 paths，拒绝覆盖本地快照");
  await mkdir(outputDirectory, { recursive: true });
  await Bun.write(join(outputDirectory, "openapi.json"), `${JSON.stringify(document, null, 2)}\n`);
  await Bun.write(join(outputDirectory, "api-catalog.md"), `${generateApiCatalog(document)}\n`);
  const operations = Object.values(paths).reduce<number>(
    (count, pathItem) => count + Object.keys(object(pathItem)).filter((key) => HTTP_METHODS.has(key)).length,
    0,
  );
  return { operations, version: text(object(document.info).version) };
}
