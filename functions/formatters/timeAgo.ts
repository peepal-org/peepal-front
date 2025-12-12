export function timeAgoFr(input: string | Date): string {
  const date = typeof input === "string" ? new Date(input) : input;
  const now = new Date();

  const diffMs = now.getTime() - date.getTime();
  if (Number.isNaN(diffMs)) return "Date inconnue";

  const sec = Math.floor(diffMs / 1000);
  if (sec < 5) return "À l’instant";
  if (sec < 60) return `Il y a ${sec} s`;

  const min = Math.floor(sec / 60);
  if (min < 60) return `Il y a ${min} min`;

  const h = Math.floor(min / 60);
  if (h < 24) return `Il y a ${h} h`;

  const days = Math.floor(h / 24);
  if (days < 7) return `Il y a ${days} j`;

  const weeks = Math.floor(days / 7);
  if (weeks < 4) return `Il y a ${weeks} semaine${weeks > 1 ? "s" : ""}`;

  const months = Math.floor(days / 30);
  if (months < 12) return `Il y a ${months} mois`;

  const years = Math.floor(days / 365);
  return `Il y a ${years} an${years > 1 ? "s" : ""}`;
}
