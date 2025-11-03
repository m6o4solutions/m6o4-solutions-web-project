import { Container } from "@/components/container";
import { Card, CardContent } from "@/components/ui/card";
import type { Archive, Post } from "@/payload-types";
import { formatDate } from "@/payload/utilities/format-date";
import config from "@payload-config";
import { Calendar } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { getPayload } from "payload";

/* combines archive block data from payload with an optional block id */
type ArchiveBlockProps = Archive & { id?: string };

/* server-side block for rendering a grid of posts.
   supports automatic population from the posts collection or manual selection.
   all data fetching happens on the server to ensure static optimization. */
const ArchiveBlock = async (props: ArchiveBlockProps) => {
	const { id, categories, limit: limitFromProps, headline, populateBy, selectedDocs, subheadline } = props;

	/* define how many posts to show, defaulting to three for layout balance */
	const limit = limitFromProps || 3;

	let posts: Post[] = [];

	/* when configured to pull posts dynamically from the collection */
	if (populateBy === "collection") {
		const payload = await getPayload({ config });

		/* extract category ids from potentially nested objects */
		const flattenedCategories = categories?.map((category) => (typeof category === "object" ? category.id : category));

		/* query posts with optional category filtering */
		const fetchedPosts = await payload.find({
			collection: "posts",
			depth: 1,
			limit,
			...(flattenedCategories && flattenedCategories.length > 0
				? {
						where: {
							categories: { in: flattenedCategories },
						},
					}
				: {}),
		});

		posts = fetchedPosts.docs;
	} else {
		/* if posts are chosen manually from the cms */
		if (selectedDocs?.length) {
			const filteredSelectedPosts = selectedDocs
				.map((post) => (typeof post.value === "object" ? post.value : undefined))
				.filter(Boolean) as Post[];

			posts = filteredSelectedPosts;
		}
	}

	return (
		<section className="section-spacing bg-white">
			<Container>
				<div className="px-3" id={`block-${id}`}>
					{/* optional section heading and subtext */}
					{(headline || subheadline) && (
						<div className="mb-16 space-y-4 text-center">
							{headline && <h2 className="text-balance">{headline}</h2>}
							{subheadline && <p className="text-text-default mx-auto max-w-2xl text-lg">{subheadline}</p>}
						</div>
					)}

					{/* grid layout for displaying post cards */}
					<div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
						{posts.map((post) => {
							const image = post.meta?.image;

							/* resolve image url and alt text gracefully */
							const imageSrc = typeof image === "string" ? image : (image?.url ?? "");
							const imageAlt = typeof image === "string" ? "" : (image?.alt ?? "");

							return (
								<Link key={post.id} href={`/posts/${post.slug}`}>
									<Card className="h-full cursor-pointer overflow-hidden bg-white p-0 shadow-lg transition-all duration-300 hover:shadow-xl">
										<div className="relative h-64 w-full">
											<Image src={imageSrc} alt={imageAlt} fill className="object-cover" />
										</div>
										<CardContent className="p-6">
											<p className="text-brand-accent mb-3 flex items-center gap-1 text-sm font-semibold">
												<Calendar className="size-4" />
												{formatDate(post.publishedAt)}
											</p>
											<h3 className="text-text-default hover:text-brand-primary mb-3 text-xl font-bold transition-colors">
												{post.title}
											</h3>
											<p className="text-text-default/80 text-base leading-relaxed">{post.meta?.description}</p>
										</CardContent>
									</Card>
								</Link>
							);
						})}
					</div>
				</div>
			</Container>
		</section>
	);
};

/* exported for use in page builder or layout configuration */
export { ArchiveBlock };
