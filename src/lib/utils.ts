import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const getOppositeRunway = (rwy: string) => {
  const match = rwy.match(/^(\d{2})([LRC]?)$/);
  if (!match) return rwy;
  const num = parseInt(match[1]);
  const letter = match[2] || "";
  const oppositeNum = num <= 18 ? num + 18 : num - 18;
  const oppositeLetter =
    letter === "L" ? "R" : letter === "R" ? "L" : letter;
  return oppositeNum.toString().padStart(2, "0") + oppositeLetter;
};