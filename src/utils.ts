import crypto from "crypto";

const ALPHANUM =
  "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";

export function generateId(length = 7) {
  if (length < 6 || length > 8) {
    throw new Error("Length must be between 6 and 8 characters");
  }

  const bytes = crypto.randomBytes(length);
  let id = "";

  for (let i = 0; i < length; i++) {
    id += ALPHANUM[bytes[i]! % ALPHANUM.length];
  }

  return id;
}
