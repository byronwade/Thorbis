import type {
	Customer,
	Job,
	RecurrenceRule,
	Technician,
	TechnicianSchedule,
} from "@/components/schedule/schedule-types";

export type SerializedRecurrenceRule = Omit<RecurrenceRule, "endDate"> & {
	endDate?: string;
};

export type SerializedCustomer = Omit<Customer, "createdAt" | "updatedAt"> & {
	createdAt: string;
	updatedAt: string;
};

export type SerializedTechnicianSchedule = Omit<TechnicianSchedule, "daysOff"> & {
	daysOff: string[];
};

export type SerializedTechnician = Omit<Technician, "createdAt" | "updatedAt" | "schedule"> & {
	createdAt: string;
	updatedAt: string;
	schedule: SerializedTechnicianSchedule;
};

export type SerializedJob = Omit<
	Job,
	"startTime" | "endTime" | "createdAt" | "updatedAt" | "customer" | "recurrence"
> & {
	startTime: string;
	endTime: string;
	createdAt: string;
	updatedAt: string;
	customer: SerializedCustomer;
	recurrence?: SerializedRecurrenceRule;
};

export type ScheduleBootstrapSerialized = {
	companyId: string;
	range: {
		start: string;
		end: string;
	};
	lastSync: string;
	jobs: SerializedJob[];
	technicians: SerializedTechnician[];
};

export type ScheduleHydrationPayload = {
	companyId: string;
	range: {
		start: Date;
		end: Date;
	};
	lastSync: Date;
	jobs: Job[];
	technicians: Technician[];
};

export function serializeScheduleBootstrap(payload: ScheduleHydrationPayload): ScheduleBootstrapSerialized {
	return {
		companyId: payload.companyId,
		range: {
			start: payload.range.start.toISOString(),
			end: payload.range.end.toISOString(),
		},
		lastSync: payload.lastSync.toISOString(),
		jobs: payload.jobs.map(serializeJob),
		technicians: payload.technicians.map(serializeTechnician),
	};
}

export function deserializeScheduleBootstrap(payload: ScheduleBootstrapSerialized): ScheduleHydrationPayload {
	return {
		companyId: payload.companyId,
		range: {
			start: new Date(payload.range.start),
			end: new Date(payload.range.end),
		},
		lastSync: new Date(payload.lastSync),
		jobs: payload.jobs.map(deserializeJob),
		technicians: payload.technicians.map(deserializeTechnician),
	};
}

function serializeJob(job: Job): SerializedJob {
	return {
		...job,
		startTime: job.startTime.toISOString(),
		endTime: job.endTime.toISOString(),
		createdAt: job.createdAt.toISOString(),
		updatedAt: job.updatedAt.toISOString(),
		customer: {
			...job.customer,
			createdAt: job.customer.createdAt.toISOString(),
			updatedAt: job.customer.updatedAt.toISOString(),
		},
		recurrence: job.recurrence ? serializeRecurrence(job.recurrence) : undefined,
	};
}

function deserializeJob(job: SerializedJob): Job {
	return {
		...job,
		startTime: new Date(job.startTime),
		endTime: new Date(job.endTime),
		createdAt: new Date(job.createdAt),
		updatedAt: new Date(job.updatedAt),
		customer: {
			...job.customer,
			createdAt: new Date(job.customer.createdAt),
			updatedAt: new Date(job.customer.updatedAt),
		},
		recurrence: job.recurrence ? deserializeRecurrence(job.recurrence) : undefined,
	};
}

function serializeTechnician(technician: Technician): SerializedTechnician {
	return {
		...technician,
		createdAt: technician.createdAt.toISOString(),
		updatedAt: technician.updatedAt.toISOString(),
		schedule: serializeTechnicianSchedule(technician.schedule),
	};
}

function deserializeTechnician(technician: SerializedTechnician): Technician {
	return {
		...technician,
		createdAt: new Date(technician.createdAt),
		updatedAt: new Date(technician.updatedAt),
		schedule: deserializeTechnicianSchedule(technician.schedule),
	};
}

function serializeTechnicianSchedule(schedule: TechnicianSchedule): SerializedTechnicianSchedule {
	return {
		...schedule,
		daysOff: schedule.daysOff.map((date) => date.toISOString()),
	};
}

function deserializeTechnicianSchedule(schedule: SerializedTechnicianSchedule): TechnicianSchedule {
	return {
		...schedule,
		daysOff: schedule.daysOff.map((value) => new Date(value)),
	};
}

function serializeRecurrence(recurrence: RecurrenceRule): SerializedRecurrenceRule {
	return {
		...recurrence,
		endDate: recurrence.endDate ? recurrence.endDate.toISOString() : undefined,
	};
}

function deserializeRecurrence(recurrence: SerializedRecurrenceRule): RecurrenceRule {
	return {
		...recurrence,
		endDate: recurrence.endDate ? new Date(recurrence.endDate) : undefined,
	};
}
