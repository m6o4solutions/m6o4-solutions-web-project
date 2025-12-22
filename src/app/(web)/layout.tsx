import { ClarityTracker } from "@/components/clarity-tracker";
import { ThemeProvider } from "@/components/theme-provider";
import { cn } from "@/lib/utils";
import { Footer } from "@/payload/blocks/globals/footer/component";
import { Header } from "@/payload/blocks/globals/header/component";
import { getServerSideURL } from "@/payload/utilities/get-url";
import { mergeOpenGraph } from "@/payload/utilities/merge-opengraph";
import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import { ReactNode } from "react";

import "@/styles/globals.css"; // import global style definitions

// font configuration for consistent typography across the site
const inter = Inter({ subsets: ["latin"], variable: "--font-sans", display: "swap" });
const jakarta = Plus_Jakarta_Sans({ subsets: ["latin"], variable: "--font-display", display: "swap" });

/**
 * root layout for the application defining global html structure, theme handling,
 * and persistent components like header and footer.
 */
const RootLayout = async ({ children }: { children: ReactNode }) => {
	return (
		<html lang="en" suppressHydrationWarning>
			{/* main body uses a vertical layout, global fonts, and antialiasing for smoother text rendering */}
			<body className={cn("flex h-screen flex-col font-sans antialiased", inter.className, jakarta.className)}>
				{/* track user behavior early in the lifecycle to catch session starts */}
				<ClarityTracker />

				{/* theme provider manages light/dark modes and syncs theme preference across the app */}
				<ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
					{/* global header displayed across all pages */}
					<header>
						<Header />
					</header>

					{/* main page content grows to fill available space, pushing footer downward */}
					<main className="grow pt-20">{children}</main>

					{/* global footer anchored to bottom when content height is small */}
					<footer className="mt-auto">
						<Footer />
					</footer>
				</ThemeProvider>
			</body>
		</html>
	);
};

/**
 * shared metadata applied to all routes, setting up base seo and social preview defaults.
 */
const metadata: Metadata = {
	metadataBase: new URL(getServerSideURL()), // establishes absolute base for metadata URLs
	openGraph: mergeOpenGraph(), // imports shared open graph configuration
	twitter: {
		card: "summary_large_image", // ensures large preview on twitter
		creator: "@m6o4solutions", // identifies publishing account
	},
	icons: {
		icon: [{ url: "/favicon.svg", type: "image/svg+xml" }], // defines the main favicon
	},
};

export { RootLayout as default, metadata };
