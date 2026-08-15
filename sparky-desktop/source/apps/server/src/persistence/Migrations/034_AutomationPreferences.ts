import * as Effect from "effect/Effect";
import * as SqlClient from "effect/unstable/sql/SqlClient";

export default Effect.gen(function* () {
  const sql = yield* SqlClient.SqlClient;

  yield* sql`
    ALTER TABLE automations ADD COLUMN execution_mode TEXT NOT NULL DEFAULT 'chat'
  `;
  yield* sql`
    ALTER TABLE automations ADD COLUMN notifications_enabled INTEGER NOT NULL DEFAULT 1
  `;
});
