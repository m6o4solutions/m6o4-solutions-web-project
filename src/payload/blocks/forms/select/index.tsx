import { Label } from "@/components/ui/label";
import {
	Select as SelectComponent,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Error } from "@/payload/blocks/forms/error";
import { Width } from "@/payload/blocks/forms/width";
import type { SelectField } from "@payloadcms/plugin-form-builder/types";
import type { Control, FieldErrorsImpl } from "react-hook-form";
import { Controller } from "react-hook-form";

// combines the payload cms select field configuration with react-hook-form control types.
type SelectProps = SelectField & {
	control: Control;
	errors: Partial<FieldErrorsImpl>;
};

// renders a customizable select dropdown, fully controlled by react-hook-form.
const Select = ({ name, control, errors, label, options, required, width, defaultValue }: SelectProps) => {
	return (
		// applies width based on cms layout configuration.
		<Width width={width}>
			<Label htmlFor={name}>
				{label}
				{/* indicates to the user that the field is mandatory. */}
				{required && (
					<span className="text-red-400">
						* <span className="sr-only">(required)</span>
					</span>
				)}
			</Label>
			{/* manages the select's state and validation status for the form. */}
			<Controller
				control={control}
				defaultValue={defaultValue} // sets the field's starting value.
				name={name}
				// applies the required validation rule based on the cms schema.
				rules={{ required }}
				render={({ field: { onChange, value } }) => {
					// finds the corresponding option object to ensure the select component displays the correct label for the value.
					const controlledValue = options.find((t) => t.value === value);

					return (
						// links the selection change event to the form state update function.
						<SelectComponent onValueChange={(val) => onChange(val)} value={controlledValue?.value}>
							<SelectTrigger className="w-full" id={name}>
								<SelectValue placeholder={label} />
							</SelectTrigger>
							<SelectContent>
								{/* dynamically generates all selectable items from the options prop. */}
								{options.map(({ label, value }) => {
									return (
										<SelectItem key={value} value={value}>
											{label}
										</SelectItem>
									);
								})}
							</SelectContent>
						</SelectComponent>
					);
				}}
			/>
			{/* shows the form error message if validation fails for this specific field. */}
			{errors[name] && <Error name={name} />}
		</Width>
	);
};

export { Select };
