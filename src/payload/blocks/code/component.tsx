import { Code } from "@/payload/blocks/code/component-client";
import React from "react";

// core data structure required for the code content block.
export type CodeBlockProps = {
	// the source code string to be displayed and highlighted.
	code: string;
	// the programming language for syntax highlighting (optional).
	language?: string;
	// explicit type identifier for the payload block structure.
	blockType: "code";
};

// component props, extending the core data structure with presentation overrides.
type Props = CodeBlockProps & {
	// custom tailwind classes for the outer container.
	className?: string;
};

/**
 * renders a server component wrapper for the client-side code highlighting component.
 * this component acts as the presentation layer for the payload 'code' block.
 */
const CodeBlock = ({ className, code, language }: Props) => {
	return (
		// merges external and internal classes, adding 'not-prose' to prevent
		// tailwind typography from overriding the custom code block styles.
		<div className={[className, "not-prose"].filter(Boolean).join(" ")}>
			{/* delegates rendering and client-side interactivity (copy) to the client component. */}
			<Code code={code} language={language} />
		</div>
	);
};

// export the block for use in rich text or layouts.
export { CodeBlock };
