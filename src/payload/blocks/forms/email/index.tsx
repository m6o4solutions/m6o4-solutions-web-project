import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Error } from "@/payload/blocks/forms/error";
import { Width } from "@/payload/blocks/forms/width";
import type { EmailField } from "@payloadcms/plugin-form-builder/types";
import type { FieldErrorsImpl, FieldValues, UseFormRegister } from "react-hook-form";

// combines the payload cms field definition with react-hook-form utilities for comprehensive typing.
type EmailProps = EmailField & {
	errors: Partial<FieldErrorsImpl>;
	register: UseFormRegister<FieldValues>;
};

// renders an email input field and integrates it with react-hook-form for state and validation.
const Email = ({ name, defaultValue, errors, label, register, required, width }: EmailProps) => {
	return (
		// wraps the field in the width component to respect the configured column size.
		<Width width={width}>
			<Label htmlFor={name}>
				{label}

				{/* shows the required asterisk for users who can see the field. */}
				{required && (
					<span className="required">
						* <span className="sr-only">(required)</span>
					</span>
				)}
			</Label>
			<Input
				defaultValue={defaultValue}
				id={name}
				type="text"
				// registers the input with react-hook-form, enabling validation and data collection.
				{...register(name, {
					// uses a regex pattern to ensure the entered value resembles an email address.
					pattern: /^\S[^\s@]*@\S+$/,
					// applies mandatory field checking from the cms settings.
					required,
				})}
			/>

			{/* displays a specific error message if validation for this field fails. */}
			{errors[name] && <Error name={name} />}
		</Width>
	);
};

export { Email };
