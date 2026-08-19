export interface AccountApiConfig {
  readonly host: string;
  readonly port: number;
  readonly databaseUrl: string;
  readonly neonAuthJwksUrl: string;
  readonly neonAuthIssuer: string;
  readonly neonAuthAudience: string;
  readonly corsOrigin: string;
}

export function readAccountApiConfig(
  env: Readonly<Record<string, string | undefined>> = process.env,
): AccountApiConfig {
  const databaseUrl = firstNonEmpty(env, "NEON_DATABASE_URL", "DATABASE_URL");
  const neonAuthJwksUrl = firstNonEmpty(env, "NEON_AUTH_JWKS_URL");
  const neonAuthIssuer = firstNonEmpty(env, "NEON_AUTH_ISSUER");
  const neonAuthAudience = firstNonEmpty(env, "NEON_AUTH_AUDIENCE");

  if (!databaseUrl) {
    throw new Error("NEON_DATABASE_URL is required for the account API.");
  }
  if (!neonAuthJwksUrl || !neonAuthIssuer || !neonAuthAudience) {
    throw new Error(
      "NEON_AUTH_JWKS_URL, NEON_AUTH_ISSUER, and NEON_AUTH_AUDIENCE are required for the account API.",
    );
  }

  const portValue = Number(env.PORT ?? "8788");
  if (!Number.isInteger(portValue) || portValue <= 0 || portValue > 65_535) {
    throw new Error("PORT must be a valid TCP port.");
  }

  return {
    host: env.HOST?.trim() || "127.0.0.1",
    port: portValue,
    databaseUrl,
    neonAuthJwksUrl,
    neonAuthIssuer,
    neonAuthAudience,
    corsOrigin: env.SPARKY_ACCOUNT_CORS_ORIGIN?.trim() || "*",
  };
}

function firstNonEmpty(
  env: Readonly<Record<string, string | undefined>>,
  ...names: ReadonlyArray<string>
): string | undefined {
  for (const name of names) {
    const value = env[name]?.trim();
    if (value) return value;
  }
  return undefined;
}
