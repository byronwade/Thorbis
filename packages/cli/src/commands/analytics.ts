import { Command } from "commander";
import chalk from "chalk";
import { logger } from "../utils/logger";

export function registerAnalyticsCommands(program: Command) {
	const analytics = program.command("analytics");

	analytics
		.command("report")
		.description("Generate analytics report")
		.option("-d, --days <days>", "Number of days", "7")
		.action((options) => {
			logger.info(`Generating report for last ${options.days} days...`);

			const mockStats = {
				pageViews: 15234,
				uniqueVisitors: 4521,
				avgTimeOnSite: "2m 45s",
				topComponents: [
					{ name: "Header", interactions: 8543 },
					{ name: "ProductCard", interactions: 6234 },
				],
			};

			console.log("\nMock Analytics Report:");
			console.log(chalk.dim("─".repeat(40)));
			Object.entries(mockStats).forEach(([key, value]) => {
				console.log(chalk.blue(key + ":"), value);
			});
		});

	analytics
		.command("live")
		.description("Show live analytics")
		.action(() => {
			logger.info("Starting live analytics stream...");

			let count = 0;
			const interval = setInterval(() => {
				const mockEvent = {
					timestamp: new Date().toISOString(),
					type: ["click", "hover", "scroll"][Math.floor(Math.random() * 3)],
					component: ["Header", "Footer", "Button"][Math.floor(Math.random() * 3)],
				};
				console.log(chalk.dim(`[${mockEvent.timestamp}]`), mockEvent.type, "on", mockEvent.component);

				if (++count > 5) {
					clearInterval(interval);
					logger.info("Live stream ended");
				}
			}, 1000);
		});
}
