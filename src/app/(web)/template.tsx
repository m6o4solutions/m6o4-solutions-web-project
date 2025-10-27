"use client";

import { motion } from "motion/react";
import React from "react";

/**
 * a layout component used to wrap pages and apply a global page transition effect.
 * this template renders a simple fade-in animation using motion/react.
 *
 * @param children - the content (page component) to be rendered within the animation wrapper.
 */
const template = ({ children }: { children: React.ReactNode }) => {
	return (
		// motion.div applies the animation properties to the wrapper element.
		<motion.div
			// defines the starting state of the animation (fully transparent).
			initial={{ opacity: 0 }}
			// defines the ending state of the animation (fully opaque).
			animate={{ opacity: 1 }}
			// configures the transition properties for a smooth fade effect.
			transition={{ ease: "easeInOut", duration: 0.75 }}
		>
			{children}
		</motion.div>
	);
};

// exports the component as the default for use in next.js's 'template.tsx' file.
export { template as default };
