"use client";

import { Button } from "@/components/ui/button";
import { CopyIcon } from "@payloadcms/ui/icons/Copy";
import { useState } from "react";

/**
 * a client-side button component designed to be placed near a code block.
 * it copies the provided code string to the user's clipboard and provides
 * visual feedback by changing the button's text temporarily.
 */
const CopyButton = ({ code }: { code: string }) => {
	// state to manage the button's text: 'copy' or 'copied!'.
	const [text, setText] = useState("copy");

	/**
	 * updates the button's status text to 'copied!' and sets a timeout
	 * to revert the text back to 'copy' after a short delay (1 second).
	 */
	function updateCopyStatus() {
		if (text === "copy") {
			setText("copied!");
			setTimeout(() => {
				setText("copy");
			}, 1000);
		}
	}

	return (
		// container to align the button to the right of its parent element.
		<div className="flex justify-end align-middle">
			<Button
				className="flex gap-1"
				variant={"secondary"}
				// handle the click event to perform the clipboard operation.
				onClick={async () => {
					// uses the modern clipboard api to copy the code text.
					await navigator.clipboard.writeText(code);
					// trigger the visual feedback.
					updateCopyStatus();
				}}
			>
				{/* button text driven by the component's state. */}
				<p>{text}</p>
				{/* a visual icon to denote the copy action. */}
				<CopyIcon />
			</Button>
		</div>
	);
};

// export the component for use in code block rendering.
export { CopyButton };
