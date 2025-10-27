"use client";

import { CopyButton } from "@/payload/blocks/code/copy-button";
import { Highlight, themes } from "prism-react-renderer";
import React from "react";

type Props = {
	// the source code string to display.
	code: string;
	// the programming language for syntax highlighting (optional, defaults to empty string).
	language?: string;
};

/**
 * a client-side component that displays and highlights source code using prism-react-renderer.
 * it renders a dark-themed code block with line numbers and an integrated copy-to-clipboard button.
 */
const Code = ({ code, language = "" }: Props) => {
	// prevents rendering if no code content is provided.
	if (!code) return null;

	return (
		// prism-react-renderer's high-order component to manage tokenization and highlighting logic.
		<Highlight code={code} language={language} theme={themes.vsDark}>
			{({ getLineProps, getTokenProps, tokens }) => (
				// the main pre element for the code block, styled with a dark theme, border, and overflow.
				<pre className="border-border relative overflow-x-auto rounded border bg-black p-4 text-xs">
					{tokens.map((line, i) => (
						// map over each line of code.
						<div key={i} {...getLineProps({ className: "table-row", line })}>
							{/* line number display, styled to be non-selectable and aligned to the right. */}
							<span className="table-cell pr-4 text-right text-white/25 select-none">{i + 1}</span>
							{/* container for the highlighted code tokens of the line. */}
							<span className="table-cell">
								{/* map over each token (word/symbol) in the line for individual styling. */}
								{line.map((token, key) => (
									<span key={key} {...getTokenProps({ token })} />
								))}
							</span>
						</div>
					))}
					{/* places the client-side copy button inside the pre element for easy access. */}
					<CopyButton code={code} />
				</pre>
			)}
		</Highlight>
	);
};

// export the client component for use in the server-side code block wrapper.
export { Code };
