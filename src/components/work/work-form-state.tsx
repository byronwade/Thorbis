import type { ReactNode } from "react";

type WorkFormStateProps = {
	title: string;
	description: string;
	action?: ReactNode;
};

export function WorkFormState({
	title,
	description,
	action,
}: WorkFormStateProps) {
	return (
		<div className="flex h-full flex-col items-center justify-center gap-4 p-8 text-center">
			<div>
				<h2 className="font-semibold text-2xl">{title}</h2>
				<p className="text-muted-foreground">{description}</p>
			</div>
			{action}
		</div>
	);
}
