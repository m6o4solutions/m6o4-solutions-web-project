import { Container } from "@/components/container";
import { Card, CardContent } from "@/components/ui/card";
import type { Archive, Post } from "@/payload-types";
import { formatDate } from "@/payload/utilities/format-date";
import config from "@payload-config";
import { Calendar } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { getPayload } from "payload";

/* extends the archive block definition to include an optional id for section anchoring */
type ArchiveBlockProps = Archive & { id?: string };

/* async server component responsible for rendering a post archive grid.
   supports both dynamic population from the posts collection and manual selection from the cms.
   all content fetching occurs server-side for performance and static optimization. */
const ArchiveBlock = async (props: ArchiveBlockProps) => {
	const {
		id,
		backgroundColor,
		categories,
		limit: limitFromProps,
		headline,
		populateBy,
		selectedDocs,
		subheadline,
	} = props;

	/* fallback ensures consistent layout even when limit is not explicitly set */
	const limit = limitFromProps || 3;

	let posts: Post[] = [];

	/* handle auto population by querying posts directly from the payload collection */
	if (populateBy === "collection") {
		const payload = await getPayload({ config });

		/* normalize category references to raw ids to ensure reliable querying */
		const flattenedCategories = categories?.map((category) => (typeof category === "object" ? category.id : category));

		/* retrieve posts, optionally filtering by assigned categories */
		const fetchedPosts = await payload.find({
			collection: "posts",
			depth: 1,
			limit,
			...(flattenedCategories && flattenedCategories.length > 0
				? { where: { categories: { in: flattenedCategories } } }
				: {}),
		});

		posts = fetchedPosts.docs;
	} else {
		/* handle manual population by filtering selected cms entries */
		if (selectedDocs?.length) {
			const filteredSelectedPosts = selectedDocs
				.map((post) => (typeof post.value === "object" ? post.value : undefined))
				.filter(Boolean) as Post[];

			posts = filteredSelectedPosts;
		}
	}

	/* apply background color theme for visual contrast across sections */
	const bgClass = backgroundColor === "subtle" ? "bg-[#f5f7fa]" : "bg-[#ffffff]";

	return (
		<section className={`section-spacing ${bgClass}`}>
			<Container>
				<div className="px-3" id={`block-${id}`}>
					{/* display section heading if defined to provide content context */}
					{(headline || subheadline) && (
						<div className="mb-16 space-y-4 text-center">
							{headline && <h2 className="text-balance">{headline}</h2>}
							{subheadline && <p className="text-text-default mx-auto max-w-2xl text-lg">{subheadline}</p>}
						</div>
					)}

					{/* render a responsive grid of posts */}
					<div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
						{posts.map((post) => {
							const image = post.meta?.image;

							/* gracefully handle mixed image data types for consistency */
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

/* exported for integration within dynamic page layouts or block builders */
export { ArchiveBlock };
