# 加密压缩响应

可信服务端客户端可以请求 `/api/v1/**` 的 `aes-256-gcm+zstd` 信封。它是 HTTPS 之外的可选增强，不提供身份认证，也不保护 URL、方法和流量模式。

`kp-cli` 已实现严格校验、AES-256-GCM 解密和 zstd 解压：

macOS/Linux：

```sh
export API_DATA_ENCRYPTION_KEY='32-byte-standard-base64-key'
export API_DATA_ENCRYPTION_KEY_ID='primary'
kp-cli api GET /api/v1/queries/videos --query limit=10 --protected
```

Windows PowerShell：

```powershell
$env:API_DATA_ENCRYPTION_KEY = '32-byte-standard-base64-key'
$env:API_DATA_ENCRYPTION_KEY_ID = 'primary'
kp-cli api GET /api/v1/queries/videos --query limit=10 --protected
```

请求头为：

```http
X-Data-Protection: aes-256-gcm+zstd
```

服务端先以 zstd level 3 压缩原 JSON，再使用 12 字节随机 nonce、AAD `lark-utils-exp:data:v1` 和 AES-256-GCM 加密。信封中的 `nonce` 与 `ciphertext` 是无 padding Base64URL。

CLI 会 fail closed：缺少保护响应头、未知版本/方案/key_id、非法 Base64URL、nonce 长度错误、GCM 校验失败、zstd 解压失败或 JSON 解析失败都会终止，不会降级为明文。

不要把 `API_DATA_ENCRYPTION_KEY` 放进浏览器、前端构建变量、LocalStorage、扩展包、Git 或 kp-cli 配置。浏览器继续通过 HTTPS 使用普通 JSON；如需保护信封，由可信 BFF 解密。

飞书 `/api/data-sync/*` 协议不使用该信封。
