import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Error } from "@/payload/blocks/forms/error";
import { Width } from "@/payload/blocks/forms/width";
import type { TextField } from "@payloadcms/plugin-form-builder/types";
import type { FieldErrorsImpl, FieldValues, UseFormRegister } from "react-hook-form";

// combines the payload cms text field definition with react-hook-form types.
type TextProps = TextField & {
	errors: Partial<FieldErrorsImpl>;
	register: UseFormRegister<FieldValues>;
};

// renders a standard html text input field, managed by react-hook-form.
const Text = ({ name, defaultValue, errors, label, register, required, width }: TextProps) => {
	return (
		// applies the maximum width configuration from the cms field settings.
		<Width width={width}>
			<Label htmlFor={name}>
				{label}

				{/* renders a visual indicator if the field is mandatory. */}
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
				// registers the input with react-hook-form and applies validation rules.
				{...register(name, {
					// applies the required validation rule from the cms settings.
					required,
				})}
			/>
			{/* conditionally displays the validation error message component. */}
			{errors[name] && <Error name={name} />}
		</Width>
	);
};

export { Text };
