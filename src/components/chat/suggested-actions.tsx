"use client";

type SuggestedActionsProps = {
	onSelect: (prompt: string) => void;
};

const suggestions = [
	"What are the advantages of using Next.js?",
	"Write code to demonstrate Dijkstra's algorithm",
	"Help me write an essay about Silicon Valley",
	"What is the weather in San Francisco?",
];

export function SuggestedActions({ onSelect }: SuggestedActionsProps) {
	return (
		<div
			className="grid w-full gap-2 sm:grid-cols-2"
			data-testid="suggested-actions"
		>
			{suggestions.map((suggestion, index) => (
				<div key={index} style={{ opacity: 1, transform: "none" }}>
					<button
						className="inline-flex h-auto w-full cursor-pointer items-center justify-center gap-2 whitespace-normal rounded-full border border-input bg-background p-3 text-left font-medium text-sm ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0"
						onClick={() => onSelect(suggestion)}
						type="button"
					>
						{suggestion}
					</button>
				</div>
			))}
		</div>
	);
}
