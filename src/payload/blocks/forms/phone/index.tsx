import { Input } from "@/payload/blocks/forms/input";
import { Width } from "@/payload/blocks/forms/width";
import type { FieldErrorsImpl, FieldValues, UseFormRegister } from "react-hook-form";

// defines the combined props required for the phone number input component
type PhoneProps = {
	// errors object from react-hook-form to display validation feedback
	errors: Partial<FieldErrorsImpl<{ [x: string]: any }>>;
	// register function from react-hook-form to connect the input field to the form state
	register: UseFormRegister<any & FieldValues>;
} & {
	// a boolean to visually hide the field
	hidden: boolean;
	// a string defining the column width in the layout (e.g., '1/2', 'full')
	width: string;
	// optional text hint displayed inside the input
	placeholder?: string;
	// the user-friendly name displayed above the input
	label: string;
	// the field's unique identifier and key for registration
	name: string;
	// boolean indicating if the field must contain a value
	required: boolean;
};

// this component renders a phone number input field, enforcing layout rules and reusing the base FormInput component
export const Phone = ({
	name,
	errors,
	label,
	register,
	required: requiredFromProps,
	hidden: hiddenFromProps,
	width,
	placeholder,
}: PhoneProps) => {
	return (
		// uses the custom width component to control the field's column size
		<Width width={width}>
			{/* reuses the generic FormInput component, overriding the native type to 'tel' 
      to enable appropriate mobile keyboard access */}
			<Input
				errors={errors}
				name={name}
				label={label}
				type="tel" // specifically sets the type to 'tel' for phone number inputs
				placeholder={placeholder}
				required={requiredFromProps}
				hidden={hiddenFromProps}
				register={register}
			/>
		</Width>
	);
};
