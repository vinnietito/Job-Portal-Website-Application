import crypto from "crypto";

const algorithm = "aes-256-cbc";

const getKey = () => {
  const key = process.env.RESUME_ENCRYPTION_KEY;

  if (!key) {
    throw new Error(
      "RESUME_ENCRYPTION_KEY missing in .env"
    );
  }

  return Buffer.from(key, "hex");
};

export const encryptBuffer = (buffer) => {
  const iv = crypto.randomBytes(16);

  const cipher = crypto.createCipheriv(
    algorithm,
    getKey(),
    iv
  );

  const encrypted = Buffer.concat([
    cipher.update(buffer),
    cipher.final(),
  ]);

  // Prefix the IV to the encrypted payload so decryption can be done from the stored data.
  return Buffer.concat([iv, encrypted]);
};

export const decryptBuffer = (encryptedBuffer) => {
  const iv = encryptedBuffer.slice(0, 16);
  const ciphertext = encryptedBuffer.slice(16);

  const decipher = crypto.createDecipheriv(
    algorithm,
    getKey(),
    iv
  );

  return Buffer.concat([
    decipher.update(ciphertext),
    decipher.final(),
  ]);
};