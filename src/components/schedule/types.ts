// V0 Scheduler Types - mapped to our Supabase schema

export type TeamMember = {
	id: string;
	name: string;
	avatar?: string;
	role?: string;
};

export type JobCategory = {
	id: string;
	name: string;
	color: string;
};

export type Assignment = {
	id: string;
	title: string;
	start: string; // ISO date string
	end: string; // ISO date string
	memberId: string;
	categoryId: string;
	description?: string;
	location?: string;
	customer?: string;
};
