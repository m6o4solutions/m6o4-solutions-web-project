// checks if the code is running in a browser environment
// verifies that 'window' and 'document' objects exist and can create elements
const isBrowser = !!(typeof window !== "undefined" && window.document && window.document.createElement);

export { isBrowser };
