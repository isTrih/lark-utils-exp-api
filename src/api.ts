import type { KpConfig } from "./config.ts";

const PROTECTION_SCHEME = "aes-256-gcm+zstd";
const PROTECTION_AAD = new TextEncoder().encode("lark-utils-exp:data:v1");

interface ProtectedEnvelope {
  protected: true;
  data: {
    version: number;
    scheme: string;
    key_id: string;
    nonce: string;
    ciphertext: string;
  };
}

function decodeCanonicalBase64Url(value: string): Uint8Array {
  if (!/^[A-Za-z0-9_-]+$/.test(value)) throw new Error("响应包含非法 Base64URL");
  const bytes = Buffer.from(value, "base64url");
  if (bytes.toString("base64url") !== value) throw new Error("响应包含非规范 Base64URL");
  return bytes;
}

function ownedBytes(value: Uint8Array): Uint8Array<ArrayBuffer> {
  const bytes = new Uint8Array(value.length);
  bytes.set(value);
  return bytes;
}

async function decryptEnvelope(envelope: ProtectedEnvelope): Promise<unknown> {
  if (envelope.protected !== true || envelope.data?.version !== 1 || envelope.data.scheme !== PROTECTION_SCHEME) {
    throw new Error("服务端返回了不支持的数据保护信封");
  }
  const keyBase64 = process.env.API_DATA_ENCRYPTION_KEY?.trim();
  if (!keyBase64) throw new Error("缺少环境变量 API_DATA_ENCRYPTION_KEY，无法解密响应");
  const keyBytes = Buffer.from(keyBase64, "base64");
  if (keyBytes.length !== 32 || keyBytes.toString("base64") !== keyBase64) {
    throw new Error("API_DATA_ENCRYPTION_KEY 必须是 32 字节规范 Base64");
  }
  const expectedKeyId = process.env.API_DATA_ENCRYPTION_KEY_ID?.trim() || "primary";
  if (envelope.data.key_id !== expectedKeyId) throw new Error(`未知 key_id：${envelope.data.key_id}`);
  const nonce = decodeCanonicalBase64Url(envelope.data.nonce);
  if (nonce.length !== 12) throw new Error("AES-GCM nonce 必须是 12 字节");
  const ciphertext = decodeCanonicalBase64Url(envelope.data.ciphertext);
  const key = await crypto.subtle.importKey("raw", ownedBytes(keyBytes), { name: "AES-GCM" }, false, ["decrypt"]);
  const compressed = await crypto.subtle.decrypt(
    { name: "AES-GCM", iv: ownedBytes(nonce), additionalData: ownedBytes(PROTECTION_AAD), tagLength: 128 },
    key,
    ownedBytes(ciphertext),
  );
  const jsonBytes = Bun.zstdDecompressSync(new Uint8Array(compressed));
  return JSON.parse(new TextDecoder().decode(jsonBytes));
}

export interface ApiCallOptions {
  body?: unknown;
  protectedResponse?: boolean;
  query?: Array<[string, string]>;
}

export async function callApi(
  config: KpConfig,
  method: string,
  path: string,
  options: ApiCallOptions = {},
): Promise<{ body: unknown; status: number }> {
  const normalizedMethod = method.toUpperCase();
  const url = new URL(path, `${config.apiBaseUrl}/`);
  for (const [key, value] of options.query ?? []) url.searchParams.append(key, value);
  const headers: Record<string, string> = {
    Accept: options.protectedResponse
      ? "application/vnd.lark-utils-exp.protected+json, application/json"
      : "application/json",
    Authorization: `Bearer ${config.mutationApiToken}`,
  };
  if (options.protectedResponse) headers["X-Data-Protection"] = PROTECTION_SCHEME;
  if (options.body !== undefined) headers["Content-Type"] = "application/json";
  const response = await fetch(url, {
    method: normalizedMethod,
    headers,
    body: options.body === undefined ? undefined : JSON.stringify(options.body),
  });
  if (response.status === 204) return { body: null, status: response.status };
  const raw = await response.text();
  let body: unknown;
  try {
    body = JSON.parse(raw);
  } catch {
    body = raw;
  }
  if (response.headers.get("X-Data-Protection") === PROTECTION_SCHEME) {
    body = await decryptEnvelope(body as ProtectedEnvelope);
  } else if (options.protectedResponse) {
    throw new Error("请求了加密响应，但服务端未返回 X-Data-Protection，已拒绝降级处理");
  }
  return { body, status: response.status };
}
