import type { Header } from "@/payload-types";
import { HeaderClient } from "@/payload/blocks/globals/header/component-client";
import { getCachedGlobal } from "@/payload/utilities/get-globals";

const Header = async () => {
	const headerData: Header = await getCachedGlobal("header", 1)();

	return <HeaderClient data={headerData} />;
};

export { Header };
