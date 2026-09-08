import { SQL } from "bun";

export const DB_PRESETS = [
  "schema",
  "projects",
  "periods",
  "content-configs",
  "daily-live-pv",
  "live-month-integrity",
] as const;

export type DbPreset = (typeof DB_PRESETS)[number];

export interface DbQueryOptions {
  activityPeriodId?: number;
  limit?: number;
  projectId?: number;
}

function requirePositive(value: number | undefined, name: string): number {
  if (!Number.isSafeInteger(value) || (value ?? 0) <= 0) throw new Error(`${name} 必须是正整数`);
  return value as number;
}

export async function runReadonlyPreset(preset: DbPreset, options: DbQueryOptions): Promise<unknown[]> {
  const databaseUrl = process.env.DATABASE_URL?.trim();
  if (!databaseUrl) throw new Error("缺少环境变量 DATABASE_URL；kp-cli 不会把数据库连接串写入配置文件");
  const limit = Math.min(Math.max(options.limit ?? 50, 1), 500);
  const database = new SQL(databaseUrl);
  const connection = await database.reserve();
  try {
    await connection`BEGIN TRANSACTION ISOLATION LEVEL REPEATABLE READ READ ONLY`;
    await connection`SET LOCAL statement_timeout = 15000`;
    await connection`SET LOCAL idle_in_transaction_session_timeout = 20000`;
    await connection`SET LOCAL TIME ZONE 'Asia/Shanghai'`;
    let rows: unknown[];
    switch (preset) {
      case "schema":
        rows = await connection`
          SELECT table_name, column_name, data_type, is_nullable
          FROM information_schema.columns
          WHERE table_schema = 'public'
            AND table_name <> 'xingtu_login_session'
          ORDER BY table_name, ordinal_position
          LIMIT ${limit}
        `;
        break;
      case "projects":
        rows = await connection`
          SELECT project_id, project_key, display_name, is_active, created_at, updated_at
          FROM xingtu_project
          ORDER BY project_id
          LIMIT ${limit}
        `;
        break;
      case "periods": {
        const projectId = options.projectId ?? null;
        rows = await connection`
          SELECT a.activity_period_id, a.project_id, p.project_key, p.display_name,
                 a.period, a.period_code, a.task_month, a.tracking_start_date,
                 a.tracking_end_date, a.is_active
          FROM xingtu_activity_period a
          JOIN xingtu_project p ON p.project_id = a.project_id
          WHERE (${projectId}::bigint IS NULL OR a.project_id = ${projectId})
          ORDER BY a.task_month DESC, a.activity_period_id DESC
          LIMIT ${limit}
        `;
        break;
      }
      case "content-configs": {
        const activityPeriodId = requirePositive(options.activityPeriodId, "--activity-period-id");
        rows = await connection`
          SELECT content_config_id, activity_period_id, content_type, xingtu_task_id,
                 xingtu_task_name, source_spreadsheet_url_update_mode,
                 sync_enabled, trace_enabled, created_at, updated_at
          FROM xingtu_activity_content_config
          WHERE activity_period_id = ${activityPeriodId}
          ORDER BY content_type
          LIMIT ${limit}
        `;
        break;
      }
      case "daily-live-pv": {
        const activityPeriodId = requirePositive(options.activityPeriodId, "--activity-period-id");
        rows = await connection`
          SELECT (s.start_time AT TIME ZONE 'Asia/Shanghai')::date AS live_date,
                 COUNT(*)::bigint AS live_session_count,
                 COUNT(DISTINCT COALESCE(NULLIF(s.anchor_uid, ''), NULLIF(s.anchor_name, '')))::bigint AS anchor_count,
                 COALESCE(SUM(s.live_exposure_pv), 0)::bigint AS total_live_exposure_pv,
                 ROUND(AVG(s.acu)::numeric, 2) AS average_acu
          FROM live_session s
          JOIN xingtu_activity_content_config c ON c.content_config_id = s.content_config_id
          JOIN xingtu_activity_period a ON a.activity_period_id = c.activity_period_id
          WHERE a.activity_period_id = ${activityPeriodId}
            AND c.content_type = 'live'
            AND s.start_time >= a.task_month::timestamp AT TIME ZONE 'Asia/Shanghai'
            AND s.start_time < (a.task_month + INTERVAL '1 month')::timestamp AT TIME ZONE 'Asia/Shanghai'
          GROUP BY 1
          ORDER BY 1
          LIMIT ${limit}
        `;
        break;
      }
      case "live-month-integrity": {
        const activityPeriodId = requirePositive(options.activityPeriodId, "--activity-period-id");
        rows = await connection`
          SELECT a.activity_period_id,
                 a.task_month,
                 COUNT(*) FILTER (
                   WHERE s.start_time < a.task_month::timestamp AT TIME ZONE 'Asia/Shanghai'
                      OR s.start_time >= (a.task_month + INTERVAL '1 month')::timestamp AT TIME ZONE 'Asia/Shanghai'
                 )::bigint AS outside_task_month_rows,
                 COALESCE(SUM(s.live_exposure_pv) FILTER (
                   WHERE s.start_time < a.task_month::timestamp AT TIME ZONE 'Asia/Shanghai'
                      OR s.start_time >= (a.task_month + INTERVAL '1 month')::timestamp AT TIME ZONE 'Asia/Shanghai'
                 ), 0)::bigint AS outside_task_month_pv,
                 COUNT(*)::bigint AS all_rows,
                 COALESCE(SUM(s.live_exposure_pv), 0)::bigint AS all_pv
          FROM xingtu_activity_period a
          JOIN xingtu_activity_content_config c
            ON c.activity_period_id = a.activity_period_id AND c.content_type = 'live'
          JOIN live_session s ON s.content_config_id = c.content_config_id
          WHERE a.activity_period_id = ${activityPeriodId}
          GROUP BY a.activity_period_id, a.task_month
        `;
        break;
      }
    }
    await connection`COMMIT`;
    return rows;
  } catch (error) {
    await connection`ROLLBACK`.catch(() => undefined);
    throw error;
  } finally {
    connection.release();
    await database.close();
  }
}
