import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Search } from "lucide-react";

interface TableOfContentsProps {
	slideNames: string[];
	currentSlide: number;
	onSlideSelect: (index: number) => void;
}

export const TableOfContents = ({ slideNames, currentSlide, onSlideSelect }: TableOfContentsProps) => {
	const [isVisible, setIsVisible] = React.useState(false);
	const [searchQuery, setSearchQuery] = React.useState("");

	const filteredSlides = slideNames.map((name, index) => ({ name, index })).filter((slide) => slide.name.toLowerCase().includes(searchQuery.toLowerCase()));

	const handleSlideSelect = (index: number) => {
		onSlideSelect(index);
		setIsVisible(false);
	};

	const handleBackdropClick = (e: React.MouseEvent) => {
		if (e.target === e.currentTarget) {
			setIsVisible(false);
		}
	};

	// Handle spacebar press
	useEffect(() => {
		const handleKeyPress = (e: KeyboardEvent) => {
			// Check if the active element is not an input or textarea
			const isInputActive = document.activeElement instanceof HTMLInputElement || document.activeElement instanceof HTMLTextAreaElement;

			if (e.code === "Space" && !isInputActive) {
				e.preventDefault(); // Prevent page scroll
				setIsVisible((prev) => !prev);
			}
			// Close on escape key
			if (e.code === "Escape" && isVisible) {
				setIsVisible(false);
			}
		};

		window.addEventListener("keydown", handleKeyPress);
		return () => window.removeEventListener("keydown", handleKeyPress);
	}, [isVisible]);

	return (
		<>
			{/* Trigger Button */}
			<button onClick={() => setIsVisible(true)} className="fixed top-4 right-4 z-50 p-2 bg-background/80 hover:bg-background border border-border rounded-full transition-colors shadow-md backdrop-blur-sm group">
				<Menu className="w-6 h-6 text-foreground" />
				<span className="absolute right-full mr-2 top-1/2 -translate-y-1/2 px-2 py-1 text-xs bg-background/80 rounded-md border border-border opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">Press Space to open</span>
			</button>

			{/* Backdrop and Menu */}
			<AnimatePresence>
				{isVisible && (
					<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={handleBackdropClick} className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-end p-4">
						<motion.div
							initial={{ opacity: 0, scale: 0.95, x: 50 }}
							animate={{ opacity: 1, scale: 1, x: 0 }}
							exit={{ opacity: 0, scale: 0.95, x: 50 }}
							transition={{
								duration: 0.2,
								ease: [0.16, 1, 0.3, 1],
							}}
							className="w-[220px] mr-4 bg-background border border-border shadow-lg rounded-lg overflow-hidden"
							onClick={(e) => e.stopPropagation()}
						>
							<div className="p-3">
								<div className="flex justify-between items-center mb-2">
									<h2 className="text-sm font-medium text-foreground">Table of Contents</h2>
									<button onClick={() => setIsVisible(false)} className="text-muted-foreground hover:text-foreground transition-colors" aria-label="Close table of contents">
										<X className="h-4 w-4" />
									</button>
								</div>

								{/* Search input */}
								<div className="relative mb-3">
									<input type="text" placeholder="Search slides..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full px-2 py-1 text-xs bg-secondary/50 border border-border rounded-md text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary" />
									<Search className="absolute right-2 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground" />
								</div>

								{/* Slide list */}
								<nav className="max-h-[60vh] overflow-y-auto">
									<ul className="space-y-0.5">
										{filteredSlides.map(({ name, index }) => (
											<li key={index}>
												<button onClick={() => handleSlideSelect(index)} className={`w-full text-left py-1.5 px-2 text-xs rounded-md transition-colors ${currentSlide === index ? "bg-primary/10 text-primary font-medium" : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"}`}>
													{index + 1}. {name}
												</button>
											</li>
										))}
									</ul>
								</nav>

								{/* Quick navigation */}
								<div className="mt-3 pt-3 border-t border-border">
									<div className="flex justify-between text-xs">
										<button onClick={() => onSlideSelect(0)} className="text-muted-foreground hover:text-foreground transition-colors">
											Start
										</button>
										<button onClick={() => onSlideSelect(slideNames.length - 1)} className="text-muted-foreground hover:text-foreground transition-colors">
											End
										</button>
									</div>
								</div>
							</div>
						</motion.div>
					</motion.div>
				)}
			</AnimatePresence>
		</>
	);
};
