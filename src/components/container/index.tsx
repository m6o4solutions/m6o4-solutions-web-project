// the 'cn' utility is typically from '@/lib/utils' and intelligently merges Tailwind classes.
// this allows consumer-provided classes to override component defaults cleanly.
import { cn } from "@/lib/utils";
import { ComponentProps } from "react";

// define the component's props by inheriting all standard attributes of a native <div> element.
// this ensures the component can accept props like 'id', 'onClick', 'aria-label', etc.
type ContainerProps = ComponentProps<"div">;

/**
 * @component container
 * @description a reusable layout wrapper that establishes a consistent, centered
 * max-width boundary for main page content, along with default horizontal and
 * vertical padding.
 *
 * it uses the 'container' class for responsiveness and 'mx-auto' for centering.
 *
 * @param {React.ReactNode} children - the content to be rendered inside the container.
 * @param {string} [className] - optional Tailwind classes to merge and apply.
 * @param {ContainerProps} props - rest of the native <div> props (e.g., id, role).
 */
const Container = ({ children, className, ...props }: ContainerProps) => {
	return (
		// the <div> element serves as the layout wrapper.
		<div
			{...props}
			// cn utility merges default classes with user-provided 'className'.
			// default classes:
			// - container: sets max-width based on breakpoints (responsive).
			// - mx-auto: centers the container horizontally.
			// - px-6: sets horizontal padding (1.5rem).
			// - py-8: sets vertical padding (2rem).
			className={cn("container mx-auto px-6 py-8", className)}
		>
			{children}
		</div>
	);
};

export { Container };
