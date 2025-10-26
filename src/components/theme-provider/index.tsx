"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import { ComponentProps } from "react";

/**
 * @component ThemeProvider
 * @description a client-side wrapper around the core NextThemesProvider.
 * this component is used once at the root of the application (e.g., in layout.tsx)
 * to initialize and manage the site's dark/light/system theme state.
 *
 * @param {React.ReactNode} children - the application content to be rendered within the theme context.
 * @param {ComponentProps<typeof NextThemesProvider>} props - all configuration props supported
 * by next-themes (e.g., attribute, defaultTheme, enableSystem).
 */
const ThemeProvider = ({ children, ...props }: ComponentProps<typeof NextThemesProvider>) => {
	return (
		// renders the actual provider, spreading all configuration props to it.
		<NextThemesProvider {...props}>{children}</NextThemesProvider>
	);
};

export { ThemeProvider };
