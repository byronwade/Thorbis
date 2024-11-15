"use client";

import { useState } from "react";
import { X, Minus, Globe, Monitor, Chrome, Clock, FileText, MousePointer, ArrowRight, CreditCard, ShoppingCart, Eye, Zap } from "lucide-react";

interface DebugData {
	profile: {
		startTime: string;
		lastActive: string;
		[key: string]: any;
	};
	[key: string]: any;
}

type AnalyticsData = {
	pageLoad: string;
	timeOnPage: string;
	avgTimeOnPage: string;
	scrollDepth: string;
};

const mockAnalyticsData: AnalyticsData = {
	pageLoad: "0ms",
	timeOnPage: "2m 16.00s",
	avgTimeOnPage: "0.00μs",
	scrollDepth: "0.0%",
};

export function ThorbisDashboard({ debugData }: { debugData?: DebugData }) {
	const [isMinimized, setIsMinimized] = useState(false);
	const [isVisible, setIsVisible] = useState(true);
	const [activeTab, setActiveTab] = useState("profile");

	const displayDebugData = debugData
		? {
				...debugData,
				profile: {
					...debugData.profile,
					startTime: "TIMESTAMP",
					lastActive: "TIMESTAMP",
				},
		  }
		: null;

	if (!isVisible) return null;

	return (
		<div className={`fixed bottom-5 right-5 w-[600px] h-[500px] bg-white dark:bg-gray-800 text-black dark:text-white border border-gray-200 dark:border-gray-700 shadow-lg rounded-lg transition-all duration-300 ${isMinimized ? "h-[40px]" : ""}`}>
			<div className="p-2 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center bg-gray-50 dark:bg-gray-900">
				<div className="font-bold text-sm">Thorbis Analytics - {isMinimized ? "MINIMIZED" : "DETAILS"}</div>
				<div className="flex gap-1">
					<button className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded" onClick={() => setIsMinimized(!isMinimized)} title={isMinimized ? "Maximize" : "Minimize"}>
						<Minus className="h-4 w-4" />
					</button>
					<button className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded" onClick={() => setIsVisible(false)} title="Close">
						<X className="h-4 w-4" />
					</button>
				</div>
			</div>
			{!isMinimized && (
				<div className="w-full h-[calc(100%-40px)]">
					<div className="flex items-center border-b border-gray-200 dark:border-gray-700">
						<div className="flex h-8 bg-transparent p-0.5 flex-grow">
							{["profile", "performance", "events", "debug"].map((tab) => (
								<button key={tab} onClick={() => setActiveTab(tab)} className={`flex-1 px-2 py-1 h-7 text-[11px] font-medium rounded-sm ${activeTab === tab ? "bg-gray-200 dark:bg-gray-700" : ""}`}>
									{tab.charAt(0).toUpperCase() + tab.slice(1)}
								</button>
							))}
						</div>
						<div className="px-2 text-[10px] text-gray-500 dark:text-gray-400 whitespace-nowrap">Last updated: 2m ago</div>
					</div>
					<div className="h-[calc(100%-32px)] overflow-auto">
						{activeTab === "debug" && <div className="m-0 p-4">{displayDebugData ? <pre className="text-xs font-mono whitespace-pre-wrap overflow-auto">{JSON.stringify(displayDebugData, null, 2)}</pre> : <div className="text-sm text-gray-500 dark:text-gray-400">No debug data available</div>}</div>}
						{/* Add other tab content here */}
					</div>
				</div>
			)}
		</div>
	);
}
