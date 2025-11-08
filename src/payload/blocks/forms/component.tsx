"use client";

import { RichText } from "@/components/rich-text";
import { Button } from "@/components/ui/button";
import { fields } from "@/payload/blocks/forms/fields";
import { getClientSideURL } from "@/payload/utilities/get-url";
import type { FormFieldBlock, Form as FormType } from "@payloadcms/plugin-form-builder/types";
import type { DefaultTypedEditorState } from "@payloadcms/richtext-lexical";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";

// defines the structure of the form configuration block data coming from payload cms.
export type FormBlockType = {
	blockName?: string;
	blockType?: "formBlock";
	enableIntro: boolean;
	form: FormType;
	introContent?: DefaultTypedEditorState;
};

// defines the props structure for the component, combining cms block data with optional id.
type FormBlockProps = {
	id?: string;
} & FormBlockType;

// renders a full form block, handling state, validation, submission, and confirmation.
const FormBlock = (props: FormBlockProps) => {
	const {
		enableIntro,
		form: formFromProps,
		form: { id: formID, confirmationMessage, confirmationType, redirect, submitButtonLabel } = {},
		introContent,
	} = props;

	// initializes react-hook-form methods, using cms field defaults for initial values.
	const formMethods = useForm({
		defaultValues: formFromProps.fields,
	});
	const {
		control,
		formState: { errors },
		handleSubmit,
		register,
	} = formMethods;

	// state management for user feedback during the submission lifecycle.
	const [isLoading, setIsLoading] = useState(false);
	const [hasSubmitted, setHasSubmitted] = useState<boolean>();
	const [error, setError] = useState<{ message: string; status?: string } | undefined>();
	const router = useRouter();

	// handles the actual form submission logic, wrapped in usecallback to prevent unnecessary re-creation.
	const onSubmit = useCallback(
		(data: FormFieldBlock[]) => {
			let loadingTimerID: ReturnType<typeof setTimeout>;
			const submitForm = async () => {
				setError(undefined);

				// transforms the form data object into the array format expected by the api.
				const dataToSend = Object.entries(data).map(([name, value]) => ({
					field: name,
					value,
				}));

				// delays showing the loading indicator to prevent a flash for fast submissions.
				loadingTimerID = setTimeout(() => {
					setIsLoading(true);
				}, 1000);

				try {
					// attempts to post the submission data to the payload cms api route.
					const req = await fetch(`${getClientSideURL()}/api/form-submissions`, {
						body: JSON.stringify({
							form: formID,
							submissionData: dataToSend,
						}),
						headers: {
							"Content-Type": "application/json",
						},
						method: "POST",
					});

					const res = await req.json();

					// clears the loading indicator delay timer regardless of the outcome.
					clearTimeout(loadingTimerID);

					// handles non-2xx status codes by setting an error message.
					if (req.status >= 400) {
						setIsLoading(false);

						setError({
							message: res.errors?.[0]?.message || "There has been an Internal Server Error.",
							status: res.status,
						});

						return;
					}

					// handles successful submission.
					setIsLoading(false);
					setHasSubmitted(true);

					// redirects the user if the cms confirmation type is set to redirect.
					if (confirmationType === "redirect" && redirect) {
						const { url } = redirect;

						const redirectUrl = url;

						if (redirectUrl) router.push(redirectUrl);
					}
				} catch (err) {
					// handles network errors or unexpected exceptions.
					console.warn(err);
					setIsLoading(false);
					setError({
						message: "Something has gone wrong...",
					});
				}
			};

			void submitForm();
		},
		// dependencies ensure the function uses the correct form metadata for submission and redirection.
		[router, formID, redirect, confirmationType],
	);

	return (
		// primary container with max-width restriction.
		<div className="container lg:max-w-3xl">
			{/* displays the introductory content if enabled and not yet submitted. */}
			{enableIntro && introContent && !hasSubmitted && (
				<RichText className="mb-8 lg:mb-12" data={introContent} enableGutter={false} />
			)}
			<div className="border-border rounded-[0.8rem] border p-4 lg:p-6">
				{/* provides form methods to all nested field components. */}
				<FormProvider {...formMethods}>
					{/* shows the confirmation message if submission was successful and confirmation type is 'message'. */}
					{!isLoading && hasSubmitted && confirmationType === "message" && <RichText data={confirmationMessage} />}
					{/* displays a simple loading state while waiting for the api response. */}
					{isLoading && !hasSubmitted && <p>Loading, please wait...</p>}
					{/* displays the error status and message if the submission failed. */}
					{error && <div>{`${error.status || "500"}: ${error.message || ""}`}</div>}
					{/* renders the form and fields only if submission has not occurred. */}
					{!hasSubmitted && (
						<form id={formID} onSubmit={handleSubmit(onSubmit)}>
							<div className="mb-4 last:mb-0">
								{formFromProps &&
									formFromProps.fields &&
									formFromProps.fields?.map((field, index) => {
										// disables type checking for dynamic component selection from the field map.
										// eslint-disable-next-line @typescript-eslint/no-explicit-any
										const Field: React.FC<any> = fields?.[field.blockType as keyof typeof fields];
										if (Field) {
											// dynamically renders the correct field component based on the blockType.
											return (
												<div className="mb-6 last:mb-0" key={index}>
													<Field
														form={formFromProps}
														{...field}
														{...formMethods}
														control={control}
														errors={errors}
														register={register}
													/>
												</div>
											);
										}
										return null;
									})}
							</div>

							{/* renders the submit button with the custom label from the cms. */}
							<Button form={formID} type="submit" variant="default">
								{submitButtonLabel}
							</Button>
						</form>
					)}
				</FormProvider>
			</div>
		</div>
	);
};

export { FormBlock };
