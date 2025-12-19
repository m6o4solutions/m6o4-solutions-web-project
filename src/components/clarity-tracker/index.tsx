"use client";

import clarity from "@microsoft/clarity";
import { useEffect } from "react";

const ClarityTracker = () => {
	useEffect(() => {
		const clarityId = process.env.NEXT_PUBLIC_CLARITY_ID;

		// enable tracking only in production to maintain data integrity
		if (process.env.NODE_ENV === "production" && clarityId) {
			clarity.init(clarityId);
		}

		// notify the developer when tracking is skipped to aid in debugging
		else if (process.env.NODE_ENV === "development") {
			if (!clarityId) {
				console.warn("Clarity skipped: NEXT_PUBLIC_CLARITY_ID is missing from your .env file.");
			} else {
				console.log("Clarity is configured but disabled in development mode.");
			}
		}
	}, []);

	return null;
};

export { ClarityTracker };
