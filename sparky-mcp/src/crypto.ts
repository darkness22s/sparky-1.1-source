import { createCipheriv, createDecipheriv, createHash, randomBytes } from "node:crypto";

function encryptionKey(): Buffer {
  const encoded = process.env.MCP_TOKEN_ENCRYPTION_KEY;
  if (!encoded) throw new Error("MCP_TOKEN_ENCRYPTION_KEY is not configured.");
  const key = Buffer.from(encoded, "base64url");
  if (key.length !== 32) throw new Error("MCP_TOKEN_ENCRYPTION_KEY must decode to 32 bytes.");
  return key;
}

export function randomToken(): string {
  return randomBytes(32).toString("base64url");
}

export function hashToken(value: string): string {
  return createHash("sha256").update(value).digest("base64url");
}

export function encryptSecret(value: string): string {
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", encryptionKey(), iv);
  const ciphertext = Buffer.concat([cipher.update(value, "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();
  return [iv, tag, ciphertext].map((part) => part.toString("base64url")).join(".");
}

export function decryptSecret(value: string): string {
  const [ivEncoded, tagEncoded, ciphertextEncoded] = value.split(".");
  if (!ivEncoded || !tagEncoded || !ciphertextEncoded) throw new Error("Invalid encrypted MCP credential.");
  const decipher = createDecipheriv("aes-256-gcm", encryptionKey(), Buffer.from(ivEncoded, "base64url"));
  decipher.setAuthTag(Buffer.from(tagEncoded, "base64url"));
  return Buffer.concat([
    decipher.update(Buffer.from(ciphertextEncoded, "base64url")),
    decipher.final(),
  ]).toString("utf8");
}
