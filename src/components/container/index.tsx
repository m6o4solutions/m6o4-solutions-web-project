import { cn } from "@/lib/utils";
import { ComponentProps } from "react";

// defines the component's props by inheriting all standard html attributes of a <div> element.
type ContainerProps = ComponentProps<"div">;

/**
 * a reusable layout wrapper that establishes a consistent, centered
 * max-width boundary for main page content, along with default horizontal and
 * vertical padding.
 */
const Container = ({ children, className, ...props }: ContainerProps) => {
	return (
		<div
			{...props}
			// combines default layout classes with any provided 'classname'.
			className={cn(
				// 'container' applies responsive max-width constraints defined in tailwind config.
				// 'mx-auto' ensures the container is horizontally centered on the page.
				"container mx-auto",
				// default padding for content separation and visual balance.
				"px-6 py-8",
				className,
			)}
		>
			{children}
		</div>
	);
};

// export the container component for use as a primary page layout wrapper.
export { Container };
