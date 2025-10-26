import { Media } from "@/payload-types";
import config from "@payload-config";
import Image from "next/image";
import { getPayload } from "payload";
import React from "react";

const Logo = async () => {
	const payload = await getPayload({ config: config });

	const branding = await payload.findGlobal({ slug: "branding" });

	const logo = branding.organizationLogo as Media;

	return (
		<>
			<Image src={logo?.url || ""} alt={logo?.alt || ""} width={100} height={100} priority />
		</>
	);
};

export { Logo };
