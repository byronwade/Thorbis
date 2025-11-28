"use server";

import { NextResponse } from "next/server";
import { createGroq } from "@ai-sdk/groq";
import { calculateHaversineDistance, estimateTravelTime } from "@/lib/schedule/route-optimization";
import { GoogleDistanceMatrix } from "@/lib/schedule/google-distance-matrix";

type IncomingJob = {
	id: string;
	title?: string | null;
	customerName?: string | null;
	technicianId?: string | null;
	startTime: string;
	endTime: string;
	revenue?: number | null;
	isExistingCustomer?: boolean;
	location?: { lat: number; lng: number } | null;
	technicianLocation?: { lat: number; lng: number } | null;
};

type OptimizationRequest = {
	job: IncomingJob;
	businessHours?: { start: string; end: string };
	techniciansAvailable?: Array<{ id: string; name?: string | null; utilization?: number }>;
};

export async function POST(request: Request) {
	try {
		const body = (await request.json()) as OptimizationRequest;
		const job = body.job;
		if (!job?.id || !job?.startTime || !job?.endTime) {
			return NextResponse.json(
				{ error: "Invalid payload: job, startTime, endTime required" },
				{ status: 400 },
			);
		}

		const hasGroq = Boolean(process.env.GROQ_API_KEY);
		const hasGoogleApi = Boolean(process.env.GOOGLE_MAPS_API_KEY);
		const start = new Date(job.startTime);
		const end = new Date(job.endTime);
		const fallbackSuggestion = {
			suggestion: `Keep within business hours (${
				body.businessHours?.start || "8:00 AM"
			}–${body.businessHours?.end || "6:00 PM"}). Consider moving ${
				job.customerName ? job.customerName : "this job"
			} earlier by 30 minutes to reduce overlap.`,
			timeSavedMinutes: 15,
			confidence: 0.35,
		};

		let travelNote = "";
		if (hasGoogleApi && job.location?.lat && job.location?.lng && job.technicianLocation?.lat && job.technicianLocation?.lng) {
			try {
				const dm = new GoogleDistanceMatrix(process.env.GOOGLE_MAPS_API_KEY!);
				const res = await dm.getDistance(
					{ lat: job.technicianLocation.lat, lng: job.technicianLocation.lng },
					{ lat: job.location.lat, lng: job.location.lng },
				);
				travelNote = `Travel to job: ${res.durationText}, ${res.distanceText}. `;
				fallbackSuggestion.suggestion = `${travelNote}${fallbackSuggestion.suggestion}`;
			} catch {
				// ignore distance errors and fallback to existing suggestion
			}
		} else if (job.location?.lat && job.location?.lng && job.technicianLocation?.lat && job.technicianLocation?.lng) {
			const meters = calculateHaversineDistance(
				{ lat: job.technicianLocation.lat, lng: job.technicianLocation.lng },
				{ lat: job.location.lat, lng: job.location.lng },
			);
			const secs = estimateTravelTime(meters);
			travelNote = `Est. travel to job: ~${Math.round(secs / 60)}m. `;
			fallbackSuggestion.suggestion = `${travelNote}${fallbackSuggestion.suggestion}`;
		}

		if (!hasGroq) {
			return NextResponse.json(fallbackSuggestion);
		}

		const groq = createGroq();
		const model = groq("llama-3.3-70b-versatile");
		const techSummary = (body.techniciansAvailable || [])
			.slice(0, 5)
			.map(
				(t) =>
					`${t.name || t.id} (utilization ${Math.round(
						(t.utilization ?? 0) * 100,
					)}%)`,
			)
			.join("; ");

		const prompt = `
You are a scheduling optimizer for field service.
- Stay within business hours ${body.businessHours?.start || "08:00"} to ${
			body.businessHours?.end || "18:00"
		}.
- Respect technician availability.
- Prefer existing customers and higher revenue.
- Suggest a better timeslot and technician that reduces conflicts and travel.
${
	hasGoogleApi
		? "Use the provided travel time from Google Distance Matrix when available."
		: travelNote
			? `Travel estimate: ${travelNote}`
			: "If travel is unknown, assume moderate urban travel."
}

Job:
- Title: ${job.title || "Job"}
- Customer: ${job.customerName || "Unknown"}
- Current tech: ${job.technicianId || "Unassigned"}
- Window: ${start.toISOString()} to ${end.toISOString()}
- Revenue: ${job.revenue ?? "n/a"}
- Existing customer: ${job.isExistingCustomer ? "yes" : "no"}

Techs: ${techSummary || "not provided"}.

Respond as JSON: { "suggestion": string, "timeSavedMinutes": number, "confidence": 0-1 }`;

		try {
			const completion = await model.complete({
				prompt,
				temperature: 0.2,
			});

			let parsed = fallbackSuggestion;
			try {
				const json = JSON.parse(completion.text.trim());
				if (json.suggestion) {
					parsed = {
						suggestion: json.suggestion,
						timeSavedMinutes: Number(json.timeSavedMinutes) || fallbackSuggestion.timeSavedMinutes,
						confidence: Number(json.confidence) || fallbackSuggestion.confidence,
					};
				}
			} catch {
				parsed = {
					...fallbackSuggestion,
					suggestion: completion.text.trim() || fallbackSuggestion.suggestion,
				};
			}

			return NextResponse.json(parsed);
		} catch (err) {
			console.error("Optimization suggestion AI error", err);
			return NextResponse.json(fallbackSuggestion);
		}
	} catch (err) {
		console.error("Optimization suggestion error", err);
		return NextResponse.json(
			{ error: "Failed to generate suggestion" },
			{ status: 500 },
		);
	}
}
