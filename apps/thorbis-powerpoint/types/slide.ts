import { type ReactNode } from "react";

export interface AnimationConfig {
	type: "fade" | "slide" | "zoom" | "bounce" | "flip";
	duration: number;
	delay?: number;
	easing?: string;
	direction?: "left" | "right" | "up" | "down";
}

export interface SlideProps {
	isActive?: boolean;
	onNext?: () => void;
	onPrev?: () => void;
	index?: number;
}
