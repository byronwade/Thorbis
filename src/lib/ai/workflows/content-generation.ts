/**
 * Content Generation Workflow
 * Multi-agent workflow for researching, writing, and reviewing content
 */

import { generateText } from "ai";
import { createAIProvider } from "../config";
import type { WorkflowDefinition } from "./types";

type ContentInput = {
	topic: string;
	tone?: "professional" | "casual" | "technical";
	length?: "short" | "medium" | "long";
	keywords?: string[];
};

type ResearchResult = {
	keyPoints: string[];
	sources: string[];
	outline: string;
};

type DraftResult = {
	title: string;
	content: string;
	wordCount: number;
};

type ReviewResult = {
	finalContent: string;
	suggestions: string[];
	score: number;
};

type ContentOutput = {
	topic: string;
	research: ResearchResult;
	draft: DraftResult;
	review: ReviewResult;
	finalContent: string;
};

/**
 * Content Generation Workflow
 * Steps: Research → Draft → Review → Polish
 */
export const contentGenerationWorkflow: WorkflowDefinition<
	ContentInput,
	ContentOutput
> = {
	id: "content-generation",
	name: "Content Generation Workflow",
	description:
		"Multi-agent workflow for creating high-quality content with research, writing, and review",
	version: "1.0.0",

	steps: [
		{
			id: "research",
			name: "Research Phase",
			description: "Research the topic and create an outline with key points",
			async execute(input) {
				const contentInput = input as ContentInput;
				const model = createAIProvider();

				const { text } = await generateText({
					model,
					prompt: `You are a research specialist. Research the topic "${contentInput.topic}" and provide:
1. 5-7 key points to cover
2. A structured outline
3. Important facts or statistics (if applicable)

${contentInput.keywords ? `Focus on these keywords: ${contentInput.keywords.join(", ")}` : ""}

Format your response as JSON with this structure:
{
  "keyPoints": ["point1", "point2", ...],
  "sources": ["source1", "source2", ...],
  "outline": "detailed outline here"
}`,
				});

				// Parse the JSON response
				const research: ResearchResult = JSON.parse(text);
				return research;
			},
		},

		{
			id: "draft",
			name: "Writing Phase",
			description: "Write the first draft based on research",
			async execute(research, context) {
				const researchResult = research as ResearchResult;
				const input = context.history[0]?.input as ContentInput;
				const model = createAIProvider();

				const lengthMap = {
					short: "300-500 words",
					medium: "700-1000 words",
					long: "1500-2000 words",
				};

				const { text } = await generateText({
					model,
					prompt: `You are a professional content writer. Write a ${input.tone || "professional"} article about "${input.topic}".

Length: ${lengthMap[input.length || "medium"]}

Use this research and outline:
${researchResult.outline}

Key points to cover:
${researchResult.keyPoints.map((point, i) => `${i + 1}. ${point}`).join("\n")}

Format your response as JSON with this structure:
{
  "title": "Compelling title here",
  "content": "Full article content here with proper paragraphs",
  "wordCount": 0
}`,
				});

				const draft: DraftResult = JSON.parse(text);
				draft.wordCount = draft.content.split(/\s+/).length;
				return draft;
			},
		},

		{
			id: "review",
			name: "Review Phase",
			description: "Review and improve the draft",
			async execute(draft) {
				const draftResult = draft as DraftResult;
				const model = createAIProvider();

				const { text } = await generateText({
					model,
					prompt: `You are an editor. Review this article and:
1. Suggest improvements
2. Check for clarity, flow, and engagement
3. Provide an overall quality score (1-10)
4. Return the final polished version

Title: ${draftResult.title}

Content:
${draftResult.content}

Format your response as JSON with this structure:
{
  "finalContent": "improved content here",
  "suggestions": ["suggestion1", "suggestion2", ...],
  "score": 8
}`,
				});

				const review: ReviewResult = JSON.parse(text);
				return review;
			},
		},
	],

	async afterAll(_reviewOutput, context) {
		const input = context.history[0]?.input as ContentInput;
		const research = context.history[0]?.output as ResearchResult;
		const draft = context.history[1]?.output as DraftResult;
		const review = context.history[2]?.output as ReviewResult;

		return {
			topic: input.topic,
			research,
			draft,
			review,
			finalContent: review.finalContent,
		};
	},

	async onError(_error, _context) {},
};
