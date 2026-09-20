/** A dialable href from a formatted number: keeps a leading +, drops the rest. */
export function telHref(number: string): string {
  return `tel:${number.replace(/[^\d+]/g, "")}`;
}

export function mailHref(email: string): string {
  return `mailto:${email}`;
}

/**
 * Decimal degrees as a drawing would print them.
 *
 * Used in place of an embedded map. A mapping provider's iframe would load
 * third-party script on the one page a visitor types their details into, which
 * is precisely what /privacy-policy says this site does not do.
 */
export function coordinates(latitude: number, longitude: number): string {
  const lat = `${Math.abs(latitude).toFixed(4)}° ${latitude >= 0 ? "N" : "S"}`;
  const lng = `${Math.abs(longitude).toFixed(4)}° ${longitude >= 0 ? "E" : "W"}`;
  return `${lat}, ${lng}`;
}
