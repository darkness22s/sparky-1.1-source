import { expect, it } from "@effect/vitest";
import { Tool } from "effect/unstable/ai";

import { AutomationListTool } from "./tools.ts";

it("exports automation_list with a provider-compatible empty object schema", () => {
  const schema = Tool.getJsonSchema(AutomationListTool) as {
    readonly type?: unknown;
    readonly additionalProperties?: unknown;
  };

  expect(schema.type).toBe("object");
  expect(schema.additionalProperties).toBe(false);
});
