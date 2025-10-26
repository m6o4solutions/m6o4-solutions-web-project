import type { Footer } from "@/payload-types";
import { FooterClient } from "@/payload/blocks/globals/footer/component-client";
import { getCachedGlobal } from "@/payload/utilities/get-globals";

const Footer = async () => {
	const footerData: Footer = await getCachedGlobal("footer", 1)();

	return <FooterClient data={footerData} />;
};

export { Footer };
