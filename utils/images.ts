export function withDefaultImage(
  url: string | null | undefined,
  fallback: string
) {
  return url?.trim() ? url : fallback;
}
