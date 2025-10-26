import { Container } from "@/components/container";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const NotFound = () => {
	return (
		<Container>
			<div className="flex min-h-[55vh] flex-col items-center justify-center px-4 text-center">
				<h1 className="text-primary mb-4 text-6xl font-bold">404</h1>
				<h2 className="text-primary mb-4 text-2xl font-semibold">Page Not Found</h2>
				<p className="text-text-default mb-8">
					Oops! The page you are looking for either does not exist or has been moved.
				</p>

				<Button className="rounded-lg font-semibold uppercase" variant="default" asChild>
					<Link href="/">Go To Homepage</Link>
				</Button>
			</div>
		</Container>
	);
};

export default NotFound;
