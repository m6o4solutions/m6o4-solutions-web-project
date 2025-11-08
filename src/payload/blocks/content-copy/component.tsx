import { Container } from "@/components/container";
import { RichText } from "@/components/rich-text";
import { ContentCopy } from "@/payload-types";

// renders a full-width section for displaying structured text from Payload CMS.
// the block includes an optional header and rich text content.
const ContentCopyBlock = ({ copy, headerBanner }: ContentCopy) => {
	const head = headerBanner?.headline;
	const sub = headerBanner?.subheadline;

	return (
		// section provides consistent padding and a subtle background for visual separation.
		<section className="section-spacing bg-bg-subtle">
			<Container>
				{/* render header block only if a headline or subheadline is present.
            this prevents an empty div with unwanted margin from rendering. */}
				{(head || sub) && (
					<div className="mb-16 space-y-4 text-center">
						{/* render primary title only if the 'headline' string has content. */}
						{head && <h2 className="text-balance">{head}</h2>}

						{/* render secondary text only if the 'subheadline' string has content. */}
						{sub && <p className="text-text-default mx-auto max-w-2xl text-lg">{sub}</p>}
					</div>
				)}

				{/* render the rich text content only if the 'copy' array is populated.
            it centers the text and restricts the width for optimal readability.
            'enableGutter={false}' is used to control alignment here instead of in the rich text component. */}
				{copy && <RichText className="mx-auto max-w-4xl" data={copy} enableGutter={false} />}
			</Container>
		</section>
	);
};

export { ContentCopyBlock };
