import { useEffect, useState } from "react";

/**
 * debounces a value, delaying its update until a specified time (delay) has passed
 * without the value changing. This is useful for optimizing expensive operations
 * like search queries that respond to user input.
 *
 * @template T the type of the value being debounced.
 * @param {T} value the value to debounce.
 * @param {number} [delay=200] the delay in milliseconds before the debounced value is updated.
 * @returns {T} the debounced value.
 */
const useDebounce = <T>(value: T, delay = 200): T => {
	const [debouncedValue, setDebouncedValue] = useState<T>(value);

	useEffect(() => {
		// set a timeout to update the debounced value
		const handler = setTimeout(() => {
			setDebouncedValue(value);
		}, delay);

		// cleanup function: clear the timeout if the value changes (re-render)
		// or if the component unmounts.
		return () => {
			clearTimeout(handler);
		};
	}, [value, delay]); // re-run effect only if value or delay changes

	return debouncedValue;
};

export { useDebounce };
