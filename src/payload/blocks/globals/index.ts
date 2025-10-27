import { Branding } from "@/payload/blocks/globals/branding/schema";
import { Footer } from "@/payload/blocks/globals/footer/schema";
import { Header } from "@/payload/blocks/globals/header/schema";

/**
 * an array containing all global singletons for the payload configuration.
 * this list is used to register all global collections at the entry point.
 */
const globals = [Header, Footer, Branding];

// export the array for use in the main payload config file.
export { globals };
