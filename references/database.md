# 生产 PostgreSQL 只读核验

生产数据库只用于核验 API 结果、统计口径和脱敏示例。`kp-cli` 不保存 `DATABASE_URL`，每次从进程环境读取。

## 设置连接串

macOS/Linux：

```sh
export DATABASE_URL='postgres://readonly_user:password@host:5432/database'
```

Windows PowerShell：

```powershell
$env:DATABASE_URL = 'postgres://readonly_user:password@host:5432/database'
```

优先使用数据库侧只有 SELECT 权限的专用账号。即使连接账号权限更高，CLI 仍固定执行：

```sql
BEGIN TRANSACTION ISOLATION LEVEL REPEATABLE READ READ ONLY;
SET LOCAL statement_timeout = 15000;
SET LOCAL idle_in_transaction_session_timeout = 20000;
SET LOCAL TIME ZONE 'Asia/Shanghai';
```

CLI 没有任意 SQL 参数，防止命令被误用为生产写入口。

## 预置查询

```text
kp-cli db presets
kp-cli db projects --limit 20
kp-cli db periods --project-id 1 --limit 20
kp-cli db content-configs --activity-period-id 10
kp-cli db daily-live-pv --activity-period-id 10
kp-cli db live-month-integrity --activity-period-id 10
kp-cli db schema --limit 500
```

| 预置 | 用途 |
| --- | --- |
| `schema` | 读取 public schema 字段清单，明确排除登录态表 |
| `projects` | 主项目基本信息，不含通知群、审核员和账号凭据 |
| `periods` | 期次、业务月份和追踪窗口 |
| `content-configs` | 视频/直播任务配置，不读取 Sheet URL 和表格 Token |
| `daily-live-pv` | 按北京时间开播日期汇总期次自然月 `live_exposure_pv` |
| `live-month-integrity` | 检查误归入其他业务月份的直播行数和 PV |

## 核心关系

```text
xingtu_project (project_id)
  -> xingtu_activity_period (activity_period_id, task_month)
    -> xingtu_activity_content_config (content_config_id, content_type)
      -> video_content / video_daily_metric
      -> live_session
      -> xingtu_feishu_source
```

直播业务唯一性由 `(content_config_id, live_room_id)` 保证；不要假设 `live_room_id` 在所有项目和月份中全局唯一。日报和项目卡片的直播 PV 只统计 `task_month` 自然月内的 `live_exposure_pv`。

## 禁止读取或输出

- `xingtu_login_session` 的任何数据。
- Cookie、CSRF、session key、加密 payload、数据库连接串和任何 Token。
- `audit_extra` 顶层 `key`。需要按它筛选时只调用专用 API，响应也不能回显该值。
- 审核员和群成员等个人数据，除非用户明确要求且任务确有必要。

发现 API 与数据库不一致时，先报告所用期次、时间边界、指标列和只读 SQL 口径；不要直接修改生产数据。
