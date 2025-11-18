const { createClient } = require("@supabase/supabase-js");

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
	console.error("Missing Supabase credentials");
	process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Team members to use (30 members) - using user_id for assigned_to field
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
		user_id: "f5923029-11a5-439a-b6a8-ce3b8da62716",
		company_id: "ef359319-c6e5-40d5-876c-71599f27373c",
	},
	{
		user_id: "f5923029-11a5-439a-b6a8-ce3b8da62716",
		company_id: "3bfab4be-a0ba-4416-9a17-3b90efa64f3b",
	},
	{
		user_id: "f5923029-11a5-439a-b6a8-ce3b8da62716",
		company_id: "45d31b1a-1d28-40a9-a5e7-37a51a9a60b4",
	},
	{
		user_id: "f5923029-11a5-439a-b6a8-ce3b8da62716",
		company_id: "b08f9483-30de-4e50-8e31-e09a59385e5b",
	},
	{
		user_id: "f5923029-11a5-439a-b6a8-ce3b8da62716",
		company_id: "64f3466b-bde5-4e26-aeb2-ef050060ab8c",
	},
	{
		user_id: "f5923029-11a5-439a-b6a8-ce3b8da62716",
		company_id: "7f90ef3f-1d6b-43e4-8273-19064b8a4295",
	},
	{
		user_id: "f5923029-11a5-439a-b6a8-ce3b8da62716",
		company_id: "67dd3419-07e4-4ffb-83fe-98497d248a4f",
	},
	{
		user_id: "f5923029-11a5-439a-b6a8-ce3b8da62716",
		company_id: "71d8d030-96ec-42c6-a742-59ee99a6464b",
	},
	{
		user_id: "f5923029-11a5-439a-b6a8-ce3b8da62716",
		company_id: "f03483bd-34aa-4471-94f0-25fa91d0722b",
	},
	{
		user_id: "f5923029-11a5-439a-b6a8-ce3b8da62716",
		company_id: "747979e9-fb51-42da-8f56-7416995f47a6",
	},
	{
		user_id: "f5923029-11a5-439a-b6a8-ce3b8da62716",
		company_id: "08af170a-f366-4200-85a1-efdefc501692",
	},
	{
		user_id: "f5923029-11a5-439a-b6a8-ce3b8da62716",
		company_id: "d7db8cfd-1542-4ee8-b077-46e6db0f50a0",
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
		user_id: "f5923029-11a5-439a-b6a8-ce3b8da62716",
		company_id: "a51dad62-1a18-4390-b97d-af71530b79b8",
	},
	{
		user_id: "f5923029-11a5-439a-b6a8-ce3b8da62716",
		company_id: "05cc1ee7-01b6-49eb-b0aa-9463e8395f28",
	},
	{
		user_id: "f5923029-11a5-439a-b6a8-ce3b8da62716",
		company_id: "f1d672e3-2104-4dc4-88e7-043ae5fb90c5",
	},
	{
		user_id: "a70b842b-03b6-4069-98c5-0116bf7c98d1",
		company_id: "2b88a305-0ecd-4bff-9898-b166cc7937c4",
	},
	{
		user_id: "f5923029-11a5-439a-b6a8-ce3b8da62716",
		company_id: "1ed8c787-6f83-4bf9-825d-bf156d51e895",
	},
	{
		user_id: "f5923029-11a5-439a-b6a8-ce3b8da62716",
		company_id: "cd9b0254-dc29-4edb-9774-1a4297bd5d25",
	},
	{
		user_id: "f5923029-11a5-439a-b6a8-ce3b8da62716",
		company_id: "11a0411f-fcd1-4618-a874-4aef87a42c9d",
	},
	{
		user_id: "f5923029-11a5-439a-b6a8-ce3b8da62716",
		company_id: "056de577-71d4-40b2-8a4e-acc97cab3842",
	},
	{
		user_id: "24a16ca1-f9e2-4e6d-ac59-ab40ea8ad7c8",
		company_id: "2b88a305-0ecd-4bff-9898-b166cc7937c4",
	},
	{
		user_id: "e3fe368b-9128-4663-80fb-5d9f50b73fbc",
		company_id: "2b88a305-0ecd-4bff-9898-b166cc7937c4",
	},
	{
		user_id: "f5923029-11a5-439a-b6a8-ce3b8da62716",
		company_id: "bfce9354-518a-4044-bb72-01186785c31f",
	},
	{
		user_id: "46167c2a-4aaa-479c-92ed-1c7f0a41e451",
		company_id: "550e8400-e29b-41d4-a716-446655440001",
	},
	{
		user_id: "46167c2a-4aaa-479c-92ed-1c7f0a41e451",
		company_id: "550e8400-e29b-41d4-a716-446655440002",
	},
];

// Sample customers (using company 2b88a305-0ecd-4bff-9898-b166cc7937c4 which has most team members)
const customers = [
	"660e8400-e29b-41d4-a716-446655440006",
	"660e8400-e29b-41d4-a716-446655440007",
	"660e8400-e29b-41d4-a716-446655440008",
	"e096bddb-c8db-4ae5-b1e9-9a0e8c66f0ec",
	"ab75ae23-b95a-481a-9db9-e4b54ea44b3d",
	"b218b185-d4cf-4865-9f2c-ecd8d2867716",
	"660e8400-e29b-41d4-a716-446655440001",
	"660e8400-e29b-41d4-a716-446655440002",
	"660e8400-e29b-41d4-a716-446655440003",
	"660e8400-e29b-41d4-a716-446655440004",
];

const appointmentTypes = [
	"service",
	"consultation",
	"estimate",
	"follow_up",
	"maintenance",
	"emergency",
	"inspection",
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

// Generate appointment number
function generateAppointmentNumber(index) {
	return `APT-2025-${String(index).padStart(6, "0")}`;
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

		const scheduledStart = new Date(date);
		scheduledStart.setHours(currentHour, 0, 0, 0);

		const scheduledEnd = new Date(scheduledStart);
		scheduledEnd.setHours(currentHour + duration, 0, 0, 0);

		const customer = customers[randomInt(0, customers.length - 1)];
		const type = appointmentTypes[randomInt(0, appointmentTypes.length - 1)];
		const status = statuses[randomInt(0, statuses.length - 1)];

		appointments.push({
			company_id: teamMember.company_id,
			customer_id: customer,
			assigned_to: teamMember.user_id,
			appointment_number: generateAppointmentNumber(startIndex + i),
			title: `${type} Appointment`,
			description: `Scheduled ${type.toLowerCase()} service`,
			scheduled_start: scheduledStart.toISOString(),
			scheduled_end: scheduledEnd.toISOString(),
			duration_minutes: duration * 60,
			status: status,
			type: type,
			priority: randomInt(0, 2) === 0 ? "high" : "normal",
		});

		// Move to next available time slot (add some buffer)
		currentHour += duration + randomInt(0, 1); // 0-1 hour gap between appointments
	}

	return appointments;
}

async function generateAppointments() {
	const totalAppointments = 10000;
	const batchSize = 100;
	let appointmentsCreated = 0;

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
			process.exit(1);
		}

		appointmentsCreated += batch.length;
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
		.limit(10000);

	if (stats) {
		const statusCounts = stats.reduce((acc, apt) => {
			acc[apt.status] = (acc[apt.status] || 0) + 1;
			return acc;
		}, {});

		const typeCounts = stats.reduce((acc, apt) => {
			acc[apt.type] = (acc[apt.type] || 0) + 1;
			return acc;
		}, {});

		console.log("\nBy Status:");
		Object.entries(statusCounts).forEach(([status, count]) => {
			console.log(`  ${status}: ${count}`);
		});

		console.log("\nBy Type:");
		Object.entries(typeCounts).forEach(([type, count]) => {
			console.log(`  ${type}: ${count}`);
		});
	}
}

generateAppointments().catch((error) => {
	console.error("Fatal error:", error);
	process.exit(1);
});
