import { describe, expect, it } from "vite-plus/test";

import { readAccountApiConfig } from "./config.ts";

describe("readAccountApiConfig", () => {
  const baseEnv = {
    NEON_DATABASE_URL: "postgresql://user:password@ep-example.neon.tech/db?sslmode=require",
    NEON_AUTH_JWKS_URL: "https://auth.example.neon.tech/.well-known/jwks.json",
    NEON_AUTH_ISSUER: "https://auth.example.neon.tech",
    NEON_AUTH_AUDIENCE: "sparky-relay",
  };

  it("reads the database and Neon Auth settings without logging or transforming credentials", () => {
    expect(readAccountApiConfig(baseEnv)).toMatchObject({
      databaseUrl: baseEnv.NEON_DATABASE_URL,
      neonAuthJwksUrl: baseEnv.NEON_AUTH_JWKS_URL,
      neonAuthIssuer: baseEnv.NEON_AUTH_ISSUER,
      neonAuthAudience: baseEnv.NEON_AUTH_AUDIENCE,
      host: "127.0.0.1",
      port: 8788,
      corsOrigin: "*",
    });
  });

  it("requires the database URL", () => {
    expect(() =>
      readAccountApiConfig({
        ...baseEnv,
        NEON_DATABASE_URL: " ",
      }),
    ).toThrow("NEON_DATABASE_URL is required");
  });

  it("requires all Neon Auth verification settings", () => {
    expect(() =>
      readAccountApiConfig({
        ...baseEnv,
        NEON_AUTH_AUDIENCE: undefined,
      }),
    ).toThrow("NEON_AUTH_JWKS_URL, NEON_AUTH_ISSUER, and NEON_AUTH_AUDIENCE");
  });

  it("rejects invalid ports", () => {
    expect(() => readAccountApiConfig({ ...baseEnv, PORT: "70000" })).toThrow(
      "PORT must be a valid TCP port",
    );
  });
});
