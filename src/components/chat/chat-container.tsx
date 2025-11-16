"use client";

import type { UIMessage } from "@ai-sdk/react";
import type { FormEvent } from "react";
import { ChatMessage, ThinkingMessage } from "./message";
import { MultimodalInput } from "./multimodal-input";
import { SuggestedActions } from "./suggested-actions";

type ChatContainerProps = {
	messages: UIMessage[];
	input: string;
	onInputChange: (e: React.ChangeEvent<HTMLTextAreaElement> | React.ChangeEvent<HTMLInputElement>) => void;
	onSubmit: (e: FormEvent<HTMLFormElement>, options?: { data?: Record<string, string> }) => void;
	isLoading: boolean;
	onStop: () => void;
};

export function ChatContainer({ messages, input, onInputChange, onSubmit, isLoading, onStop }: ChatContainerProps) {
	const handleSuggestedAction = (prompt: string) => {
		// Simulate form submission with the suggested prompt
		const syntheticEvent = {
			preventDefault: () => {},
			currentTarget: document.createElement("form"),
		} as FormEvent<HTMLFormElement>;

		// Set input value
		(onInputChange as any)({
			target: { value: prompt },
		});

		// Submit after a brief delay to allow input to update
		setTimeout(() => {
			onSubmit(syntheticEvent);
		}, 10);
	};

	return (
		<div className="mx-auto flex h-full w-full max-w-7xl flex-col">
			{/* Messages Area */}
			<div className="flex-1 overflow-y-auto">
				<div className="mx-auto flex max-w-4xl flex-col gap-4 p-4 px-2 py-4 md:gap-6 md:px-4">
					{messages.length === 0 ? (
						<div className="mx-auto mt-4 flex size-full max-w-3xl flex-col justify-center px-4 md:mt-16 md:px-8">
							<div className="font-semibold text-xl md:text-2xl" style={{ opacity: 1, transform: "none" }}>
								Hello there!
							</div>
							<div className="text-muted-foreground text-xl md:text-2xl" style={{ opacity: 1, transform: "none" }}>
								How can I help you today?
							</div>
						</div>
					) : (
						<>
							{messages.map((message) => (
								<ChatMessage isLoading={false} key={message.id} message={message} />
							))}
							{isLoading && <ThinkingMessage />}
						</>
					)}
					<div className="min-h-[24px] min-w-[24px] shrink-0" />
				</div>
			</div>

			{/* Input Area with Suggested Actions */}
			<div className="shrink-0 bg-background">
				{messages.length === 0 && (
					<div className="mx-auto mb-4 w-full max-w-4xl px-2 pt-4 md:px-4">
						<SuggestedActions onSelect={handleSuggestedAction} />
					</div>
				)}
				<div className="mx-auto w-full max-w-4xl px-2 pb-4 md:px-4">
					<MultimodalInput
						isLoading={isLoading}
						onChange={(value) => {
							(onInputChange as any)({ target: { value } });
						}}
						onStop={onStop}
						onSubmit={(message) => {
							(onInputChange as any)({ target: { value: message } });
							const syntheticEvent = {
								preventDefault: () => {},
								currentTarget: document.createElement("form"),
							} as FormEvent<HTMLFormElement>;
							onSubmit(syntheticEvent);
						}}
						value={input}
					/>
				</div>
			</div>
		</div>
	);
}
