import { ThemeProvider } from "@/components/theme-provider";
import { cn } from "@/lib/utils";
import { Footer } from "@/payload/blocks/globals/footer/component";
import { Header } from "@/payload/blocks/globals/header/component";
import { getServerSideURL } from "@/payload/utilities/get-url";
import { mergeOpenGraph } from "@/payload/utilities/merge-opengraph";
import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import React, { ReactNode } from "react";

// import global tailwind and custom css styles.
import "@/styles/globals.css";

// configure the 'inter' font for general body text.
const inter = Inter({ subsets: ["latin"], variable: "--font-sans", display: "swap" });
// configure the 'plus jakartasans' font for headings or display elements.
const jakarta = Plus_Jakarta_Sans({
	subsets: ["latin"],
	variable: "--font-display",
	display: "swap",
});

/**
 * the next.js root layout component. it wraps all pages, setting up the core html structure,
 * theme management, and global structural components (header and footer).
 *
 * @param props.children - the page content to be rendered in the <main> tag.
 */
const RootLayout = async (props: { children: ReactNode }) => {
	const { children } = props;

	return (
		// base html structure, setting language and enabling theme attribute.
		<html lang="en" suppressHydrationWarning>
			{/* body applies base css, a flex column layout, antialiasing, and the font classes. */}
			<body className={cn("flex h-screen flex-col font-sans antialiased", inter.className, jakarta.className)}>
				{/* theme provider component for managing dark/light mode across the application. */}
				<ThemeProvider
					// uses a 'class' attribute on the html tag to denote the current theme.
					attribute="class"
					// default theme for initial load.
					defaultTheme="light"
					// allows the operating system's preference to dictate the theme.
					enableSystem
					// prevents theme changes from triggering animation flashes.
					disableTransitionOnChange
				>
					{/* header component, fetched and rendered on the server. */}
					<header>
						<Header />
					</header>

					{/* the main area where the content of the current page is rendered. */}
					<main className="grow">{children}</main>

					{/* footer component, using 'mt-auto' to push it to the bottom of the viewport. */}
					<footer className="mt-auto">
						<Footer />
					</footer>
				</ThemeProvider>
			</body>
		</html>
	);
};

/**
 * next.js metadata object for site-wide seo and social sharing configuration.
 * this data will be inherited and merged by individual page metadata.
 */
const metadata: Metadata = {
	// sets the base url for all relative metadata urls (e.g., open graph images).
	metadataBase: new URL(getServerSideURL()),
	// merges in site-wide default open graph properties.
	openGraph: mergeOpenGraph(),
	// specific twitter card configuration.
	twitter: {
		// ensures a large image preview is used on twitter.
		card: "summary_large_image",
		// identifies the twitter account of the content creator.
		creator: "@m6o4solutions",
	},
	// defines site icons.
	icons: {
		icon: [{ url: "/favicon.svg", type: "image/svg+xml" }],
	},
};

// export the layout as default and the metadata object for next.js to use.
export { RootLayout as default, metadata };
