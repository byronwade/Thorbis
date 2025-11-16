/**
 * Workflow Engine
 * Orchestrates multi-step AI workflows with error handling and logging
 */

import { nanoid } from "nanoid";
import type { WorkflowContext, WorkflowDefinition, WorkflowResult, WorkflowStepResult } from "./types";

export class WorkflowEngine {
	/**
	 * Execute a workflow with the given input
	 */
	static async execute<TInput, TOutput>(
		workflow: WorkflowDefinition<TInput, TOutput>,
		input: TInput,
		options?: {
			userId?: string;
			metadata?: Record<string, unknown>;
			signal?: AbortSignal;
		}
	): Promise<WorkflowResult<TOutput>> {
		const workflowId = nanoid();
		const startTime = new Date();

		const context: WorkflowContext = {
			workflowId,
			userId: options?.userId,
			metadata: options?.metadata,
			history: [],
			signal: options?.signal,
		};

		const result: WorkflowResult<TOutput> = {
			workflowId,
			status: "running",
			steps: [],
			startTime,
		};

		try {
			// Run beforeAll hook
			if (workflow.beforeAll) {
				await workflow.beforeAll(input, context);
			}

			// Execute steps sequentially
			let currentInput: unknown = input;

			for (const step of workflow.steps) {
				// Check for abortion
				if (options?.signal?.aborted) {
					throw new Error("Workflow aborted by user");
				}

				const stepStartTime = new Date();

				try {
					// Execute step
					const stepOutput = await step.execute(currentInput, context);

					const stepEndTime = new Date();
					const stepResult: WorkflowStepResult = {
						stepId: step.id,
						stepName: step.name,
						status: "success",
						input: currentInput,
						output: stepOutput,
						startTime: stepStartTime,
						endTime: stepEndTime,
						duration: stepEndTime.getTime() - stepStartTime.getTime(),
					};

					result.steps.push(stepResult);
					context.history.push(stepResult);

					// Pass output to next step
					currentInput = stepOutput;
				} catch (error) {
    console.error("Error:", error);
					const stepEndTime = new Date();
					const stepResult: WorkflowStepResult = {
						stepId: step.id,
						stepName: step.name,
						status: "error",
						input: currentInput,
						error: error instanceof Error ? error.message : String(error),
						startTime: stepStartTime,
						endTime: stepEndTime,
						duration: stepEndTime.getTime() - stepStartTime.getTime(),
					};

					result.steps.push(stepResult);
					throw error;
				}
			}

			// Run afterAll hook
			let finalOutput = currentInput as TOutput;
			if (workflow.afterAll) {
				finalOutput = await workflow.afterAll(finalOutput, context);
			}

			result.status = "completed";
			result.output = finalOutput;
		} catch (error) {
    console.error("Error:", error);
			result.status = "error";
			result.error = error instanceof Error ? error.message : String(error);

			// Run error handler
			if (workflow.onError) {
				await workflow.onError(error instanceof Error ? error : new Error(String(error)), context);
			}

			throw error;
		} finally {
			const endTime = new Date();
			result.endTime = endTime;
			result.duration = endTime.getTime() - startTime.getTime();
		}

		return result;
	}

	/**
	 * Execute steps in parallel
	 */
	static async executeParallel<TInput, TOutput>(
		steps: Array<{
			id: string;
			name: string;
			execute: (input: TInput, context: WorkflowContext) => Promise<TOutput>;
		}>,
		input: TInput,
		context: WorkflowContext
	): Promise<TOutput[]> {
		const results = await Promise.all(steps.map((step) => step.execute(input, context)));
		return results;
	}

	/**
	 * Execute steps with retry logic
	 */
	static async executeWithRetry<TInput, TOutput>(
		step: {
			id: string;
			name: string;
			execute: (input: TInput, context: WorkflowContext) => Promise<TOutput>;
		},
		input: TInput,
		context: WorkflowContext,
		options: {
			maxRetries?: number;
			retryDelay?: number;
			backoffMultiplier?: number;
		} = {}
	): Promise<TOutput> {
		const { maxRetries = 3, retryDelay = 1000, backoffMultiplier = 2 } = options;

		let lastError: Error | undefined;
		let currentDelay = retryDelay;

		for (let attempt = 0; attempt <= maxRetries; attempt++) {
			try {
				return await step.execute(input, context);
			} catch (error) {
    console.error("Error:", error);
				lastError = error instanceof Error ? error : new Error(String(error));

				if (attempt < maxRetries) {
					// Wait before retry
					await new Promise((resolve) => setTimeout(resolve, currentDelay));
					currentDelay *= backoffMultiplier;
				}
			}
		}

		throw lastError || new Error("Max retries exceeded");
	}
}
