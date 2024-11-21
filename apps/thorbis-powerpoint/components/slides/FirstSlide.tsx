import React from "react";
import { BaseSlide } from "./BaseSlide";
import { motion } from "framer-motion";
import { SlideProps } from "@/types/slide";

export const FirstSlide = (props: SlideProps) => {
	return (
		<BaseSlide {...props}>
			<div className="flex flex-col items-center justify-center h-full gap-6 px-4 text-center">
				<motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="space-y-2">
					<h1 className="text-5xl font-bold bg-gradient-to-r from-primary via-primary/80 to-primary/40 bg-clip-text text-transparent">Thorbis LLC</h1>
					<h2 className="text-3xl font-semibold text-foreground/90">Revolutionizing Website Management</h2>
				</motion.div>

				<motion.h3 className="text-xl text-muted-foreground max-w-2xl" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
					An AI-Driven Platform for Adaptive Web Experiences
				</motion.h3>

				<motion.div className="flex flex-wrap justify-center gap-4 mt-8" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
					<div className="flex flex-col items-center p-4 rounded-lg bg-secondary/50 border border-primary/20 backdrop-blur-sm hover:bg-primary/10 transition-colors">
						<span className="text-3xl font-bold text-primary">AI-Powered</span>
						<span className="text-sm text-muted-foreground">Smart Solutions</span>
					</div>
					<div className="flex flex-col items-center p-4 rounded-lg bg-secondary/50 border border-primary/20 backdrop-blur-sm hover:bg-primary/10 transition-colors">
						<span className="text-3xl font-bold text-primary">Adaptive</span>
						<span className="text-sm text-muted-foreground">Dynamic Content</span>
					</div>
					<div className="flex flex-col items-center p-4 rounded-lg bg-secondary/50 border border-primary/20 backdrop-blur-sm hover:bg-primary/10 transition-colors">
						<span className="text-3xl font-bold text-primary">Seamless</span>
						<span className="text-sm text-muted-foreground">Integration</span>
					</div>
				</motion.div>
			</div>
		</BaseSlide>
	);
};

FirstSlide.displayName = "Welcome";
