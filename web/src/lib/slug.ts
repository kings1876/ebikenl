// Tiny, dependency-free helpers shared by client and server code (keeps the translation dictionary out of client bundles).
export const brandSlug = (b: string) => b.toLowerCase().replace(/[^a-z0-9]+/g, '-');
