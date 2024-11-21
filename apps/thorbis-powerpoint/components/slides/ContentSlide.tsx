import { BaseSlide } from "./BaseSlide";
import { motion } from "framer-motion";
import { SlideProps } from "@/types/slide";

export const ContentSlide = (props: SlideProps) => {
	return (
		<BaseSlide {...props}>
			<div className="flex flex-col p-12 h-full">
				<motion.h2 className="text-2xl font-semibold mb-8" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
					Thorbis
				</motion.h2>
				<motion.div className="flex-1" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
					<ul>
						<li>More flexible and maintainable</li>
						<li>Reusable slide templates</li>
						<li>Type-safe props</li>
						<li>Easy to customize with Tailwind CSS</li>
					</ul>
				</motion.div>
			</div>
		</BaseSlide>
	);
};

ContentSlide.displayName = "Thorbis Features";
