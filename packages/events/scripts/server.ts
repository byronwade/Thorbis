import express from "express";
import cors from "cors";
import chalk from "chalk";
import type { EventData } from "../src/types";

const app = express();
const port = process.env.PORT || 3001;

app.use(
	cors({
		origin: "*",
		methods: ["POST", "OPTIONS"],
		allowedHeaders: ["Content-Type", "X-Thorbis-Debug"],
	})
);

app.use(express.json());

app.post("/events", (req, res) => {
	const { events, timestamp, debug, source } = req.body;

	console.group(chalk.cyan("\n📊 Thorbis Events Received"));
	console.log(chalk.gray(`Timestamp: ${new Date(timestamp).toISOString()}`));
	console.log(chalk.gray(`Source: ${source}`));
	console.log(chalk.gray(`Debug Mode: ${debug}`));

	if (Array.isArray(events)) {
		events.forEach((event: EventData) => {
			const eventTime = new Date(event.timestamp).toISOString();
			console.log(chalk.green(`\n🔍 [${eventTime}] ${event.type}`));
			console.dir(event, { depth: null, colors: true });
		});
	}

	console.groupEnd();

	res.json({
		success: true,
		received: Array.isArray(events) ? events.length : 0,
		timestamp: new Date().toISOString(),
	});
});

app.listen(port, () => {
	console.log(chalk.cyan("\n🚀 Thorbis Events Development Server"));
	console.log(chalk.gray(`Listening on port ${port}\n`));
});
