import React from "react";
import { motion } from "framer-motion";
import { SlideProps } from "@/types/slide";

export const BaseSlide = ({ children, background, animationsEnabled = true, isActive }: SlideProps) => {
	if (!isActive) return null;

	const Content = () => (
		<div
			className="relative w-full h-full"
			style={{
				background: typeof background === "string" ? background : background?.type === "gradient" ? background.value : background?.value ? `url(${background.value})` : "white",
			}}
		>
			{children}
		</div>
	);

	if (!animationsEnabled) {
		return <Content />;
	}

	return (
		<motion.div className="relative w-full h-full" initial={{ opacity: 0, x: 100 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -100 }} transition={{ duration: 0.5 }}>
			{children}
		</motion.div>
	);
};
