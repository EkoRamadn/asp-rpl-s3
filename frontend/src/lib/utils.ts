import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getTodayDate() {
  const now = new Date();
  return {
    day: new Intl.DateTimeFormat('en-US', { weekday: 'long' }).format(now),
    date: now.getDate(),
    month: new Intl.DateTimeFormat('en-US', { month: 'long' }).format(now),
    year: now.getFullYear(),
    
    fullDateString: `${new Intl.DateTimeFormat('en-US', { weekday: 'long' }).format(now)}, ${now.getDate()} ${new Intl.DateTimeFormat('en-US', { month: 'long' }).format(now)} ${now.getFullYear()}`
  };
}