"use client";

import { useFormContext } from "react-hook-form";

// component displays validation errors for a specific field within a react-hook-form context.
const Error = ({ name }: { name: string }) => {
	// hooks into the nearest form context provider to access the form state.
	const {
		formState: { errors },
	} = useFormContext();

	// conditionally renders the error message associated with the 'name' prop.
	return (
		<div className="mt-2 text-sm text-red-400">
			{/* retrieves the error message for the field name; defaults to a generic required message if one isn't found. */}
			{(errors[name]?.message as string) || "This is a required field."}
		</div>
	);
};

export { Error };
