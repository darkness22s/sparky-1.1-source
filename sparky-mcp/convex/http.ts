import { httpRouter } from "convex/server";
import { httpAction, type ActionCtx } from "./_generated/server";
import { api, internal } from "./_generated/api";
import { decryptSecret } from "./mcp";

const http = httpRouter();
const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Authorization, Content-Type, Mcp-Session-Id, Mcp-Protocol-Version",
  "Access-Control-Allow-Methods": "GET, POST, DELETE, OPTIONS",
  "Cache-Control": "no-store",
};

function withCors(headers: HeadersInit = {}) {
  return { ...cors, ...headers };
}

function bearerToken(request: Request): string | null {
  const value = request.headers.get("Authorization");
  return value?.startsWith("Bearer ") ? value.slice("Bearer ".length).trim() || null : null;
}

async function requireMcpSession(ctx: ActionCtx, request: Request, pluginSlug: string) {
  const token = bearerToken(request);
  if (!token) throw new Response("MCP authorization is required.", { status: 401, headers: withCors() });
  const tokenHash = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(token));
  const hash = btoa(String.fromCharCode(...new Uint8Array(tokenHash)))
    .replaceAll("+", "-")
    .replaceAll("/", "_")
    .replaceAll("=", "");
  const session = await ctx.runQuery(internal.mcp.getSession, { tokenHash: hash });
  if (!session || session.pluginSlug !== pluginSlug || session.expiresAt < Date.now()) {
    throw new Response("MCP session is invalid or expired.", { status: 401, headers: withCors() });
  }
  return session;
}

http.route({
  path: "/mcp/catalog",
  method: "OPTIONS",
  handler: httpAction(async () => new Response(null, { status: 204, headers: withCors() })),
});

http.route({
  path: "/mcp/catalog",
  method: "GET",
  handler: httpAction(async (ctx) => Response.json(await ctx.runQuery(api.mcp.list, {}), { headers: withCors() })),
});

http.route({
  path: "/mcp/connections",
  method: "OPTIONS",
  handler: httpAction(async () => new Response(null, { status: 204, headers: withCors() })),
});

http.route({
  path: "/mcp/connections",
  method: "GET",
  handler: httpAction(async (ctx) => {
    try {
      return Response.json(await ctx.runQuery(api.mcp.listConnections, {}), { headers: withCors() });
    } catch (error) {
      return Response.json({ error: error instanceof Error ? error.message : "Authentication is required." }, {
        status: 401,
        headers: withCors(),
      });
    }
  }),
});

http.route({
  path: "/mcp/oauth/start",
  method: "OPTIONS",
  handler: httpAction(async () => new Response(null, { status: 204, headers: withCors() })),
});

http.route({
  path: "/mcp/oauth/start",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    try {
      const body = (await request.json()) as { pluginSlug?: unknown };
      if (typeof body.pluginSlug !== "string" || body.pluginSlug.trim().length === 0) {
        return Response.json({ error: "pluginSlug is required." }, { status: 400, headers: withCors() });
      }
      return Response.json(await ctx.runAction(api.mcp.startOAuth, { pluginSlug: body.pluginSlug }), {
        headers: withCors(),
      });
    } catch (error) {
      return Response.json({ error: error instanceof Error ? error.message : "Unable to start OAuth." }, {
        status: 400,
        headers: withCors(),
      });
    }
  }),
});

http.route({
  path: "/mcp/oauth/callback",
  method: "GET",
  handler: httpAction(async (ctx, request) => {
    const url = new URL(request.url);
    const code = url.searchParams.get("code");
    const state = url.searchParams.get("state");
    const error = url.searchParams.get("error");
    if (error || !code || !state) {
      return new Response(`<h1>MCP connection was not completed</h1><p>${error ?? "Missing OAuth response."}</p>`, {
        status: 400,
        headers: { ...withCors(), "Content-Type": "text/html; charset=utf-8" },
      });
    }
    try {
      const result = await ctx.runAction(api.mcp.completeOAuth, { code, state });
      return new Response(
        `<h1>Connected</h1><p>${result.pluginSlug} is now connected to Sparky. You can close this window.</p>`,
        { headers: { ...withCors(), "Content-Type": "text/html; charset=utf-8" } },
      );
    } catch (cause) {
      return new Response(`<h1>MCP connection failed</h1><p>${cause instanceof Error ? cause.message : "OAuth failed."}</p>`, {
        status: 400,
        headers: { ...withCors(), "Content-Type": "text/html; charset=utf-8" },
      });
    }
  }),
});

http.route({
  path: "/mcp/session",
  method: "OPTIONS",
  handler: httpAction(async () => new Response(null, { status: 204, headers: withCors() })),
});

http.route({
  path: "/mcp/session",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    try {
      const body = (await request.json()) as { pluginSlug?: unknown };
      if (typeof body.pluginSlug !== "string" || body.pluginSlug.trim().length === 0) {
        return Response.json({ error: "pluginSlug is required." }, { status: 400, headers: withCors() });
      }
      return Response.json(await ctx.runAction(api.mcp.createSession, { pluginSlug: body.pluginSlug }), {
        headers: withCors(),
      });
    } catch (error) {
      return Response.json({ error: error instanceof Error ? error.message : "Unable to create MCP session." }, {
        status: 400,
        headers: withCors(),
      });
    }
  }),
});

for (const method of ["GET", "POST", "DELETE"] as const) {
  http.route({
    path: "/mcp/:pluginSlug",
    method,
    handler: httpAction(async (ctx, request) => {
      const pluginSlug = new URL(request.url).pathname.split("/").pop();
      if (!pluginSlug) return new Response("Missing MCP plugin.", { status: 404, headers: withCors() });
      try {
        const session = await requireMcpSession(ctx, request, decodeURIComponent(pluginSlug));
        const headers = new Headers();
        for (const name of ["Accept", "Content-Type", "Mcp-Session-Id", "Mcp-Protocol-Version"]) {
          const value = request.headers.get(name);
          if (value) headers.set(name, value);
        }
        headers.set("Authorization", `Bearer ${await decryptSecret(session.encryptedAccessToken)}`);
        const remote = await fetch(session.mcpServerUrl, {
          method,
          headers,
          ...(method === "GET" || method === "DELETE" ? {} : { body: request.body }),
        });
        return new Response(remote.body, {
          status: remote.status,
          headers: withCors({
            "Content-Type": remote.headers.get("Content-Type") ?? "application/json",
            ...(remote.headers.get("Mcp-Session-Id")
              ? { "Mcp-Session-Id": remote.headers.get("Mcp-Session-Id")! }
              : {}),
          }),
        });
      } catch (error) {
        if (error instanceof Response) return error;
        return Response.json({ error: "MCP request failed." }, { status: 502, headers: withCors() });
      }
    }),
  });
}

export default http;
