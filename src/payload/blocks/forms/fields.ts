import { Checkbox } from "@/payload/blocks/forms/checkbox";
import { Country } from "@/payload/blocks/forms/country";
import { Email } from "@/payload/blocks/forms/email";
import { Message } from "@/payload/blocks/forms/message";
import { Number } from "@/payload/blocks/forms/number";
import { Select } from "@/payload/blocks/forms/select";
import { Text } from "@/payload/blocks/forms/text";
import { Textarea } from "@/payload/blocks/forms/textarea";

// maps payload cms form field types (keys) to their corresponding react components (values).
const fields = {
	checkbox: Checkbox,
	country: Country,
	email: Email,
	message: Message,
	number: Number,
	select: Select,
	text: Text,
	textarea: Textarea,
};

// exports the field map object for use in dynamically rendering form fields.
export { fields };
