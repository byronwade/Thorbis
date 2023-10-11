// ContentTypes.js
import { supabase } from "./supabase"; // your Supabase client setup

function createContentType(name, fields) {
	return {
		name,
		fields,

		async create(contentData) {
			// Logic to insert content into Supabase
			const { data, error } = await supabase.from(name).insert([contentData]);

			if (error) {
				throw error;
			}

			return data;
		},

		// ... Additional methods as needed, e.g., update, delete, fetch, etc.
	};
}

export { createContentType };
