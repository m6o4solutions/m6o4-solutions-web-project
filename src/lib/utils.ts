import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * utility function for conditionally joining and merging tailwind css classes.
 * it accepts an array of class values, uses clsx to filter out falsy values and join strings,
 * and then uses twmerge to resolve conflicts by prioritizing the rightmost class.
 *
 * @param inputs - an array of class values (strings, arrays, objects) to be processed.
 * @returns a clean, merged string of tailwind classes.
 */
export function cn(...inputs: ClassValue[]) {
	// combine array/object class inputs into a single string using clsx,
	// then merge and resolve conflicting tailwind classes using twmerge.
	return twMerge(clsx(inputs));
}
