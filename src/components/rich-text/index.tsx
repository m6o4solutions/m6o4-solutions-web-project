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
	RichText as ConvertRichText, // renamed to avoid collision with this component's name
	JSXConvertersFunction,
	LinkJSXConverter,
} from "@payloadcms/richtext-lexical/react";

// defines the custom structure of block nodes expected within the lexical data.
type NodeTypes = DefaultNodeTypes | SerializedBlockNode<MediaBlockProps | BannerBlockProps | CodeBlockProps>;

/**
 * @function internalDocToHref
 * @description custom function to translate internal document link data (from Payload)
 * into a usable frontend url path (e.g., converting a 'post' relationship slug to '/posts/[slug]').
 * this is passed to the LinkJSXConverter to handle internal links correctly.
 */
const internalDocToHref = ({ linkNode }: { linkNode: SerializedLinkNode }) => {
	const { value, relationTo } = linkNode.fields.doc!;
	if (typeof value !== "object") {
		throw new Error("Expected value to be an object.");
	}
	const slug = value.slug;
	return relationTo === "posts" ? `/posts/${slug}` : `/${slug}`;
};

/**
 * @function jsxConverters
 * @description defines the comprehensive set of rules for converting lexical json nodes
 * into react jsx elements. this is where custom payload blocks are mapped to their
 * corresponding react components.
 */
const jsxConverters: JSXConvertersFunction<NodeTypes> = ({ defaultConverters }) => ({
	// includes standard formatting converters (bold, italic, lists, etc.).
	...defaultConverters,
	// customizes link handling using the internalDocToHref function defined above.
	...LinkJSXConverter({ internalDocToHref }),
	// defines custom block rendering rules:
	blocks: {
		banner: ({ node }) => <BannerBlock className="col-start-2 mb-4" {...node.fields} />,
		media: ({ node }) => (
			<MediaBlock
				className="col-span-3 col-start-1"
				imgClassName="m-0"
				{...node.fields}
				captionClassName="mx-auto max-w-[48rem]"
				enableGutter={false}
				disableInnerContainer={true}
			/>
		),
		code: ({ node }) => <CodeBlock className="col-start-2" {...node.fields} />,
	},
});

// defines the component props, including the required rich text data and optional layout controls.
type Props = {
	data: DefaultTypedEditorState; // the json state from the lexical editor.
	enableGutter?: boolean; // controls whether to use a container for centering/padding.
	enableProse?: boolean; // controls whether to apply Tailwind Typography styles.
} & React.HTMLAttributes<HTMLDivElement>;

/**
 * @component RichText
 * @description the main component that renders payload lexical rich text.
 * it takes the json data, applies custom block converters, and styles the output
 * using tailwind utility classes, including the 'prose' styling for typography.
 */
const RichText = (props: Props) => {
	const { className, enableProse = true, enableGutter = true, ...rest } = props;
	return (
		<ConvertRichText
			converters={jsxConverters} // passes the custom converter rules
			className={cn(
				"payload-richtext",
				{
					// conditional styling based on props:
					container: enableGutter, // apply max-width/centering if gutter is enabled
					"max-w-none": !enableGutter, // override max-width if gutter is disabled
					"prose md:prose-md dark:prose-invert mx-auto": enableProse, // apply tailwind typography styles
				},
				className, // merges any user-provided classes
			)}
			{...rest}
		/>
	);
};

export { RichText };
