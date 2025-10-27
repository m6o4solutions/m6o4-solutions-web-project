import PageTemplate, { generateMetadata } from "@/app/(web)/[slug]/page";

/**
 * this file serves as a root-level page for the homepage (/) route.
 * it re-exports the main page component and metadata generation function
 * from the dynamic page slug route ([slug]/page.tsx).
 *
 * intent: this structure allows the root path (/) to render using the same
 * template and data fetching logic as all other static pages, treating the
 * homepage as a 'page' document with the slug 'home'.
 */
// export the page component as default for next.js to render the homepage.
export { PageTemplate as default, generateMetadata };
