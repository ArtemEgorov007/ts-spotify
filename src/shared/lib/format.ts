export function formatDuration(durationSec: number) {
  const safeDuration = Number.isFinite(durationSec) ? Math.max(0, Math.floor(durationSec)) : 0;
  const minutes = Math.floor(safeDuration / 60);
  const seconds = String(safeDuration % 60).padStart(2, '0');
  return `${minutes}:${seconds}`;
}
