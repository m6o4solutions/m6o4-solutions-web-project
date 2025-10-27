"use client";

import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import * as React from "react";

/**
 * a client-side component that renders a dropdown menu for theme selection.
 * it utilizes 'next-themes' to manage the site's color scheme, offering light,
 * dark, and system preference options.
 */
const ThemeToggle = () => {
	// accesses the theme setter function from next-themes.
	const { setTheme } = useTheme();

	return (
		<DropdownMenu>
			{/* the dropdown trigger button, rendering a dynamic sun/moon icon. */}
			<DropdownMenuTrigger asChild>
				<Button variant="ghost" size="icon" className="rounded-lg">
					{/* sun icon is visible in light mode, hidden in dark mode with a rotation animation. */}
					<Sun className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
					{/* moon icon is hidden in light mode, visible in dark mode with a rotation animation. */}
					<Moon className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
					{/* visually hidden text for accessibility. */}
					<span className="sr-only">theme toggle</span>
				</Button>
			</DropdownMenuTrigger>

			{/* the menu that appears when the button is clicked, aligned to the right. */}
			<DropdownMenuContent align="end">
				{/* menu item to set the theme to 'light'. */}
				<DropdownMenuItem onClick={() => setTheme("light")}>light</DropdownMenuItem>
				{/* menu item to set the theme to 'dark'. */}
				<DropdownMenuItem onClick={() => setTheme("dark")}>dark</DropdownMenuItem>
				{/* menu item to set the theme to respect the operating system's setting. */}
				<DropdownMenuItem onClick={() => setTheme("system")}>system</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
};

// export the component for inclusion in site headers or navigation.
export { ThemeToggle };
