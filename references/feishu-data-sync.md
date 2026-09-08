# 飞书数据同步插件协议

这些端点没有进入业务 OpenAPI，响应遵循飞书数据连接器协议。

| 方法 | 路径 | 用途 |
| --- | --- | --- |
| GET | `/meta.json` | 插件元信息、配置页和数据端点 |
| POST | `/api/data-sync/table-meta` | 日报表名和字段定义 |
| POST | `/api/data-sync/records` | 按页返回日报记录 |

配置保存：

```json
{
  "activity_period_id": 10
}
```

飞书请求中的 `params` 和 `datasourceConfig` 都可能是 JSON 字符串。`records` 使用 `maxPageSize` 和 `pageToken`；分页 Token 格式为 `offset_N`。稳定主键为 `period_{activity_period_id}_{YYYYMMDD}`。

示例协议请求体：

```json
{
  "params": "{\"datasourceConfig\":\"{\\\"activity_period_id\\\":10}\",\"maxPageSize\":100,\"pageToken\":\"\"}"
}
```

配置 `DATA_SYNC_SECRET_KEY` 后，服务校验：

```text
SHA1(timestamp + nonce + secretKey + 原始请求体)
```

请求头是 `X-Base-Request-Timestamp`、`X-Base-Request-Nonce`、`X-Base-Signature`。时间戳有效期 5 分钟，nonce 10 分钟内不能复用。通常由飞书平台发起并签名，不要把 Secret 写入命令、示例或 Git。

日报按期次 `task_month` 所在自然月生成。直播观看人次只取 `live_exposure_pv`；平均 ACU 是当日场次 ACU 算术平均；业务日期使用 `Asia/Shanghai`。
