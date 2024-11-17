"use client";

import { useMemoizedFunction } from "@/lib/utils/memoization";
import { FormEvent } from "react";

export function SettingsForm() {
	const handleSubmit = useMemoizedFunction((e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		// Handle form submission
	}, []);

	return (
		<form onSubmit={handleSubmit} className="space-y-6">
			<div>
				<h3 className="text-lg font-medium">General Settings</h3>
				<p className="text-sm text-muted-foreground">Configure your general preferences</p>
			</div>
			{/* Add form fields here */}
		</form>
	);
}
