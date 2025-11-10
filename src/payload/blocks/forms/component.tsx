"use client";

import { Container } from "@/components/container";
import { RichText } from "@/components/rich-text";
import { SubmitButton } from "@/components/submit-button";
import { fields } from "@/payload/blocks/forms/fields";
import { getClientSideURL } from "@/payload/utilities/get-url";
import { mapPayloadFieldsToRHFDefaults, rhfdefaultvalues } from "@/payload/utilities/map-form-fields";
import type { Form as FormType } from "@payloadcms/plugin-form-builder/types";
import type { SerializedEditorState } from "@payloadcms/richtext-lexical/lexical";
import { LoaderCircle } from "lucide-react";
//import { usePathname } from "next/navigation";
import { ComponentType, useCallback, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";

// represents a single payload form block and its configuration
type FormBlockType = {
	blockName?: string;
	blockType?: "formBlock";
	enableCompanionText?: boolean;
	form: FormType;
	companionText?: SerializedEditorState;
	confirmationMessage?: SerializedEditorState;
};

// extends the block type with an optional element id
type FormBlockProps = { id?: string } & FormBlockType;

// represents any dynamically rendered field component
type FieldComponent = ComponentType<any>;

// main form component used to render payload-managed forms on the client
const FormBlock = (props: FormBlockProps) => {
	const {
		enableCompanionText,
		form: formFromProps,
		form: { id: formID, confirmationMessage, confirmationType, submitButtonLabel } = {},
		companionText,
	} = props;

	// track current route for potential use in submission context
	//const pathname = usePathname();

	// initialize form control with default values based on payload configuration
	const formMethods = useForm<rhfdefaultvalues>({
		defaultValues: mapPayloadFieldsToRHFDefaults(formFromProps.fields),
	});

	const {
		control,
		formState: { errors },
		handleSubmit,
		register,
	} = formMethods;

	// ui states for submission feedback and error tracking
	const [isLoading, setIsLoading] = useState(false);
	const [hasSubmitted, setHasSubmitted] = useState<boolean>();
	const [error, setError] = useState<{ message: string; status?: string } | undefined>();

	// handles user submission, posting structured form data to the api
	const onSubmit = useCallback(
		(data: rhfdefaultvalues) => {
			let loadingTimerID: ReturnType<typeof setTimeout>;

			const submitForm = async () => {
				setError(undefined);
				// delay loader activation to prevent flicker on quick responses
				loadingTimerID = setTimeout(() => setIsLoading(true), 1000);

				// shape flat react-hook-form data into payload's expected format
				const dataToSend = Object.entries(data).map(([name, value]) => ({
					field: name,
					value,
				}));

				try {
					const req = await fetch(`${getClientSideURL()}/api/form-submissions`, {
						body: JSON.stringify({ form: formID, submissionData: dataToSend }),
						credentials: "include",
						headers: { "Content-Type": "application/json" },
						method: "POST",
					});

					const res = await req.json();
					clearTimeout(loadingTimerID);

					// capture server-side errors for user feedback
					if (req.status >= 400) {
						setIsLoading(false);
						setError({
							message: res.errors?.[0]?.message || "Internal Server Error.",
							status: req.status.toString(),
						});
						return;
					}

					// successful submission resets loading and triggers confirmation view
					setIsLoading(false);
					setHasSubmitted(true);
				} catch (e) {
					// catch network or unexpected client errors
					console.warn(e);
					setIsLoading(false);
					setError({ message: "Something went wrong..." });
				}
			};

			void submitForm();
		},
		[formID /* pathname */],
	);

	return (
		<section className="section-spacing bg-bg-subtle">
			<Container>
				<div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
					<div className="space-y-8 lg:col-span-1">
						{/* show optional companion text beside the form before submission */}
						{enableCompanionText && companionText && !hasSubmitted && (
							<RichText
								className="mb-8 text-center md:col-span-6 md:text-start lg:mb-12 xl:col-span-4"
								data={companionText as unknown as any}
							/>
						)}
					</div>

					<div className="lg:col-span-2">
						<div className="border-border-subtle rounded-xl border-2 bg-white p-3 shadow-lg lg:p-5">
							<p className="text-text-default pt-3 pb-5 text-2xl font-semibold">Message</p>

							{/* provide react-hook-form context to nested field components */}
							<FormProvider {...formMethods}>
								{/* show confirmation message after a successful submission */}
								{!isLoading && hasSubmitted && confirmationType === "message" && (
									<RichText className="text-center" data={confirmationMessage} />
								)}

								{/* show a short loading message during request handling */}
								{isLoading && !hasSubmitted && (
									<p className="mb-4 flex items-center">
										<span>
											<LoaderCircle className="me-2 animate-spin" />
										</span>{" "}
										loading, please wait...
									</p>
								)}

								{/* display any api or network error messages */}
								{error && <div className="text-red-400">{`${error.status || "error"}: ${error.message || ""}`}</div>}

								{/* render form fields only if submission has not yet succeeded */}
								{!hasSubmitted && (
									<form id={formID} onSubmit={handleSubmit(onSubmit)}>
										<div className="mb-4 last:mb-0 sm:flex sm:flex-wrap sm:gap-4">
											{formFromProps?.fields?.map((field, index) => {
												// dynamically render field components from payload configuration
												const Field: FieldComponent = (fields as Record<string, FieldComponent>)[field.blockType];
												if (!Field) return null;

												return (
													<Field
														key={index}
														form={formFromProps}
														{...field}
														{...formMethods}
														control={control}
														errors={errors}
														register={register}
													/>
												);
											})}
										</div>

										{/* submit button triggers validation and form submission */}
										<SubmitButton loading={isLoading} text={submitButtonLabel ?? "Submit"} form={formID} />
									</form>
								)}
							</FormProvider>
						</div>
					</div>
				</div>
			</Container>
		</section>
	);
};

export { FormBlock };
