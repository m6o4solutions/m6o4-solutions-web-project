import { ReactNode } from "react";

// defines the accepted properties for the width component.
type WidthProps = {
	children: ReactNode;
	className?: string; // allows passing custom tailwind classes for styling.
	width?: number | string; // sets the max-width value, expected to be a percentage.
};

// component wraps children in a div and conditionally sets a maximum width style.
const Width = ({ children, className, width }: WidthProps) => {
	return (
		<div
			className={className}
			// dynamically applies max-width to the div, appending '%' if a width value is provided.
			style={{ maxWidth: width ? `${width}%` : undefined }}
		>
			{children}
		</div>
	);
};

export { Width };
