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
 * @component ThemeToggle
 * @description renders a dropdown menu that allows users to switch the site's color
 * theme between Light, Dark, and System preference.
 */
const ThemeToggle = () => {
	// destructures the 'setTheme' function from the useTheme hook, which handles
	// updating the application's theme state (e.g., setting the 'dark' class on the HTML tag).
	const { setTheme } = useTheme();

	return (
		<DropdownMenu>
			{/* the trigger is the clickable button that opens the menu. 'asChild' ensures 
            	the button component is rendered as the trigger element. */}
			<DropdownMenuTrigger asChild>
				<Button variant="ghost" size="icon" className="rounded-lg">
					<Sun className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
					<Moon className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
					<span className="sr-only">Theme Toggle</span>
				</Button>
			</DropdownMenuTrigger>

			{/* menu options content, aligned to the 'end' (right) of the trigger button. */}
			<DropdownMenuContent align="end">
				{/* options: each option calls setTheme() with the corresponding value. */}
				<DropdownMenuItem onClick={() => setTheme("light")}>Light</DropdownMenuItem>
				<DropdownMenuItem onClick={() => setTheme("dark")}>Dark</DropdownMenuItem>
				<DropdownMenuItem onClick={() => setTheme("system")}>System</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
};

export { ThemeToggle };
