import { RichText } from "@/components/rich-text";
import { Width } from "@/payload/blocks/forms/width";
import { DefaultTypedEditorState } from "@payloadcms/richtext-lexical";

// defines the required prop for the rich text editor's state object.
type MessageProps = {
	message: DefaultTypedEditorState;
};

// displays rich text content from a payload CMS lexical field.
const Message = ({ message }: MessageProps) => {
	return (
		// contains the rich text content, setting full width and providing vertical spacing for visual separation.
		<Width className="my-12" width="100">
			{/* prevents rendering the rich text component if the message data is null or undefined. */}
			{message && <RichText data={message} />}
		</Width>
	);
};

export { Message };
