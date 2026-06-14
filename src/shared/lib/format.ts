export function formatDuration(durationSec: number) {
  const safeDuration = Number.isFinite(durationSec) ? Math.max(0, Math.floor(durationSec)) : 0;
  const minutes = Math.floor(safeDuration / 60);
  const seconds = String(safeDuration % 60).padStart(2, '0');
  return `${minutes}:${seconds}`;
}

export function formatTracksCount(count: number) {
  const mod10 = count % 10;
  const mod100 = count % 100;

  if (mod10 === 1 && mod100 !== 11) {
    return `${count} трек`;
  }

  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) {
    return `${count} трека`;
  }

  return `${count} треков`;
}
