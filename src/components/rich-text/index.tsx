import { cn } from "@/lib/utils";
import type { BannerBlock as BannerBlockProps, MediaBlock as MediaBlockProps } from "@/payload-types";
import { BannerBlock } from "@/payload/blocks/banner/component";
import { CodeBlock, CodeBlockProps } from "@/payload/blocks/code/component";
import { MediaBlock } from "@/payload/blocks/media/component";
import {
	DefaultNodeTypes,
	SerializedBlockNode,
	SerializedLinkNode,
	type DefaultTypedEditorState,
} from "@payloadcms/richtext-lexical";
import {
	RichText as ConvertRichText, // renamed to avoid collision
	JSXConvertersFunction,
	LinkJSXConverter,
} from "@payloadcms/richtext-lexical/react";
import React from "react";

// defines the union of default lexical node types and the custom block nodes used in this application.
type NodeTypes = DefaultNodeTypes | SerializedBlockNode<MediaBlockProps | BannerBlockProps | CodeBlockProps>;

/**
 * custom function to map internal payload document relationship data to a frontend url.
 * this ensures that internal links created in the payload editor resolve correctly
 * in the published application.
 *
 * @param linkNode - the serialized link node containing relationship details.
 * @returns the correctly formatted public url string.
 */
const internalDocToHref = ({ linkNode }: { linkNode: SerializedLinkNode }) => {
	// safely destructures the document value and relation from the link node fields.
	const { value, relationTo } = linkNode.fields.doc!;

	// ensures the related document object is fully populated as expected.
	if (typeof value !== "object") {
		throw new Error("expected value to be an object.");
	}

	// extracts the slug from the related document.
	const slug = value.slug;

	// constructs the url path based on the document's collection type.
	return relationTo === "posts" ? `/posts/${slug}` : `/${slug}`;
};

/**
 * defines the complete set of rules for converting lexical editor json into react jsx.
 * it extends the default converters and explicitly maps custom blocks to their components.
 */
const jsxConverters: JSXConvertersFunction<NodeTypes> = ({ defaultConverters }) => ({
	// includes all standard rich text formatting and element converters.
	...defaultConverters,

	// overrides the default link converter to use the custom 'internaldoc-to-href' logic.
	...LinkJSXConverter({ internalDocToHref }),

	// maps the payload block slugs to their corresponding react components.
	blocks: {
		// maps the 'banner' block, applying custom tailwind grid placement.
		banner: ({ node }) => <BannerBlock className="col-start-2 mb-4" {...node.fields} />,
		// maps the 'media' block, applying custom grid placement and presentation classes.
		media: ({ node }) => (
			<MediaBlock
				className="col-span-3 col-start-1"
				imgClassName="m-0"
				{...node.fields}
				captionClassName="mx-auto max-w-[48rem]"
				enableGutter={false} // media block handles its own gutter/container logic.
				disableInnerContainer={true}
			/>
		),
		// maps the 'code' block, applying custom tailwind grid placement.
		code: ({ node }) => <CodeBlock className="col-start-2" {...node.fields} />,
	},
});

// defines the props for the rich text component.
type Props = {
	// the required json data structure from the lexical editor field.
	data: DefaultTypedEditorState;
	// control flag to apply max-width, horizontal padding, and centering (gutter).
	enableGutter?: boolean;
	// control flag to apply tailwind typography ('prose') styling.
	enableProse?: boolean;
} & React.HTMLAttributes<HTMLDivElement>;

/**
 * the main component that accepts rich text json data and renders it as styled html.
 * it manages the application of typography and layout container styles around the content.
 */
const RichText = (props: Props) => {
	// destructures props, setting defaults for optional layout controls.
	const { className, enableProse = true, enableGutter = true, ...rest } = props;
	return (
		// uses the underlying payload rich text converter component.
		<ConvertRichText
			converters={jsxConverters} // applies the custom block and link conversion rules.
			className={cn(
				"payload-richtext",
				{
					// conditional container styling: applies max-width and centering if gutter is enabled.
					container: enableGutter,
					// removes max-width constraint if gutter is disabled.
					"max-w-none": !enableGutter,
					// applies tailwind typography classes for readable styling if prose is enabled.
					"prose md:prose-md dark:prose-invert mx-auto": enableProse,
				},
				className, // includes any external classes passed to the component.
			)}
			{...rest}
		/>
	);
};

// export the reusable rich text rendering component.
export { RichText };
