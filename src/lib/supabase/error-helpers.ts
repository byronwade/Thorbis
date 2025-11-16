import type { PostgrestError } from "@supabase/supabase-js";

export type QueryError = PostgrestError | null;

const POSTGREST_ROW_NOT_FOUND = "PGRST116";
const UNDEFINED_COLUMN_ERROR_CODES = new Set(["42703", "PGRST204"]);

export const isRowNotFoundError = (error: QueryError) => Boolean(error?.code && error.code === POSTGREST_ROW_NOT_FOUND);

export const hasReportableError = (error: QueryError) =>
	Boolean(error && !isRowNotFoundError(error) && (error.message || error.details || error.hint || error.code));

export const isMissingColumnError = (error: QueryError, columnName: string) => {
	if (!error) {
		return false;
	}

	if (UNDEFINED_COLUMN_ERROR_CODES.has(error.code ?? "")) {
		return true;
	}

	const haystack = [error.message, error.details, error.hint]
		.filter((part): part is string => Boolean(part))
		.join(" ")
		.toLowerCase();

	return haystack.includes(columnName.toLowerCase());
};
