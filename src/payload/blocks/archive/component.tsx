import { RichText } from "@/components/rich-text";
import { Card, CardContent } from "@/components/ui/card";
import type { Archive, Post } from "@/payload-types";
import { formatDate } from "@/payload/utilities/format-date";
import config from "@payload-config";
import Image from "next/image";
import Link from "next/link";
import { getPayload } from "payload";

// component props type, combining the payload 'archive' block data with an optional block id.
type ArchiveBlockProps = Archive & { id?: string };

/**
 * a server component block that dynamically fetches and displays a list of posts
 * in a responsive card grid. it supports two methods for populating the list:
 * 1. dynamically querying the 'posts' collection (with category filters and limit).
 * 2. manually displaying a selection of posts.
 *
 * this component runs on the server to handle data fetching before rendering.
 */
const ArchiveBlock = async (props: ArchiveBlockProps) => {
	// destructure properties for use in logic and rendering.
	const { id, categories, introContent, limit: limitFromProps, populateBy, selectedDocs } = props;

	// determine the maximum number of posts to display, defaulting to 3.
	const limit = limitFromProps || 3;

	let posts: Post[] = [];

	// logic branch for populating the post list.
	if (populateBy === "collection") {
		// initialize payload instance for server-side data fetching.
		const payload = await getPayload({ config: config });

		// normalize category data: extract the id string from potentially populated category objects.
		const flattenedCategories = categories?.map((category) => {
			if (typeof category === "object") return category.id;
			else return category;
		});

		// query the 'posts' collection with depth 1 to retrieve metadata images and authors.
		const fetchedPosts = await payload.find({
			collection: "posts",
			depth: 1,
			limit,
			// conditionally construct the 'where' query to filter by selected categories.
			...(flattenedCategories && flattenedCategories.length > 0
				? {
						where: {
							categories: {
								// filter posts whose 'categories' array contains any of the selected category ids.
								in: flattenedCategories,
							},
						},
					}
				: {}),
		});

		// assign the fetched documents to the posts array.
		posts = fetchedPosts.docs;
	} else {
		// if populateby is set to manual selection.
		if (selectedDocs?.length) {
			// safely extract the fully populated post objects from the selecteddocs array.
			const filteredSelectedPosts = selectedDocs
				.map((post) => {
					// post.value is the populated document when depth is used, otherwise it's just the id.
					if (typeof post.value === "object") return post.value;
				})
				.filter(Boolean) as Post[]; // filter out any null/undefined results.

			posts = filteredSelectedPosts;
		}
	}

	return (
		// main wrapper for the block with padding and background.
		<div className="bg-white px-4 py-20">
			<div className="mx-auto max-w-6xl">
				{/* inner container, using the block id for potential anchor links. */}
				<div className="px-3" id={`block-${id}`}>
					{/* render introductory rich text content if provided by the editor. */}
					{introContent && <RichText className="mx-auto mb-6 max-w-200" data={introContent} enableGutter={false} />}

					{/* responsive grid container for the post cards. */}
					<div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
						{/* map over the final list of posts and render a card for each. */}
						{posts.map((post) => {
							const image = post.meta?.image;

							// safely extract the image url, falling back to a default asset path if the image object is missing or incomplete.
							const imageSrc = typeof image === "string" ? image : (image?.url ?? "/way-finding-og.webp");

							// safely extract the image alt text, falling back to a generic description.
							const imageAlt = typeof image === "string" ? "post image" : (image?.alt ?? "post image");

							return (
								// wrap the card in a next/link to make the entire card clickable.
								<Link key={post.id} href={`/posts/${post.slug}`}>
									<Card className="h-full cursor-pointer overflow-hidden bg-white p-0 shadow-lg transition-all duration-300 hover:shadow-xl">
										{/* image container to control aspect ratio and layout. */}
										<div className="relative h-64 w-full">
											{/* next/image component for optimization, using object-cover to maintain aspect ratio. */}
											<Image src={imageSrc} alt={imageAlt} fill className="object-cover" />
										</div>
										<CardContent className="p-6">
											{/* published date, formatted using a utility for consistent presentation. */}
											<p className="mb-3 text-sm font-semibold text-[#B2D2C2]">{formatDate(post.publishedAt)}</p>
											{/* post title with hover effect. */}
											<h3 className="mb-3 text-xl font-bold text-[#1A233D] transition-colors hover:text-[#49536C]">
												{post.title}
											</h3>
											{/* post excerpt/description. */}
											<p className="leading-relaxed text-[#49536C]">{post.meta?.description}</p>
										</CardContent>
									</Card>
								</Link>
							);
						})}
					</div>
				</div>
			</div>
		</div>
	);
};

// export the block component for use in layout configurations.
export { ArchiveBlock };
