const { supabase } = require("./supabase");

async function createTable(tableName, columns) {
	// Construct the SQL statement
	let columnStatements = Object.entries(columns).map(([columnName, columnType]) => `${columnName} ${columnType}`);
	let sqlStatement = `CREATE TABLE ${tableName} (${columnStatements.join(", ")});`;

	const { data, error } = await supabase.rpc("sql", { query: sqlStatement });
	if (error) throw error;
	return data;
}

async function addRowToTable(tableName, rowData) {
	const { data, error } = await supabase.from(tableName).insert([rowData]);
	if (error) throw error;
	return data;
}

module.exports = {
	createTable,
	addRowToTable,
};
