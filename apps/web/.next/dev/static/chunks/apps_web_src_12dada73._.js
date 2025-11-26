(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/apps/web/src/lib/schedule-utils.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "endOfDay",
    ()=>endOfDay,
    "filterJobs",
    ()=>filterJobs,
    "sortJobsByStartTime",
    ()=>sortJobsByStartTime,
    "startOfDay",
    ()=>startOfDay
]);
/**
 * Utilities for schedule management
 */ // ============================================
// CONFLICT DETECTION
// ============================================
function hasTimeConflict(job1Start, job1End, job2Start, job2End) {
    const start1 = job1Start instanceof Date ? job1Start : new Date(job1Start);
    const end1 = job1End instanceof Date ? job1End : new Date(job1End);
    const start2 = job2Start instanceof Date ? job2Start : new Date(job2Start);
    const end2 = job2End instanceof Date ? job2End : new Date(job2End);
    return start1 >= start2 && start1 < end2 || end1 > start2 && end1 <= end2 || start1 <= start2 && end1 >= end2;
}
function findConflictingJobs(jobs, technicianId, startTime, endTime, excludeJobId) {
    return jobs.filter((job)=>{
        if (excludeJobId && job.id === excludeJobId) {
            return false;
        }
        if (!jobHasTechnician(job, technicianId)) {
            return false;
        }
        return hasTimeConflict(startTime, endTime, job.startTime, job.endTime);
    });
}
// ============================================
// MIGRATION UTILITIES
// ============================================
function legacyJobToJob(legacy, technicianId) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    // Parse time strings
    const [startHour, startMin] = legacy.startTime.split(":").map(Number);
    const [endHour, endMin] = legacy.endTime.split(":").map(Number);
    const startTime = new Date(today);
    startTime.setHours(startHour, startMin, 0, 0);
    const endTime = new Date(today);
    endTime.setHours(endHour, endMin, 0, 0);
    // Create address and location
    const address = {
        street: legacy.address,
        city: "",
        state: "",
        zip: "",
        country: "USA"
    };
    const location = {
        address,
        coordinates: {
            lat: legacy.lat,
            lng: legacy.lng
        }
    };
    // Create customer
    const customer = {
        id: `customer-${legacy.customer.toLowerCase().replace(/\s+/g, "-")}`,
        name: legacy.customer,
        location,
        createdAt: new Date(),
        updatedAt: new Date()
    };
    // Calculate estimated duration in minutes
    const estimatedDuration = legacy.estimatedDuration ? Number.parseFloat(legacy.estimatedDuration.replace(/[^\d.]/g, "")) * 60 : undefined;
    const assignments = technicianId ? [
        {
            technicianId,
            teamMemberId: undefined,
            displayName: "Technician",
            avatar: null,
            role: "primary",
            status: "available",
            isActive: true
        }
    ] : [];
    return {
        id: legacy.id,
        technicianId,
        assignments,
        isUnassigned: assignments.length === 0,
        title: legacy.title,
        description: legacy.description,
        customer,
        location,
        startTime,
        endTime,
        status: legacy.status,
        priority: legacy.priority,
        metadata: {
            estimatedDuration
        },
        createdAt: new Date(),
        updatedAt: new Date()
    };
}
// ============================================
// TIME CALCULATIONS
// ============================================
function calculateDuration(startTime, endTime) {
    const start = startTime instanceof Date ? startTime : new Date(startTime);
    const end = endTime instanceof Date ? endTime : new Date(endTime);
    return Math.round((end.getTime() - start.getTime()) / (1000 * 60)); // minutes
}
function formatDuration(minutes) {
    if (minutes < 60) {
        return `${minutes}m`;
    }
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
}
function addMinutes(date, minutes) {
    return new Date(date.getTime() + minutes * 60 * 1000);
}
// ============================================
// WORK HOURS CALCULATIONS
// ============================================
function calculateWorkload(jobs, technicianSchedule, date) {
    const dayStart = new Date(date);
    dayStart.setHours(technicianSchedule.availableHours.start, 0, 0, 0);
    const dayEnd = new Date(date);
    dayEnd.setHours(technicianSchedule.availableHours.end, 0, 0, 0);
    const availableMinutes = calculateDuration(dayStart, dayEnd);
    // Calculate total job duration for this day
    const totalMinutes = jobs.reduce((sum, job)=>{
        // Check if job is on this date
        if (job.startTime.toDateString() === date.toDateString() || job.endTime.toDateString() === date.toDateString()) {
            return sum + calculateDuration(job.startTime, job.endTime);
        }
        return sum;
    }, 0);
    const utilizationRate = availableMinutes > 0 ? totalMinutes / availableMinutes * 100 : 0;
    return {
        totalMinutes,
        availableMinutes,
        utilizationRate: Math.min(utilizationRate, 100)
    };
}
// ============================================
// DATE UTILITIES
// ============================================
function isSameDay(date1, date2) {
    return date1.getFullYear() === date2.getFullYear() && date1.getMonth() === date2.getMonth() && date1.getDate() === date2.getDate();
}
function isToday(date) {
    return isSameDay(date, new Date());
}
function startOfDay(date) {
    const result = new Date(date);
    result.setHours(0, 0, 0, 0);
    return result;
}
function endOfDay(date) {
    const result = new Date(date);
    result.setHours(23, 59, 59, 999);
    return result;
}
// ============================================
// RECURRING JOBS
// ============================================
function generateRecurringJobInstances(baseJob, startDate, endDate) {
    if (!baseJob.recurrence) {
        return [
            baseJob
        ];
    }
    const instances = [];
    const { frequency, interval, count, endDate: recurrenceEndDate } = baseJob.recurrence;
    const currentDate = new Date(baseJob.startTime);
    let instanceCount = 0;
    while(currentDate <= endDate){
        if (currentDate >= startDate) {
            // Calculate job duration
            const duration = calculateDuration(baseJob.startTime, baseJob.endTime);
            // Create new instance
            const instance = {
                ...baseJob,
                id: `${baseJob.id}-instance-${instanceCount}`,
                parentJobId: baseJob.id,
                startTime: new Date(currentDate),
                endTime: addMinutes(new Date(currentDate), duration)
            };
            instances.push(instance);
        }
        // Move to next occurrence
        instanceCount++;
        if (count && instanceCount >= count) {
            break;
        }
        if (recurrenceEndDate && currentDate >= recurrenceEndDate) {
            break;
        }
        switch(frequency){
            case "daily":
                currentDate.setDate(currentDate.getDate() + interval);
                break;
            case "weekly":
                currentDate.setDate(currentDate.getDate() + interval * 7);
                break;
            case "monthly":
                currentDate.setMonth(currentDate.getMonth() + interval);
                break;
            case "yearly":
                currentDate.setFullYear(currentDate.getFullYear() + interval);
                break;
        }
    }
    return instances;
}
function filterJobs(jobs, filters) {
    return jobs.filter((job)=>{
        // Filter by technician
        if (filters.technicianIds && filters.technicianIds.length > 0 && !filters.technicianIds.some((technicianId)=>jobHasTechnician(job, technicianId))) {
            return false;
        }
        // Filter by status
        if (filters.statuses && filters.statuses.length > 0 && !filters.statuses.includes(job.status)) {
            return false;
        }
        // Filter by priority
        if (filters.priorities && filters.priorities.length > 0 && !filters.priorities.includes(job.priority)) {
            return false;
        }
        // Filter by search query
        if (filters.searchQuery && filters.searchQuery.trim() !== "") {
            const query = filters.searchQuery.toLowerCase();
            const matchesTitle = job.title.toLowerCase().includes(query);
            const matchesCustomer = job.customer.name.toLowerCase().includes(query);
            const matchesDescription = job.description?.toLowerCase().includes(query);
            if (!(matchesTitle || matchesCustomer || matchesDescription)) {
                return false;
            }
        }
        return true;
    });
}
function sortJobsByStartTime(jobs) {
    return [
        ...jobs
    ].sort((a, b)=>{
        // Ensure dates are Date objects
        const aTime = a.startTime instanceof Date ? a.startTime : new Date(a.startTime);
        const bTime = b.startTime instanceof Date ? b.startTime : new Date(b.startTime);
        return aTime.getTime() - bTime.getTime();
    });
}
function sortTechniciansByName(technicians) {
    return [
        ...technicians
    ].sort((a, b)=>a.name.localeCompare(b.name));
}
// ============================================
// VALIDATION
// ============================================
function validateJobTimes(startTime, endTime) {
    if (startTime >= endTime) {
        return {
            valid: false,
            error: "End time must be after start time"
        };
    }
    const duration = calculateDuration(startTime, endTime);
    if (duration < 15) {
        return {
            valid: false,
            error: "Job must be at least 15 minutes long"
        };
    }
    return {
        valid: true
    };
}
function validateJob(job) {
    const errors = [];
    if (!job.title || job.title.trim() === "") {
        errors.push("Title is required");
    }
    const hasTechnician = !!job.technicianId || job.assignments?.some((assignment)=>assignment.technicianId);
    if (!hasTechnician) {
        errors.push("Technician must be assigned");
    }
    if (!job.startTime) {
        errors.push("Start time is required");
    }
    if (!job.endTime) {
        errors.push("End time is required");
    }
    if (job.startTime && job.endTime) {
        const timeValidation = validateJobTimes(job.startTime, job.endTime);
        if (!timeValidation.valid) {
            errors.push(timeValidation.error);
        }
    }
    return {
        valid: errors.length === 0,
        errors
    };
}
function jobHasTechnician(job, technicianId) {
    if (job.technicianId === technicianId) {
        return true;
    }
    return job.assignments.some((assignment)=>assignment.technicianId === technicianId);
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/apps/web/src/lib/utils/customer-display.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Customer Display Utilities
 *
 * Unified logic for displaying customer information consistently across the application.
 * This prevents inconsistent customer name display and provides fallback logic.
 */ __turbopack_context__.s([
    "getCustomerContactDisplay",
    ()=>getCustomerContactDisplay,
    "getCustomerDisplayName",
    ()=>getCustomerDisplayName,
    "getCustomerInitials",
    ()=>getCustomerInitials,
    "getCustomerSortName",
    ()=>getCustomerSortName,
    "hasCustomerName",
    ()=>hasCustomerName
]);
function getCustomerDisplayName(customer, fallbackEmail) {
    if (!customer) {
        return fallbackEmail || "Unknown Customer";
    }
    // Priority 1: Explicit display name
    if (customer.display_name) {
        return customer.display_name;
    }
    // Priority 2: Full name (first + last)
    const firstName = customer.first_name?.trim();
    const lastName = customer.last_name?.trim();
    if (firstName && lastName) {
        return `${firstName} ${lastName}`;
    }
    // Priority 3: Either first or last name
    if (firstName) return firstName;
    if (lastName) return lastName;
    // Priority 4: Company name (for business customers)
    if (customer.company_name) {
        return customer.company_name;
    }
    // Priority 5: Email from customer record
    if (customer.email) {
        return customer.email;
    }
    // Priority 6: Fallback email provided
    if (fallbackEmail) {
        return fallbackEmail;
    }
    // Ultimate fallback
    return "Unknown Customer";
}
function getCustomerInitials(customer) {
    if (!customer) return "?";
    const displayName = getCustomerDisplayName(customer);
    // Split by spaces and take first letter of each word
    const words = displayName.split(/\s+/).filter(Boolean);
    if (words.length >= 2) {
        return (words[0][0] + words[1][0]).toUpperCase();
    }
    if (words.length === 1 && words[0].length >= 2) {
        return words[0].slice(0, 2).toUpperCase();
    }
    if (words.length === 1) {
        return words[0][0].toUpperCase();
    }
    return "?";
}
function getCustomerContactDisplay(customer) {
    if (!customer) return "Unknown Customer";
    const lines = [
        getCustomerDisplayName(customer)
    ];
    if (customer.email) {
        lines.push(customer.email);
    }
    if (customer.phone) {
        lines.push(customer.phone);
    }
    return lines.join("\n");
}
function hasCustomerName(customer) {
    if (!customer) return false;
    return !!(customer.display_name || customer.first_name || customer.last_name || customer.company_name);
}
function getCustomerSortName(customer) {
    if (!customer) return "zzz_unknown"; // Sort unknowns to end
    // If only last name, use it
    if (customer.last_name && !customer.first_name) {
        return customer.last_name;
    }
    // If only first name, use it
    if (customer.first_name && !customer.last_name) {
        return customer.first_name;
    }
    // If both names, use "Last, First" format
    if (customer.first_name && customer.last_name) {
        return `${customer.last_name}, ${customer.first_name}`;
    }
    // Otherwise use display name logic
    return getCustomerDisplayName(customer);
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/apps/web/src/hooks/use-schedule.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useSchedule",
    ()=>useSchedule,
    "useScheduleRealtime",
    ()=>useScheduleRealtime
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.4_@opentelemetry+api@1.9.0_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$schedule$2d$data$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/lib/schedule-data.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$schedule$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/lib/schedule-utils.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$stores$2f$schedule$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/lib/stores/schedule-store.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$stores$2f$view$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/lib/stores/view-store.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$database$2f$src$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/database/src/client.ts [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature(), _s2 = __turbopack_context__.k.signature();
;
;
;
;
;
;
function useSchedule() {
    _s();
    // Use granular selectors to avoid closure issues
    const isLoading = (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$stores$2f$schedule$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useScheduleStore"])({
        "useSchedule.useScheduleStore[isLoading]": (state)=>state.isLoading
    }["useSchedule.useScheduleStore[isLoading]"]);
    const error = (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$stores$2f$schedule$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useScheduleStore"])({
        "useSchedule.useScheduleStore[error]": (state)=>state.error
    }["useSchedule.useScheduleStore[error]"]);
    const lastSync = (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$stores$2f$schedule$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useScheduleStore"])({
        "useSchedule.useScheduleStore[lastSync]": (state)=>state.lastSync
    }["useSchedule.useScheduleStore[lastSync]"]);
    const jobs = (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$stores$2f$schedule$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useScheduleStore"])({
        "useSchedule.useScheduleStore[jobs]": (state)=>state.jobs
    }["useSchedule.useScheduleStore[jobs]"]);
    const technicians = (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$stores$2f$schedule$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useScheduleStore"])({
        "useSchedule.useScheduleStore[technicians]": (state)=>state.technicians
    }["useSchedule.useScheduleStore[technicians]"]);
    const selectedJobId = (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$stores$2f$schedule$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useScheduleStore"])({
        "useSchedule.useScheduleStore[selectedJobId]": (state)=>state.selectedJobId
    }["useSchedule.useScheduleStore[selectedJobId]"]);
    const selectedTechnicianId = (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$stores$2f$schedule$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useScheduleStore"])({
        "useSchedule.useScheduleStore[selectedTechnicianId]": (state)=>state.selectedTechnicianId
    }["useSchedule.useScheduleStore[selectedTechnicianId]"]);
    const lastFetchedRange = (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$stores$2f$schedule$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useScheduleStore"])({
        "useSchedule.useScheduleStore[lastFetchedRange]": (state)=>state.lastFetchedRange
    }["useSchedule.useScheduleStore[lastFetchedRange]"]);
    const storeCompanyId = (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$stores$2f$schedule$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useScheduleStore"])({
        "useSchedule.useScheduleStore[storeCompanyId]": (state)=>state.companyId
    }["useSchedule.useScheduleStore[storeCompanyId]"]);
    const unassignedHasMore = (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$stores$2f$schedule$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useScheduleStore"])({
        "useSchedule.useScheduleStore[unassignedHasMore]": (state)=>state.unassignedHasMore
    }["useSchedule.useScheduleStore[unassignedHasMore]"]);
    const unassignedSearch = (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$stores$2f$schedule$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useScheduleStore"])({
        "useSchedule.useScheduleStore[unassignedSearch]": (state)=>state.unassignedSearch
    }["useSchedule.useScheduleStore[unassignedSearch]"]);
    const isLoadingUnassigned = (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$stores$2f$schedule$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useScheduleStore"])({
        "useSchedule.useScheduleStore[isLoadingUnassigned]": (state)=>state.isLoadingUnassigned
    }["useSchedule.useScheduleStore[isLoadingUnassigned]"]);
    const unassignedTotalCount = (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$stores$2f$schedule$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useScheduleStore"])({
        "useSchedule.useScheduleStore[unassignedTotalCount]": (state)=>state.unassignedTotalCount
    }["useSchedule.useScheduleStore[unassignedTotalCount]"]);
    // Get actions
    const setLoading = (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$stores$2f$schedule$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useScheduleStore"])({
        "useSchedule.useScheduleStore[setLoading]": (state)=>state.setLoading
    }["useSchedule.useScheduleStore[setLoading]"]);
    const setError = (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$stores$2f$schedule$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useScheduleStore"])({
        "useSchedule.useScheduleStore[setError]": (state)=>state.setError
    }["useSchedule.useScheduleStore[setError]"]);
    const setJobs = (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$stores$2f$schedule$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useScheduleStore"])({
        "useSchedule.useScheduleStore[setJobs]": (state)=>state.setJobs
    }["useSchedule.useScheduleStore[setJobs]"]);
    const setTechnicians = (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$stores$2f$schedule$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useScheduleStore"])({
        "useSchedule.useScheduleStore[setTechnicians]": (state)=>state.setTechnicians
    }["useSchedule.useScheduleStore[setTechnicians]"]);
    const selectJob = (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$stores$2f$schedule$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useScheduleStore"])({
        "useSchedule.useScheduleStore[selectJob]": (state)=>state.selectJob
    }["useSchedule.useScheduleStore[selectJob]"]);
    const selectTechnician = (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$stores$2f$schedule$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useScheduleStore"])({
        "useSchedule.useScheduleStore[selectTechnician]": (state)=>state.selectTechnician
    }["useSchedule.useScheduleStore[selectTechnician]"]);
    const addJob = (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$stores$2f$schedule$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useScheduleStore"])({
        "useSchedule.useScheduleStore[addJob]": (state)=>state.addJob
    }["useSchedule.useScheduleStore[addJob]"]);
    const updateJob = (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$stores$2f$schedule$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useScheduleStore"])({
        "useSchedule.useScheduleStore[updateJob]": (state)=>state.updateJob
    }["useSchedule.useScheduleStore[updateJob]"]);
    const moveJob = (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$stores$2f$schedule$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useScheduleStore"])({
        "useSchedule.useScheduleStore[moveJob]": (state)=>state.moveJob
    }["useSchedule.useScheduleStore[moveJob]"]);
    const deleteJob = (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$stores$2f$schedule$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useScheduleStore"])({
        "useSchedule.useScheduleStore[deleteJob]": (state)=>state.deleteJob
    }["useSchedule.useScheduleStore[deleteJob]"]);
    const duplicateJob = (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$stores$2f$schedule$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useScheduleStore"])({
        "useSchedule.useScheduleStore[duplicateJob]": (state)=>state.duplicateJob
    }["useSchedule.useScheduleStore[duplicateJob]"]);
    const getJobById = (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$stores$2f$schedule$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useScheduleStore"])({
        "useSchedule.useScheduleStore[getJobById]": (state)=>state.getJobById
    }["useSchedule.useScheduleStore[getJobById]"]);
    const syncWithServer = (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$stores$2f$schedule$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useScheduleStore"])({
        "useSchedule.useScheduleStore[syncWithServer]": (state)=>state.syncWithServer
    }["useSchedule.useScheduleStore[syncWithServer]"]);
    const setLastSync = (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$stores$2f$schedule$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useScheduleStore"])({
        "useSchedule.useScheduleStore[setLastSync]": (state)=>state.setLastSync
    }["useSchedule.useScheduleStore[setLastSync]"]);
    const setCompanyId = (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$stores$2f$schedule$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useScheduleStore"])({
        "useSchedule.useScheduleStore[setCompanyId]": (state)=>state.setCompanyId
    }["useSchedule.useScheduleStore[setCompanyId]"]);
    const setLastFetchedRange = (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$stores$2f$schedule$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useScheduleStore"])({
        "useSchedule.useScheduleStore[setLastFetchedRange]": (state)=>state.setLastFetchedRange
    }["useSchedule.useScheduleStore[setLastFetchedRange]"]);
    const setUnassignedMeta = (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$stores$2f$schedule$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useScheduleStore"])({
        "useSchedule.useScheduleStore[setUnassignedMeta]": (state)=>state.setUnassignedMeta
    }["useSchedule.useScheduleStore[setUnassignedMeta]"]);
    const getUnassignedJobsFromStore = (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$stores$2f$schedule$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useScheduleStore"])({
        "useSchedule.useScheduleStore[getUnassignedJobsFromStore]": (state)=>state.getUnassignedJobs
    }["useSchedule.useScheduleStore[getUnassignedJobsFromStore]"]);
    const getJobsGroupedByTechnicianFromStore = (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$stores$2f$schedule$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useScheduleStore"])({
        "useSchedule.useScheduleStore[getJobsGroupedByTechnicianFromStore]": (state)=>state.getJobsGroupedByTechnician
    }["useSchedule.useScheduleStore[getJobsGroupedByTechnicianFromStore]"]);
    const loadMoreUnassignedJobs = (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$stores$2f$schedule$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useScheduleStore"])({
        "useSchedule.useScheduleStore[loadMoreUnassignedJobs]": (state)=>state.loadMoreUnassignedJobs
    }["useSchedule.useScheduleStore[loadMoreUnassignedJobs]"]);
    // Get view store values with selectors to avoid re-renders
    const filters = (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$stores$2f$view$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useViewStore"])({
        "useSchedule.useViewStore[filters]": (state)=>state.filters
    }["useSchedule.useViewStore[filters]"]);
    const showCompletedJobs = (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$stores$2f$view$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useViewStore"])({
        "useSchedule.useViewStore[showCompletedJobs]": (state)=>state.showCompletedJobs
    }["useSchedule.useViewStore[showCompletedJobs]"]);
    const _currentDate = (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$stores$2f$view$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useViewStore"])({
        "useSchedule.useViewStore[_currentDate]": (state)=>state.currentDate
    }["useSchedule.useViewStore[_currentDate]"]);
    const _zoom = (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$stores$2f$view$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useViewStore"])({
        "useSchedule.useViewStore[_zoom]": (state)=>state.zoom
    }["useSchedule.useViewStore[_zoom]"]);
    // Calculate visible time range once
    const visibleTimeRange = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "useSchedule.useMemo[visibleTimeRange]": ()=>__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$stores$2f$view$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useViewStore"].getState().getVisibleTimeRange()
    }["useSchedule.useMemo[visibleTimeRange]"], []);
    const rangeStart = visibleTimeRange.start.getTime();
    const rangeEnd = visibleTimeRange.end.getTime();
    const companyIdRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$stores$2f$schedule$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useScheduleStore"].getState().companyId);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "useSchedule.useEffect": ()=>{
            companyIdRef.current = storeCompanyId;
        }
    }["useSchedule.useEffect"], [
        storeCompanyId
    ]);
    const jobCount = jobs.size;
    const hasCoverage = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "useSchedule.useMemo[hasCoverage]": ()=>{
            if (!lastFetchedRange || jobCount === 0) {
                return false;
            }
            const fetchedStart = lastFetchedRange.start.getTime();
            const fetchedEnd = lastFetchedRange.end.getTime();
            return fetchedStart <= rangeStart && fetchedEnd >= rangeEnd;
        }
    }["useSchedule.useMemo[hasCoverage]"], [
        jobCount,
        lastFetchedRange,
        rangeEnd,
        rangeStart
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "useSchedule.useEffect": ()=>{
            let isMounted = true;
            if (hasCoverage && companyIdRef.current) {
                return ({
                    "useSchedule.useEffect": ()=>{
                        isMounted = false;
                    }
                })["useSchedule.useEffect"];
            }
            const loadData = {
                "useSchedule.useEffect.loadData": async ()=>{
                    setLoading(true);
                    setError(null);
                    try {
                        const supabase = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$database$2f$src$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createClient"])();
                        if (!supabase) {
                            throw new Error("Database connection not available");
                        }
                        const { data: { user }, error: authError } = await supabase.auth.getUser();
                        if (authError) {
                            throw authError;
                        }
                        if (!user) {
                            throw new Error("User session not found");
                        }
                        let companyId = companyIdRef.current;
                        if (!companyId) {
                            const { data: membership, error: membershipError } = await supabase.from("company_memberships").select("company_id").eq("user_id", user.id).eq("status", "active").order("joined_at", {
                                ascending: false,
                                nullsFirst: false
                            }).limit(1).maybeSingle();
                            if (membershipError) {
                                throw membershipError;
                            }
                            if (!membership?.company_id) {
                                throw new Error("No active company membership found");
                            }
                            companyId = membership.company_id;
                            companyIdRef.current = companyId;
                            setCompanyId(companyId);
                        }
                        if (!companyId) {
                            throw new Error("Unable to resolve company context for schedule data");
                        }
                        const { jobs: convertedJobs, technicians: convertedTechnicians, unassignedMeta } = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$schedule$2d$data$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["fetchScheduleData"])({
                            supabase,
                            companyId,
                            range: {
                                start: new Date(rangeStart),
                                end: new Date(rangeEnd)
                            }
                        });
                        if (!isMounted) {
                            return;
                        }
                        setTechnicians(convertedTechnicians);
                        setJobs(convertedJobs);
                        const fetchedRange = {
                            start: new Date(rangeStart),
                            end: new Date(rangeEnd)
                        };
                        setTechnicians(convertedTechnicians);
                        setJobs(convertedJobs);
                        const unassignedCount = convertedJobs.filter({
                            "useSchedule.useEffect.loadData": (job)=>job.isUnassigned
                        }["useSchedule.useEffect.loadData"]).length;
                        setUnassignedMeta(unassignedMeta, unassignedCount);
                        setLastSync(new Date());
                        setLastFetchedRange(fetchedRange);
                    } catch (error) {
                        if (!isMounted) {
                            return;
                        }
                        const errorMessage = error instanceof Error ? error.message : typeof error === "object" && error !== null && "message" in error ? String(error.message) : "Unknown error";
                        setError(errorMessage);
                    } finally{
                        if (isMounted) {
                            setLoading(false);
                        }
                    }
                }
            }["useSchedule.useEffect.loadData"];
            loadData();
            return ({
                "useSchedule.useEffect": ()=>{
                    isMounted = false;
                }
            })["useSchedule.useEffect"];
        }
    }["useSchedule.useEffect"], [
        hasCoverage,
        rangeEnd,
        rangeStart,
        setCompanyId,
        setLastFetchedRange,
        setError,
        setJobs,
        setLastSync,
        setLoading,
        setTechnicians
    ]);
    // Get filtered and sorted jobs - MEMOIZED
    const filteredJobs = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "useSchedule.useMemo[filteredJobs]": ()=>{
            const allJobs = Array.from(jobs.values());
            // Apply view filters
            const filtered = (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$schedule$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["filterJobs"])(allJobs, {
                technicianIds: filters.technicianIds,
                statuses: filters.statuses,
                priorities: filters.priorities,
                searchQuery: filters.searchQuery
            });
            // Filter by completed jobs visibility
            const visible = showCompletedJobs ? filtered : filtered.filter({
                "useSchedule.useMemo[filteredJobs]": (job)=>job.status !== "completed"
            }["useSchedule.useMemo[filteredJobs]"]);
            // Sort by start time
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$schedule$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["sortJobsByStartTime"])(visible);
        }
    }["useSchedule.useMemo[filteredJobs]"], [
        jobs,
        filters,
        showCompletedJobs
    ]);
    // Get filtered technicians - MEMOIZED
    const filteredTechnicians = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "useSchedule.useMemo[filteredTechnicians]": ()=>{
            const allTechnicians = Array.from(technicians.values());
            // If technician filter is active, only show filtered technicians
            if (filters.technicianIds.length > 0) {
                return allTechnicians.filter({
                    "useSchedule.useMemo[filteredTechnicians]": (tech)=>filters.technicianIds.includes(tech.id)
                }["useSchedule.useMemo[filteredTechnicians]"]);
            }
            return allTechnicians;
        }
    }["useSchedule.useMemo[filteredTechnicians]"], [
        technicians,
        filters.technicianIds
    ]);
    // Pre-index jobs by technician ID for O(1) lookups instead of O(n) filter
    const jobsByTechnicianId = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "useSchedule.useMemo[jobsByTechnicianId]": ()=>{
            const map = new Map();
            for (const job of filteredJobs){
                const techId = job.technicianId;
                if (techId) {
                    const existing = map.get(techId);
                    if (existing) {
                        existing.push(job);
                    } else {
                        map.set(techId, [
                            job
                        ]);
                    }
                }
            }
            return map;
        }
    }["useSchedule.useMemo[jobsByTechnicianId]"], [
        filteredJobs
    ]);
    // Get jobs for a specific technician - now O(1) lookup
    const getJobsForTechnician = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useSchedule.useCallback[getJobsForTechnician]": (technicianId)=>jobsByTechnicianId.get(technicianId) ?? []
    }["useSchedule.useCallback[getJobsForTechnician]"], [
        jobsByTechnicianId
    ]);
    // Get jobs within visible time range - MEMOIZED
    const visibleJobs = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "useSchedule.useMemo[visibleJobs]": ()=>{
            const { start, end } = visibleTimeRange;
            return filteredJobs.filter({
                "useSchedule.useMemo[visibleJobs]": (job)=>{
                    // Job overlaps with visible range
                    return job.startTime <= end && job.endTime >= start;
                }
            }["useSchedule.useMemo[visibleJobs]"]);
        }
    }["useSchedule.useMemo[visibleJobs]"], [
        filteredJobs,
        visibleTimeRange
    ]);
    // Get all jobs (unfiltered)
    const getAllJobs = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useSchedule.useCallback[getAllJobs]": ()=>Array.from(jobs.values())
    }["useSchedule.useCallback[getAllJobs]"], [
        jobs
    ]);
    return {
        // State
        isLoading,
        error,
        lastSync,
        // Data
        technicians: filteredTechnicians,
        jobs: filteredJobs,
        visibleJobs,
        // Selection
        selectedJobId,
        selectedTechnicianId,
        selectedJob: selectedJobId ? getJobById(selectedJobId) : null,
        // Actions
        getJobsForTechnician,
        getAllJobs,
        selectJob,
        selectTechnician,
        getUnassignedJobs: getUnassignedJobsFromStore,
        getJobsGroupedByTechnician: getJobsGroupedByTechnicianFromStore,
        unassignedHasMore,
        unassignedSearch,
        isLoadingUnassigned,
        unassignedTotalCount,
        loadMoreUnassignedJobs,
        // Mutations
        addJob,
        updateJob,
        moveJob,
        deleteJob,
        duplicateJob,
        // Sync
        refresh: syncWithServer
    };
}
_s(useSchedule, "Nf94IDSuKiZvhhSHEAVZdP4ajRc=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$stores$2f$schedule$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useScheduleStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$stores$2f$schedule$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useScheduleStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$stores$2f$schedule$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useScheduleStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$stores$2f$schedule$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useScheduleStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$stores$2f$schedule$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useScheduleStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$stores$2f$schedule$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useScheduleStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$stores$2f$schedule$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useScheduleStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$stores$2f$schedule$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useScheduleStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$stores$2f$schedule$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useScheduleStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$stores$2f$schedule$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useScheduleStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$stores$2f$schedule$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useScheduleStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$stores$2f$schedule$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useScheduleStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$stores$2f$schedule$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useScheduleStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$stores$2f$schedule$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useScheduleStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$stores$2f$schedule$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useScheduleStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$stores$2f$schedule$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useScheduleStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$stores$2f$schedule$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useScheduleStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$stores$2f$schedule$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useScheduleStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$stores$2f$schedule$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useScheduleStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$stores$2f$schedule$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useScheduleStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$stores$2f$schedule$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useScheduleStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$stores$2f$schedule$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useScheduleStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$stores$2f$schedule$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useScheduleStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$stores$2f$schedule$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useScheduleStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$stores$2f$schedule$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useScheduleStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$stores$2f$schedule$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useScheduleStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$stores$2f$schedule$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useScheduleStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$stores$2f$schedule$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useScheduleStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$stores$2f$schedule$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useScheduleStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$stores$2f$schedule$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useScheduleStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$stores$2f$schedule$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useScheduleStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$stores$2f$schedule$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useScheduleStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$stores$2f$schedule$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useScheduleStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$stores$2f$view$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useViewStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$stores$2f$view$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useViewStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$stores$2f$view$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useViewStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$stores$2f$view$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useViewStore"]
    ];
});
function useScheduleRealtime() {
    _s1();
    const companyId = (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$stores$2f$schedule$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useScheduleStore"])({
        "useScheduleRealtime.useScheduleStore[companyId]": (state)=>state.companyId
    }["useScheduleRealtime.useScheduleStore[companyId]"]);
    const updateJob = (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$stores$2f$schedule$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useScheduleStore"])({
        "useScheduleRealtime.useScheduleStore[updateJob]": (state)=>state.updateJob
    }["useScheduleRealtime.useScheduleStore[updateJob]"]);
    const deleteJob = (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$stores$2f$schedule$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useScheduleStore"])({
        "useScheduleRealtime.useScheduleStore[deleteJob]": (state)=>state.deleteJob
    }["useScheduleRealtime.useScheduleStore[deleteJob]"]);
    const addJob = (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$stores$2f$schedule$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useScheduleStore"])({
        "useScheduleRealtime.useScheduleStore[addJob]": (state)=>state.addJob
    }["useScheduleRealtime.useScheduleStore[addJob]"]);
    const getJobById = (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$stores$2f$schedule$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useScheduleStore"])({
        "useScheduleRealtime.useScheduleStore[getJobById]": (state)=>state.getJobById
    }["useScheduleRealtime.useScheduleStore[getJobById]"]);
    const syncWithServer = (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$stores$2f$schedule$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useScheduleStore"])({
        "useScheduleRealtime.useScheduleStore[syncWithServer]": (state)=>state.syncWithServer
    }["useScheduleRealtime.useScheduleStore[syncWithServer]"]);
    const lastSync = (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$stores$2f$schedule$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useScheduleStore"])({
        "useScheduleRealtime.useScheduleStore[lastSync]": (state)=>state.lastSync
    }["useScheduleRealtime.useScheduleStore[lastSync]"]);
    const [isConnected, setIsConnected] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [connectionError, setConnectionError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "useScheduleRealtime.useEffect": ()=>{
            if (!companyId) {
                return;
            }
            const supabase = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$database$2f$src$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createClient"])();
            if (!supabase) {
                setConnectionError("Database connection not available");
                return;
            }
            const channelName = `schedule-realtime-${companyId}`;
            const channel = supabase.channel(channelName).on("postgres_changes", {
                event: "*",
                schema: "public",
                table: "appointments",
                filter: `company_id=eq.${companyId}`
            }, {
                "useScheduleRealtime.useEffect.channel": async (payload)=>{
                    const { eventType, new: newRecord, old: oldRecord } = payload;
                    switch(eventType){
                        case "DELETE":
                            {
                                // Remove job from store
                                const jobId = oldRecord?.id;
                                if (jobId) {
                                    deleteJob(jobId);
                                }
                                break;
                            }
                        case "UPDATE":
                            {
                                // For updates, try to merge changes into existing job
                                const record = newRecord;
                                const jobId = record.id;
                                if (!jobId) break;
                                const existingJob = getJobById(jobId);
                                if (existingJob) {
                                    // Merge updates into existing job
                                    const updates = {};
                                    if (record.title !== undefined) {
                                        updates.title = record.title;
                                    }
                                    if (record.description !== undefined) {
                                        updates.description = record.description;
                                    }
                                    if (record.status !== undefined) {
                                        updates.status = mapStatus(record.status);
                                    }
                                    if (record.start_time !== undefined) {
                                        updates.startTime = new Date(record.start_time);
                                    }
                                    if (record.end_time !== undefined) {
                                        updates.endTime = new Date(record.end_time);
                                    }
                                    if (record.assigned_to !== undefined) {
                                        // Assignment changed - need to handle technician change
                                        if (record.assigned_to === null) {
                                            updates.isUnassigned = true;
                                            updates.technicianId = "";
                                            updates.assignments = [];
                                        } else {
                                            updates.isUnassigned = false;
                                            updates.technicianId = record.assigned_to;
                                        }
                                    }
                                    if (Object.keys(updates).length > 0) {
                                        updateJob(jobId, updates);
                                    }
                                } else {
                                    // Job not in store - fetch fresh data
                                    await syncWithServer();
                                }
                                break;
                            }
                        case "INSERT":
                            {
                                // For new jobs, we need full data with joins
                                // Trigger a sync to get complete job with customer/property data
                                await syncWithServer();
                                break;
                            }
                    }
                }
            }["useScheduleRealtime.useEffect.channel"]).subscribe({
                "useScheduleRealtime.useEffect.channel": (status)=>{
                    if (status === "SUBSCRIBED") {
                        setIsConnected(true);
                        setConnectionError(null);
                    } else if (status === "CHANNEL_ERROR") {
                        setIsConnected(false);
                        setConnectionError("Failed to connect to real-time updates");
                    } else if (status === "CLOSED") {
                        setIsConnected(false);
                    }
                }
            }["useScheduleRealtime.useEffect.channel"]);
            return ({
                "useScheduleRealtime.useEffect": ()=>{
                    supabase.removeChannel(channel);
                    setIsConnected(false);
                }
            })["useScheduleRealtime.useEffect"];
        }
    }["useScheduleRealtime.useEffect"], [
        companyId,
        updateJob,
        deleteJob,
        addJob,
        getJobById,
        syncWithServer
    ]);
    return {
        isConnected,
        connectionError,
        lastUpdate: lastSync
    };
}
_s1(useScheduleRealtime, "HPBur0oPbFLBbow3OiBMrQtI8xA=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$stores$2f$schedule$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useScheduleStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$stores$2f$schedule$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useScheduleStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$stores$2f$schedule$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useScheduleStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$stores$2f$schedule$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useScheduleStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$stores$2f$schedule$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useScheduleStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$stores$2f$schedule$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useScheduleStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$stores$2f$schedule$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useScheduleStore"]
    ];
});
// Helper to map database status to Job status
function mapStatus(status) {
    const normalized = status?.toLowerCase() ?? "scheduled";
    switch(normalized){
        case "scheduled":
        case "dispatched":
        case "arrived":
        case "closed":
        case "cancelled":
            return normalized;
        case "in-progress":
        case "in_progress":
        case "inprogress":
            return "in-progress";
        case "completed":
        case "complete":
        case "done":
            return "completed";
        default:
            return "scheduled";
    }
}
/**
 * Hook for schedule statistics
 */ function useScheduleStats() {
    _s2();
    const { technicians, jobs, visibleJobs } = useSchedule();
    const stats = {
        totalTechnicians: technicians.length,
        totalJobs: jobs.length,
        visibleJobs: visibleJobs.length,
        scheduledJobs: jobs.filter((j)=>j.status === "scheduled").length,
        inProgressJobs: jobs.filter((j)=>j.status === "in-progress").length,
        completedJobs: jobs.filter((j)=>j.status === "completed").length,
        cancelledJobs: jobs.filter((j)=>j.status === "cancelled").length,
        urgentJobs: jobs.filter((j)=>j.priority === "urgent").length
    };
    return stats;
}
_s2(useScheduleStats, "6DayUr8FYM0FhUbE6F4DrrvBes4=", false, function() {
    return [
        useSchedule
    ];
});
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=apps_web_src_12dada73._.js.map