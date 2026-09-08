# 生产环境脱敏示例

采样时间：2026-09-08（Asia/Shanghai）。这些值来自生产 PostgreSQL 的 `REPEATABLE READ READ ONLY` 事务，不包含凭据、个人信息或保密 `audit_extra.key`。

| 主项目 | project_id | 示例期次 | activity_period_id | task_month | 状态 |
| --- | ---: | --- | ---: | --- | --- |
| `[ROK]生态` | 1 | 万国26年9月第十六期 | 10 | 2026-09-01 | 启用 |
| `[SAMO]生态` | 2 | 万龙26-9 | 11 | 2026-09-01 | 启用 |
| `[ROK]生态` | 1 | 万国26年8月第十五期 | 2 | 2026-08-01 | 启用 |
| `[SAMO]生态` | 2 | 万龙26年8月第十五期 | 3 | 2026-08-01 | 启用 |

用于只读 API 示例：

```text
kp-cli api GET /api/v1/queries/periods --query project_id=1
kp-cli api GET /api/v1/queries/v2/live-sessions --query activity_period_id=10 --query limit=20
kp-cli api GET /api/v1/queries/lives/summary --query activity_period_id=10
kp-cli db daily-live-pv --activity-period-id 10
kp-cli db live-month-integrity --activity-period-id 10
```

生产数据会持续变化。这些 ID 适合演示调用结构，不应被当作永远存在的固定夹具；使用前先查询 `/api/v1/queries/projects` 和 `/api/v1/queries/periods`。
