import crypto from "crypto";

const ALGORITHM = "aes-256-gcm";
const IV_LENGTH = 16;
const SALT_LENGTH = 16;
const TAG_LENGTH = 16;
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || "default_insecure_development_key_change_me_immediately_please";

/**
 * Mendapatkan kunci 32-byte dari ENCRYPTION_KEY menggunakan PBKDF2
 * Ini memastikan bahwa apapun string ENCRYPTION_KEY-nya, panjangnya akan selalu pas 32 bytes (256 bits).
 */
const getKey = (salt: Buffer) => {
  return crypto.pbkdf2Sync(ENCRYPTION_KEY, salt, 100000, 32, "sha256");
};

export interface EncryptedData {
  encryptedText: string;
  iv: string;
  authTag: string;
  salt: string;
}

/**
 * Mengenkripsi teks biasa (plaintext) menjadi AES-256-GCM
 * Mengembalikan objek berisi teks terenkripsi, Initialization Vector (IV), Auth Tag, dan Salt.
 * Semuanya dalam format hex dan bisa disimpan di database.
 */
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

/**
 * Mendekripsi data dari AES-256-GCM kembali menjadi teks biasa.
 */
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
