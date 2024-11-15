import express from "express";
import cors from "cors";
import chalk from "chalk";
import type { EventData } from "../src/types";

const app = express();
const port = process.env.PORT || 3010;

app.use(
	cors({
		origin: ["http://localhost:3000", "http://127.0.0.1:3000"],
		methods: ["POST", "OPTIONS"],
		allowedHeaders: ["Content-Type", "X-Thorbis-Debug"],
		credentials: false,
		preflightContinue: false,
		optionsSuccessStatus: 204,
	})
);

app.use(express.json({ limit: "50mb" }));

app.post("/events", (req, res) => {
	const { events, timestamp, debug } = req.body;

	if (debug) {
		console.group(chalk.cyan("\n📊 Thorbis Events Received"));
		console.log(chalk.gray(`Timestamp: ${new Date(timestamp).toISOString()}`));

		if (Array.isArray(events)) {
			events.forEach((event: EventData) => {
				if (!event.type.includes("layout_shift") && !event.type.includes("paint")) {
					console.log(chalk.green(`\n🔍 [${new Date(event.timestamp).toISOString()}] ${event.type}`));
					console.dir(event, { depth: null, colors: true });
				}
			});
		}

		console.groupEnd();
	}

	res.json({
		success: true,
		received: Array.isArray(events) ? events.length : 0,
		timestamp: new Date().toISOString(),
	});
});

app.options("/events", (req, res) => {
	res.status(204).end();
});

app.listen(port, () => {
	console.log(chalk.cyan("\n🚀 Thorbis Events Development Server"));
	console.log(chalk.gray(`Listening on port ${port}\n`));
});
