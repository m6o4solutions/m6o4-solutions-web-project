import { Checkbox as CheckboxUI } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Error } from "@/payload/blocks/forms/error";
import { Width } from "@/payload/blocks/forms/width";
import type { CheckboxField } from "@payloadcms/plugin-form-builder/types";
import type { FieldErrorsImpl, FieldValues, UseFormRegister } from "react-hook-form";
import { useFormContext } from "react-hook-form";

// defines the combined properties required by the component, blending payloadcms config and react-hook-form utilities.
type CheckboxProps = CheckboxField & {
	errors: Partial<FieldErrorsImpl>;
	register: UseFormRegister<FieldValues>;
};

// renders a form checkbox field, integrating with react-hook-form for state management and validation.
const Checkbox = ({ name, defaultValue, errors, label, register, required, width }: CheckboxProps) => {
	// registers the field with react-hook-form to enable tracking and apply the required validation rule.
	const props = register(name, { required: required });
	// retrieves the function used to manually set form values, necessary for custom components like the checkboxui.
	const { setValue } = useFormContext();

	return (
		// wraps the field in a container that controls its maximum width based on payload cms configuration.
		<Width width={width}>
			<div className="flex items-center gap-2">
				<CheckboxUI
					defaultChecked={defaultValue}
					id={name}
					// spreads react-hook-form properties onto the checkbox to handle ref and blur events.
					{...props}
					// manually updates the form state using setvalue when the checkbox state changes.
					// this is needed because the shadcn/ui checkbox does not natively pass an event object compatible with register's onChange.
					onCheckedChange={(checked) => {
						setValue(props.name, checked);
					}}
				/>
				<Label htmlFor={name}>
					{/* visually marks the field as required for the user. */}
					{required && (
						<span className="text-red-400">
							* <span className="sr-only">(required)</span>
						</span>
					)}
					{label}
				</Label>
			</div>
			{/* displays the specific validation message if an error exists for this field name. */}
			{errors[name] && <Error name={name} />}
		</Width>
	);
};

export { Checkbox };
