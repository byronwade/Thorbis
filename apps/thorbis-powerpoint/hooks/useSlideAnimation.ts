import { useEffect, useState } from "react";
import { AnimationConfig } from "@/types/slide";

export const useSlideAnimation = (config: AnimationConfig) => {
	const [isAnimating, setIsAnimating] = useState(false);
	const [isVisible, setIsVisible] = useState(false);

	const getAnimationClass = () => {
		const { type, duration, delay = 0, easing = "ease" } = config;

		const baseClass = "transition-all";
		const durationClass = `duration-${duration}`;
		const delayClass = delay ? `delay-${delay}` : "";
		const easingClass = `ease-${easing}`;

		const animationClasses: Record<AnimationConfig["type"], string> = {
			fade: "opacity-0 animate-in fade-in",
			slide: `translate-${config.direction || "x"}-[100%] animate-in slide-in-${config.direction || "from-right"}`,
			zoom: "scale-0 animate-in zoom-in",
			bounce: "scale-95 animate-bounce",
			flip: "rotate-x-180 animate-flip",
		};

		return `${baseClass} ${durationClass} ${delayClass} ${easingClass} ${animationClasses[type]}`;
	};

	return {
		isAnimating,
		isVisible,
		animationClass: getAnimationClass(),
		startAnimation: () => setIsAnimating(true),
		stopAnimation: () => setIsAnimating(false),
	};
};
