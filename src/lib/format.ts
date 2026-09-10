/** A dialable href from a formatted number: keeps a leading +, drops the rest. */
export function telHref(number: string): string {
  return `tel:${number.replace(/[^\d+]/g, "")}`;
}

export function mailHref(email: string): string {
  return `mailto:${email}`;
}
