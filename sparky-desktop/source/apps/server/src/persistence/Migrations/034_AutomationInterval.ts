import * as Effect from "effect/Effect";
import * as SqlClient from "effect/unstable/sql/SqlClient";

export default Effect.gen(function* () {
  const sql = yield* SqlClient.SqlClient;
  const tables = yield* sql<{ readonly name: string }>`PRAGMA table_list`;
  if (!tables.some((table) => table.name === "automations")) return;
  const columns = yield* sql<{ readonly name: string }>`PRAGMA table_info(automations)`;
  if (!columns.some((column) => column.name === "interval_hours")) {
    yield* sql`ALTER TABLE automations ADD COLUMN interval_hours INTEGER NOT NULL DEFAULT 1`;
  }
});
