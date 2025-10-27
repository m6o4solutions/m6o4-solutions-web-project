import { Container } from "@/components/container";
import { Button } from "@/components/ui/button";
import Link from "next/link";

/**
 * the default not found component for next.js, triggered when no matching route is found.
 * it renders a centered, styled 404 error page with a call to action to return to the homepage.
 */
const NotFound = () => {
	return (
		// wraps the content in a container component to ensure consistent max-width and padding.
		<Container>
			{/* flex container to center the content both horizontally and vertically, ensuring a minimum height. */}
			<div className="flex min-h-[55vh] flex-col items-center justify-center px-4 text-center">
				{/* prominent 404 heading. */}
				<h1 className="text-primary mb-4 text-6xl font-bold">404</h1>
				{/* explanatory secondary heading. */}
				<h2 className="text-primary mb-4 text-2xl font-semibold">page not found</h2>
				{/* descriptive message for the user. */}
				<p className="text-text-default mb-8">
					oops! the page you are looking for either does not exist or has been moved.
				</p>

				{/* button component styled as a primary call to action. */}
				<Button className="rounded-lg font-semibold uppercase" variant="default" asChild>
					{/* next/link component rendered inside the button due to 'aschild',
                        directing the user to the root path. */}
					<Link href="/">go to homepage</Link>
				</Button>
			</div>
		</Container>
	);
};

// export the component as default for use by next.js's file-based routing system.
export { NotFound as default };
