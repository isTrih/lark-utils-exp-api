# Lark Utils Exp API 全量目录

- 服务版本：`2.2.3+build.20260907T132253Z.git.271bec904cf1`
- OpenAPI：`3.1.0`
- 操作数量：`65`
- 生产基址：`https://autoxingtu.api.ali.trih.top`

> 本文件由 `kp-cli openapi sync` 生成。精确对象字段以 `openapi.json` 的 schemas 为准。鉴权标记结合服务端路由补充，因为当前 OpenAPI 未声明 securitySchemes。

## admin

### GET /api/v1/admin/card-messages

查询卡片消息发送历史

- 鉴权：MUTATION_API_TOKEN
- Operation ID：`lark_exp.server.admin.list_card_messages`

参数：

| 名称 | 位置 | 必填 | 类型 | 说明 |
| --- | --- | --- | --- | --- |
| category | query | 否 | `string` | 消息类别：error_log、audit、daily_report。 |
| date_from | query | 否 | `string(date)` | 北京时间发送日期起点，闭区间。 |
| date_to | query | 否 | `string(date)` | 北京时间发送日期终点，闭区间。 |
| limit | query | 否 | `integer(int64)` | 返回条数，限制为 1..500，默认 50。 |
| offset | query | 否 | `integer(int64)` | 分页偏移量，默认 0。 |

响应：

| 状态 | 说明 | Schema |
| --- | --- | --- |
| 200 | Response with json format data | array<`lark_exp.lark.message_history.CardMessageHistory`> |
| 400 | 请求参数错误 | `lark_exp.server.error.ApiErrorResponse` |
| 401 | Bearer token 无效 | `lark_exp.server.error.ApiErrorResponse` |
| 404 | 记录不存在 | `lark_exp.server.error.ApiErrorResponse` |
| 409 | 记录冲突 | `lark_exp.server.error.ApiErrorResponse` |
| 500 | 服务内部错误 | `lark_exp.server.error.ApiErrorResponse` |
| 502 | 飞书上游接口不可用 | `lark_exp.server.error.ApiErrorResponse` |
| 503 | 服务尚未就绪 | `lark_exp.server.error.ApiErrorResponse` |

### POST /api/v1/admin/card-messages/{message_id}/recall

撤回已记录的飞书卡片消息

- 鉴权：MUTATION_API_TOKEN
- Operation ID：`lark_exp.server.admin.recall_card_message`

参数：

| 名称 | 位置 | 必填 | 类型 | 说明 |
| --- | --- | --- | --- | --- |
| message_id | path | 是 | `string` | 飞书消息 ID。 |

响应：

| 状态 | 说明 | Schema |
| --- | --- | --- |
| 200 | Response with json format data | `lark_exp.lark.message_history.CardMessageHistory` |
| 400 | 请求参数错误 | `lark_exp.server.error.ApiErrorResponse` |
| 401 | Bearer token 无效 | `lark_exp.server.error.ApiErrorResponse` |
| 404 | 记录不存在 | `lark_exp.server.error.ApiErrorResponse` |
| 409 | 记录冲突 | `lark_exp.server.error.ApiErrorResponse` |
| 500 | 服务内部错误 | `lark_exp.server.error.ApiErrorResponse` |
| 502 | 飞书上游接口不可用 | `lark_exp.server.error.ApiErrorResponse` |
| 503 | 服务尚未就绪 | `lark_exp.server.error.ApiErrorResponse` |

### GET /api/v1/admin/failed-sources

查询失败来源队列

- 鉴权：MUTATION_API_TOKEN
- Operation ID：`lark_exp.server.admin.list_failed_sources`

参数：

| 名称 | 位置 | 必填 | 类型 | 说明 |
| --- | --- | --- | --- | --- |
| limit | query | 否 | `integer(int64)` |  |
| offset | query | 否 | `integer(int64)` |  |

响应：

| 状态 | 说明 | Schema |
| --- | --- | --- |
| 200 | Response with json format data | array<`lark_exp.server.admin.FailedSourceDto`> |
| 400 | 请求参数错误 | `lark_exp.server.error.ApiErrorResponse` |
| 401 | Bearer token 无效 | `lark_exp.server.error.ApiErrorResponse` |
| 404 | 记录不存在 | `lark_exp.server.error.ApiErrorResponse` |
| 409 | 记录冲突 | `lark_exp.server.error.ApiErrorResponse` |
| 500 | 服务内部错误 | `lark_exp.server.error.ApiErrorResponse` |
| 502 | 飞书上游接口不可用 | `lark_exp.server.error.ApiErrorResponse` |
| 503 | 服务尚未就绪 | `lark_exp.server.error.ApiErrorResponse` |

### POST /api/v1/admin/failed-sources/{feishu_source_id}/ignore

忽略单个失败来源

- 鉴权：MUTATION_API_TOKEN
- Operation ID：`lark_exp.server.admin.ignore_failed_source`

参数：

| 名称 | 位置 | 必填 | 类型 | 说明 |
| --- | --- | --- | --- | --- |
| feishu_source_id | path | 是 | `integer(int64)` |  |

响应：

| 状态 | 说明 | Schema |
| --- | --- | --- |
| 200 | Response with json format data | `object` |
| 400 | 请求参数错误 | `lark_exp.server.error.ApiErrorResponse` |
| 401 | Bearer token 无效 | `lark_exp.server.error.ApiErrorResponse` |
| 404 | 记录不存在 | `lark_exp.server.error.ApiErrorResponse` |
| 409 | 记录冲突 | `lark_exp.server.error.ApiErrorResponse` |
| 500 | 服务内部错误 | `lark_exp.server.error.ApiErrorResponse` |
| 502 | 飞书上游接口不可用 | `lark_exp.server.error.ApiErrorResponse` |
| 503 | 服务尚未就绪 | `lark_exp.server.error.ApiErrorResponse` |

### POST /api/v1/admin/failed-sources/{feishu_source_id}/retry

立即重试单个失败来源

- 鉴权：MUTATION_API_TOKEN
- Operation ID：`lark_exp.server.admin.retry_failed_source`

参数：

| 名称 | 位置 | 必填 | 类型 | 说明 |
| --- | --- | --- | --- | --- |
| feishu_source_id | path | 是 | `integer(int64)` |  |

响应：

| 状态 | 说明 | Schema |
| --- | --- | --- |
| 200 | Response with json format data | `lark_exp.xingtu.data_import.PendingImportResult` |
| 400 | 请求参数错误 | `lark_exp.server.error.ApiErrorResponse` |
| 401 | Bearer token 无效 | `lark_exp.server.error.ApiErrorResponse` |
| 404 | 记录不存在 | `lark_exp.server.error.ApiErrorResponse` |
| 409 | 记录冲突 | `lark_exp.server.error.ApiErrorResponse` |
| 500 | 服务内部错误 | `lark_exp.server.error.ApiErrorResponse` |
| 502 | 飞书上游接口不可用 | `lark_exp.server.error.ApiErrorResponse` |
| 503 | 服务尚未就绪 | `lark_exp.server.error.ApiErrorResponse` |

### GET /api/v1/admin/feishu/bitable/tables

根据飞书多维表链接枚举数据表

- 鉴权：MUTATION_API_TOKEN
- Operation ID：`lark_exp.server.admin.list_bitable_tables`
- 说明：从 wiki/base 链接提取 app_token，以应用身份请求飞书数据表列表；page_size 固定为 99，并透传飞书官方 code/data/msg 响应。

参数：

| 名称 | 位置 | 必填 | 类型 | 说明 |
| --- | --- | --- | --- | --- |
| url | query | 是 | `string` | 飞书知识库多维表或普通多维表链接，也兼容 Markdown 链接文本。 |
| page_token | query | 否 | `string` | 飞书上一页响应返回的分页标记。 |

响应：

| 状态 | 说明 | Schema |
| --- | --- | --- |
| 200 | Response with json format data | `object` |
| 400 | 请求参数错误 | `lark_exp.server.error.ApiErrorResponse` |
| 401 | Bearer token 无效 | `lark_exp.server.error.ApiErrorResponse` |
| 404 | 记录不存在 | `lark_exp.server.error.ApiErrorResponse` |
| 409 | 记录冲突 | `lark_exp.server.error.ApiErrorResponse` |
| 500 | 服务内部错误 | `lark_exp.server.error.ApiErrorResponse` |
| 502 | 飞书上游接口不可用 | `lark_exp.server.error.ApiErrorResponse` |
| 503 | 服务尚未就绪 | `lark_exp.server.error.ApiErrorResponse` |

### GET /api/v1/admin/feishu/chats

查询机器人所在的群聊

- 鉴权：MUTATION_API_TOKEN
- Operation ID：`lark_exp.server.admin.list_bot_chats`
- 说明：以应用身份调用飞书群列表接口，并透传飞书官方 code/data/msg 响应和 HTTP 状态码。

参数：

| 名称 | 位置 | 必填 | 类型 | 说明 |
| --- | --- | --- | --- | --- |
| user_id_type | query | 否 | `string` | 群主用户 ID 类型：open_id、union_id 或 user_id。缺省时使用飞书默认值。 |
| sort_type | query | 否 | `string` | 排序方式：ByCreateTimeAsc 或 ByActiveTimeDesc。 |
| page_size | query | 否 | `integer(int32)` | 单页数量，范围 1..=100，飞书默认 20。 |
| page_token | query | 否 | `string` | 飞书上一页响应返回的分页标记。 |

响应：

| 状态 | 说明 | Schema |
| --- | --- | --- |
| 200 | Response with json format data | `object` |
| 400 | 请求参数错误 | `lark_exp.server.error.ApiErrorResponse` |
| 401 | Bearer token 无效 | `lark_exp.server.error.ApiErrorResponse` |
| 404 | 记录不存在 | `lark_exp.server.error.ApiErrorResponse` |
| 409 | 记录冲突 | `lark_exp.server.error.ApiErrorResponse` |
| 500 | 服务内部错误 | `lark_exp.server.error.ApiErrorResponse` |
| 502 | 飞书上游接口不可用 | `lark_exp.server.error.ApiErrorResponse` |
| 503 | 服务尚未就绪 | `lark_exp.server.error.ApiErrorResponse` |

### GET /api/v1/admin/feishu/chats/{chat_id}/members

查询指定群聊的成员

- 鉴权：MUTATION_API_TOKEN
- Operation ID：`lark_exp.server.admin.list_chat_members`
- 说明：以应用身份调用飞书群成员接口；member_id_type 支持 open_id、union_id、user_id，并透传飞书官方响应。

参数：

| 名称 | 位置 | 必填 | 类型 | 说明 |
| --- | --- | --- | --- | --- |
| chat_id | path | 是 | `string` | 飞书群聊 ID，以 oc_ 开头。 |
| member_id_type | query | 否 | `string` | 成员 ID 类型：open_id、union_id 或 user_id。缺省时使用飞书默认值。 |
| page_size | query | 否 | `integer(int32)` | 单页数量，范围 1..=100，飞书默认 20。 |
| page_token | query | 否 | `string` | 飞书上一页响应返回的分页标记。 |

响应：

| 状态 | 说明 | Schema |
| --- | --- | --- |
| 200 | Response with json format data | `object` |
| 400 | 请求参数错误 | `lark_exp.server.error.ApiErrorResponse` |
| 401 | Bearer token 无效 | `lark_exp.server.error.ApiErrorResponse` |
| 404 | 记录不存在 | `lark_exp.server.error.ApiErrorResponse` |
| 409 | 记录冲突 | `lark_exp.server.error.ApiErrorResponse` |
| 500 | 服务内部错误 | `lark_exp.server.error.ApiErrorResponse` |
| 502 | 飞书上游接口不可用 | `lark_exp.server.error.ApiErrorResponse` |
| 503 | 服务尚未就绪 | `lark_exp.server.error.ApiErrorResponse` |

### POST /api/v1/admin/feishu/spreadsheets/format-analysis

格式化电子表格分析文本

- 鉴权：MUTATION_API_TOKEN
- Operation ID：`lark_exp.server.admin_sheet.format_analysis_spreadsheet`
- 说明：从飞书普通电子表格链接提取 spreadsheetToken 和 sheet_id，以 sheet_id 读取单个范围；将“数字）文字：”加粗，将下降百分比标绿、上升百分比标红，绝对数字大于 50 时加粗。只回写命中的字符串单元格。

请求体：

- 必填 `application/json`：`lark_exp.server.admin_sheet.FormatAnalysisSpreadsheetRequest`

响应：

| 状态 | 说明 | Schema |
| --- | --- | --- |
| 200 | Response with json format data | `object` |
| 400 | 请求参数错误 | `lark_exp.server.error.ApiErrorResponse` |
| 401 | Bearer token 无效 | `lark_exp.server.error.ApiErrorResponse` |
| 404 | 记录不存在 | `lark_exp.server.error.ApiErrorResponse` |
| 409 | 记录冲突 | `lark_exp.server.error.ApiErrorResponse` |
| 500 | 服务内部错误 | `lark_exp.server.error.ApiErrorResponse` |
| 502 | 飞书上游接口不可用 | `lark_exp.server.error.ApiErrorResponse` |
| 503 | 服务尚未就绪 | `lark_exp.server.error.ApiErrorResponse` |

### POST /api/v1/admin/live-sessions/normalize

按开播月份规整直播数据

- 鉴权：MUTATION_API_TOKEN
- Operation ID：`lark_exp.server.admin.normalize_live_sessions`
- 说明：将直播记录归入同一主项目下 task_month 与开播月份一致的活动期次。同一目标期次已有相同直播间 ID 时删除错期副本，否则移动记录并关联目标期次来源。直播间 ID 的唯一范围是同一主项目、同一活动月份；生产源中的 SDxxx 并非平台全局唯一 ID。dry_run 默认为 true，仅返回预计结果；明确传 false 才实际执行。找不到目标期次或目标飞书来源的记录不会删除，计入 unresolved_rows。

请求体：

- 必填 `application/json`：`lark_exp.server.admin.NormalizeLiveSessionsRequest`

响应：

| 状态 | 说明 | Schema |
| --- | --- | --- |
| 200 | Response with json format data | `lark_exp.xingtu.data_import.LiveSessionNormalizationResult` |
| 400 | 请求参数错误 | `lark_exp.server.error.ApiErrorResponse` |
| 401 | Bearer token 无效 | `lark_exp.server.error.ApiErrorResponse` |
| 404 | 记录不存在 | `lark_exp.server.error.ApiErrorResponse` |
| 409 | 记录冲突 | `lark_exp.server.error.ApiErrorResponse` |
| 500 | 服务内部错误 | `lark_exp.server.error.ApiErrorResponse` |
| 502 | 飞书上游接口不可用 | `lark_exp.server.error.ApiErrorResponse` |
| 503 | 服务尚未就绪 | `lark_exp.server.error.ApiErrorResponse` |

### GET /api/v1/admin/periods/statuses

查询各项目运行与数据新鲜度

- 鉴权：MUTATION_API_TOKEN
- Operation ID：`lark_exp.server.admin.project_statuses`

响应：

| 状态 | 说明 | Schema |
| --- | --- | --- |
| 200 | Response with json format data | array<`lark_exp.server.admin.ProjectStatusDto`> |
| 400 | 请求参数错误 | `lark_exp.server.error.ApiErrorResponse` |
| 401 | Bearer token 无效 | `lark_exp.server.error.ApiErrorResponse` |
| 404 | 记录不存在 | `lark_exp.server.error.ApiErrorResponse` |
| 409 | 记录冲突 | `lark_exp.server.error.ApiErrorResponse` |
| 500 | 服务内部错误 | `lark_exp.server.error.ApiErrorResponse` |
| 502 | 飞书上游接口不可用 | `lark_exp.server.error.ApiErrorResponse` |
| 503 | 服务尚未就绪 | `lark_exp.server.error.ApiErrorResponse` |

### GET /api/v1/admin/projects

查询主项目配置

- 鉴权：MUTATION_API_TOKEN
- Operation ID：`lark_exp.server.admin.list_master_projects`

参数：

| 名称 | 位置 | 必填 | 类型 | 说明 |
| --- | --- | --- | --- | --- |
| project_id | query | 否 | `integer(int64)` | 按主项目 ID 过滤；优先于 project。 |
| project | query | 否 | `string` | 按项目过滤，例如 ROK。 |
| include_inactive | query | 否 | `boolean` | 是否包含停用记录，默认 true。 |

响应：

| 状态 | 说明 | Schema |
| --- | --- | --- |
| 200 | Response with json format data | array<`lark_exp.server.admin.MasterProjectDto`> |
| 400 | 请求参数错误 | `lark_exp.server.error.ApiErrorResponse` |
| 401 | Bearer token 无效 | `lark_exp.server.error.ApiErrorResponse` |
| 404 | 记录不存在 | `lark_exp.server.error.ApiErrorResponse` |
| 409 | 记录冲突 | `lark_exp.server.error.ApiErrorResponse` |
| 500 | 服务内部错误 | `lark_exp.server.error.ApiErrorResponse` |
| 502 | 飞书上游接口不可用 | `lark_exp.server.error.ApiErrorResponse` |
| 503 | 服务尚未就绪 | `lark_exp.server.error.ApiErrorResponse` |

### POST /api/v1/admin/projects

创建主项目

- 鉴权：MUTATION_API_TOKEN
- Operation ID：`lark_exp.server.admin.create_master_project`

请求体：

- 必填 `application/json`：`lark_exp.server.admin.CreateMasterProjectRequest`

响应：

| 状态 | 说明 | Schema |
| --- | --- | --- |
| 200 | Response with json format data | `lark_exp.server.admin.MasterProjectDetailDto` |
| 400 | 请求参数错误 | `lark_exp.server.error.ApiErrorResponse` |
| 401 | Bearer token 无效 | `lark_exp.server.error.ApiErrorResponse` |
| 404 | 记录不存在 | `lark_exp.server.error.ApiErrorResponse` |
| 409 | 记录冲突 | `lark_exp.server.error.ApiErrorResponse` |
| 500 | 服务内部错误 | `lark_exp.server.error.ApiErrorResponse` |
| 502 | 飞书上游接口不可用 | `lark_exp.server.error.ApiErrorResponse` |
| 503 | 服务尚未就绪 | `lark_exp.server.error.ApiErrorResponse` |

### GET /api/v1/admin/projects/{project_id}

查询主项目及账号、审核员、期次

- 鉴权：MUTATION_API_TOKEN
- Operation ID：`lark_exp.server.admin.get_master_project`

参数：

| 名称 | 位置 | 必填 | 类型 | 说明 |
| --- | --- | --- | --- | --- |
| project_id | path | 是 | `integer(int64)` |  |

响应：

| 状态 | 说明 | Schema |
| --- | --- | --- |
| 200 | Response with json format data | `lark_exp.server.admin.MasterProjectDetailDto` |
| 400 | 请求参数错误 | `lark_exp.server.error.ApiErrorResponse` |
| 401 | Bearer token 无效 | `lark_exp.server.error.ApiErrorResponse` |
| 404 | 记录不存在 | `lark_exp.server.error.ApiErrorResponse` |
| 409 | 记录冲突 | `lark_exp.server.error.ApiErrorResponse` |
| 500 | 服务内部错误 | `lark_exp.server.error.ApiErrorResponse` |
| 502 | 飞书上游接口不可用 | `lark_exp.server.error.ApiErrorResponse` |
| 503 | 服务尚未就绪 | `lark_exp.server.error.ApiErrorResponse` |

### PATCH /api/v1/admin/projects/{project_id}

更新主项目

- 鉴权：MUTATION_API_TOKEN
- Operation ID：`lark_exp.server.admin.update_master_project`

参数：

| 名称 | 位置 | 必填 | 类型 | 说明 |
| --- | --- | --- | --- | --- |
| project_id | path | 是 | `integer(int64)` |  |

请求体：

- 必填 `application/json`：`lark_exp.server.admin.UpdateMasterProjectRequest`

响应：

| 状态 | 说明 | Schema |
| --- | --- | --- |
| 200 | Response with json format data | `lark_exp.server.admin.MasterProjectDetailDto` |
| 400 | 请求参数错误 | `lark_exp.server.error.ApiErrorResponse` |
| 401 | Bearer token 无效 | `lark_exp.server.error.ApiErrorResponse` |
| 404 | 记录不存在 | `lark_exp.server.error.ApiErrorResponse` |
| 409 | 记录冲突 | `lark_exp.server.error.ApiErrorResponse` |
| 500 | 服务内部错误 | `lark_exp.server.error.ApiErrorResponse` |
| 502 | 飞书上游接口不可用 | `lark_exp.server.error.ApiErrorResponse` |
| 503 | 服务尚未就绪 | `lark_exp.server.error.ApiErrorResponse` |

### GET /api/v1/admin/projects/{project_id}/accounts

查询项目星图账号

- 鉴权：MUTATION_API_TOKEN
- Operation ID：`lark_exp.server.admin.list_project_accounts`

参数：

| 名称 | 位置 | 必填 | 类型 | 说明 |
| --- | --- | --- | --- | --- |
| project_id | path | 是 | `integer(int64)` |  |
| include_inactive | query | 否 | `boolean` | 是否包含停用期次，默认 true。 |

响应：

| 状态 | 说明 | Schema |
| --- | --- | --- |
| 200 | Response with json format data | array<`lark_exp.server.admin.MasterProjectAccountDto`> |
| 400 | 请求参数错误 | `lark_exp.server.error.ApiErrorResponse` |
| 401 | Bearer token 无效 | `lark_exp.server.error.ApiErrorResponse` |
| 404 | 记录不存在 | `lark_exp.server.error.ApiErrorResponse` |
| 409 | 记录冲突 | `lark_exp.server.error.ApiErrorResponse` |
| 500 | 服务内部错误 | `lark_exp.server.error.ApiErrorResponse` |
| 502 | 飞书上游接口不可用 | `lark_exp.server.error.ApiErrorResponse` |
| 503 | 服务尚未就绪 | `lark_exp.server.error.ApiErrorResponse` |

### POST /api/v1/admin/projects/{project_id}/accounts

新增项目星图账号

- 鉴权：MUTATION_API_TOKEN
- Operation ID：`lark_exp.server.admin.create_project_account`

参数：

| 名称 | 位置 | 必填 | 类型 | 说明 |
| --- | --- | --- | --- | --- |
| project_id | path | 是 | `integer(int64)` |  |

请求体：

- 必填 `application/json`：`lark_exp.server.admin.MasterProjectAccountInput`

响应：

| 状态 | 说明 | Schema |
| --- | --- | --- |
| 200 | Response with json format data | `lark_exp.server.admin.MasterProjectAccountDto` |
| 400 | 请求参数错误 | `lark_exp.server.error.ApiErrorResponse` |
| 401 | Bearer token 无效 | `lark_exp.server.error.ApiErrorResponse` |
| 404 | 记录不存在 | `lark_exp.server.error.ApiErrorResponse` |
| 409 | 记录冲突 | `lark_exp.server.error.ApiErrorResponse` |
| 500 | 服务内部错误 | `lark_exp.server.error.ApiErrorResponse` |
| 502 | 飞书上游接口不可用 | `lark_exp.server.error.ApiErrorResponse` |
| 503 | 服务尚未就绪 | `lark_exp.server.error.ApiErrorResponse` |

### PATCH /api/v1/admin/projects/{project_id}/accounts/{xingtu_account_id}

更新项目星图账号

- 鉴权：MUTATION_API_TOKEN
- Operation ID：`lark_exp.server.admin.update_project_account`

参数：

| 名称 | 位置 | 必填 | 类型 | 说明 |
| --- | --- | --- | --- | --- |
| project_id | path | 是 | `integer(int64)` |  |
| xingtu_account_id | path | 是 | `string` |  |

请求体：

- 必填 `application/json`：`lark_exp.server.admin.UpdateMasterProjectAccountRequest`

响应：

| 状态 | 说明 | Schema |
| --- | --- | --- |
| 200 | Response with json format data | `lark_exp.server.admin.MasterProjectAccountDto` |
| 400 | 请求参数错误 | `lark_exp.server.error.ApiErrorResponse` |
| 401 | Bearer token 无效 | `lark_exp.server.error.ApiErrorResponse` |
| 404 | 记录不存在 | `lark_exp.server.error.ApiErrorResponse` |
| 409 | 记录冲突 | `lark_exp.server.error.ApiErrorResponse` |
| 500 | 服务内部错误 | `lark_exp.server.error.ApiErrorResponse` |
| 502 | 飞书上游接口不可用 | `lark_exp.server.error.ApiErrorResponse` |
| 503 | 服务尚未就绪 | `lark_exp.server.error.ApiErrorResponse` |

### GET /api/v1/admin/projects/{project_id}/auditors

查询项目审核员

- 鉴权：MUTATION_API_TOKEN
- Operation ID：`lark_exp.server.admin.list_project_auditors`

参数：

| 名称 | 位置 | 必填 | 类型 | 说明 |
| --- | --- | --- | --- | --- |
| project_id | path | 是 | `integer(int64)` |  |
| include_inactive | query | 否 | `boolean` | 是否包含停用期次，默认 true。 |

响应：

| 状态 | 说明 | Schema |
| --- | --- | --- |
| 200 | Response with json format data | array<`lark_exp.server.admin.ProjectAuditorDto`> |
| 400 | 请求参数错误 | `lark_exp.server.error.ApiErrorResponse` |
| 401 | Bearer token 无效 | `lark_exp.server.error.ApiErrorResponse` |
| 404 | 记录不存在 | `lark_exp.server.error.ApiErrorResponse` |
| 409 | 记录冲突 | `lark_exp.server.error.ApiErrorResponse` |
| 500 | 服务内部错误 | `lark_exp.server.error.ApiErrorResponse` |
| 502 | 飞书上游接口不可用 | `lark_exp.server.error.ApiErrorResponse` |
| 503 | 服务尚未就绪 | `lark_exp.server.error.ApiErrorResponse` |

### POST /api/v1/admin/projects/{project_id}/auditors

新增项目审核员

- 鉴权：MUTATION_API_TOKEN
- Operation ID：`lark_exp.server.admin.create_project_auditor`

参数：

| 名称 | 位置 | 必填 | 类型 | 说明 |
| --- | --- | --- | --- | --- |
| project_id | path | 是 | `integer(int64)` |  |

请求体：

- 必填 `application/json`：`lark_exp.server.admin.MasterProjectAuditorInput`

响应：

| 状态 | 说明 | Schema |
| --- | --- | --- |
| 200 | Response with json format data | `lark_exp.server.admin.ProjectAuditorDto` |
| 400 | 请求参数错误 | `lark_exp.server.error.ApiErrorResponse` |
| 401 | Bearer token 无效 | `lark_exp.server.error.ApiErrorResponse` |
| 404 | 记录不存在 | `lark_exp.server.error.ApiErrorResponse` |
| 409 | 记录冲突 | `lark_exp.server.error.ApiErrorResponse` |
| 500 | 服务内部错误 | `lark_exp.server.error.ApiErrorResponse` |
| 502 | 飞书上游接口不可用 | `lark_exp.server.error.ApiErrorResponse` |
| 503 | 服务尚未就绪 | `lark_exp.server.error.ApiErrorResponse` |

### PATCH /api/v1/admin/projects/{project_id}/auditors/{project_auditor_id}

更新项目审核员

- 鉴权：MUTATION_API_TOKEN
- Operation ID：`lark_exp.server.admin.update_project_auditor`

参数：

| 名称 | 位置 | 必填 | 类型 | 说明 |
| --- | --- | --- | --- | --- |
| project_id | path | 是 | `integer(int64)` |  |
| project_auditor_id | path | 是 | `integer(int64)` |  |

请求体：

- 必填 `application/json`：`lark_exp.server.admin.UpdateAuditorRequest`

响应：

| 状态 | 说明 | Schema |
| --- | --- | --- |
| 200 | Response with json format data | `lark_exp.server.admin.ProjectAuditorDto` |
| 400 | 请求参数错误 | `lark_exp.server.error.ApiErrorResponse` |
| 401 | Bearer token 无效 | `lark_exp.server.error.ApiErrorResponse` |
| 404 | 记录不存在 | `lark_exp.server.error.ApiErrorResponse` |
| 409 | 记录冲突 | `lark_exp.server.error.ApiErrorResponse` |
| 500 | 服务内部错误 | `lark_exp.server.error.ApiErrorResponse` |
| 502 | 飞书上游接口不可用 | `lark_exp.server.error.ApiErrorResponse` |
| 503 | 服务尚未就绪 | `lark_exp.server.error.ApiErrorResponse` |

### GET /api/v1/admin/projects/{project_id}/notification

查询项目通知配置

- 鉴权：MUTATION_API_TOKEN
- Operation ID：`lark_exp.server.admin.get_project_notification`

参数：

| 名称 | 位置 | 必填 | 类型 | 说明 |
| --- | --- | --- | --- | --- |
| project_id | path | 是 | `integer(int64)` |  |

响应：

| 状态 | 说明 | Schema |
| --- | --- | --- |
| 200 | Response with json format data | `lark_exp.server.admin.ProjectNotificationDto` |
| 400 | 请求参数错误 | `lark_exp.server.error.ApiErrorResponse` |
| 401 | Bearer token 无效 | `lark_exp.server.error.ApiErrorResponse` |
| 404 | 记录不存在 | `lark_exp.server.error.ApiErrorResponse` |
| 409 | 记录冲突 | `lark_exp.server.error.ApiErrorResponse` |
| 500 | 服务内部错误 | `lark_exp.server.error.ApiErrorResponse` |
| 502 | 飞书上游接口不可用 | `lark_exp.server.error.ApiErrorResponse` |
| 503 | 服务尚未就绪 | `lark_exp.server.error.ApiErrorResponse` |

### PATCH /api/v1/admin/projects/{project_id}/notification

更新项目通知配置

- 鉴权：MUTATION_API_TOKEN
- Operation ID：`lark_exp.server.admin.update_project_notification`

参数：

| 名称 | 位置 | 必填 | 类型 | 说明 |
| --- | --- | --- | --- | --- |
| project_id | path | 是 | `integer(int64)` |  |

请求体：

- 必填 `application/json`：`lark_exp.server.admin.UpdateProjectNotificationRequest`

响应：

| 状态 | 说明 | Schema |
| --- | --- | --- |
| 200 | Response with json format data | `lark_exp.server.admin.ProjectNotificationDto` |
| 400 | 请求参数错误 | `lark_exp.server.error.ApiErrorResponse` |
| 401 | Bearer token 无效 | `lark_exp.server.error.ApiErrorResponse` |
| 404 | 记录不存在 | `lark_exp.server.error.ApiErrorResponse` |
| 409 | 记录冲突 | `lark_exp.server.error.ApiErrorResponse` |
| 500 | 服务内部错误 | `lark_exp.server.error.ApiErrorResponse` |
| 502 | 飞书上游接口不可用 | `lark_exp.server.error.ApiErrorResponse` |
| 503 | 服务尚未就绪 | `lark_exp.server.error.ApiErrorResponse` |

### GET /api/v1/admin/projects/{project_id}/periods

查询项目期次

- 鉴权：MUTATION_API_TOKEN
- Operation ID：`lark_exp.server.admin.list_project_periods`

参数：

| 名称 | 位置 | 必填 | 类型 | 说明 |
| --- | --- | --- | --- | --- |
| project_id | path | 是 | `integer(int64)` |  |
| include_inactive | query | 否 | `boolean` | 是否包含停用期次，默认 true。 |

响应：

| 状态 | 说明 | Schema |
| --- | --- | --- |
| 200 | Response with json format data | array<`lark_exp.server.admin.ActivityAdminDto`> |
| 400 | 请求参数错误 | `lark_exp.server.error.ApiErrorResponse` |
| 401 | Bearer token 无效 | `lark_exp.server.error.ApiErrorResponse` |
| 404 | 记录不存在 | `lark_exp.server.error.ApiErrorResponse` |
| 409 | 记录冲突 | `lark_exp.server.error.ApiErrorResponse` |
| 500 | 服务内部错误 | `lark_exp.server.error.ApiErrorResponse` |
| 502 | 飞书上游接口不可用 | `lark_exp.server.error.ApiErrorResponse` |
| 503 | 服务尚未就绪 | `lark_exp.server.error.ApiErrorResponse` |

### POST /api/v1/admin/projects/{project_id}/periods

新增项目期次

- 鉴权：MUTATION_API_TOKEN
- Operation ID：`lark_exp.server.admin.create_project_period`

参数：

| 名称 | 位置 | 必填 | 类型 | 说明 |
| --- | --- | --- | --- | --- |
| project_id | path | 是 | `integer(int64)` |  |

请求体：

- 必填 `application/json`：`lark_exp.server.admin.UpsertProjectPeriodRequest`

响应：

| 状态 | 说明 | Schema |
| --- | --- | --- |
| 200 | Response with json format data | `lark_exp.server.admin.ActivityDetailDto` |
| 400 | 请求参数错误 | `lark_exp.server.error.ApiErrorResponse` |
| 401 | Bearer token 无效 | `lark_exp.server.error.ApiErrorResponse` |
| 404 | 记录不存在 | `lark_exp.server.error.ApiErrorResponse` |
| 409 | 记录冲突 | `lark_exp.server.error.ApiErrorResponse` |
| 500 | 服务内部错误 | `lark_exp.server.error.ApiErrorResponse` |
| 502 | 飞书上游接口不可用 | `lark_exp.server.error.ApiErrorResponse` |
| 503 | 服务尚未就绪 | `lark_exp.server.error.ApiErrorResponse` |

### GET /api/v1/admin/projects/{project_id}/periods/{activity_period_id}

查询项目期次详情

- 鉴权：MUTATION_API_TOKEN
- Operation ID：`lark_exp.server.admin.get_project_period`

参数：

| 名称 | 位置 | 必填 | 类型 | 说明 |
| --- | --- | --- | --- | --- |
| project_id | path | 是 | `integer(int64)` |  |
| activity_period_id | path | 是 | `integer(int64)` |  |

响应：

| 状态 | 说明 | Schema |
| --- | --- | --- |
| 200 | Response with json format data | `lark_exp.server.admin.ActivityDetailDto` |
| 400 | 请求参数错误 | `lark_exp.server.error.ApiErrorResponse` |
| 401 | Bearer token 无效 | `lark_exp.server.error.ApiErrorResponse` |
| 404 | 记录不存在 | `lark_exp.server.error.ApiErrorResponse` |
| 409 | 记录冲突 | `lark_exp.server.error.ApiErrorResponse` |
| 500 | 服务内部错误 | `lark_exp.server.error.ApiErrorResponse` |
| 502 | 飞书上游接口不可用 | `lark_exp.server.error.ApiErrorResponse` |
| 503 | 服务尚未就绪 | `lark_exp.server.error.ApiErrorResponse` |

### PUT /api/v1/admin/projects/{project_id}/periods/{activity_period_id}

完整替换项目期次

- 鉴权：MUTATION_API_TOKEN
- Operation ID：`lark_exp.server.admin.replace_project_period`

参数：

| 名称 | 位置 | 必填 | 类型 | 说明 |
| --- | --- | --- | --- | --- |
| project_id | path | 是 | `integer(int64)` |  |
| activity_period_id | path | 是 | `integer(int64)` |  |

请求体：

- 必填 `application/json`：`lark_exp.server.admin.UpsertProjectPeriodRequest`

响应：

| 状态 | 说明 | Schema |
| --- | --- | --- |
| 200 | Response with json format data | `lark_exp.server.admin.ActivityDetailDto` |
| 400 | 请求参数错误 | `lark_exp.server.error.ApiErrorResponse` |
| 401 | Bearer token 无效 | `lark_exp.server.error.ApiErrorResponse` |
| 404 | 记录不存在 | `lark_exp.server.error.ApiErrorResponse` |
| 409 | 记录冲突 | `lark_exp.server.error.ApiErrorResponse` |
| 500 | 服务内部错误 | `lark_exp.server.error.ApiErrorResponse` |
| 502 | 飞书上游接口不可用 | `lark_exp.server.error.ApiErrorResponse` |
| 503 | 服务尚未就绪 | `lark_exp.server.error.ApiErrorResponse` |

### PATCH /api/v1/admin/projects/{project_id}/periods/{activity_period_id}/status

更新项目期次状态

- 鉴权：MUTATION_API_TOKEN
- Operation ID：`lark_exp.server.admin.update_project_period_status`

参数：

| 名称 | 位置 | 必填 | 类型 | 说明 |
| --- | --- | --- | --- | --- |
| project_id | path | 是 | `integer(int64)` |  |
| activity_period_id | path | 是 | `integer(int64)` |  |

请求体：

- 必填 `application/json`：`lark_exp.server.admin.UpdateActivityStatusRequest`

响应：

| 状态 | 说明 | Schema |
| --- | --- | --- |
| 200 | Response with json format data | `lark_exp.server.admin.ActivityAdminDto` |
| 400 | 请求参数错误 | `lark_exp.server.error.ApiErrorResponse` |
| 401 | Bearer token 无效 | `lark_exp.server.error.ApiErrorResponse` |
| 404 | 记录不存在 | `lark_exp.server.error.ApiErrorResponse` |
| 409 | 记录冲突 | `lark_exp.server.error.ApiErrorResponse` |
| 500 | 服务内部错误 | `lark_exp.server.error.ApiErrorResponse` |
| 502 | 飞书上游接口不可用 | `lark_exp.server.error.ApiErrorResponse` |
| 503 | 服务尚未就绪 | `lark_exp.server.error.ApiErrorResponse` |

### GET /api/v1/admin/quarantine

查询数据异常隔离区

- 鉴权：MUTATION_API_TOKEN
- Operation ID：`lark_exp.server.admin.list_quarantine`

参数：

| 名称 | 位置 | 必填 | 类型 | 说明 |
| --- | --- | --- | --- | --- |
| limit | query | 否 | `integer(int64)` |  |
| offset | query | 否 | `integer(int64)` |  |

响应：

| 状态 | 说明 | Schema |
| --- | --- | --- |
| 200 | Response with json format data | array<`lark_exp.server.admin.QuarantineDto`> |
| 400 | 请求参数错误 | `lark_exp.server.error.ApiErrorResponse` |
| 401 | Bearer token 无效 | `lark_exp.server.error.ApiErrorResponse` |
| 404 | 记录不存在 | `lark_exp.server.error.ApiErrorResponse` |
| 409 | 记录冲突 | `lark_exp.server.error.ApiErrorResponse` |
| 500 | 服务内部错误 | `lark_exp.server.error.ApiErrorResponse` |
| 502 | 飞书上游接口不可用 | `lark_exp.server.error.ApiErrorResponse` |
| 503 | 服务尚未就绪 | `lark_exp.server.error.ApiErrorResponse` |

### GET /api/v1/admin/status

查询系统业务健康度

- 鉴权：MUTATION_API_TOKEN
- Operation ID：`lark_exp.server.admin.system_status`

响应：

| 状态 | 说明 | Schema |
| --- | --- | --- |
| 200 | Response with json format data | `lark_exp.server.admin.SystemStatusDto` |
| 400 | 请求参数错误 | `lark_exp.server.error.ApiErrorResponse` |
| 401 | Bearer token 无效 | `lark_exp.server.error.ApiErrorResponse` |
| 404 | 记录不存在 | `lark_exp.server.error.ApiErrorResponse` |
| 409 | 记录冲突 | `lark_exp.server.error.ApiErrorResponse` |
| 500 | 服务内部错误 | `lark_exp.server.error.ApiErrorResponse` |
| 502 | 飞书上游接口不可用 | `lark_exp.server.error.ApiErrorResponse` |
| 503 | 服务尚未就绪 | `lark_exp.server.error.ApiErrorResponse` |

### GET /api/v1/admin/workflow-runs

查询工作流运行历史

- 鉴权：MUTATION_API_TOKEN
- Operation ID：`lark_exp.server.admin.list_workflow_runs`

参数：

| 名称 | 位置 | 必填 | 类型 | 说明 |
| --- | --- | --- | --- | --- |
| limit | query | 否 | `integer(int64)` |  |
| offset | query | 否 | `integer(int64)` |  |

响应：

| 状态 | 说明 | Schema |
| --- | --- | --- |
| 200 | Response with json format data | array<`lark_exp.workflow_run.WorkflowRunRecord`> |
| 400 | 请求参数错误 | `lark_exp.server.error.ApiErrorResponse` |
| 401 | Bearer token 无效 | `lark_exp.server.error.ApiErrorResponse` |
| 404 | 记录不存在 | `lark_exp.server.error.ApiErrorResponse` |
| 409 | 记录冲突 | `lark_exp.server.error.ApiErrorResponse` |
| 500 | 服务内部错误 | `lark_exp.server.error.ApiErrorResponse` |
| 502 | 飞书上游接口不可用 | `lark_exp.server.error.ApiErrorResponse` |
| 503 | 服务尚未就绪 | `lark_exp.server.error.ApiErrorResponse` |

### GET /api/v1/admin/workflow-runs/{workflow_run_id}/steps

查询工作流阶段历史

- 鉴权：MUTATION_API_TOKEN
- Operation ID：`lark_exp.server.admin.list_workflow_steps`

参数：

| 名称 | 位置 | 必填 | 类型 | 说明 |
| --- | --- | --- | --- | --- |
| workflow_run_id | path | 是 | `integer(int64)` |  |

响应：

| 状态 | 说明 | Schema |
| --- | --- | --- |
| 200 | Response with json format data | array<`lark_exp.workflow_run.WorkflowStepRecord`> |
| 400 | 请求参数错误 | `lark_exp.server.error.ApiErrorResponse` |
| 401 | Bearer token 无效 | `lark_exp.server.error.ApiErrorResponse` |
| 404 | 记录不存在 | `lark_exp.server.error.ApiErrorResponse` |
| 409 | 记录冲突 | `lark_exp.server.error.ApiErrorResponse` |
| 500 | 服务内部错误 | `lark_exp.server.error.ApiErrorResponse` |
| 502 | 飞书上游接口不可用 | `lark_exp.server.error.ApiErrorResponse` |
| 503 | 服务尚未就绪 | `lark_exp.server.error.ApiErrorResponse` |

### GET /api/v1/admin/xingtu/session-upload-token

获取星图同步插件上传 Token

- 鉴权：MUTATION_API_TOKEN
- Operation ID：`lark_exp.server.admin.get_xingtu_session_upload_token`
- 说明：通过 MUTATION_API_TOKEN 鉴权返回 XINGTU_SESSION_UPLOAD_TOKEN，供内部前端按星图账号 ID 生成同步插件包。该 Token 仅用于上传登录态，不是数据库登录态加密密钥。

响应：

| 状态 | 说明 | Schema |
| --- | --- | --- |
| 200 | Response with json format data | `lark_exp.server.admin.XingtuExtensionConfigDto` |
| 400 | 请求参数错误 | `lark_exp.server.error.ApiErrorResponse` |
| 401 | Bearer token 无效 | `lark_exp.server.error.ApiErrorResponse` |
| 404 | 记录不存在 | `lark_exp.server.error.ApiErrorResponse` |
| 409 | 记录冲突 | `lark_exp.server.error.ApiErrorResponse` |
| 500 | 服务内部错误 | `lark_exp.server.error.ApiErrorResponse` |
| 502 | 飞书上游接口不可用 | `lark_exp.server.error.ApiErrorResponse` |
| 503 | 服务尚未就绪 | `lark_exp.server.error.ApiErrorResponse` |

## analytics

### GET /api/v1/queries/lives/summary

查询直播观看/ACU/场次/主播汇总

- 鉴权：无
- Operation ID：`lark_exp.server.api.live_summary`

参数：

| 名称 | 位置 | 必填 | 类型 | 说明 |
| --- | --- | --- | --- | --- |
| content_config_id | query | 否 | `integer(int64)` | 内容配置 ID；用于限定某一期活动的直播配置。 |
| anchor_uid | query | 否 | `string` | 主播 uid，精确匹配。 |
| anchor_name | query | 否 | `string` | 主播名称，模糊匹配。 |
| date | query | 否 | `string(date)` | 指定单日；传入后优先于 date_from/date_to。 |
| date_from | query | 否 | `string(date)` | 日期区间开始，闭区间。 |
| date_to | query | 否 | `string(date)` | 日期区间结束，闭区间。 |

响应：

| 状态 | 说明 | Schema |
| --- | --- | --- |
| 200 | Response with json format data | `lark_exp.server.query.LiveSummaryDto` |
| 400 | 请求参数错误 | `lark_exp.server.error.ApiErrorResponse` |
| 401 | Bearer token 无效 | `lark_exp.server.error.ApiErrorResponse` |
| 404 | 记录不存在 | `lark_exp.server.error.ApiErrorResponse` |
| 409 | 记录冲突 | `lark_exp.server.error.ApiErrorResponse` |
| 500 | 服务内部错误 | `lark_exp.server.error.ApiErrorResponse` |
| 502 | 飞书上游接口不可用 | `lark_exp.server.error.ApiErrorResponse` |
| 503 | 服务尚未就绪 | `lark_exp.server.error.ApiErrorResponse` |

### GET /api/v1/queries/v2/videos/label-summary

按审核标签汇总视频周报数据

- 鉴权：无
- Operation ID：`lark_exp.server.api.video_label_summary`

参数：

| 名称 | 位置 | 必填 | 类型 | 说明 |
| --- | --- | --- | --- | --- |
| activity_period_id | query | 否 | `integer(int64)` | 活动期次 ID。 |
| content_config_id | query | 否 | `integer(int64)` | 视频内容配置 ID。 |
| status | query | 否 | `string` | 审核结果，精确匹配。 |
| label | query | 否 | `string` | 只返回指定审核标签，忽略大小写精确匹配。 |
| date_from | query | 是 | `string(date)` | 北京时间开始日期，必填，从当天 00:00:00 起算。 |
| date_to | query | 是 | `string(date)` | 北京时间结束日期，必填，包含当天 23:59:59 及其小数秒。 |

响应：

| 状态 | 说明 | Schema |
| --- | --- | --- |
| 200 | Response with json format data | `lark_exp.server.query.VideoLabelSummaryResponse` |
| 400 | 请求参数错误 | `lark_exp.server.error.ApiErrorResponse` |
| 401 | Bearer token 无效 | `lark_exp.server.error.ApiErrorResponse` |
| 404 | 记录不存在 | `lark_exp.server.error.ApiErrorResponse` |
| 409 | 记录冲突 | `lark_exp.server.error.ApiErrorResponse` |
| 500 | 服务内部错误 | `lark_exp.server.error.ApiErrorResponse` |
| 502 | 飞书上游接口不可用 | `lark_exp.server.error.ApiErrorResponse` |
| 503 | 服务尚未就绪 | `lark_exp.server.error.ApiErrorResponse` |

### GET /api/v1/queries/videos/summary

查询视频播放/互动/稿件/作者汇总

- 鉴权：无
- Operation ID：`lark_exp.server.api.video_summary`

参数：

| 名称 | 位置 | 必填 | 类型 | 说明 |
| --- | --- | --- | --- | --- |
| content_config_id | query | 否 | `integer(int64)` | 内容配置 ID；用于限定某一期活动的直播/视频配置。 |
| video_id | query | 否 | `string` | 视频 ID。 |
| author_uid | query | 否 | `string` | 作者 uid，精确匹配。 |
| author_name | query | 否 | `string` | 作者名称，模糊匹配。 |
| label | query | 否 | `string` | 审核标签，忽略大小写精确匹配。 |
| date | query | 否 | `string(date)` | 指定单日；传入后优先于 date_from/date_to。 |
| date_from | query | 否 | `string(date)` | 日期区间开始，闭区间。 |
| date_to | query | 否 | `string(date)` | 日期区间结束，闭区间。 |
| limit | query | 否 | `integer(int64)` | 返回视频条数，服务端限制为 1..500。 |
| offset | query | 否 | `integer(int64)` | 视频分页偏移量。 |

响应：

| 状态 | 说明 | Schema |
| --- | --- | --- |
| 200 | Response with json format data | `lark_exp.server.query.VideoSummaryDto` |
| 400 | 请求参数错误 | `lark_exp.server.error.ApiErrorResponse` |
| 401 | Bearer token 无效 | `lark_exp.server.error.ApiErrorResponse` |
| 404 | 记录不存在 | `lark_exp.server.error.ApiErrorResponse` |
| 409 | 记录冲突 | `lark_exp.server.error.ApiErrorResponse` |
| 500 | 服务内部错误 | `lark_exp.server.error.ApiErrorResponse` |
| 502 | 飞书上游接口不可用 | `lark_exp.server.error.ApiErrorResponse` |
| 503 | 服务尚未就绪 | `lark_exp.server.error.ApiErrorResponse` |

### GET /api/v1/queries/videos/top-growth

查询播放量增长最快的视频

- 鉴权：无
- Operation ID：`lark_exp.server.api.top_video_growth`

参数：

| 名称 | 位置 | 必填 | 类型 | 说明 |
| --- | --- | --- | --- | --- |
| content_config_id | query | 否 | `integer(int64)` | 内容配置 ID；用于限定某一期活动的视频配置。 |
| author_uid | query | 否 | `string` | 作者 uid，精确匹配。 |
| author_name | query | 否 | `string` | 作者名称，模糊匹配。 |
| label | query | 否 | `string` | 审核标签，忽略大小写精确匹配。 |
| date | query | 否 | `string(date)` | 指定单日；传入后优先于 date_from/date_to。 |
| date_from | query | 否 | `string(date)` | 日期区间开始，闭区间。 |
| date_to | query | 否 | `string(date)` | 日期区间结束，闭区间。 |
| limit | query | 否 | `integer(int64)` | 返回榜单条数，服务端限制为 1..100。 |

响应：

| 状态 | 说明 | Schema |
| --- | --- | --- |
| 200 | Response with json format data | array<`lark_exp.server.query.VideoGrowthDto`> |
| 400 | 请求参数错误 | `lark_exp.server.error.ApiErrorResponse` |
| 401 | Bearer token 无效 | `lark_exp.server.error.ApiErrorResponse` |
| 404 | 记录不存在 | `lark_exp.server.error.ApiErrorResponse` |
| 409 | 记录冲突 | `lark_exp.server.error.ApiErrorResponse` |
| 500 | 服务内部错误 | `lark_exp.server.error.ApiErrorResponse` |
| 502 | 飞书上游接口不可用 | `lark_exp.server.error.ApiErrorResponse` |
| 503 | 服务尚未就绪 | `lark_exp.server.error.ApiErrorResponse` |

### GET /api/v1/queries/videos/with-metrics

查询视频基础信息和线性每日指标

- 鉴权：无
- Operation ID：`lark_exp.server.api.list_videos_with_metrics`

参数：

| 名称 | 位置 | 必填 | 类型 | 说明 |
| --- | --- | --- | --- | --- |
| content_config_id | query | 否 | `integer(int64)` | 内容配置 ID；用于限定某一期活动的直播/视频配置。 |
| video_id | query | 否 | `string` | 视频 ID。 |
| author_uid | query | 否 | `string` | 作者 uid，精确匹配。 |
| author_name | query | 否 | `string` | 作者名称，模糊匹配。 |
| label | query | 否 | `string` | 审核标签，忽略大小写精确匹配。 |
| date | query | 否 | `string(date)` | 指定单日；传入后优先于 date_from/date_to。 |
| date_from | query | 否 | `string(date)` | 日期区间开始，闭区间。 |
| date_to | query | 否 | `string(date)` | 日期区间结束，闭区间。 |
| limit | query | 否 | `integer(int64)` | 返回视频条数，服务端限制为 1..500。 |
| offset | query | 否 | `integer(int64)` | 视频分页偏移量。 |

响应：

| 状态 | 说明 | Schema |
| --- | --- | --- |
| 200 | Response with json format data | array<`lark_exp.server.query.VideoWithMetricsDto`> |
| 400 | 请求参数错误 | `lark_exp.server.error.ApiErrorResponse` |
| 401 | Bearer token 无效 | `lark_exp.server.error.ApiErrorResponse` |
| 404 | 记录不存在 | `lark_exp.server.error.ApiErrorResponse` |
| 409 | 记录冲突 | `lark_exp.server.error.ApiErrorResponse` |
| 500 | 服务内部错误 | `lark_exp.server.error.ApiErrorResponse` |
| 502 | 飞书上游接口不可用 | `lark_exp.server.error.ApiErrorResponse` |
| 503 | 服务尚未就绪 | `lark_exp.server.error.ApiErrorResponse` |

## audit-extra

### POST /api/v1/queries/v2/audit-extra/live-pv/weighted-acu-below

汇总加权平均 ACU 低于门槛用户的直播 PV

- 鉴权：无
- Operation ID：`lark_exp.server.api.audit_extra_live_pv_below_weighted_acu`
- 说明：只读且幂等的 POST 聚合接口。服务端先在指定主项目和活动期次内应用可选 conditions（audit_extra 多条件 AND 精确匹配）及 audit_result，再按非空 anchor_uid 聚合。每个 UID 的加权平均 ACU = Σ(acu × live_duration_seconds) / Σ(live_duration_seconds)，只有同时具备 ACU 且 live_duration_seconds > 0 的场次参与分子和分母；完全没有有效 ACU/时长的 UID 不参与门槛判断。随后选出 weighted_average_acu 严格小于 weighted_average_acu_lt 的 UID，并汇总这些 UID 在同一筛选范围内全部场次的 live_exposure_pv；选中 UID 的其他缺少 ACU/有效时长场次仍计入场次数和 PV。空 anchor_uid 不参与聚合。conditions 可省略或传空对象，表示查询整期；示例：{"project_id":1,"activity_period_id":2,"conditions":{"rok_key":"ROK"},"audit_result":"审核通过","weighted_average_acu_lt":10}。顶层机密条件 key 可以筛选，但不回显且不会进入缓存键。业务直播 PV 只使用 live_exposure_pv。

请求体：

- 必填 `application/json`：`lark_exp.server.audit_extra_query.WeightedAcuLivePvRequest`

响应：

| 状态 | 说明 | Schema |
| --- | --- | --- |
| 200 | Response with json format data | `lark_exp.server.audit_extra_query.WeightedAcuLivePvResponse` |
| 400 | 请求参数错误 | `lark_exp.server.error.ApiErrorResponse` |
| 401 | Bearer token 无效 | `lark_exp.server.error.ApiErrorResponse` |
| 404 | 记录不存在 | `lark_exp.server.error.ApiErrorResponse` |
| 409 | 记录冲突 | `lark_exp.server.error.ApiErrorResponse` |
| 500 | 服务内部错误 | `lark_exp.server.error.ApiErrorResponse` |
| 502 | 飞书上游接口不可用 | `lark_exp.server.error.ApiErrorResponse` |
| 503 | 服务尚未就绪 | `lark_exp.server.error.ApiErrorResponse` |

### POST /api/v1/queries/v2/audit-extra/search

按 audit_extra 精确查询视频、直播及最新汇总

- 鉴权：无
- Operation ID：`lark_exp.server.api.search_audit_extra`
- 说明：只读且幂等的 POST 查询接口。project_id 与 activity_period_id 都必填，服务端会校验期次确实属于该主项目；历史期次也可查询。conditions 是 audit_extra 键值对象，至少一项、最多 20 项，多个条件使用 AND；键名和值均区分大小写，值按 JSON 业务类型精确比较，所以数字 1、字符串 "1" 和布尔值 true 不相等，JSON null 也不会匹配缺少该键的记录。飞书历史 `{type,value}` 传输包装会先还原为字符串、数字或布尔业务值再比较；调用方只需传业务值，不要传富文本包装。对象要求完整相等，数组要求元素和顺序完全相等。示例：{"project_id":1,"activity_period_id":2,"conditions":{"rok_key":"ROK","key":"<保密值>"},"audit_result":"审核通过","limit":100,"offset":0}。响应同时返回视频最新 video_daily_metric、直播当前最新行和不受分页影响的汇总；total_play_count 是每个命中视频最新快照的播放量之和，total_live_exposure_pv 只统计 live_exposure_pv。视频和直播分别使用相同的 limit/offset 分页。audit_extra 顶层字段名 key 是机密扩展项：允许作为筛选条件，但绝不会出现在 filters、视频或直播响应中，含该条件的请求也不会写入查询缓存。

请求体：

- 必填 `application/json`：`lark_exp.server.audit_extra_query.AuditExtraSearchRequest`

响应：

| 状态 | 说明 | Schema |
| --- | --- | --- |
| 200 | Response with json format data | `lark_exp.server.audit_extra_query.AuditExtraSearchResponse` |
| 400 | 请求参数错误 | `lark_exp.server.error.ApiErrorResponse` |
| 401 | Bearer token 无效 | `lark_exp.server.error.ApiErrorResponse` |
| 404 | 记录不存在 | `lark_exp.server.error.ApiErrorResponse` |
| 409 | 记录冲突 | `lark_exp.server.error.ApiErrorResponse` |
| 500 | 服务内部错误 | `lark_exp.server.error.ApiErrorResponse` |
| 502 | 飞书上游接口不可用 | `lark_exp.server.error.ApiErrorResponse` |
| 503 | 服务尚未就绪 | `lark_exp.server.error.ApiErrorResponse` |

### POST /api/v1/queries/v2/audit-extra/video-play/author-total-below

汇总视频总播放低于门槛用户的播放量

- 鉴权：无
- Operation ID：`lark_exp.server.api.audit_extra_video_play_below_author_total`
- 说明：只读且幂等的 POST 聚合接口。服务端先在指定主项目和活动期次内应用可选 conditions（audit_extra 多条件 AND 精确匹配）及 audit_result，再按非空 author_uid 聚合。每条视频只取 stat_date 最新、同日 imported_at 最新的一条 video_daily_metric，play_count 缺失或为空按 0；每个 UID 的 author_total_play_count 是这些视频最新播放量之和。随后选出 author_total_play_count 严格小于 author_total_play_count_lt 的 UID，并返回这些 UID 的视频数量、已有指标视频数量及总播放量。没有指标但具有 author_uid 的视频按 0 参与，因此在正数门槛下对应 UID 可能被选中。空 author_uid 不参与聚合。conditions 可省略或传空对象，表示查询整期；示例：{"project_id":1,"activity_period_id":2,"conditions":{"rok_key":"ROK"},"audit_result":"审核通过","author_total_play_count_lt":100000}。顶层机密条件 key 可以筛选，但不回显且不会进入缓存键。

请求体：

- 必填 `application/json`：`lark_exp.server.audit_extra_query.AuthorPlayVideoTotalRequest`

响应：

| 状态 | 说明 | Schema |
| --- | --- | --- |
| 200 | Response with json format data | `lark_exp.server.audit_extra_query.AuthorPlayVideoTotalResponse` |
| 400 | 请求参数错误 | `lark_exp.server.error.ApiErrorResponse` |
| 401 | Bearer token 无效 | `lark_exp.server.error.ApiErrorResponse` |
| 404 | 记录不存在 | `lark_exp.server.error.ApiErrorResponse` |
| 409 | 记录冲突 | `lark_exp.server.error.ApiErrorResponse` |
| 500 | 服务内部错误 | `lark_exp.server.error.ApiErrorResponse` |
| 502 | 飞书上游接口不可用 | `lark_exp.server.error.ApiErrorResponse` |
| 503 | 服务尚未就绪 | `lark_exp.server.error.ApiErrorResponse` |

## health

### GET /health

健康检查

- 鉴权：无
- Operation ID：`lark_exp.server.api.health.health`

响应：

| 状态 | 说明 | Schema |
| --- | --- | --- |
| 200 | Response with json format data | `lark_exp.server.api.HealthResponse` |
| 400 | 请求参数错误 | `lark_exp.server.error.ApiErrorResponse` |
| 401 | Bearer token 无效 | `lark_exp.server.error.ApiErrorResponse` |
| 404 | 记录不存在 | `lark_exp.server.error.ApiErrorResponse` |
| 409 | 记录冲突 | `lark_exp.server.error.ApiErrorResponse` |
| 500 | 服务内部错误 | `lark_exp.server.error.ApiErrorResponse` |
| 502 | 飞书上游接口不可用 | `lark_exp.server.error.ApiErrorResponse` |
| 503 | 服务尚未就绪 | `lark_exp.server.error.ApiErrorResponse` |

### GET /live

进程存活检查

- 鉴权：无
- Operation ID：`lark_exp.server.api.health.live`

响应：

| 状态 | 说明 | Schema |
| --- | --- | --- |
| 200 | Response with json format data | `lark_exp.server.api.LiveResponse` |

### GET /ready

服务就绪检查

- 鉴权：无
- Operation ID：`lark_exp.server.api.health.ready`

响应：

| 状态 | 说明 | Schema |
| --- | --- | --- |
| 200 | Response with json format data | `lark_exp.server.api.ReadyResponse` |
| 400 | 请求参数错误 | `lark_exp.server.error.ApiErrorResponse` |
| 401 | Bearer token 无效 | `lark_exp.server.error.ApiErrorResponse` |
| 404 | 记录不存在 | `lark_exp.server.error.ApiErrorResponse` |
| 409 | 记录冲突 | `lark_exp.server.error.ApiErrorResponse` |
| 500 | 服务内部错误 | `lark_exp.server.error.ApiErrorResponse` |
| 502 | 飞书上游接口不可用 | `lark_exp.server.error.ApiErrorResponse` |
| 503 | 服务尚未就绪 | `lark_exp.server.error.ApiErrorResponse` |

## projects

### POST /api/v1/projects/{activity_period_id}/report/send

发送项目数据汇报卡片

- 鉴权：MUTATION_API_TOKEN
- Operation ID：`lark_exp.server.api.send_project_report`

参数：

| 名称 | 位置 | 必填 | 类型 | 说明 |
| --- | --- | --- | --- | --- |
| activity_period_id | path | 是 | `integer(int64)` | 活动期次内部 ID。 |

请求体：

- 必填 `application/json`：`lark_exp.server.api.SendProjectReportRequest`

响应：

| 状态 | 说明 | Schema |
| --- | --- | --- |
| 200 | Response with json format data | `lark_exp.server.api.ProjectReportResponse` |
| 400 | 请求参数错误 | `lark_exp.server.error.ApiErrorResponse` |
| 401 | Bearer token 无效 | `lark_exp.server.error.ApiErrorResponse` |
| 404 | 记录不存在 | `lark_exp.server.error.ApiErrorResponse` |
| 409 | 记录冲突 | `lark_exp.server.error.ApiErrorResponse` |
| 500 | 服务内部错误 | `lark_exp.server.error.ApiErrorResponse` |
| 502 | 飞书上游接口不可用 | `lark_exp.server.error.ApiErrorResponse` |
| 503 | 服务尚未就绪 | `lark_exp.server.error.ApiErrorResponse` |

## queries

### GET /api/v1/queries/contents

查询活动直播/视频内容配置

- 鉴权：无
- Operation ID：`lark_exp.server.api.list_contents`

响应：

| 状态 | 说明 | Schema |
| --- | --- | --- |
| 200 | Response with json format data | array<`lark_exp.server.query.ContentConfigDto`> |
| 400 | 请求参数错误 | `lark_exp.server.error.ApiErrorResponse` |
| 401 | Bearer token 无效 | `lark_exp.server.error.ApiErrorResponse` |
| 404 | 记录不存在 | `lark_exp.server.error.ApiErrorResponse` |
| 409 | 记录冲突 | `lark_exp.server.error.ApiErrorResponse` |
| 500 | 服务内部错误 | `lark_exp.server.error.ApiErrorResponse` |
| 502 | 飞书上游接口不可用 | `lark_exp.server.error.ApiErrorResponse` |
| 503 | 服务尚未就绪 | `lark_exp.server.error.ApiErrorResponse` |

### GET /api/v1/queries/feishu-sources

查询星图导出的飞书 Sheet 来源

- 鉴权：无
- Operation ID：`lark_exp.server.api.list_feishu_sources`

参数：

| 名称 | 位置 | 必填 | 类型 | 说明 |
| --- | --- | --- | --- | --- |
| limit | query | 否 | `integer(int64)` | 返回条数，服务端限制为 1..500。 |
| offset | query | 否 | `integer(int64)` | 偏移量，小于 0 时按 0 处理。 |

响应：

| 状态 | 说明 | Schema |
| --- | --- | --- |
| 200 | Response with json format data | array<`lark_exp.server.query.FeishuSourceDto`> |
| 400 | 请求参数错误 | `lark_exp.server.error.ApiErrorResponse` |
| 401 | Bearer token 无效 | `lark_exp.server.error.ApiErrorResponse` |
| 404 | 记录不存在 | `lark_exp.server.error.ApiErrorResponse` |
| 409 | 记录冲突 | `lark_exp.server.error.ApiErrorResponse` |
| 500 | 服务内部错误 | `lark_exp.server.error.ApiErrorResponse` |
| 502 | 飞书上游接口不可用 | `lark_exp.server.error.ApiErrorResponse` |
| 503 | 服务尚未就绪 | `lark_exp.server.error.ApiErrorResponse` |

### GET /api/v1/queries/live-sessions

查询直播场次最新数据

- 鉴权：无
- Operation ID：`lark_exp.server.api.list_live_sessions`

参数：

| 名称 | 位置 | 必填 | 类型 | 说明 |
| --- | --- | --- | --- | --- |
| limit | query | 否 | `integer(int64)` | 返回条数，服务端限制为 1..500。 |
| offset | query | 否 | `integer(int64)` | 偏移量，小于 0 时按 0 处理。 |

响应：

| 状态 | 说明 | Schema |
| --- | --- | --- |
| 200 | Response with json format data | array<`lark_exp.server.query.LiveSessionDto`> |
| 400 | 请求参数错误 | `lark_exp.server.error.ApiErrorResponse` |
| 401 | Bearer token 无效 | `lark_exp.server.error.ApiErrorResponse` |
| 404 | 记录不存在 | `lark_exp.server.error.ApiErrorResponse` |
| 409 | 记录冲突 | `lark_exp.server.error.ApiErrorResponse` |
| 500 | 服务内部错误 | `lark_exp.server.error.ApiErrorResponse` |
| 502 | 飞书上游接口不可用 | `lark_exp.server.error.ApiErrorResponse` |
| 503 | 服务尚未就绪 | `lark_exp.server.error.ApiErrorResponse` |

### GET /api/v1/queries/pending-summary

查询飞书来源待导入/失败数量

- 鉴权：无
- Operation ID：`lark_exp.server.api.pending_summary`

响应：

| 状态 | 说明 | Schema |
| --- | --- | --- |
| 200 | Response with json format data | `lark_exp.server.query.PendingSummaryDto` |
| 400 | 请求参数错误 | `lark_exp.server.error.ApiErrorResponse` |
| 401 | Bearer token 无效 | `lark_exp.server.error.ApiErrorResponse` |
| 404 | 记录不存在 | `lark_exp.server.error.ApiErrorResponse` |
| 409 | 记录冲突 | `lark_exp.server.error.ApiErrorResponse` |
| 500 | 服务内部错误 | `lark_exp.server.error.ApiErrorResponse` |
| 502 | 飞书上游接口不可用 | `lark_exp.server.error.ApiErrorResponse` |
| 503 | 服务尚未就绪 | `lark_exp.server.error.ApiErrorResponse` |

### GET /api/v1/queries/periods

查询启用中的活动期次配置

- 鉴权：无
- Operation ID：`lark_exp.server.api.list_periods`

响应：

| 状态 | 说明 | Schema |
| --- | --- | --- |
| 200 | Response with json format data | array<`lark_exp.server.query.ActivityPeriodDto`> |
| 400 | 请求参数错误 | `lark_exp.server.error.ApiErrorResponse` |
| 401 | Bearer token 无效 | `lark_exp.server.error.ApiErrorResponse` |
| 404 | 记录不存在 | `lark_exp.server.error.ApiErrorResponse` |
| 409 | 记录冲突 | `lark_exp.server.error.ApiErrorResponse` |
| 500 | 服务内部错误 | `lark_exp.server.error.ApiErrorResponse` |
| 502 | 飞书上游接口不可用 | `lark_exp.server.error.ApiErrorResponse` |
| 503 | 服务尚未就绪 | `lark_exp.server.error.ApiErrorResponse` |

### GET /api/v1/queries/projects

查询全部当前项目

- 鉴权：无
- Operation ID：`lark_exp.server.api.list_current_projects`

响应：

| 状态 | 说明 | Schema |
| --- | --- | --- |
| 200 | Response with json format data | array<`lark_exp.server.query.CurrentProjectDto`> |
| 400 | 请求参数错误 | `lark_exp.server.error.ApiErrorResponse` |
| 401 | Bearer token 无效 | `lark_exp.server.error.ApiErrorResponse` |
| 404 | 记录不存在 | `lark_exp.server.error.ApiErrorResponse` |
| 409 | 记录冲突 | `lark_exp.server.error.ApiErrorResponse` |
| 500 | 服务内部错误 | `lark_exp.server.error.ApiErrorResponse` |
| 502 | 飞书上游接口不可用 | `lark_exp.server.error.ApiErrorResponse` |
| 503 | 服务尚未就绪 | `lark_exp.server.error.ApiErrorResponse` |

### GET /api/v1/queries/v2/feishu-sources

统一分页查询飞书来源

- 鉴权：无
- Operation ID：`lark_exp.server.api.list_feishu_sources_v2`

参数：

| 名称 | 位置 | 必填 | 类型 | 说明 |
| --- | --- | --- | --- | --- |
| activity_period_id | query | 否 | `integer(int64)` |  |
| content_config_id | query | 否 | `integer(int64)` |  |
| status | query | 否 | `string` |  |
| label | query | 否 | `string` | 审核标签，忽略大小写精确匹配；`search` 仍支持对标签做模糊搜索。 |
| date_from | query | 否 | `string(date)` | 北京时间业务日期开始；视频/直播按当天 00:00:00 起算。 |
| date_to | query | 否 | `string(date)` | 北京时间业务日期结束；包含当天 23:59:59 及其小数秒。 |
| search | query | 否 | `string` |  |
| limit | query | 否 | `integer(int64)` |  |
| offset | query | 否 | `integer(int64)` |  |
| cursor | query | 否 | `string` | 新接口游标；存在时优先于 offset。 |

响应：

| 状态 | 说明 | Schema |
| --- | --- | --- |
| 200 | Response with json format data | `lark_exp.server.query.PagedResponse<lark_exp.server.query.FeishuSourceDto>` |
| 400 | 请求参数错误 | `lark_exp.server.error.ApiErrorResponse` |
| 401 | Bearer token 无效 | `lark_exp.server.error.ApiErrorResponse` |
| 404 | 记录不存在 | `lark_exp.server.error.ApiErrorResponse` |
| 409 | 记录冲突 | `lark_exp.server.error.ApiErrorResponse` |
| 500 | 服务内部错误 | `lark_exp.server.error.ApiErrorResponse` |
| 502 | 飞书上游接口不可用 | `lark_exp.server.error.ApiErrorResponse` |
| 503 | 服务尚未就绪 | `lark_exp.server.error.ApiErrorResponse` |

### GET /api/v1/queries/v2/live-sessions

统一分页查询直播内容

- 鉴权：无
- Operation ID：`lark_exp.server.api.list_live_sessions_v2`

参数：

| 名称 | 位置 | 必填 | 类型 | 说明 |
| --- | --- | --- | --- | --- |
| activity_period_id | query | 否 | `integer(int64)` |  |
| content_config_id | query | 否 | `integer(int64)` |  |
| status | query | 否 | `string` |  |
| label | query | 否 | `string` | 审核标签，忽略大小写精确匹配；`search` 仍支持对标签做模糊搜索。 |
| date_from | query | 否 | `string(date)` | 北京时间业务日期开始；视频/直播按当天 00:00:00 起算。 |
| date_to | query | 否 | `string(date)` | 北京时间业务日期结束；包含当天 23:59:59 及其小数秒。 |
| search | query | 否 | `string` |  |
| limit | query | 否 | `integer(int64)` |  |
| offset | query | 否 | `integer(int64)` |  |
| cursor | query | 否 | `string` | 新接口游标；存在时优先于 offset。 |

响应：

| 状态 | 说明 | Schema |
| --- | --- | --- |
| 200 | Response with json format data | `lark_exp.server.query.PagedResponse<lark_exp.server.query.LiveSessionDto>` |
| 400 | 请求参数错误 | `lark_exp.server.error.ApiErrorResponse` |
| 401 | Bearer token 无效 | `lark_exp.server.error.ApiErrorResponse` |
| 404 | 记录不存在 | `lark_exp.server.error.ApiErrorResponse` |
| 409 | 记录冲突 | `lark_exp.server.error.ApiErrorResponse` |
| 500 | 服务内部错误 | `lark_exp.server.error.ApiErrorResponse` |
| 502 | 飞书上游接口不可用 | `lark_exp.server.error.ApiErrorResponse` |
| 503 | 服务尚未就绪 | `lark_exp.server.error.ApiErrorResponse` |

### GET /api/v1/queries/v2/videos

统一分页查询视频内容

- 鉴权：无
- Operation ID：`lark_exp.server.api.list_videos_v2`

参数：

| 名称 | 位置 | 必填 | 类型 | 说明 |
| --- | --- | --- | --- | --- |
| activity_period_id | query | 否 | `integer(int64)` |  |
| content_config_id | query | 否 | `integer(int64)` |  |
| status | query | 否 | `string` |  |
| label | query | 否 | `string` | 审核标签，忽略大小写精确匹配；`search` 仍支持对标签做模糊搜索。 |
| date_from | query | 否 | `string(date)` | 北京时间业务日期开始；视频/直播按当天 00:00:00 起算。 |
| date_to | query | 否 | `string(date)` | 北京时间业务日期结束；包含当天 23:59:59 及其小数秒。 |
| search | query | 否 | `string` |  |
| limit | query | 否 | `integer(int64)` |  |
| offset | query | 否 | `integer(int64)` |  |
| cursor | query | 否 | `string` | 新接口游标；存在时优先于 offset。 |

响应：

| 状态 | 说明 | Schema |
| --- | --- | --- |
| 200 | Response with json format data | `lark_exp.server.query.PagedResponse<lark_exp.server.query.VideoContentDto>` |
| 400 | 请求参数错误 | `lark_exp.server.error.ApiErrorResponse` |
| 401 | Bearer token 无效 | `lark_exp.server.error.ApiErrorResponse` |
| 404 | 记录不存在 | `lark_exp.server.error.ApiErrorResponse` |
| 409 | 记录冲突 | `lark_exp.server.error.ApiErrorResponse` |
| 500 | 服务内部错误 | `lark_exp.server.error.ApiErrorResponse` |
| 502 | 飞书上游接口不可用 | `lark_exp.server.error.ApiErrorResponse` |
| 503 | 服务尚未就绪 | `lark_exp.server.error.ApiErrorResponse` |

### GET /api/v1/queries/video-metrics

查询视频每日追踪指标

- 鉴权：无
- Operation ID：`lark_exp.server.api.list_video_metrics`

参数：

| 名称 | 位置 | 必填 | 类型 | 说明 |
| --- | --- | --- | --- | --- |
| limit | query | 否 | `integer(int64)` | 返回条数，服务端限制为 1..500。 |
| offset | query | 否 | `integer(int64)` | 偏移量，小于 0 时按 0 处理。 |

响应：

| 状态 | 说明 | Schema |
| --- | --- | --- |
| 200 | Response with json format data | array<`lark_exp.server.query.VideoMetricDto`> |
| 400 | 请求参数错误 | `lark_exp.server.error.ApiErrorResponse` |
| 401 | Bearer token 无效 | `lark_exp.server.error.ApiErrorResponse` |
| 404 | 记录不存在 | `lark_exp.server.error.ApiErrorResponse` |
| 409 | 记录冲突 | `lark_exp.server.error.ApiErrorResponse` |
| 500 | 服务内部错误 | `lark_exp.server.error.ApiErrorResponse` |
| 502 | 飞书上游接口不可用 | `lark_exp.server.error.ApiErrorResponse` |
| 503 | 服务尚未就绪 | `lark_exp.server.error.ApiErrorResponse` |

### GET /api/v1/queries/video-trace-metrics

查询视频每次追踪快照指标

- 鉴权：无
- Operation ID：`lark_exp.server.api.list_video_trace_metrics`

参数：

| 名称 | 位置 | 必填 | 类型 | 说明 |
| --- | --- | --- | --- | --- |
| content_config_id | query | 否 | `integer(int64)` | 内容配置 ID；用于限定某一期活动的直播/视频配置。 |
| video_id | query | 否 | `string` | 视频 ID。 |
| author_uid | query | 否 | `string` | 作者 uid，精确匹配。 |
| author_name | query | 否 | `string` | 作者名称，模糊匹配。 |
| label | query | 否 | `string` | 审核标签，忽略大小写精确匹配。 |
| date | query | 否 | `string(date)` | 指定单日；传入后优先于 date_from/date_to。 |
| date_from | query | 否 | `string(date)` | 日期区间开始，闭区间。 |
| date_to | query | 否 | `string(date)` | 日期区间结束，闭区间。 |
| limit | query | 否 | `integer(int64)` | 返回视频条数，服务端限制为 1..500。 |
| offset | query | 否 | `integer(int64)` | 视频分页偏移量。 |

响应：

| 状态 | 说明 | Schema |
| --- | --- | --- |
| 200 | Response with json format data | array<`lark_exp.server.query.VideoTraceMetricDto`> |
| 400 | 请求参数错误 | `lark_exp.server.error.ApiErrorResponse` |
| 401 | Bearer token 无效 | `lark_exp.server.error.ApiErrorResponse` |
| 404 | 记录不存在 | `lark_exp.server.error.ApiErrorResponse` |
| 409 | 记录冲突 | `lark_exp.server.error.ApiErrorResponse` |
| 500 | 服务内部错误 | `lark_exp.server.error.ApiErrorResponse` |
| 502 | 飞书上游接口不可用 | `lark_exp.server.error.ApiErrorResponse` |
| 503 | 服务尚未就绪 | `lark_exp.server.error.ApiErrorResponse` |

### GET /api/v1/queries/videos

查询视频/图文基础内容数据

- 鉴权：无
- Operation ID：`lark_exp.server.api.list_videos`

参数：

| 名称 | 位置 | 必填 | 类型 | 说明 |
| --- | --- | --- | --- | --- |
| limit | query | 否 | `integer(int64)` | 返回条数，服务端限制为 1..500。 |
| offset | query | 否 | `integer(int64)` | 偏移量，小于 0 时按 0 处理。 |

响应：

| 状态 | 说明 | Schema |
| --- | --- | --- |
| 200 | Response with json format data | array<`lark_exp.server.query.VideoContentDto`> |
| 400 | 请求参数错误 | `lark_exp.server.error.ApiErrorResponse` |
| 401 | Bearer token 无效 | `lark_exp.server.error.ApiErrorResponse` |
| 404 | 记录不存在 | `lark_exp.server.error.ApiErrorResponse` |
| 409 | 记录冲突 | `lark_exp.server.error.ApiErrorResponse` |
| 500 | 服务内部错误 | `lark_exp.server.error.ApiErrorResponse` |
| 502 | 飞书上游接口不可用 | `lark_exp.server.error.ApiErrorResponse` |
| 503 | 服务尚未就绪 | `lark_exp.server.error.ApiErrorResponse` |

## workflows

### POST /api/v1/workflows/{kind}/run

手动执行工作流

- 鉴权：MUTATION_API_TOKEN
- Operation ID：`lark_exp.server.api.run_workflow`

参数：

| 名称 | 位置 | 必填 | 类型 | 说明 |
| --- | --- | --- | --- | --- |
| kind | path | 是 | `string` | 工作流类型：morning、periodic、night。 |

请求体：

- 可选 `application/json`：`lark_exp.server.api.WorkflowScopeRequest`

响应：

| 状态 | 说明 | Schema |
| --- | --- | --- |
| 200 | Response with json format data | `lark_exp.server.api.WorkflowRunResponse` |
| 400 | 请求参数错误 | `lark_exp.server.error.ApiErrorResponse` |
| 401 | Bearer token 无效 | `lark_exp.server.error.ApiErrorResponse` |
| 404 | 记录不存在 | `lark_exp.server.error.ApiErrorResponse` |
| 409 | 记录冲突 | `lark_exp.server.error.ApiErrorResponse` |
| 500 | 服务内部错误 | `lark_exp.server.error.ApiErrorResponse` |
| 502 | 飞书上游接口不可用 | `lark_exp.server.error.ApiErrorResponse` |
| 503 | 服务尚未就绪 | `lark_exp.server.error.ApiErrorResponse` |

### POST /api/v1/workflows/audit-results/sync

从审核表同步审核结果到数据库

- 鉴权：MUTATION_API_TOKEN
- Operation ID：`lark_exp.server.api.sync_audit_results`

请求体：

- 可选 `application/json`：`lark_exp.server.api.WorkflowScopeRequest`

响应：

| 状态 | 说明 | Schema |
| --- | --- | --- |
| 200 | Response with json format data | `lark_exp.server.api.AuditResultSyncResponse` |
| 400 | 请求参数错误 | `lark_exp.server.error.ApiErrorResponse` |
| 401 | Bearer token 无效 | `lark_exp.server.error.ApiErrorResponse` |
| 404 | 记录不存在 | `lark_exp.server.error.ApiErrorResponse` |
| 409 | 记录冲突 | `lark_exp.server.error.ApiErrorResponse` |
| 500 | 服务内部错误 | `lark_exp.server.error.ApiErrorResponse` |
| 502 | 飞书上游接口不可用 | `lark_exp.server.error.ApiErrorResponse` |
| 503 | 服务尚未就绪 | `lark_exp.server.error.ApiErrorResponse` |

### POST /api/v1/workflows/audit/run

只统计并发送审核通知

- 鉴权：MUTATION_API_TOKEN
- Operation ID：`lark_exp.server.api.run_audit_notice`

请求体：

- 可选 `application/json`：`lark_exp.server.api.WorkflowScopeRequest`

响应：

| 状态 | 说明 | Schema |
| --- | --- | --- |
| 200 | Response with json format data | `lark_exp.server.api.AuditNoticeRunResponse` |
| 400 | 请求参数错误 | `lark_exp.server.error.ApiErrorResponse` |
| 401 | Bearer token 无效 | `lark_exp.server.error.ApiErrorResponse` |
| 404 | 记录不存在 | `lark_exp.server.error.ApiErrorResponse` |
| 409 | 记录冲突 | `lark_exp.server.error.ApiErrorResponse` |
| 500 | 服务内部错误 | `lark_exp.server.error.ApiErrorResponse` |
| 502 | 飞书上游接口不可用 | `lark_exp.server.error.ApiErrorResponse` |
| 503 | 服务尚未就绪 | `lark_exp.server.error.ApiErrorResponse` |

### POST /api/v1/workflows/manual-sync/run

只同步直播和视频手动登记数据

- 鉴权：MUTATION_API_TOKEN
- Operation ID：`lark_exp.server.api.run_manual_sync`

请求体：

- 可选 `application/json`：`lark_exp.server.api.WorkflowScopeRequest`

响应：

| 状态 | 说明 | Schema |
| --- | --- | --- |
| 200 | Response with json format data | `lark_exp.server.api.ManualRegistrationSyncResponse` |
| 400 | 请求参数错误 | `lark_exp.server.error.ApiErrorResponse` |
| 401 | Bearer token 无效 | `lark_exp.server.error.ApiErrorResponse` |
| 404 | 记录不存在 | `lark_exp.server.error.ApiErrorResponse` |
| 409 | 记录冲突 | `lark_exp.server.error.ApiErrorResponse` |
| 500 | 服务内部错误 | `lark_exp.server.error.ApiErrorResponse` |
| 502 | 飞书上游接口不可用 | `lark_exp.server.error.ApiErrorResponse` |
| 503 | 服务尚未就绪 | `lark_exp.server.error.ApiErrorResponse` |

### POST /api/v1/workflows/pending/import

补偿导入 pending/failed 飞书来源

- 鉴权：MUTATION_API_TOKEN
- Operation ID：`lark_exp.server.api.import_pending_sources`

请求体：

- 可选 `application/json`：`lark_exp.server.api.ImportPendingRequest`

响应：

| 状态 | 说明 | Schema |
| --- | --- | --- |
| 200 | Response with json format data | `lark_exp.server.api.ImportPendingResponse` |
| 400 | 请求参数错误 | `lark_exp.server.error.ApiErrorResponse` |
| 401 | Bearer token 无效 | `lark_exp.server.error.ApiErrorResponse` |
| 404 | 记录不存在 | `lark_exp.server.error.ApiErrorResponse` |
| 409 | 记录冲突 | `lark_exp.server.error.ApiErrorResponse` |
| 500 | 服务内部错误 | `lark_exp.server.error.ApiErrorResponse` |
| 502 | 飞书上游接口不可用 | `lark_exp.server.error.ApiErrorResponse` |
| 503 | 服务尚未就绪 | `lark_exp.server.error.ApiErrorResponse` |

## xingtu

### POST /api/v1/xingtu/sessions

写入或更新星图登录态

- 鉴权：XINGTU_SESSION_UPLOAD_TOKEN 或 MUTATION_API_TOKEN
- Operation ID：`lark_exp.server.api.upsert_xingtu_session`

请求体：

- 必填 `application/json`：`lark_exp.server.api.UpsertSessionRequest`

响应：

| 状态 | 说明 | Schema |
| --- | --- | --- |
| 200 | Response with json format data | `lark_exp.server.api.OkResponse` |
| 400 | 请求参数错误 | `lark_exp.server.error.ApiErrorResponse` |
| 401 | Bearer token 无效 | `lark_exp.server.error.ApiErrorResponse` |
| 404 | 记录不存在 | `lark_exp.server.error.ApiErrorResponse` |
| 409 | 记录冲突 | `lark_exp.server.error.ApiErrorResponse` |
| 500 | 服务内部错误 | `lark_exp.server.error.ApiErrorResponse` |
| 502 | 飞书上游接口不可用 | `lark_exp.server.error.ApiErrorResponse` |
| 503 | 服务尚未就绪 | `lark_exp.server.error.ApiErrorResponse` |

### GET /api/v1/xingtu/sessions/{account_id}/check

检查指定星图账号登录态

- 鉴权：MUTATION_API_TOKEN
- Operation ID：`lark_exp.server.api.check_xingtu_session`

参数：

| 名称 | 位置 | 必填 | 类型 | 说明 |
| --- | --- | --- | --- | --- |
| account_id | path | 是 | `string` | 星图账号 ID。 |

响应：

| 状态 | 说明 | Schema |
| --- | --- | --- |
| 200 | Response with json format data | `lark_exp.server.api.CheckSessionResponse` |
| 400 | 请求参数错误 | `lark_exp.server.error.ApiErrorResponse` |
| 401 | Bearer token 无效 | `lark_exp.server.error.ApiErrorResponse` |
| 404 | 记录不存在 | `lark_exp.server.error.ApiErrorResponse` |
| 409 | 记录冲突 | `lark_exp.server.error.ApiErrorResponse` |
| 500 | 服务内部错误 | `lark_exp.server.error.ApiErrorResponse` |
| 502 | 飞书上游接口不可用 | `lark_exp.server.error.ApiErrorResponse` |
| 503 | 服务尚未就绪 | `lark_exp.server.error.ApiErrorResponse` |

### POST /api/v1/xingtu/sessions/check-all

检查所有启用巡检的星图账号登录态

- 鉴权：MUTATION_API_TOKEN
- Operation ID：`lark_exp.server.api.check_all_xingtu_sessions`

响应：

| 状态 | 说明 | Schema |
| --- | --- | --- |
| 200 | Response with json format data | `lark_exp.server.api.CheckAllSessionsResponse` |
| 400 | 请求参数错误 | `lark_exp.server.error.ApiErrorResponse` |
| 401 | Bearer token 无效 | `lark_exp.server.error.ApiErrorResponse` |
| 404 | 记录不存在 | `lark_exp.server.error.ApiErrorResponse` |
| 409 | 记录冲突 | `lark_exp.server.error.ApiErrorResponse` |
| 500 | 服务内部错误 | `lark_exp.server.error.ApiErrorResponse` |
| 502 | 飞书上游接口不可用 | `lark_exp.server.error.ApiErrorResponse` |
| 503 | 服务尚未就绪 | `lark_exp.server.error.ApiErrorResponse` |

## 未进入 OpenAPI 的协议端点

| 方法 | 路径 | 用途 | 鉴权 |
| --- | --- | --- | --- |
| GET | `/meta.json` | 飞书数据同步插件元信息 | 无 |
| POST | `/api/data-sync/table-meta` | 飞书数据同步字段定义 | 可选 DATA_SYNC_SECRET_KEY 签名 |
| POST | `/api/data-sync/records` | 飞书日报同步记录 | 可选 DATA_SYNC_SECRET_KEY 签名 |
| GET | `/api-doc/openapi.json` | OpenAPI JSON | 无 |
| GET | `/swagger-ui` | Swagger UI | 无 |
