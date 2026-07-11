const NONCE_LENGTH = 16;

export function generateNonce(): string {
  const array = new Uint8Array(NONCE_LENGTH);
  crypto.getRandomValues(array);
  return btoa(String.fromCharCode(...array));
}
