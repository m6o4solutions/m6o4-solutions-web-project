"use client";

import { formatSlug } from "@/payload/fields/slug/format-slug";
import { Button, FieldLabel, TextInput, useField, useForm, useFormFields } from "@payloadcms/ui";
import { TextFieldClientProps } from "payload";
import React, { useCallback } from "react";

import "@/payload/fields/slug/index.scss";

/* define local event and prop types for reusability and type safety */
type MouseEventType = React.MouseEvent<Element>;

type SlugComponentProps = {
	fieldToUse: string; // the field whose value is used to generate the slug
	checkboxFieldPath: string; // path to the boolean "lock" field in the form
} & TextFieldClientProps;

/* custom slug field component with auto-generation and lock behavior */
function SlugComponent({
	field,
	fieldToUse,
	checkboxFieldPath: checkboxFieldPathFromProps,
	path,
	readOnly: readOnlyFromProps,
}: SlugComponentProps) {
	const { label } = field;

	/* ensure nested field paths are resolved correctly in deeply structured forms */
	const checkboxFieldPath = path?.includes(".") ? `${path}.${checkboxFieldPathFromProps}` : checkboxFieldPathFromProps;

	/* hook into payload form state for this field */
	const { value, setValue } = useField<string>({ path: path || field.name });
	const { dispatchFields, getDataByPath } = useForm();

	/* watch the "lock" checkbox field to determine slug editability */
	const isLocked = useFormFields(([fields]) => {
		return fields[checkboxFieldPath]?.value as boolean;
	});

	/* generate slug from the target field when "generate" is clicked */
	const handleGenerate = useCallback(
		(e: MouseEventType) => {
			e.preventDefault();

			const targetFieldValue = getDataByPath(fieldToUse) as string;

			if (targetFieldValue) {
				const formattedSlug = formatSlug(targetFieldValue);
				if (value !== formattedSlug) setValue(formattedSlug);
			} else {
				if (value !== "") setValue("");
			}
		},
		[setValue, value, fieldToUse, getDataByPath],
	);

	/* toggle the lock state to enable or disable manual editing */
	const handleLock = useCallback(
		(e: MouseEventType) => {
			e.preventDefault();

			dispatchFields({
				type: "UPDATE",
				path: checkboxFieldPath,
				value: !isLocked,
			});
		},
		[isLocked, checkboxFieldPath, dispatchFields],
	);

	/* render the slug field with lock and generate buttons */
	return (
		<div className="field-type slug-field-component">
			<div className="label-wrapper">
				<FieldLabel htmlFor={`field-${path}`} label={label} />

				{/* show generate button only when slug is editable */}
				{!isLocked && (
					<Button className="lock-button" buttonStyle="none" onClick={handleGenerate}>
						Generate
					</Button>
				)}

				{/* lock/unlock button to toggle readonly state */}
				<Button className="lock-button" buttonStyle="none" onClick={handleLock}>
					{isLocked ? "Unlock" : "Lock"}
				</Button>
			</div>

			{/* slug text input with conditional readonly state */}
			<TextInput
				value={value}
				onChange={setValue}
				path={path || field.name}
				readOnly={Boolean(readOnlyFromProps || isLocked)}
			/>
		</div>
	);
}

export { SlugComponent };
