import crypto from "crypto";

const ALGORITHM = "aes-256-gcm";
const IV_LENGTH = 16;
const SALT_LENGTH = 16;
const TAG_LENGTH = 16;

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY;

const getEncryptionKey = (): string => {
  if (!ENCRYPTION_KEY) {
    throw new Error(
      "ENCRYPTION_KEY environment variable is required to encrypt/decrypt provider keys. "
    );
  }
  return ENCRYPTION_KEY;
};

const getKey = (salt: Buffer) => {
  return crypto.pbkdf2Sync(getEncryptionKey(), salt, 100000, 32, "sha256");
};

export interface EncryptedData {
  encryptedText: string;
  iv: string;
  authTag: string;
  salt: string;
}

export function encryptText(text: string): EncryptedData {
  const salt = crypto.randomBytes(SALT_LENGTH);
  const iv = crypto.randomBytes(IV_LENGTH);
  const key = getKey(salt);

  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
  
  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");
  const authTag = cipher.getAuthTag().toString("hex");

  return {
    encryptedText: encrypted,
    iv: iv.toString("hex"),
    authTag: authTag,
    salt: salt.toString("hex"),
  };
}

export function decryptText(encryptedData: EncryptedData): string {
  try {
    const salt = Buffer.from(encryptedData.salt, "hex");
    const iv = Buffer.from(encryptedData.iv, "hex");
    const authTag = Buffer.from(encryptedData.authTag, "hex");
    const key = getKey(salt);

    const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
    decipher.setAuthTag(authTag);

    let decrypted = decipher.update(encryptedData.encryptedText, "hex", "utf8");
    decrypted += decipher.final("utf8");

    return decrypted;
  } catch (error) {
    console.error("Decryption failed. Invalid key or corrupted data:", error);
    throw new Error("Failed to decrypt data.");
  }
}
