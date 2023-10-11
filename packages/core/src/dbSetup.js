const { supabase } = require("./supabase");

// Example predefined tables and rows. Customize according to your needs.
const predefinedTables = [
	{
		name: "posts",
		columns: ["id", "title", "content", "author"],
	},
	{
		name: "users",
		columns: ["id", "name", "email"],
	},
];

async function createTables() {
	for (let table of predefinedTables) {
		const { error } = await supabase.rpc("create_table", {
			table_name: table.name,
			columns: table.columns,
		});
		if (error) {
			console.error(`Error creating table ${table.name}:`, error);
		}
	}
}

module.exports = {
	createTables,
};
