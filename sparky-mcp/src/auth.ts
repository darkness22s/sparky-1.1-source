import { createRemoteJWKSet, jwtVerify, type JWTPayload } from "jose";

let jwks: ReturnType<typeof createRemoteJWKSet> | undefined;

function clerkIssuer(): string {
  const issuer = process.env.CLERK_ISSUER?.replace(/\/$/u, "");
  if (!issuer) throw new Error("CLERK_ISSUER is not configured.");
  return issuer;
}

function clerkJwks() {
  return (jwks ??= createRemoteJWKSet(new URL(`${clerkIssuer()}/.well-known/jwks.json`)));
}

export async function authenticateBearer(authorization: string | undefined): Promise<JWTPayload> {
  if (!authorization?.startsWith("Bearer ")) throw new HttpAuthError("Authentication is required.");
  const token = authorization.slice("Bearer ".length).trim();
  if (!token) throw new HttpAuthError("Authentication is required.");
  const audience = process.env.CLERK_AUDIENCE;
  try {
    const verified = await jwtVerify(token, clerkJwks(), {
      issuer: clerkIssuer(),
      ...(audience ? { audience } : {}),
    });
    return verified.payload;
  } catch {
    throw new HttpAuthError("Authentication is invalid or expired.");
  }
}

export function subjectFromClaims(claims: JWTPayload): string {
  if (typeof claims.sub !== "string" || claims.sub.length === 0) {
    throw new HttpAuthError("Authenticated subject is missing.");
  }
  return claims.sub;
}

export class HttpAuthError extends Error {
  readonly statusCode = 401;
}
