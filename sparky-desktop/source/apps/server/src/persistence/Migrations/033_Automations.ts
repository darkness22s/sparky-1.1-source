import * as Effect from "effect/Effect";
import * as SqlClient from "effect/unstable/sql/SqlClient";

export default Effect.gen(function* () {
  const sql = yield* SqlClient.SqlClient;

  yield* sql`
    CREATE TABLE IF NOT EXISTS automations (
      id TEXT PRIMARY KEY NOT NULL,
      environment_id TEXT NOT NULL,
      thread_id TEXT NOT NULL,
      provider_instance_id TEXT NOT NULL,
      title TEXT NOT NULL,
      prompt TEXT NOT NULL,
      schedule TEXT NOT NULL CHECK (schedule IN ('once', 'hourly', 'daily', 'weekly')),
      interval_hours REAL NOT NULL DEFAULT 1,
      run_at TEXT NOT NULL,
      next_run_at TEXT,
      timezone TEXT NOT NULL,
      enabled INTEGER NOT NULL DEFAULT 1,
      status TEXT NOT NULL DEFAULT 'active',
      execution_mode TEXT NOT NULL DEFAULT 'chat',
      notifications_enabled INTEGER NOT NULL DEFAULT 1,
      model_selection_json TEXT,
      runtime_mode TEXT NOT NULL DEFAULT 'full-access',
      interaction_mode TEXT NOT NULL DEFAULT 'default',
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      last_run_at TEXT,
      last_error TEXT
    )
  `;

  yield* sql`
    CREATE INDEX IF NOT EXISTS idx_automations_due
    ON automations(enabled, status, next_run_at)
  `;
});
