"use client";

import { type ChangeEvent, type KeyboardEvent, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { ArrowUpIcon, PaperclipIcon, StopIcon } from "./icons";

type MultimodalInputProps = {
	value?: string;
	onChange?: (value: string) => void;
	onSubmit: (message: string) => void;
	onStop?: () => void;
	isLoading?: boolean;
	placeholder?: string;
	disabled?: boolean;
};

export function MultimodalInput({
	value: controlledValue,
	onChange,
	onSubmit,
	onStop,
	isLoading = false,
	placeholder = "Send a message...",
	disabled = false,
}: MultimodalInputProps) {
	const [internalInput, setInternalInput] = useState("");
	const textareaRef = useRef<HTMLTextAreaElement>(null);

	// Use controlled value if provided, otherwise use internal state
	const input = controlledValue !== undefined ? controlledValue : internalInput;
	const setInput =
		controlledValue !== undefined && onChange ? onChange : setInternalInput;

	const handleSubmit = () => {
		if (!input.trim() || disabled) {
			return;
		}

		onSubmit(input);
		setInput("");

		// Reset textarea height
		if (textareaRef.current) {
			textareaRef.current.style.height = "auto";
		}
	};

	const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
		if (e.key === "Enter" && !e.shiftKey) {
			e.preventDefault();
			handleSubmit();
		}
	};

	const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
		setInput(e.target.value);

		// Auto-resize textarea
		const textarea = e.target;
		textarea.style.height = "auto";
		textarea.style.height = `${textarea.scrollHeight}px`;
	};

	return (
		<div className="sticky bottom-0 z-10 mx-auto flex w-full max-w-4xl flex-col gap-4 border-t-0 bg-background px-2 pb-3 md:px-4 md:pb-4">
			<form
				className="w-full overflow-hidden rounded-xl border border-border bg-background p-3 shadow-sm transition-all duration-200 focus-within:border-border hover:border-muted-foreground/50"
				onSubmit={(e) => {
					e.preventDefault();
					handleSubmit();
				}}
			>
				<div className="flex flex-row items-start gap-1 sm:gap-2">
					{/* Textarea */}
					<textarea
						autoFocus
						className={cn(
							"flex min-h-[80px] w-full resize-none rounded-none border-none bg-transparent p-2 text-sm outline-none ring-0 placeholder:text-muted-foreground",
							"focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0",
							"[-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
						)}
						data-testid="multimodal-input"
						disabled={disabled}
						name="message"
						onChange={handleChange}
						onKeyDown={handleKeyDown}
						placeholder={placeholder}
						ref={textareaRef}
						rows={1}
						style={{ height: "44px" }}
						value={input}
					/>

					{/* Context usage indicator */}
					<button
						className="inline-flex aspect-square h-8 select-none items-center justify-center rounded-lg bg-background text-foreground transition-colors hover:bg-accent"
						title="0.0% of model context used"
						type="button"
					>
						<svg
							aria-label="0.00% of model context used"
							height="28"
							role="img"
							style={{ color: "currentcolor" }}
							viewBox="0 0 24 24"
							width="28"
						>
							<circle
								cx="12"
								cy="12"
								fill="none"
								opacity="0.25"
								r="10"
								stroke="currentColor"
								strokeWidth="2"
							/>
							<circle
								cx="12"
								cy="12"
								fill="none"
								opacity="0.7"
								r="10"
								stroke="currentColor"
								strokeDasharray="62.83185307179586 62.83185307179586"
								strokeDashoffset="62.83185307179586"
								strokeLinecap="round"
								strokeWidth="2"
								transform="rotate(-90 12 12)"
							/>
						</svg>
					</button>
				</div>

				<div className="flex items-center justify-between border-t-0 p-0 shadow-none">
					<div className="flex items-center gap-0 sm:gap-0.5">
						{/* Attachment button */}
						<button
							className="inline-flex aspect-square h-8 items-center justify-center rounded-lg p-1 font-medium text-sm transition-colors hover:bg-accent hover:text-accent-foreground disabled:pointer-events-none disabled:opacity-50"
							data-testid="attachments-button"
							disabled={disabled}
							title="Attach files (coming soon)"
							type="button"
						>
							<PaperclipIcon size={14} />
						</button>
					</div>

					{/* Submit/Stop button */}
					{isLoading ? (
						<button
							className="inline-flex size-8 items-center justify-center gap-1.5 rounded-full bg-primary text-primary-foreground transition-colors duration-200 hover:bg-primary/90 disabled:bg-muted disabled:text-muted-foreground"
							onClick={onStop}
							type="button"
						>
							<StopIcon size={14} />
						</button>
					) : (
						<button
							className="inline-flex size-8 items-center justify-center gap-1.5 rounded-full bg-primary text-primary-foreground transition-colors duration-200 hover:bg-primary/90 disabled:pointer-events-none disabled:bg-muted disabled:text-muted-foreground disabled:opacity-50"
							disabled={!input.trim() || disabled}
							type="submit"
						>
							<ArrowUpIcon size={14} />
						</button>
					)}
				</div>
			</form>
		</div>
	);
}
