import { cn } from "@/lib/utils";
import type { BannerBlock as BannerBlockProps, MediaBlock as MediaBlockProps } from "@/payload-types";
import { BannerBlock } from "@/payload/blocks/banner/component";
import { CodeBlock, CodeBlockProps } from "@/payload/blocks/code/component";
import { MediaBlock } from "@/payload/blocks/media/component";
import { DefaultNodeTypes, SerializedBlockNode, SerializedLinkNode } from "@payloadcms/richtext-lexical";
import {
	RichText as ConvertRichText,
	JSXConvertersFunction,
	LinkJSXConverter,
} from "@payloadcms/richtext-lexical/react";
import { ComponentPropsWithoutRef, HTMLAttributes } from "react";

// defines all node types that may appear within lexical data, including custom payload blocks
type NodeTypes = DefaultNodeTypes | SerializedBlockNode<MediaBlockProps | BannerBlockProps | CodeBlockProps>;

// translates internal payload document links into usable frontend urls
const internalDocToHref = ({ linkNode }: { linkNode: SerializedLinkNode }) => {
	const { value, relationTo } = linkNode.fields.doc!;

	// ensure the link target is a valid object
	if (typeof value !== "object") throw new Error("expected value to be an object.");

	const slug = value.slug;

	// route posts to /posts and other content to root-level paths
	return relationTo === "posts" ? `/posts/${slug}` : `/${slug}`;
};

// defines how lexical json nodes should render as react elements
const jsxConverters: JSXConvertersFunction<NodeTypes> = ({ defaultConverters }) => ({
	...defaultConverters,
	...LinkJSXConverter({ internalDocToHref }),
	blocks: {
		// renders banner blocks with centered alignment and bottom spacing
		banner: ({ node }) => <BannerBlock className="col-start-2 mb-4" {...node.fields} />,
		// renders media blocks spanning full width while maintaining consistent styling
		media: ({ node }) => (
			<MediaBlock
				className="col-span-3 col-start-1"
				imgClassName="m-0"
				{...node.fields}
				captionClassName="mx-auto max-w-[48rem]"
				enableGutter={false}
				disableInnerContainer
			/>
		),
		// renders code blocks centered in the layout grid
		code: ({ node }) => <CodeBlock className="col-start-2" {...node.fields} />,
	},
});

type ConvertRichTextProps = ComponentPropsWithoutRef<typeof ConvertRichText>;

type ConvertRichTextData = ConvertRichTextProps["data"];

// defines props for controlling layout and typography behavior
type Props = {
	data: ConvertRichTextData | null | undefined;
	enableGutter?: boolean;
	enableProse?: boolean;
} & HTMLAttributes<HTMLDivElement>;

// converts lexical json into html output, applying typography and layout options
const RichText = (props: Props) => {
	const { className, enableProse = true, enableGutter = true, data, ...rest } = props;

	// if data is null or undefined, return null to prevent component failure
	if (!data) return null;

	// merges conditional layout and typography classes based on component configuration
	return (
		<ConvertRichText
			converters={jsxConverters}
			data={data}
			className={cn(
				"payload-richtext",
				{
					container: enableGutter,
					"max-w-none": !enableGutter,
					"prose md:prose-md dark:prose-invert mx-auto": enableProse,
				},
				className,
			)}
			{...rest}
		/>
	);
};

// export component as a named arrow function for consistent usage across modules
export { RichText };
