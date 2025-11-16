import { describe, expect, it } from "@jest/globals";
import {
	deriveHealthStatus,
	formatTrendDelta,
	normalizeProgress,
	progressFromSteps,
} from "../status-utils";

describe("status-utils", () => {
	describe("normalizeProgress", () => {
		it("clamps to 0-100", () => {
			expect(normalizeProgress(-5)).toBe(0);
			expect(normalizeProgress(42.2)).toBe(42);
			expect(normalizeProgress(120)).toBe(100);
		});
	});

	describe("deriveHealthStatus", () => {
		it("returns ready for high progress", () => {
			expect(deriveHealthStatus(95)).toBe("ready");
		});

		it("returns warning for mid progress", () => {
			expect(deriveHealthStatus(70)).toBe("warning");
		});

		it("returns danger for low progress", () => {
			expect(deriveHealthStatus(20)).toBe("danger");
		});
	});

	describe("progressFromSteps", () => {
		it("returns 0 when total is 0", () => {
			expect(progressFromSteps(0, 0)).toBe(0);
		});

		it("calculates completion percentage", () => {
			expect(progressFromSteps(2, 4)).toBe(50);
			expect(progressFromSteps(3, 3)).toBe(100);
		});
	});

	describe("formatTrendDelta", () => {
		it("formats positive and negative deltas", () => {
			expect(formatTrendDelta(4.3)).toBe("+4%");
			expect(formatTrendDelta(-7.8)).toBe("-8%");
			expect(formatTrendDelta(0)).toBe("0%");
		});
	});
});
