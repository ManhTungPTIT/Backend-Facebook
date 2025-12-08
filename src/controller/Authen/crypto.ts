import crypto from "crypto";

export function genSalt(bytes = 16): string {
  return crypto.randomBytes(bytes).toString("hex");
}

export function hashPasswordPBKDF2(
  password: string,
  salt: string,
  iterations = 310_000,
  keylen = 32,
  digest: "sha256" | "sha512" = "sha256"
): Promise<string> {
  return new Promise((resolve, reject) => {
    crypto.pbkdf2(
      password,
      salt,
      iterations,
      keylen,
      digest,
      (err, derived) => {
        if (err) return reject(err);
        resolve(derived.toString("hex")); // trả về string hex
      }
    );
  });
}

export function timingSafeEqualHex(aHex: string, bHex: string): boolean {
  const a = Buffer.from(aHex, "hex");
  const b = Buffer.from(bHex, "hex");
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}
