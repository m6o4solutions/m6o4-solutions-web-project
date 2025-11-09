"use client";

import { Container } from "@/components/container";
import { RichText } from "@/components/rich-text";
import { Button } from "@/components/ui/button";
import { fields } from "@/payload/blocks/forms/fields";
import { getClientSideURL } from "@/payload/utilities/get-url";
import type { FormFieldBlock } from "@payloadcms/plugin-form-builder/types";
import type { DefaultTypedEditorState } from "@payloadcms/richtext-lexical";
import { LoaderCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";

// minimal shape of a form object expected from payload
type LocalFormType = {
	id?: string;
	fields?: FormFieldBlock[];
	confirmationMessage?: DefaultTypedEditorState;
	confirmationType?: "message" | "redirect";
	redirect?: { url?: string };
	submitButtonLabel?: string;
};

// defines a form block as structured in payload cms
export type FormBlockType = {
	blockName?: string;
	blockType?: "formBlock";
	enableIntro?: boolean;
	form: LocalFormType;
	introContent?: DefaultTypedEditorState;
	enableCompanionText?: boolean;
	companionText?: DefaultTypedEditorState;
};

// combines cms-provided form block with optional id for unique instances
type FormBlockProps = { id?: string } & FormBlockType;

// named export for use across pages or layouts
export function FormBlock(props: FormBlockProps) {
	const {
		enableIntro,
		introContent,
		enableCompanionText,
		companionText,
		form: formFromProps,
		form: { id: formID, confirmationMessage, confirmationType, redirect, submitButtonLabel } = {},
	} = props;

	// enables programmatic navigation for redirect confirmations
	const router = useRouter();

	// initializes react-hook-form with a generic structure to handle dynamic cms fields
	const formMethods = useForm<Record<string, any>>({
		defaultValues: {},
	});

	const {
		control,
		formState: { errors },
		handleSubmit,
		register,
	} = formMethods;

	// state used for submission lifecycle and user feedback
	const [isLoading, setIsLoading] = useState(false);
	const [hasSubmitted, setHasSubmitted] = useState<boolean>();
	const [error, setError] = useState<{ message: string; status?: string } | undefined>();

	// handles form submission and communicates with the api route
	const onSubmit = useCallback(
		(data: Record<string, any>) => {
			let loadingTimerID: ReturnType<typeof setTimeout>;

			const submitForm = async () => {
				setError(undefined);

				// show loader only if request takes long enough to justify it
				loadingTimerID = setTimeout(() => {
					setIsLoading(true);
				}, 1000);

				// transform form data into the payload-compatible array format
				const dataToSend = Object.entries(data).map(([name, value]) => ({
					field: name,
					value,
				}));

				try {
					const req = await fetch(`${getClientSideURL()}/api/form-submissions`, {
						body: JSON.stringify({
							form: formID,
							submissionData: dataToSend,
						}),
						headers: { "Content-Type": "application/json" },
						method: "POST",
					});

					const res = await req.json();
					clearTimeout(loadingTimerID);

					// handle server-side validation or internal error
					if (req.status >= 400) {
						setIsLoading(false);
						setError({
							message: res.errors?.[0]?.message || "internal server error",
							status: String(res.status),
						});
						return;
					}

					// mark submission as successful and handle redirect
					setIsLoading(false);
					setHasSubmitted(true);

					if (confirmationType === "redirect" && redirect?.url) {
						router.push(redirect.url);
					}
				} catch (err) {
					console.warn(err);
					clearTimeout(loadingTimerID);
					setIsLoading(false);
					setError({
						message: "something went wrong while submitting the form...",
					});
				}
			};

			void submitForm();
		},
		[router, formID, redirect, confirmationType],
	);

	return (
		<section className="section-spacing bg-bg-subtle">
			<Container className="lg:max-w-4xl">
				{/* show intro and companion content before submission */}
				{!hasSubmitted && (
					<>
						{enableCompanionText && companionText && (
							<RichText
								className="mb-8 text-center md:text-start lg:mb-12"
								data={companionText || ({} as DefaultTypedEditorState)}
							/>
						)}
					</>
				)}

				{/* visually separates form area */}
				<div className="border-border-subtle rounded-[0.8rem] border bg-white p-4 lg:p-6">
					<FormProvider {...formMethods}>
						{/* display confirmation message when form submission succeeds */}
						{!isLoading && hasSubmitted && confirmationType === "message" && (
							<RichText className="text-center" data={confirmationMessage || ({} as DefaultTypedEditorState)} />
						)}

						{/* loading indicator for async submissions */}
						{isLoading && !hasSubmitted && (
							<p className="text-muted-foreground mb-4 flex items-center">
								<LoaderCircle className="me-2 h-4 w-4 animate-spin" /> loading, please wait...
							</p>
						)}

						{/* display descriptive error if submission fails */}
						{error && <div className="mb-4 text-red-400">{`${error.status || "error"}: ${error.message || ""}`}</div>}

						{/* render all form fields before submission */}
						{!hasSubmitted && (
							<form id={formID} onSubmit={handleSubmit(onSubmit)}>
								<div className="mb-4 last:mb-0">
									{formFromProps?.fields?.map((field, index) => {
										// dynamically load the correct field component type
										const Field = fields?.[field.blockType as keyof typeof fields] as any;
										if (!Field) return null;

										return (
											<div className="mb-6 last:mb-0" key={index}>
												<Field form={formFromProps} {...field} control={control} errors={errors} register={register} />
											</div>
										);
									})}
								</div>

								{/* submit button with spinner feedback */}
								<Button form={formID} type="submit" variant="default" disabled={isLoading}>
									{isLoading ? (
										<>
											<LoaderCircle className="me-2 h-4 w-4 animate-spin" /> submitting...
										</>
									) : (
										submitButtonLabel || "submit"
									)}
								</Button>
							</form>
						)}
					</FormProvider>
				</div>
			</Container>
		</section>
	);
}
