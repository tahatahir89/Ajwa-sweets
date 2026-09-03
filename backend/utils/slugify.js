// Turns any input into a safe, URL-friendly slug: lowercase, spaces and
// underscores become hyphens, anything that isn't a letter/number/hyphen is
// stripped, and repeated/leading/trailing hyphens are cleaned up.
// e.g. "Kema Samosa!!" -> "kema-samosa", "  Two   Words " -> "two-words"
export function slugify(input) {
  return String(input || "")
    .toLowerCase()
    .trim()
    .replace(/[\s_]+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}
