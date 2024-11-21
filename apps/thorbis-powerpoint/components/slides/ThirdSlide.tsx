import React from "react";
import { BaseSlide } from "./BaseSlide";
import { motion } from "framer-motion";
import { SlideProps } from "@/types/slide";

export const SecondSlide = (props: SlideProps) => {
	return (
		<BaseSlide {...props}>
			<div className="flex flex-col p-12 h-full">
				<motion.h2 className="text-2xl font-semibold mb-8" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
					Why Component-Based Slides?
				</motion.h2>
				<motion.ul className="list-disc space-y-4 text-lg" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
					<li>More flexible and maintainable</li>
					<li>Reusable slide templates</li>
					<li>Type-safe props</li>
					<li>Easy to customize with Tailwind CSS</li>
				</motion.ul>
			</div>
		</BaseSlide>
	);
};
