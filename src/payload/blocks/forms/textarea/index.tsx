import { Label } from "@/components/ui/label";
import { Textarea as TextAreaComponent } from "@/components/ui/textarea";
import { Error } from "@/payload/blocks/forms/error";
import { Width } from "@/payload/blocks/forms/width";
import type { TextField } from "@payloadcms/plugin-form-builder/types";
import type { FieldErrorsImpl, FieldValues, UseFormRegister } from "react-hook-form";

// combines the payload cms field definition with react-hook-form utilities and an optional row count.
type TextareaProps = TextField & {
	errors: Partial<FieldErrorsImpl>;
	register: UseFormRegister<FieldValues>;
	rows?: number;
};

// renders a multi-line text input (textarea), managed by react-hook-form.
const Textarea = ({ name, defaultValue, errors, label, register, required, rows = 3, width }: TextareaProps) => {
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

			<TextAreaComponent
				defaultValue={defaultValue}
				id={name}
				// sets the visual height of the textarea, defaulting to 3 lines.
				rows={rows}
				// registers the input with react-hook-form and applies validation rules.
				{...register(name, {
					// applies the required validation rule from the cms settings.
					required: required,
				})}
			/>

			{/* displays the error component if validation fails for this specific field. */}
			{errors[name] && <Error name={name} />}
		</Width>
	);
};

export { Textarea };
