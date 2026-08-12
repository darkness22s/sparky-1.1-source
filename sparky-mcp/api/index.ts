import type { IncomingMessage, ServerResponse } from "node:http";

import { handleRequest } from "../src/server.js";

export default async function handler(request: IncomingMessage, response: ServerResponse) {
  await handleRequest(request, response);
}
