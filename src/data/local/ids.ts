const Alphabet = '0123456789abcdefghijklmnopqrstuvwxyz';

/** Identificador local, ordenable por tiempo. */
export function createId(): string {
  let suffix = '';
  for (let index = 0; index < 10; index += 1) {
    suffix += Alphabet[Math.floor(Math.random() * Alphabet.length)];
  }
  return `${Date.now().toString(36)}-${suffix}`;
}

export function nowIso(): string {
  return new Date().toISOString();
}
