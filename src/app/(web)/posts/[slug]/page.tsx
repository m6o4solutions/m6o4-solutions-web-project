import { Container } from "@/components/container";
import { LivePreviewListener } from "@/components/live-preview-listener";
import { PayloadRedirects } from "@/components/payload-redirects";
import { RichText } from "@/components/rich-text";
import { formatAuthors } from "@/payload/utilities/format-authors";
import { formatDate } from "@/payload/utilities/format-date";
import { generateMeta } from "@/payload/utilities/generate-meta";
import config from "@payload-config";
import type { Metadata } from "next";
import { draftMode } from "next/headers";
import Image from "next/image";
import { getPayload } from "payload";
import { cache, Fragment } from "react";

/* statically generate route params for posts to support prerendering.
   only retrieves slugs to minimize payload size. */
const generateStaticParams = async () => {
	const payload = await getPayload({ config });
	const posts = await payload.find({
		collection: "posts",
		draft: false,
		limit: 100,
		overrideAccess: false,
		pagination: false,
		select: { slug: true },
	});

	return posts.docs.map(({ slug }) => ({ slug }));
};

type Args = { params: Promise<{ slug?: string }> };

/* cached query function to fetch a single post by slug.
   enables server caching and reduces redundant data fetching between calls. */
const queryPostBySlug = cache(async ({ slug }: { slug: string }) => {
	const { isEnabled: draft } = await draftMode();
	const payload = await getPayload({ config });
	const result = await payload.find({
		collection: "posts",
		draft,
		limit: 1,
		overrideAccess: draft,
		pagination: false,
		where: { slug: { equals: slug } },
	});

	return result.docs?.[0] || null;
});

/* builds seo metadata dynamically from post content and meta configuration */
const generateMetadata = async ({ params: paramsPromise }: Args): Promise<Metadata> => {
	const { slug = "" } = await paramsPromise;
	const post = await queryPostBySlug({ slug });
	return generateMeta({ doc: post });
};

/* server-rendered page component for displaying a single blog post.
   supports draft preview mode and redirects for unpublished or missing content. */
const Page = async ({ params: paramsPromise }: Args) => {
	const { isEnabled: draft } = await draftMode();
	const { slug = "" } = await paramsPromise;
	const url = "/posts/" + slug;
	const post = await queryPostBySlug({ slug });

	if (!post) return <PayloadRedirects url={url} />;

	const { content, categories, heroImage, populatedAuthors, publishedAt, title } = post;
	const hasAuthors = populatedAuthors && populatedAuthors.length > 0 && formatAuthors(populatedAuthors) !== "";
	const image = heroImage;
	const imageSrc = typeof image === "string" ? image : (image?.url ?? "");
	const imageAlt = typeof image === "string" ? "" : (image?.alt ?? "");

	return (
		<section className="pt-10 pb-20">
			<Container>
				{/* manages redirects if the post has moved or is unpublished */}
				<PayloadRedirects disableNotFound url={url} />

				{/* enables live preview updates while editing in payload cms */}
				{draft && <LivePreviewListener />}

				<div className="mx-auto max-w-5xl">
					{/* category tags displayed above the post title */}
					<div className="text-text-default mb-6 text-sm uppercase">
						{categories?.map((category, index) => {
							if (typeof category === "object" && category !== null) {
								const titleToUse = category.title || "Untitled category";
								const isLast = index === categories.length - 1;
								return (
									<Fragment key={index}>
										{titleToUse}
										{!isLast && <Fragment>, &nbsp;</Fragment>}
									</Fragment>
								);
							}
							return null;
						})}
					</div>

					{/* post headline */}
					<h1 className="text-text-default mb-6 text-4xl leading-tight font-bold text-balance md:text-5xl">{title}</h1>

					{/* author and publication info */}
					<div className="text-text-default mb-6 flex flex-col gap-4 md:flex-row md:gap-16">
						{hasAuthors && (
							<div className="flex flex-col gap-4">
								<div className="flex flex-col gap-1">
									<p className="text-sm">Author</p>
									<p>{formatAuthors(populatedAuthors)}</p>
								</div>
							</div>
						)}
						{publishedAt && (
							<div className="flex flex-col gap-1">
								<p className="text-sm">Date Published</p>
								<time dateTime={publishedAt}>{formatDate(publishedAt)}</time>
							</div>
						)}
					</div>

					{/* hero image for visual context */}
					<div className="relative mb-12 h-[400px] w-full overflow-hidden rounded-lg md:h-[500px]">
						<div className="absolute inset-0">
							<Image src={imageSrc} alt={imageAlt} fill priority className="object-cover" />
						</div>
					</div>

					{/* main post body rendered via rich text editor content */}
					<RichText className="mx-auto max-w-4xl" data={content} enableGutter={false} />
				</div>
			</Container>
		</section>
	);
};

/* exports the page component and its supporting static functions for next.js routing */
export { Page as default, generateStaticParams, generateMetadata };
