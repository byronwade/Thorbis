import type { Metadata } from "next";
import { generateMetadata as generateSEOMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = {
	...generateSEOMetadata({
		title: "Field Service ROI Calculator",
		section: "Tools",
		description:
			"Calculate your potential ROI from Thorbis field service software. Free interactive tool for HVAC, plumbing, and electrical contractors. See projected savings and revenue gains.",
		path: "/tools/roi-calculator",
		keywords: [
			"field service ROI calculator",
			"HVAC software ROI",
			"plumbing software savings",
			"field service management ROI",
			"service business calculator",
			"technician efficiency calculator",
			"ServiceTitan ROI comparison",
		],
	}),
};

export default function ROICalculatorLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return children;
}
