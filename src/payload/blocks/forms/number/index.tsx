import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Error } from "@/payload/blocks/forms/error";
import { Width } from "@/payload/blocks/forms/width";
import type { TextField } from "@payloadcms/plugin-form-builder/types";
import type { FieldErrorsImpl, FieldValues, UseFormRegister } from "react-hook-form";

// combines the payload cms field definition (textfield is used for number in form builder) with react-hook-form types.
type NumberProps = TextField & {
	errors: Partial<FieldErrorsImpl>;
	register: UseFormRegister<FieldValues>;
};

// renders a standard HTML number input field, managed by react-hook-form.
const Number = ({ name, defaultValue, errors, label, register, required, width }: NumberProps) => {
	return (
		// wraps the input in the width component to respect the configured column layout.
		<Width width={width}>
			<Label htmlFor={name}>
				{label}

				{/* renders a visual indicator if the field is mandatory. */}
				{required && (
					<span className="text-red-400">
						* <span className="sr-only">(required)</span>
					</span>
				)}
			</Label>
			<Input
				defaultValue={defaultValue}
				id={name}
				// sets the input type to 'number' to restrict input to numeric values and improve mobile keyboard experience.
				type="number"
				// spreads the registration props to integrate the input into the form state and validation logic.
				{...register(name, {
					// applies the required validation rule from the cms settings.
					required,
				})}
			/>

			{/* displays the error component if a validation error exists for this field's name. */}
			{errors[name] && <Error name={name} />}
		</Width>
	);
};

export { Number };
