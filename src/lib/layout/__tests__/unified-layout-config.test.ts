import { beforeEach, describe, expect, it } from "@jest/globals";
import {
	clearUnifiedLayoutCache,
	getUnifiedLayoutConfig,
} from "@/lib/layout/unified-layout-config";

describe("getUnifiedLayoutConfig", () => {
	beforeEach(() => {
		clearUnifiedLayoutCache();
	});

	it("matches the work hub root config", () => {
		const config = getUnifiedLayoutConfig("/dashboard/work");
		expect(config.toolbar.subtitle).toBe("81 total jobs today");
		expect(config.sidebar.show).toBe(true);
	});

	it("uses the schedule layout for /dashboard/schedule", () => {
		const config = getUnifiedLayoutConfig("/dashboard/schedule");
		expect(config.sidebar.show).toBe(false);
	});

	it("returns the invoices list config for /dashboard/work/invoices", () => {
		const config = getUnifiedLayoutConfig("/dashboard/work/invoices");
		expect(config.toolbar.title).toBe("Invoices");
		expect(config.sidebar.show).toBe(true);
	});

	it("returns the invoice detail layout for /dashboard/work/invoices/:id", () => {
		const config = getUnifiedLayoutConfig("/dashboard/work/invoices/demo-id");
		expect(config.sidebar.show).toBe(false);
		expect(config.rightSidebar?.component).toBe("invoice");
		expect(config.rightSidebar?.show).toBe(true);
	});
});
