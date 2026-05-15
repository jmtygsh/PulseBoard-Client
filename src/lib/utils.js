import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}


export function convertExpiryAtToISO(poll) {
  if (poll.expiresAt && poll.expiresAt !== 'never') {
    const now = new Date();
    const value = parseInt(poll.expiresAt.slice(0, -1));
    const unit = poll.expiresAt.slice(-1);

    if (unit === 'm') now.setMinutes(now.getMinutes() + value);
    else if (unit === 'h') now.setHours(now.getHours() + value);
    else if (unit === 'd') now.setDate(now.getDate() + value);

    return now.toISOString();
  }
}