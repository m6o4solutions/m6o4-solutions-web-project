"use client";

import clarity from "@microsoft/clarity";
import { useEffect } from "react";

const ClarityTrackerDev = () => {
	useEffect(() => {
		const clarityId = process.env.NEXT_PUBLIC_CLARITY_ID;

		// LOGGING FOR DEBUGGING (Remove after fixing)
		console.log("Clarity Debug - Env:", process.env.NODE_ENV);
		console.log("Clarity Debug - ID Present:", !!clarityId);

		// we temporarily removed the 'production' check to force it to run
		// on your local machine or preview links for testing purposes.
		if (clarityId) {
			try {
				clarity.init(clarityId);
				console.log("Clarity Debug - Init called successfully");
			} catch (e) {
				console.error("Clarity Debug - Init failed", e);
			}
		} else {
			console.error("Clarity Debug - Missing ID");
		}
	}, []);

	return null;
};

export { ClarityTrackerDev };
