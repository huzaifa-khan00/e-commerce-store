import clsx from "clsx";
import { twMerge } from "tailwind-merge";

// Combine conditional class names and resolve Tailwind conflicts.
export default function cn(...inputs) {
  return twMerge(clsx(inputs));
}