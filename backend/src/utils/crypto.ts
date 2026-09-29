import crypto from "crypto";

const ALGORITHM = "aes-256-gcm";

const BACKEND_SECRET =
  process.env.BACKEND_ENCRYPTION_KEY ||
  "backend-demo-secret-key-2026";

const FRONTEND_SECRET =
  process.env.FRONTEND_ENCRYPTION_KEY ||
  "frontend-demo-secret-key-2026";

function createKey(secret: string): Buffer {
  return crypto
    .createHash("sha256")
    .update(secret)
    .digest();
}

function encryptWithKey(
  data: string,
  secret: string
): string {
  const key = createKey(secret);

  const iv = crypto.randomBytes(12);

  const cipher = crypto.createCipheriv(
    ALGORITHM,
    key,
    iv
  );

  const encrypted = Buffer.concat([
    cipher.update(data, "utf8"),
    cipher.final(),
  ]);

  const authTag = cipher.getAuthTag();

  return [
    iv.toString("base64"),
    authTag.toString("base64"),
    encrypted.toString("base64"),
  ].join(":");
}

function decryptWithKey(
  encryptedData: string,
  secret: string
): string {
  const key = createKey(secret);

  const [
    ivBase64,
    authTagBase64,
    encryptedBase64,
  ] = encryptedData.split(":");

  if (
    !ivBase64 ||
    !authTagBase64 ||
    !encryptedBase64
  ) {
    throw new Error("Invalid encrypted data");
  }

  const iv = Buffer.from(ivBase64, "base64");
  const authTag = Buffer.from(
    authTagBase64,
    "base64"
  );
  const encrypted = Buffer.from(
    encryptedBase64,
    "base64"
  );

  const decipher = crypto.createDecipheriv(
    ALGORITHM,
    key,
    iv
  );

  decipher.setAuthTag(authTag);

  const decrypted = Buffer.concat([
    decipher.update(encrypted),
    decipher.final(),
  ]);

  return decrypted.toString("utf8");
}

export function encryptBackendData(
  data: string
): string {
  return encryptWithKey(data, BACKEND_SECRET);
}

export function decryptBackendData(
  encryptedData: string
): string {
  return decryptWithKey(
    encryptedData,
    BACKEND_SECRET
  );
}

export function decryptFrontendData(
  encryptedData: string
): string {
  return decryptWithKey(
    encryptedData,
    FRONTEND_SECRET
  );
}