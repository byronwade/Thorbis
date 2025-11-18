const { createClient } = require("@supabase/supabase-js");

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
	console.error("Missing Supabase credentials");
	process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Team members with user_ids (for assigned_to field)
const teamMembers = [
	{
		user_id: "46167c2a-4aaa-479c-92ed-1c7f0a41e451",
		company_id: "2b88a305-0ecd-4bff-9898-b166cc7937c4",
	},
	{
		user_id: "f5923029-11a5-439a-b6a8-ce3b8da62716",
		company_id: "2b88a305-0ecd-4bff-9898-b166cc7937c4",
	},
	{
		user_id: "d09025e6-2c79-4688-a516-441f03689c4d",
		company_id: "2b88a305-0ecd-4bff-9898-b166cc7937c4",
	},
	{
		user_id: "f29a7cba-c03d-4fbf-90ec-526eb54e4f17",
		company_id: "2b88a305-0ecd-4bff-9898-b166cc7937c4",
	},
	{
		user_id: "32cc161c-2a7d-4db8-a697-e82eb5e71684",
		company_id: "2b88a305-0ecd-4bff-9898-b166cc7937c4",
	},
	{
		user_id: "a70b842b-03b6-4069-98c5-0116bf7c98d1",
		company_id: "2b88a305-0ecd-4bff-9898-b166cc7937c4",
	},
	{
		user_id: "24a16ca1-f9e2-4e6d-ac59-ab40ea8ad7c8",
		company_id: "2b88a305-0ecd-4bff-9898-b166cc7937c4",
	},
	{
		user_id: "e3fe368b-9128-4663-80fb-5d9f50b73fbc",
		company_id: "2b88a305-0ecd-4bff-9898-b166cc7937c4",
	},
];

// Customer-property pairs from company
const customerProperties = [
	{
		property_id: "dc23cfcd-bcd8-472d-add3-8dd7d5fdbd84",
		customer_id: "110674c3-5ed5-47fb-9b53-b4cbabe71025",
		company_id: "2b88a305-0ecd-4bff-9898-b166cc7937c4",
	},
	{
		property_id: "67e57051-0918-461c-adcb-d2024f9e24c0",
		customer_id: "110674c3-5ed5-47fb-9b53-b4cbabe71025",
		company_id: "2b88a305-0ecd-4bff-9898-b166cc7937c4",
	},
	{
		property_id: "4b9723da-c714-4acc-b3ef-4697c0b2851d",
		customer_id: "110674c3-5ed5-47fb-9b53-b4cbabe71025",
		company_id: "2b88a305-0ecd-4bff-9898-b166cc7937c4",
	},
	{
		property_id: "770e8400-e29b-41d4-a716-446655440001",
		customer_id: "660e8400-e29b-41d4-a716-446655440001",
		company_id: "2b88a305-0ecd-4bff-9898-b166cc7937c4",
	},
	{
		property_id: "770e8400-e29b-41d4-a716-446655440002",
		customer_id: "660e8400-e29b-41d4-a716-446655440002",
		company_id: "2b88a305-0ecd-4bff-9898-b166cc7937c4",
	},
	{
		property_id: "770e8400-e29b-41d4-a716-446655440003",
		customer_id: "660e8400-e29b-41d4-a716-446655440003",
		company_id: "2b88a305-0ecd-4bff-9898-b166cc7937c4",
	},
	{
		property_id: "770e8400-e29b-41d4-a716-446655440004",
		customer_id: "660e8400-e29b-41d4-a716-446655440004",
		company_id: "2b88a305-0ecd-4bff-9898-b166cc7937c4",
	},
	{
		property_id: "770e8400-e29b-41d4-a716-446655440005",
		customer_id: "660e8400-e29b-41d4-a716-446655440005",
		company_id: "2b88a305-0ecd-4bff-9898-b166cc7937c4",
	},
	{
		property_id: "770e8400-e29b-41d4-a716-446655440006",
		customer_id: "660e8400-e29b-41d4-a716-446655440006",
		company_id: "2b88a305-0ecd-4bff-9898-b166cc7937c4",
	},
	{
		property_id: "770e8400-e29b-41d4-a716-446655440007",
		customer_id: "660e8400-e29b-41d4-a716-446655440007",
		company_id: "2b88a305-0ecd-4bff-9898-b166cc7937c4",
	},
];

const appointmentTitles = [
	"HVAC Installation",
	"Annual Maintenance",
	"Furnace Repair",
	"AC Tune-up",
	"Emergency Service Call",
	"System Inspection",
	"Duct Cleaning",
	"Thermostat Replacement",
];

const statuses = [
	"scheduled",
	"confirmed",
	"in_progress",
	"completed",
	"cancelled",
];

// Generate random number between min and max (inclusive)
function randomInt(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Generate random duration in hours (1-8 hours)
function randomDuration() {
	return randomInt(1, 8);
}

// Generate appointments for a specific date and team member
function generateAppointmentsForDay(date, teamMember, startIndex) {
	const appointments = [];
	const appointmentsPerDay = randomInt(0, 3); // 0-3 appointments per day

	let currentHour = 7; // Start at 7 AM

	for (let i = 0; i < appointmentsPerDay; i++) {
		const duration = randomDuration();

		// Check if we have enough time left in the day (7am-5pm = 10 hours)
		if (currentHour + duration > 17) {
			break; // No more time in the day
		}

		const startTime = new Date(date);
		startTime.setHours(currentHour, 0, 0, 0);

		const endTime = new Date(startTime);
		endTime.setHours(currentHour + duration, 0, 0, 0);

		const custProp =
			customerProperties[randomInt(0, customerProperties.length - 1)];
		const title = appointmentTitles[randomInt(0, appointmentTitles.length - 1)];
		const status = statuses[randomInt(0, statuses.length - 1)];

		// Format timestamps for Postgres (timestamp without time zone)
		const formatTimestamp = (dt) => {
			const year = dt.getFullYear();
			const month = String(dt.getMonth() + 1).padStart(2, "0");
			const day = String(dt.getDate()).padStart(2, "0");
			const hours = String(dt.getHours()).padStart(2, "0");
			const minutes = String(dt.getMinutes()).padStart(2, "0");
			const seconds = String(dt.getSeconds()).padStart(2, "0");
			return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
		};

		appointments.push({
			company_id: teamMember.company_id,
			customer_id: custProp.customer_id,
			property_id: custProp.property_id,
			assigned_to: teamMember.user_id,
			type: "appointment",
			title: title,
			description: `Scheduled ${title.toLowerCase()} service`,
			start_time: formatTimestamp(startTime),
			end_time: formatTimestamp(endTime),
			duration: duration * 60, // duration in minutes
			all_day: false,
			is_recurring: false,
			status: status,
		});

		// Move to next available time slot (add some buffer)
		currentHour += duration + randomInt(0, 1); // 0-1 hour gap between appointments
	}

	return appointments;
}

async function generateAppointments() {
	const totalAppointments = 10000;
	const batchSize = 100;

	console.log("Starting to generate 10,000 appointments...");
	console.log(`Using ${teamMembers.length} team members`);
	console.log(`Batch size: ${batchSize}`);

	const today = new Date();
	today.setHours(0, 0, 0, 0);

	let allAppointments = [];
	let appointmentIndex = 1;

	// Generate appointments over the next ~365 days
	for (
		let dayOffset = 0;
		dayOffset < 365 && appointmentIndex <= totalAppointments;
		dayOffset++
	) {
		const date = new Date(today);
		date.setDate(today.getDate() + dayOffset);

		// Skip weekends
		const dayOfWeek = date.getDay();
		if (dayOfWeek === 0 || dayOfWeek === 6) {
			continue;
		}

		// Generate appointments for each team member for this day
		for (const teamMember of teamMembers) {
			if (appointmentIndex > totalAppointments) break;

			const dayAppointments = generateAppointmentsForDay(
				date,
				teamMember,
				appointmentIndex,
			);
			allAppointments = allAppointments.concat(dayAppointments);
			appointmentIndex += dayAppointments.length;
		}
	}

	// Trim to exactly 10,000
	allAppointments = allAppointments.slice(0, totalAppointments);

	console.log(`\nGenerated ${allAppointments.length} appointments`);
	console.log("Inserting into database in batches...\n");

	// Insert in batches
	for (let i = 0; i < allAppointments.length; i += batchSize) {
		const batch = allAppointments.slice(i, i + batchSize);

		const { data, error } = await supabase.from("appointments").insert(batch);

		if (error) {
			console.error(
				`Error inserting batch ${Math.floor(i / batchSize) + 1}:`,
				error.message,
			);
			console.error("Sample record:", JSON.stringify(batch[0], null, 2));
			process.exit(1);
		}

		const appointmentsCreated = i + batch.length;
		const progress = ((appointmentsCreated / totalAppointments) * 100).toFixed(
			1,
		);
		process.stdout.write(
			`\rProgress: ${appointmentsCreated}/${totalAppointments} (${progress}%)`,
		);
	}

	console.log("\n\n✅ Successfully created 10,000 appointments!");
	console.log("\nStatistics:");

	// Get some stats
	const { data: stats } = await supabase
		.from("appointments")
		.select("status, type")
		.eq("type", "appointment")
		.limit(10000);

	if (stats) {
		const statusCounts = stats.reduce((acc, apt) => {
			acc[apt.status] = (acc[apt.status] || 0) + 1;
			return acc;
		}, {});

		console.log("\nBy Status:");
		Object.entries(statusCounts).forEach(([status, count]) => {
			console.log(`  ${status}: ${count}`);
		});

		const { count: totalCount } = await supabase
			.from("appointments")
			.select("*", { count: "exact", head: true })
			.eq("type", "appointment");

		console.log(`\nTotal appointments of type='appointment': ${totalCount}`);
	}
}

generateAppointments().catch((error) => {
	console.error("Fatal error:", error);
	process.exit(1);
});
