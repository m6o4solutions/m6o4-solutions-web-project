"use client";

import { formatSlug } from "@/payload/fields/slug/format-slug";
import { Button, FieldLabel, TextInput, useField, useForm, useFormFields } from "@payloadcms/ui";
import { TextFieldClientProps } from "payload";
import React, { useCallback } from "react";

import "@/payload/fields/slug/index.scss";

type MouseEventType = React.MouseEvent<Element>;

/* props for the slug component including field and checkbox references */
type SlugComponentProps = {
	fieldToUse: string;
	checkboxFieldPath: string;
} & TextFieldClientProps;

/* ui component for managing slug values with lock/unlock and auto-generate behavior */
const SlugComponent = ({
	field,
	fieldToUse,
	checkboxFieldPath: checkboxFieldPathFromProps,
	path,
	readOnly: readOnlyFromProps,
}: SlugComponentProps) => {
	const { label } = field;

	/* handle nested field paths correctly for the slug lock checkbox */
	const checkboxFieldPath = path?.includes(".") ? `${path}.${checkboxFieldPathFromProps}` : checkboxFieldPathFromProps;

	/* manage the slug field value and its setter */
	const { value, setValue } = useField<string>({ path: path || field.name });

	/* access form dispatch and data utilities */
	const { dispatchFields, getDataByPath } = useForm();

	/* determine if the slug field is locked (readonly) */
	const isLocked = useFormFields(([fields]) => fields[checkboxFieldPath]?.value as boolean);

	/* regenerate slug from a target field (usually title) when unlocked */
	const handleGenerate = useCallback(
		(e: MouseEventType) => {
			e.preventDefault();

			const targetFieldValue = getDataByPath(fieldToUse) as string;

			if (targetFieldValue) {
				const formattedSlug = formatSlug(targetFieldValue);
				if (value !== formattedSlug) setValue(formattedSlug);
			} else if (value !== "") {
				setValue("");
			}
		},
		[setValue, value, fieldToUse, getDataByPath],
	);

	/* toggle the lock state of the slug field */
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

	return (
		<div className="field-type slug-field-component">
			<div className="label-wrapper">
				<FieldLabel htmlFor={`field-${path}`} label={label} />
				{/* only show the generate button when the slug is unlocked */}
				{!isLocked && (
					<Button className="lock-button" buttonStyle="none" onClick={handleGenerate}>
						Generate
					</Button>
				)}
				{/* toggle lock/unlock state */}
				<Button className="lock-button" buttonStyle="none" onClick={handleLock}>
					{isLocked ? "Unlock" : "Lock"}
				</Button>
			</div>

			{/* slug text input that becomes readonly when locked */}
			<TextInput
				value={value}
				onChange={setValue}
				path={path || field.name}
				readOnly={Boolean(readOnlyFromProps || isLocked)}
			/>
		</div>
	);
};

export { SlugComponent };
