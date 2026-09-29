const SECRET_KEY =
  import.meta.env.VITE_FRONTEND_ENCRYPTION_KEY ||
  "frontend-demo-secret-key-2026";

const encoder = new TextEncoder();
const decoder = new TextDecoder();

async function getKey(): Promise<CryptoKey> {
  const keyMaterial = await crypto.subtle.digest(
    "SHA-256",
    encoder.encode(SECRET_KEY)
  );

  return crypto.subtle.importKey(
    "raw",
    keyMaterial,
    { name: "AES-GCM" },
    false,
    ["encrypt", "decrypt"]
  );
}

export async function encryptData(data: unknown): Promise<string> {
  const key = await getKey();

  const iv = crypto.getRandomValues(new Uint8Array(12));

  const encodedData = encoder.encode(JSON.stringify(data));

  const encrypted = await crypto.subtle.encrypt(
    {
      name: "AES-GCM",
      iv,
    },
    key,
    encodedData
  );

  const encryptedArray = new Uint8Array(encrypted);

  /*
   * Web Crypto AES-GCM automatically appends
   * the 16-byte authentication tag to the ciphertext.
   *
   * Backend expects:
   * IV : AUTH_TAG : CIPHERTEXT
   */

  const authTagLength = 16;

  const ciphertext = encryptedArray.slice(
    0,
    encryptedArray.length - authTagLength
  );

  const authTag = encryptedArray.slice(
    encryptedArray.length - authTagLength
  );

  return [
    uint8ArrayToBase64(iv),
    uint8ArrayToBase64(authTag),
    uint8ArrayToBase64(ciphertext),
  ].join(":");
}

export async function decryptData(
  encryptedData: string
): Promise<any> {
  const key = await getKey();

  const parts = encryptedData.split(":");

  if (parts.length !== 3) {
    throw new Error("Invalid encrypted data");
  }

  const iv = base64ToUint8Array(parts[0]);
  const authTag = base64ToUint8Array(parts[1]);
  const ciphertext = base64ToUint8Array(parts[2]);

  const combined = new Uint8Array(
    ciphertext.length + authTag.length
  );

  combined.set(ciphertext, 0);
  combined.set(authTag, ciphertext.length);

  const decrypted = await crypto.subtle.decrypt(
    {
      name: "AES-GCM",
      iv,
    },
    key,
    combined
  );

  return JSON.parse(decoder.decode(decrypted));
}

function uint8ArrayToBase64(bytes: Uint8Array): string {
  let binary = "";

  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });

  return btoa(binary);
}

function base64ToUint8Array(base64: string): Uint8Array {
  const binary = atob(base64);

  const bytes = new Uint8Array(binary.length);

  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }

  return bytes;
}