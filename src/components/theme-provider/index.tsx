"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import { ComponentProps } from "react";

/**
 * a client component that wraps and exports the 'next-themes' provider.
 * it establishes the necessary react context to manage the site's color theme
 * (light, dark, system preference) across the application.
 */
const ThemeProvider = ({ children, ...props }: ComponentProps<typeof NextThemesProvider>) => {
	return (
		// passes all configuration properties (e.g., system preference, theme storage key)
		// directly to the underlying next-themes provider.
		<NextThemesProvider {...props}>{children}</NextThemesProvider>
	);
};

// export the provider component for use in the root layout.
export { ThemeProvider };
