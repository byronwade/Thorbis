"use client";

import { Presentation } from "@/components/Presentation";
import { ContentSlide } from "@/components/slides/ContentSlide";
import { FirstSlide } from "@/components/slides/FirstSlide";
import { SecondSlide } from "@/components/slides/SecondSlide";

export default function PresentationPage() {
	return (
		<Presentation animationsEnabled={true} slideTransitions={false}>
			<FirstSlide key="slide1" />
			<SecondSlide key="slide2" />
			<ContentSlide key="slide3" />
		</Presentation>
	);
}
