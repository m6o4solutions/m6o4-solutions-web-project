import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { countryOptions } from "@/payload/blocks/forms/country/options";
import { Error } from "@/payload/blocks/forms/error";
import { Width } from "@/payload/blocks/forms/width";
import type { CountryField } from "@payloadcms/plugin-form-builder/types";
import type { Control, FieldErrorsImpl } from "react-hook-form";
import { Controller } from "react-hook-form";

// defines the component's properties by intersecting the payload cms field configuration with react-hook-form control utilities.
type CountryProps = CountryField & {
	control: Control;
	errors: Partial<FieldErrorsImpl>;
};

// renders a country selection field using a shadcn/ui select, fully integrated with react-hook-form.
const Country = ({ name, control, errors, label, required, width }: CountryProps) => {
	return (
		// controls the component's maximum width based on cms configuration.
		<Width width={width}>
			<Label className="" htmlFor={name}>
				{label}

				{/* visually marks the field as required. */}
				{required && (
					<span className="required">
						* <span className="sr-only">(required)</span>
					</span>
				)}
			</Label>
			{/* uses controller to bridge the uncontrolled select component to react-hook-form's state management. */}
			<Controller
				control={control}
				defaultValue="" // sets the initial form value, which should be an empty string for select.
				name={name}
				// applies the required validation rule.
				rules={{ required }}
				render={({ field: { onChange, value } }) => {
					// finds the full country option object from the static list based on the stored two-letter code.
					const controlledValue = countryOptions.find((t) => t.value === value);

					return (
						// onvaluechange is linked to react-hook-form's onchange to update the form state with the new value.
						<Select onValueChange={(val) => onChange(val)} value={controlledValue?.value}>
							<SelectTrigger className="w-full" id={name}>
								<SelectValue placeholder={label} />
							</SelectTrigger>
							<SelectContent>
								{/* iterates over the list of countries to create dropdown items. */}
								{countryOptions.map(({ label, value }) => {
									return (
										<SelectItem key={value} value={value}>
											{label}
										</SelectItem>
									);
								})}
							</SelectContent>
						</Select>
					);
				}}
			/>
			{/* conditionally displays the validation error message component. */}
			{errors[name] && <Error name={name} />}
		</Width>
	);
};

export { Country };
